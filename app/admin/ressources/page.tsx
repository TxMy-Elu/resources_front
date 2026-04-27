'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';
import { getResources, createResource, updateResource, deleteResource, ApiResource } from '@/lib/api';
import { RoleGuard } from '@/components/shared/RoleGuard';

interface Res {
  id: number;
  title: string;
  author: string;
  category: string;
  type: string;
  status: string;
  date: string;
  views: number;
}

export default function AdminResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [resources, setResources] = useState<Res[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Res | null>(null);
  const [form, setForm] = useState<{ title: string; author: string; category: string; type: string; status: string }>({
    title: '',
    author: '',
    category: 'Éducation',
    type: 'article',
    status: 'En attente'
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const apiResources = await getResources();
        const mappedResources: Res[] = apiResources.map(r => ({
          id: r.id,
          title: r.titre,
          author: r.createur,
          category: r.category || 'Général',
          type: r.type_ressource,
          status: r.statut === 'publie' ? 'Publié' : r.statut === 'en attente' ? 'En attente' : 'Suspendu',
          date: r.created_at.split(' ')[0],
          views: 0
        }));
        setResources(mappedResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || r.status === filterStatus) &&
    (filterCategory === 'all' || r.category === filterCategory)
  );

  const save = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      alert('Remplir tous les champs');
      return;
    }
    try {
      if (edit) {
        await updateResource(edit.id, {
          titre: form.title,
          description: form.title,
          contenu: form.title,
          type: form.type,
          visibilite: form.status === 'Publié' ? 'publie' : 'private',
          categoryId: 1
        });
        setResources(resources.map(r => r.id === edit.id ? { ...r, ...form } : r));
        alert(`✅ "${form.title}" modifiée`);
      } else {
        const result = await createResource({
          titre: form.title,
          description: form.title,
          contenu: form.title,
          type: form.type,
          visibilite: form.status === 'Publié' ? 'publie' : 'private',
          categoryId: 1
        });
        setResources([...resources, {
          id: result.id,
          ...form,
          date: new Date().toISOString().split('T')[0],
          views: 0
        }]);
        alert(`✅ "${form.title}" créée`);
      }
      setModal(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (resourceId: number) => {
    try {
      await deleteResource(resourceId);
      const r = resources.find(x => x.id === resourceId);
      setResources(resources.filter(x => x.id !== resourceId));
      alert(`❌ "${r?.title}" supprimée`);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <RoleGuard required="admin">
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader
        title="Ressources"
        description="Administrez le catalogue"
        showBackButton={true}
        actions={
          <Button
            onClick={() => {
              setEdit(null);
              setForm({ title: '', author: '', category: 'Éducation', type: 'article', status: 'En attente' });
              setModal(true);
            }}
            className="bg-primary text-white h-8 px-4 rounded-lg text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter
          </Button>
        }
      />
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-content-muted text-lg font-medium">Chargement...</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs font-semibold text-gray-600">Rechercher</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input placeholder="Titre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 text-sm rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
            </div>
            <div className="min-w-[130px]">
              <Label className="text-xs font-semibold text-gray-600">Statut</Label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                <option value="all">Tous</option>
                <option value="Publié">Publié</option>
                <option value="En attente">Attente</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
            <div className="min-w-[130px]">
              <Label className="text-xs font-semibold text-gray-600">Catégorie</Label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                <option value="all">Tous</option>
                <option value="Administratif">Admin</option>
                <option value="Bien-être">Bien-être</option>
                <option value="Éducation">Éducation</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Auteur</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{r.title}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{r.author}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{r.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      r.status === 'Publié' ? 'bg-green-50 text-green-700 border-green-100' : 
                      r.status === 'En attente' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          setEdit(r);
                          setForm({ title: r.title, author: r.author, category: r.category, type: r.type, status: r.status });
                          setModal(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => setDeleteId(r.id)}
                        size="sm"
                        variant="outline"
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

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="border-b border-gray-100 p-5 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">{edit ? 'Éditer' : 'Ajouter'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <Label className="text-xs font-semibold text-gray-600">Titre</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Auteur</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Statut</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                  <option value="Publié">Publié</option>
                  <option value="En attente">En attente</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>
              <div className="flex gap-3 pt-5 border-t border-gray-100">
                <Button onClick={() => setModal(false)} variant="outline" className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50">Annuler</Button>
                <Button onClick={save} className="flex-1 bg-primary hover:bg-primary-700 text-white h-10 rounded-xl transition-colors">{edit ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmer</h2>
            <p className="text-sm text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50">Annuler</Button>
               <Button
                 onClick={() => {
                   handleDelete(deleteId!);
                 }}
                 className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10 rounded-xl transition-colors"
               >
                 Supprimer
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </RoleGuard>
  );
}

