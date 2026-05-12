import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://pcabklncvqwqrlhnrwda.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYWJrbG5jdnF3cXJsaG5yd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTY4MTEsImV4cCI6MjA5NDA3MjgxMX0.nipbRAwZMbiDU3OkFtzZhAx-1Yj0mApHNLRYxwLYHB8';
const BUCKET = 'Ressources';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  return url.includes(SUPABASE_URL);
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
