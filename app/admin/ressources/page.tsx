'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';

interface Res {
  id: number;
  title: string;
  author: string;
  category: string;
  type: string;
  status: 'Publié' | 'En attente' | 'Suspendu';
  date: string;
  views: number;
}

export default function AdminResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [resources, setResources] = useState<Res[]>([
    { id: 1, title: 'Budget familial', author: 'Marie', category: 'Administratif', type: 'pdf', status: 'Publié', date: '2024-02-25', views: 245 },
    { id: 2, title: 'Méditation parents', author: 'Jean', category: 'Bien-être', type: 'video', status: 'Publié', date: '2024-02-24', views: 512 },
    { id: 3, title: 'Aides sociales 2026', author: 'Sophie', category: 'Administratif', type: 'article', status: 'En attente', date: '2024-02-23', views: 0 }
  ]);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Res | null>(null);
  const [form, setForm] = useState<{ title: string; author: string; category: string; type: string; status: 'Publié' | 'En attente' | 'Suspendu' }>({
    title: '',
    author: '',
    category: 'Éducation',
    type: 'article',
    status: 'En attente'
  });

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || r.status === filterStatus) &&
    (filterCategory === 'all' || r.category === filterCategory)
  );

  const save = () => {
    if (!form.title.trim() || !form.author.trim()) {
      alert('Remplir tous les champs');
      return;
    }
    if (edit) {
      setResources(resources.map(r => r.id === edit.id ? { ...r, ...form } : r));
      alert(`✅ "${form.title}" modifiée`);
    } else {
      setResources([...resources, {
        id: Math.max(...resources.map(r => r.id), 0) + 1,
        ...form,
        date: new Date().toISOString().split('T')[0],
        views: 0
      }]);
      alert(`✅ "${form.title}" créée`);
    }
    setModal(false);
  };

  return (
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
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Res['status'] })} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
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
                  const r = resources.find(x => x.id === deleteId);
                  setResources(resources.filter(x => x.id !== deleteId));
                  alert(`❌ "${r?.title}" supprimée`);
                  setDeleteId(null);
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
  );
}

