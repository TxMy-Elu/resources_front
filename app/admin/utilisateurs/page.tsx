'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Citoyen' | 'Modérateur' | 'Administrateur' | 'Super-administrateur';
  status: 'Actif' | 'Inactif';
  joinDate: string;
  resourceCount: number;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@email.com', role: 'Citoyen', status: 'Actif', joinDate: '2024-01-15', resourceCount: 3 },
    { id: 2, name: 'Thomas Dubois', email: 'thomas.dubois@email.com', role: 'Modérateur', status: 'Actif', joinDate: '2023-11-20', resourceCount: 0 },
    { id: 3, name: 'Admin Central', email: 'admin@ressources.fr', role: 'Administrateur', status: 'Actif', joinDate: '2023-06-01', resourceCount: 0 },
    { id: 4, name: 'Leila Kassam', email: 'leila.k@email.com', role: 'Citoyen', status: 'Inactif', joinDate: '2024-02-10', resourceCount: 1 },
    { id: 5, name: 'Pierre Durand', email: 'pierre.durand@email.com', role: 'Modérateur', status: 'Actif', joinDate: '2024-01-05', resourceCount: 0 }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: 'Citoyen' | 'Modérateur' | 'Administrateur' | 'Super-administrateur';
    status: 'Actif' | 'Inactif';
  }>({
    name: '',
    email: '',
    role: 'Citoyen',
    status: 'Actif'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Citoyen', status: 'Actif' });
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Citoyen', status: 'Actif' });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      alert(`✅ Utilisateur "${formData.name}" modifié`);
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        resourceCount: 0
      };
      setUsers([...users, newUser]);
      alert(`✅ Utilisateur "${formData.name}" créé`);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    alert(`❌ Utilisateur "${user?.name}" supprimé. Données anonymisées conformément au RGPD.`);
    setDeleteConfirmId(null);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'Super-administrateur': 'bg-red-100 text-red-700',
      'Administrateur': 'bg-purple-100 text-purple-700',
      'Modérateur': 'bg-blue-100 text-blue-700',
      'Citoyen': 'bg-gray-100 text-gray-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <PageHeader
        title="Gestion des Utilisateurs"
        description="Gérez les comptes et les droits d'accès"
        showBackButton={true}
        actions={
          <Button onClick={openAddModal} className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-4 h-8 rounded-lg text-xs transition-all flex items-center gap-2">
            <Plus className="w-3 h-3" />
            Ajouter
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow">
        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search" className="text-xs font-semibold text-gray-600">Rechercher</Label>
              <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="search" placeholder="Nom ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 text-sm rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
            </div>
            <div className="min-w-[150px]">
                <Label htmlFor="role" className="text-xs font-semibold text-gray-600">Rôle</Label>
                <select id="role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                <option value="all">Tous</option>
                <option value="Citoyen">Citoyen</option>
                <option value="Modérateur">Modérateur</option>
                <option value="Administrateur">Administrateur</option>
                <option value="Super-administrateur">Super-admin</option>
              </select>
            </div>
            <div className="min-w-[150px]">
                <Label htmlFor="status" className="text-xs font-semibold text-gray-600">Statut</Label>
                <select id="status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                <option value="all">Tous</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Inscrit</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Ressources</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-3 text-content-muted text-xs">{user.email}</td>
                    <td className="px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>{user.role}</span></td>
                    <td className="px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
                    <td className="px-6 py-3 text-xs text-content-muted">{new Date(user.joinDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-3 text-center">{user.resourceCount}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openEditModal(user)} size="sm" variant="outline" className="h-8 px-2.5 border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button onClick={() => setDeleteConfirmId(user.id)} size="sm" variant="outline" className="h-8 px-2.5 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-content-muted">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">{users.length}</p>
            <p className="text-content-muted text-xs mt-1">Total utilisateurs</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Actif').length}</p>
            <p className="text-content-muted text-xs mt-1">Actifs</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{users.filter(u => ['Modérateur', 'Administrateur', 'Super-administrateur'].includes(u.role)).length}</p>
            <p className="text-content-muted text-xs mt-1">Modérateurs+</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="border-b border-gray-100 p-5 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-content">{editingUser ? 'Éditer utilisateur' : 'Ajouter utilisateur'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <Label className="text-xs font-semibold text-gray-600">Nom</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom complet" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Email</Label>
                <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" type="email" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Rôle</Label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                  <option value="Citoyen">Citoyen</option>
                  <option value="Modérateur">Modérateur</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Super-administrateur">Super-administrateur</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Statut</Label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm px-3 mt-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer">
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div className="flex gap-3 pt-5 border-t border-gray-100">
                <Button onClick={closeModal} variant="outline" className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50">Annuler</Button>
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary-700 text-white h-10 rounded-xl transition-colors">{editingUser ? 'Modifier' : 'Créer'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-content">Confirmer la suppression</h2>
              <p className="text-content-muted text-sm">Cette action supprimera définitivement le compte et respectera le droit à l&apos;oubli (RGPD).</p>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setDeleteConfirmId(null)} variant="outline" className="flex-1 h-10 rounded-xl border-gray-200 hover:bg-gray-50">Annuler</Button>
                <Button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10 rounded-xl transition-colors">Supprimer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

