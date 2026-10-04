'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Pet } from '@/types';
import { LogIn, HeartHandshake } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, pet, onClose }) => {
  const router = useRouter();

  if (!pet) return null;

  const handleGoToLogin = () => {
    onClose();
    router.push(`/login?redirect=/&adoptPetId=${pet.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In Required" maxWidth="md">
      <div className="space-y-4">
        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
            alt={pet.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
            <div>
              <div className="text-white font-bold text-lg">{pet.name}</div>
              <div className="text-emerald-400 text-xs font-semibold">
                ฿{pet.price.toLocaleString()} • {pet.breed}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Ready to welcome {pet.name} into your home?</span>
            <p className="mt-0.5 text-amber-800">
              Please sign in or create an account to submit your adoption request and track your order.
            </p>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Browse More
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleGoToLogin}
            icon={<LogIn className="w-4 h-4" />}
            className="shadow-md shadow-emerald-600/30 font-bold"
          >
            Sign In to Adopt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
