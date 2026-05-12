'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { Edit, Trash2, Plus, Search, X, Upload, FileText, Eye, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import {
  getAdminResources,
  createResource,
  updateResource,
  deleteResource,
  ApiCategory,
  CreateResourcePayload,
  getMediaUrl,
} from '@/lib/api';
import { useCategories } from '@/lib/hooks/useCategories';
import { RoleGuard } from '@/components/shared/RoleGuard';

/* ─── Types ─── */

interface Res {
  id: number;
  title: string;
  author: string;
  description: string;
  contenu: string;
  category: string;
  categoryId: number;
  type: string;
  status: string;   // French label: Publié / En attente / Suspendu / Brouillon
  visibilite: string;
  lien: string;
  media: string;
  date: string;
}

interface FormState {
  title: string;
  author: string;
  description: string;
  contenu: string;
  categoryId: number;
  type: string;
  status: string;
  visibilite: string;
  lien: string;
  documentFile: File | null;
}

/* ─── Constants ─── */

const TYPES = [
  { value: 'article',  label: 'Article'  },
  { value: 'video',    label: 'Vidéo'    },
  { value: 'podcast',  label: 'Podcast'  },
  { value: 'activite', label: 'Activité' },
  { value: 'jeu',      label: 'Jeu'      },
];

const STATUTS = [
  { value: 'Brouillon',   api: 'brouillon'  },
  { value: 'En attente',  api: 'en attente' },
  { value: 'Publié',      api: 'publie'     },
  { value: 'Suspendu',    api: 'suspendu'   },
];

const statusToApi  = (s: string) => STATUTS.find(x => x.value === s)?.api  ?? 'brouillon';
const statusFromApi = (s: string) => STATUTS.find(x => x.api  === s)?.value ?? 'Brouillon';

const defaultForm: FormState = {
  title: '', author: '', description: '', contenu: '',
  categoryId: 0, type: 'article', status: 'En attente',
  visibilite: 'private', lien: '', documentFile: null,
};

/* ─── Component ─── */

