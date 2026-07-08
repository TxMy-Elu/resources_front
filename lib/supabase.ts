import { createClient } from '@supabase/supabase-js';

const BUCKET = 'Ressources';

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_t, prop) {
    return (getSupabase() as never)[prop];
  },
});

/* ─── Règles de validation ─────────────────────────────────────────── */

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string[]> = {
  'application/pdf':    ['.pdf'],
  'image/jpeg':         ['.jpg', '.jpeg'],
  'image/png':          ['.png'],
  'image/gif':          ['.gif'],
  'image/webp':         ['.webp'],
  'audio/mpeg':         ['.mp3'],
  'audio/ogg':          ['.ogg'],
  'audio/wav':          ['.wav'],
  'video/mp4':          ['.mp4'],
  'video/webm':         ['.webm'],
};

export interface ValidationError {
  code: 'SIZE' | 'TYPE' | 'EXTENSION';
  message: string;
}

export function validateFile(file: File): ValidationError | null {
  // 1. Taille
  if (file.size > MAX_SIZE_BYTES) {
    return {
      code: 'SIZE',
      message: `Fichier trop lourd : ${(file.size / 1024 / 1024).toFixed(1)} Mo (max ${MAX_SIZE_MB} Mo)`,
    };
  }

  // 2. Type MIME
  if (!ALLOWED_TYPES[file.type]) {
    return {
      code: 'TYPE',
      message: `Type non autorisé : ${file.type || 'inconnu'}. Types acceptés : PDF, images, audio, vidéo.`,
    };
  }

  // 3. Extension cohérente avec le MIME (évite renommage malveillant)
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_TYPES[file.type].includes(ext)) {
    return {
      code: 'EXTENSION',
      message: `Extension "${ext}" incohérente avec le type de fichier détecté.`,
    };
  }

  return null;
}

export async function uploadMedia(file: File): Promise<string> {
  // Validation avant envoi
  const err = validateFile(file);
  if (err) throw new Error(err.message);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${Date.now()}_${safeName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload Supabase : ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

/** Extrait le path Supabase depuis une URL publique */
function extractSupabasePath(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export function isSupabaseUrl(url: string): boolean {
  return url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '');
}

/** Télécharge un fichier Supabase via le SDK (gère CORS + nom d'origine) */
export async function downloadFromSupabase(publicUrl: string, filename: string): Promise<void> {
  const path = extractSupabasePath(publicUrl);

  if (path) {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (!error && data) {
      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      return;
    }
  }

  // Fallback : ouverture directe
  window.open(publicUrl, '_blank');
}
