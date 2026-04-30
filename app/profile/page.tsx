'use client';

import React, { useEffect, useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Calendar, Edit2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getCurrentUser } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    role: string;
    joinDate: string;
    resourcesCreated: number;
    resourcesSaved: number;
    avgRating: number | null;
    avatar: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    role: '',
    joinDate: '',
    resourcesCreated: 0,
    resourcesSaved: 0,
    avgRating: null,
    avatar: 'U',
  });

  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }

    const displayName = user?.name || `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || user?.email || 'U';
    const avatar = displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U';

    const baseProfile = {
      firstName: user?.firstname || user?.name?.split(' ')[0] || 'Utilisateur',
      lastName: user?.lastname || user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: '',
      role: user?.role || 'Citoyen',
      joinDate: '',
      resourcesCreated: 0,
      resourcesSaved: 0,
      avgRating: null as number | null,
      avatar,
    };

    setProfile(baseProfile);
    setFormData(baseProfile);

    // Charger les stats depuis /api/me
    getCurrentUser().then((me) => {
      setProfile(prev => ({
        ...prev,
        joinDate: me.joinDate
          ? new Date(me.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
          : '',
        resourcesCreated: me.resourcesCreated ?? 0,
        resourcesSaved:   me.resourcesSaved   ?? 0,
        avgRating:        me.avgRating         ?? null,
      }));
    }).catch(() => { /* silencieux */ });
  }, [isAuthenticated, loading, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    alert('✅ Profil mis à jour avec succès !');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/connexion');
    router.refresh();
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader title="Mon Profil" description="Gérez votre profil utilisateur" showBackButton={false} />
        <main className="grow flex items-center justify-center px-4">
          <p className="text-content-muted">Chargement du profil...</p>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Mon Profil" description="Gérez votre profil utilisateur" showBackButton={false} />

      <main className="grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">

            {/* Profile Header */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                    {profile.avatar}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-content">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-primary font-semibold mt-1">{profile.role}</p>
                    <p className="text-content-muted text-sm mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {profile.joinDate ? `Inscrit depuis ${profile.joinDate}` : 'Compte connecte'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 text-xs text-content-muted">
                    Modification du profil non disponible tant que l&apos;API de mise a jour n&apos;est pas exposee.
                  </div>
                  <Button onClick={handleLogout} className="bg-red-50 text-red-600 hover:bg-red-100 h-10 px-4 rounded-xl font-semibold flex items-center gap-2 border border-red-100">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">{profile.resourcesCreated}</p>
                <p className="text-content-muted text-sm mt-2">Ressources créées</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">{profile.resourcesSaved}</p>
                <p className="text-content-muted text-sm mt-2">Ressources enregistrées</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">
                  {profile.avgRating !== null ? profile.avgRating.toFixed(1) : '–'}
                </p>
                <p className="text-content-muted text-sm mt-2">Note moyenne</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-content">Informations Personnelles</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Prénom */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Prénom</Label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <p className="text-content py-2">{profile.firstName}</p>
                  )}
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nom</Label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <p className="text-content py-2">{profile.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <p className="text-content py-2">{profile.email}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <p className="text-content py-2">{profile.phone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </Label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <p className="text-content py-2">{profile.address}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold">Bio</Label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-primary/20"
                      rows={4}
                    />
                  ) : (
                    <p className="text-content py-2">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-content">Sécurité</h2>
              <Button className="bg-primary text-white hover:bg-primary-700 h-10 px-4 rounded-xl font-semibold">
                Changer le mot de passe
              </Button>
              <p className="text-sm text-content-muted">Vous avez connecté récemment depuis :</p>
              <p className="text-sm text-content">Chrome 120.0 sur Windows 11</p>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-red-900">Zone Dangereuse</h2>
              <p className="text-sm text-red-800">La suppression de votre compte est permanente et irrévocable. Toutes vos données seront supprimées.</p>
              <Button className="bg-red-600 text-white hover:bg-red-700 h-10 px-4 rounded-xl font-semibold">
                Supprimer mon compte (RGPD)
              </Button>
            </div>

          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