export default function AdminResourcesPage() {
  const [searchTerm,      setSearchTerm]      = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [filterCategory,  setFilterCategory]  = useState('all');
  const [resources,       setResources]       = useState<Res[]>([]);
  const { categories } = useCategories();
  const [loading,         setLoading]         = useState(true);

  // modals
  const [modal,    setModal]    = useState(false);
  const [viewRes,  setViewRes]  = useState<Res | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // form
  const [edit,   setEdit]   = useState<Res | null>(null);
  const [form,   setForm]   = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ─── Data fetch ─── */

  useEffect(() => {
    (async () => {
      try {
        const apiResources = await getAdminResources();
        setResources(apiResources.map(r => ({
          id:          r.id,
          title:       r.titre,
          author:      r.createur ?? '',
          description: r.description ?? '',
          contenu:     r.contenu ?? '',
          category:    r.category ?? 'Général',
          categoryId:  r.categoryId ?? 0,
          type:        r.type_ressource ?? 'article',
          status:      statusFromApi(r.statut),
          visibilite:  r.visibilite ?? 'private',
          lien:        r.lien ?? '',
          media:       r.media ?? '',
          date:        (r.created_at ?? '').split(' ')[0],
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── Filtering ─── */

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus   === 'all' || r.status   === filterStatus) &&
    (filterCategory === 'all' || r.category === filterCategory)
  );

  /* ─── Modal helpers ─── */

  const openCreate = () => {
    setEdit(null);
    setForm({ ...defaultForm, categoryId: categories[0]?.id ?? 0 });
    setModal(true);
  };

  const openEdit = (r: Res) => {
    setEdit(r);
    setForm({
      title:        r.title,
      author:       r.author,
      description:  r.description,
      contenu:      r.contenu,
      categoryId:   r.categoryId || categories[0]?.id || 0,
      type:         r.type,
      status:       r.status,
      visibilite:   r.visibilite,
      lien:         r.lien,
      documentFile: null,
    });
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEdit(null); };

  /* ─── Save ─── */

  const save = async () => {
    if (!form.title.trim())       { showToast('Le titre est requis', 'error');       return; }
    if (!form.description.trim()) { showToast('La description est requise', 'error'); return; }
    if (!form.contenu.trim())     { showToast('Le contenu est requis', 'error');     return; }

    setSaving(true);
    try {
      const payload: CreateResourcePayload = {
        titre:       form.title,
        description: form.description,
        contenu:     form.contenu,
        type:        form.type,
        visibilite:  form.visibilite,
        categoryId:  form.categoryId || categories[0]?.id || 1,
        statut:      statusToApi(form.status),
        lien:        form.lien || undefined,
      };

      if (edit) {
        await updateResource(edit.id, payload);
        const catLabel = categories.find(c => c.id === form.categoryId)?.name ?? edit.category;
        setResources(prev => prev.map(r =>
          r.id === edit.id ? {
            ...r,
            title:       form.title,
            description: form.description,
            contenu:     form.contenu,
            category:    catLabel,
            categoryId:  form.categoryId,
            type:        form.type,
            status:      form.status,
            visibilite:  form.visibilite,
            lien:        form.lien,
          } : r
        ));
        showToast(`"${form.title}" modifiée avec succès`);
      } else {
        const result = await createResource(payload);
        const catLabel = categories.find(c => c.id === form.categoryId)?.name ?? 'Général';
        setResources(prev => [...prev, {
          id:          result.id,
          title:       form.title,
          author:      form.author,
          description: form.description,
          contenu:     form.contenu,
          category:    catLabel,
          categoryId:  form.categoryId,
          type:        form.type,
          status:      statusFromApi(result.statut ?? statusToApi(form.status)),
          visibilite:  form.visibilite,
          lien:        form.lien,
          media:       '',
          date:        new Date().toISOString().split('T')[0],
        }]);
        showToast(`"${form.title}" créée avec succès`);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Status change (approve / reject / suspend) ─── */

  const handleStatusChange = async (id: number, apiStatut: string, label: string) => {
    try {
      await updateResource(id, { statut: apiStatut } as Partial<CreateResourcePayload>);
      const newLabel = statusFromApi(apiStatut);
      setResources(prev => prev.map(r => r.id === id ? { ...r, status: newLabel } : r));
      if (viewRes?.id === id) setViewRes(prev => prev ? { ...prev, status: newLabel } : prev);
      showToast(`Ressource ${label}`);
    } catch {
      showToast('Erreur lors du changement de statut', 'error');
    }
  };

  /* ─── Delete ─── */

  const handleDelete = async (id: number) => {
    try {
      await deleteResource(id);
      const r = resources.find(x => x.id === id);
      setResources(prev => prev.filter(x => x.id !== id));
      showToast(`"${r?.title}" supprimée`);
      setDeleteId(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  /* ─── Status badge style ─── */

  const statusBadge = (s: string) => {
    if (s === 'Publié')     return 'bg-green-50 text-green-700 border-green-100';
    if (s === 'En attente') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    if (s === 'Suspendu')   return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-gray-50 text-gray-600 border-gray-200'; // Brouillon
  };

  /* ──────────────────────────────────── RENDER ──────────────────────────────────── */

  return (
    <RoleGuard required="admin">
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader
          title="Ressources"
          description="Administrez le catalogue"
          showBackButton={true}
          actions={
            <Button onClick={openCreate} className="bg-primary text-white h-8 px-4 rounded-lg text-xs">
              <Plus className="w-3 h-3 mr-1" /> Ajouter
            </Button>
          }
        />

        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-content-muted text-lg font-medium">Chargement…</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs font-semibold text-gray-600">Rechercher</Label>
                    <div className="relative mt-1.5">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Titre…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 text-sm rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="min-w-[140px]">
                    <Label className="text-xs font-semibold text-gray-600">Statut</Label>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="all">Tous</option>
                      {STATUTS.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                    </select>
                  </div>
                  <div className="min-w-[160px]">
                    <Label className="text-xs font-semibold text-gray-600">Catégorie</Label>
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="all">Toutes</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      {['Titre', 'Auteur', 'Catégorie', 'Type', 'Statut', 'Actions'].map(h => (
                        <th
                          key={h}
                          className={`px-5 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                          Aucune ressource trouvée
                        </td>
                      </tr>
                    ) : filtered.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                          {r.title}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">{r.author}</td>
                        <td className="px-5 py-4 text-xs text-gray-600">{r.category}</td>
                        <td className="px-5 py-4 text-xs text-gray-600 capitalize">{r.type}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              onClick={() => setViewRes(r)}
                              size="sm"
                              variant="outline"
                              title="Consulter"
                              className="h-8 px-2.5 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors rounded-lg"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() => openEdit(r)}
                              size="sm"
                              variant="outline"
                              title="Modifier"
                              className="h-8 px-2.5 border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() => setDeleteId(r.id)}
                              size="sm"
                              variant="outline"
                              title="Supprimer"
                              className="h-8 px-2.5 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            MODAL — Consulter (lecture seule)
        ══════════════════════════════════════════════════════ */}
        {viewRes && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl flex flex-col max-h-[92vh]">

              {/* Header */}
              <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-start bg-gray-50/50 shrink-0 rounded-t-2xl">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{viewRes.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Par <span className="font-medium text-gray-600">{viewRes.author}</span>
                    {' · '}{viewRes.date}
                  </p>
                </div>
                <button onClick={() => setViewRes(null)} className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(viewRes.status)}`}>
                    {viewRes.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                    {viewRes.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                    {viewRes.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    {{private: 'Privé', partage: 'Partagé', publie: 'Public'}[viewRes.visibilite] ?? viewRes.visibilite}
                  </span>
                </div>

                {/* Lien / À propos */}
                {viewRes.lien && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lien / À propos</p>
                    <a
                      href={viewRes.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {viewRes.lien}
                    </a>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {viewRes.description || <span className="text-gray-400 italic">Aucune description</span>}
                  </div>
                </div>

                {/* Contenu */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contenu</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {viewRes.contenu || <span className="text-gray-400 italic">Aucun contenu</span>}
                  </div>
                </div>

                {/* Document */}
                {viewRes.media && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Document joint</p>
                    <a
                      href={getMediaUrl(viewRes.media)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors w-full"
                    >
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm text-blue-700 font-medium truncate">{viewRes.media}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-auto" />
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0 bg-gray-50/30 rounded-b-2xl flex-wrap">
                <Button
                  onClick={() => setViewRes(null)}
                  variant="outline"
                  className="h-10 rounded-xl border-gray-200 hover:bg-gray-50 px-4"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => { setViewRes(null); openEdit(viewRes); }}
                  variant="outline"
                  className="h-10 rounded-xl border-gray-200 hover:bg-gray-50 px-4"
                >
                  <Edit className="w-4 h-4 mr-1.5" /> Modifier
                </Button>

                {viewRes.status === 'En attente' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(viewRes.id, 'brouillon', 'rejetée')}
                      className="h-10 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-4 ml-auto"
                      variant="outline"
                    >
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(viewRes.id, 'publie', 'approuvée')}
                      className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4"
                    >
                      Approuver
                    </Button>
                  </>
                )}

                {viewRes.status === 'Publié' && (
                  <Button
                    onClick={() => handleStatusChange(viewRes.id, 'suspendu', 'suspendue')}
                    className="h-10 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 px-4 ml-auto"
                    variant="outline"
                  >
                    Suspendre
                  </Button>
                )}

                {viewRes.status === 'Suspendu' && (
                  <Button
                    onClick={() => handleStatusChange(viewRes.id, 'publie', 'réactivée')}
                    className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 ml-auto"
                  >
                    Réactiver
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MODAL — Créer / Modifier
        ══════════════════════════════════════════════════════ */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl flex flex-col max-h-[92vh]">

              {/* Header */}
              <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50 shrink-0 rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-800">
                  {edit ? 'Modifier la ressource' : 'Nouvelle ressource'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Titre */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Titre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Titre de la ressource"
                    className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Courte description visible dans les listes et aperçus…"
                    rows={3}
                    className="w-full mt-1.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                {/* Contenu */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Contenu <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    value={form.contenu}
                    onChange={e => setForm({ ...form, contenu: e.target.value })}
                    placeholder="Contenu complet de la ressource (texte, HTML, Markdown…)"
                    rows={8}
                    className="w-full mt-1.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-y font-mono"
                  />
                </div>

                {/* Lien / À propos */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Lien / À propos</Label>
                  <Input
                    value={form.lien}
                    onChange={e => setForm({ ...form, lien: e.target.value })}
                    placeholder="https://exemple.com/source"
                    type="url"
                    className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lien de référence, source ou page « à propos » de la ressource</p>
                </div>

                {/* Catégorie + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Catégorie</Label>
                    <select
                      value={form.categoryId}
                      onChange={e => setForm({ ...form, categoryId: Number(e.target.value) })}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      {categories.length === 0 && <option value={0}>Chargement…</option>}
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Type</Label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Statut + Visibilité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Statut</Label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      {STATUTS.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Visibilité</Label>
                    <select
                      value={form.visibilite}
                      onChange={e => setForm({ ...form, visibilite: e.target.value })}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="publie">Public</option>
                      <option value="partage">Partagé</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>
                </div>

                {/* Document */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Document / Fichier joint</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1.5 border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {form.documentFile ? (
                      <>
                        <FileText className="w-6 h-6 text-primary" />
                        <p className="text-sm font-medium text-gray-700">{form.documentFile.name}</p>
                        <p className="text-xs text-gray-400">
                          {(form.documentFile.size / 1024).toFixed(1)} Ko — cliquer pour changer
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Glisser-déposer ou{' '}
                          <span className="text-primary font-medium">parcourir</span>
                        </p>
                        <p className="text-xs text-gray-400">PDF, DOC, DOCX, images — max 10 Mo</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={e => setForm({ ...form, documentFile: e.target.files?.[0] ?? null })}
                  />
                  {form.documentFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, documentFile: null });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Supprimer le fichier
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0 bg-gray-50/30 rounded-b-2xl">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? 'Enregistrement…' : edit ? 'Enregistrer les modifications' : 'Créer la ressource'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MODAL — Confirmation suppression
        ══════════════════════════════════════════════════════ */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h2>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteId(null)}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handleDelete(deleteId!)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10 rounded-xl transition-colors"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TOAST
        ══════════════════════════════════════════════════════ */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium transition-all animate-in slide-in-from-bottom-4 ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle  className="w-4 h-4 text-green-600 shrink-0" />
              : <AlertCircle  className="w-4 h-4 text-red-600   shrink-0" />
            }
            {toast.msg}
            <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
