'use client';

import React from 'react';
import { Pet } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Heart } from 'lucide-react';

interface PetDetailProps {
  pet: Pet | null;
  onClose: () => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (pet: Pet) => void;
  onToggle?: (pet: Pet) => void;
  onAdopt?: (pet: Pet) => void;
}

export const PetDetailModal: React.FC<PetDetailProps> = ({
  pet,
  onClose,
  onEdit,
  onDelete,
  onToggle,
  onAdopt,
}) => {
  if (!pet) return null;

  const getStatusVariant = (status: string): 'emerald' | 'blue' | 'amber' | 'slate' => {
    switch (status) {
      case 'Available':
        return 'emerald';
      case 'Adopted':
        return 'blue';
      case 'Pending':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <Modal isOpen={!!pet} onClose={onClose} title={pet.name} maxWidth="lg">
      <div className="space-y-5">
        {/* Photo and Header */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
            alt={pet.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={getStatusVariant(pet.status)}>{pet.status}</Badge>
            <Badge variant="slate">{pet.categoryName}</Badge>
          </div>
          <div className="absolute bottom-3 right-3 px-4 py-1.5 rounded-xl bg-slate-900/90 text-white font-extrabold text-base shadow-lg backdrop-blur-md">
            ฿{pet.price.toLocaleString()}
          </div>
        </div>

        {/* Name and Breed */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">{pet.name}</h2>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {pet.gender} • {pet.age} {pet.ageUnit}
            </span>
          </div>
          <p className="text-sm text-emerald-700 font-bold mt-0.5">{pet.breed}</p>
        </div>

        {/* Health */}
        {pet.healthStatus && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900">
              <span className="font-bold block">Health & Vaccination Status</span>
              <span>{pet.healthStatus}</span>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1">About {pet.name}</span>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {pet.description || 'Gentle companion with complete health records and vaccination.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          {onToggle ? (
            <Button variant="outline" size="md" onClick={() => onToggle(pet)}>
              {pet.status === 'Available' ? 'Mark Adopted' : 'Mark Available'}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {onEdit && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  onClose();
                  onEdit(pet);
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  onClose();
                  onDelete(pet);
                }}
              >
                Delete
              </Button>
            )}
            {!onEdit && !onDelete && (
              <>
                <Button variant="outline" size="md" onClick={onClose}>
                  Close
                </Button>
                {onAdopt && pet.status === 'Available' && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      onClose();
                      onAdopt(pet);
                    }}
                    icon={<Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />}
                  >
                    Adopt Now
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const PetDetail = PetDetailModal;
