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
        <div className="bg-white p-4 rounded-lg border mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs font-semibold">Rechercher</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4" />
                <Input placeholder="Titre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-9 text-sm" />
              </div>
            </div>
            <div className="min-w-[130px]">
              <Label className="text-xs font-semibold">Statut</Label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full h-9 rounded-lg border text-sm px-3 mt-1">
                <option value="all">Tous</option>
                <option value="Publié">Publié</option>
                <option value="En attente">Attente</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
            <div className="min-w-[130px]">
              <Label className="text-xs font-semibold">Catégorie</Label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full h-9 rounded-lg border text-sm px-3 mt-1">
                <option value="all">Tous</option>
                <option value="Administratif">Admin</option>
                <option value="Bien-être">Bien-être</option>
                <option value="Éducation">Éducation</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-xs">Titre</th>
                <th className="px-6 py-3 text-left font-semibold text-xs">Auteur</th>
                <th className="px-6 py-3 text-left font-semibold text-xs">Catégorie</th>
                <th className="px-6 py-3 text-left font-semibold text-xs">Statut</th>
                <th className="px-6 py-3 text-right font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="px-6 py-3 text-sm">{r.title}</td>
                  <td className="px-6 py-3 text-xs text-gray-600">{r.author}</td>
                  <td className="px-6 py-3 text-xs">{r.category}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      r.status === 'Publié' ? 'bg-green-100 text-green-700' : 
                      r.status === 'En attente' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          setEdit(r);
                          setForm({ title: r.title, author: r.author, category: r.category, type: r.type, status: r.status });
                          setModal(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => setDeleteId(r.id)}
                        size="sm"
                        className="h-7 px-2 bg-red-100 text-red-600 border-0"
                      >
                        <Trash2 className="w-3 h-3" />
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
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between">
              <h2 className="text-lg font-bold">{edit ? 'Éditer' : 'Ajouter'}</h2>
              <button onClick={() => setModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-xs">Titre</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Auteur</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Statut</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Res['status'] })} className="w-full h-9 rounded border text-sm px-3 mt-1">
                  <option value="Publié">Publié</option>
                  <option value="En attente">En attente</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => setModal(false)} variant="outline" className="flex-1 h-9">Annuler</Button>
                <Button onClick={save} className="flex-1 bg-primary text-white h-9">Créer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold mb-4">Confirmer</h2>
            <p className="text-sm text-gray-600 mb-4">Supprimer cette ressource ?</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1 h-9">Annuler</Button>
              <Button
                onClick={() => {
                  const r = resources.find(x => x.id === deleteId);
                  setResources(resources.filter(x => x.id !== deleteId));
                  alert(`❌ "${r?.title}" supprimée`);
                  setDeleteId(null);
                }}
                className="flex-1 bg-red-600 text-white h-9"
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

