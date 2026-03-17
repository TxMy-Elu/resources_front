'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockData = [
  { id: "1", title: "Guide de la parentalité 2026", type: "PDF", author: "Ministère Santé", status: "Publié", date: "12 Mar 2026", views: 1240 },
  { id: "2", title: "Atelier CNV : Gérer les conflits", type: "Vidéo", author: "Assoc. Relat", status: "En attente", date: "14 Mar 2026", views: 0 },
  { id: "3", title: "Aides financières : le récapitulatif", type: "Article", author: "CAF", status: "Publié", date: "10 Mar 2026", views: 8900 },
  { id: "4", title: "Podcast : Écouter ses ados", type: "Audio", author: "Radio Famille", status: "Archivé", date: "01 Fév 2026", views: 450 },
];

export const AdminTable = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border-standard/50 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border-standard/30 bg-surface-muted/20">
        <h3 className="font-semibold text-content">Gestion des ressources</h3>
        <Button size="sm" className="bg-primary text-white h-8 rounded-lg text-xs font-semibold">
          + Nouvelle ressource
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-muted/50 hover:bg-surface-muted/50 border-border-standard/30">
              <TableHead className="w-12 text-center"><Checkbox /></TableHead>
              <TableHead className="font-semibold text-content-muted">Titre de la ressource</TableHead>
              <TableHead className="font-semibold text-content-muted">Type</TableHead>
              <TableHead className="font-semibold text-content-muted">Auteur</TableHead>
              <TableHead className="font-semibold text-content-muted">Statut</TableHead>
              <TableHead className="font-semibold text-content-muted text-right">Vues</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item) => (
              <TableRow key={item.id} className="border-border-standard/20 hover:bg-surface-muted/30 transition-colors">
                <TableCell className="text-center"><Checkbox /></TableCell>
                <TableCell className="font-medium text-content max-w-[250px] truncate">
                  {item.title}
                  <div className="text-[10px] text-content-subtle font-normal mt-0.5">Modifié le {item.date}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium text-content-subtle bg-surface-sunken px-2 py-1 rounded-md">
                    {item.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-content-muted font-medium">{item.author}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.status === 'Publié' ? "bg-success-subtle text-success-700 border-none font-semibold text-[10px]" :
                    item.status === 'En attente' ? "bg-warning-subtle text-warning-800 border-none font-semibold text-[10px]" :
                    "bg-surface-sunken text-content-muted border-none font-semibold text-[10px]"
                  }>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-content-muted">
                  {item.views.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-content-subtle hover:text-content">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                      <DropdownMenuLabel className="text-xs text-content-subtle">Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="text-sm font-medium cursor-pointer"><Eye className="w-4 h-4 mr-2" /> Voir</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm font-medium cursor-pointer"><Edit2 className="w-4 h-4 mr-2" /> Éditer</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-sm font-medium text-danger focus:text-danger cursor-pointer"><Trash2 className="w-4 h-4 mr-2" /> Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
