'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResourceComments } from './ResourceComments';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface CommentsModalProps {
  resourceId: number;
  resourceTitle: string;
  isAuthenticated: boolean;
}

export function CommentsButton({ resourceId, resourceTitle, isAuthenticated }: CommentsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 rounded-lg border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Commentaires</span>
        <span className="sm:hidden">💬</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">
              Commentaires - {resourceTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <ResourceComments
              resourceId={resourceId}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

