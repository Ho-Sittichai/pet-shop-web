'use client';

import React from 'react';
import { Pet } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  pet: Pet | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  pet,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !pet) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">Delete Pet Record</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Are you sure you want to remove <strong className="text-slate-800">"{pet.name}"</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} loading={loading} className="shadow-md shadow-rose-600/30">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
