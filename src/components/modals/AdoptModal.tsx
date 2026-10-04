'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pet, User } from '@/types';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Heart, Phone, Mail, User as UserIcon } from 'lucide-react';

interface AdoptModalProps {
  isOpen: boolean;
  pet: Pet | null;
  currentUser: User | null;
  onClose: () => void;
  onSuccess: (petName: string, orderNumber: string) => void;
}

export const AdoptModal: React.FC<AdoptModalProps> = ({
  isOpen,
  pet,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState(currentUser?.fullName || currentUser?.username || '');
  const [customerPhone, setCustomerPhone] = useState('081-234-5678');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('PromptPay');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!pet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.petshop.createOrder({
        petId: pet.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        paymentMethod,
        notes: notes.trim(),
      });

      if (res.success && res.data) {
        onSuccess(pet.name, res.data.orderNumber);
        onClose();
      } else {
        throw new Error(res.message || 'Adoption submission failed');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error submitting adoption order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adopt ${pet.name}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pet Summary Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <img
            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
            alt={pet.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{pet.name}</h4>
            <p className="text-xs text-emerald-700 font-medium">{pet.breed} • {pet.categoryName}</p>
            <p className="text-xs text-slate-500">{pet.age} {pet.ageUnit} • {pet.gender}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Adoption Fee</span>
            <span className="font-bold text-base text-slate-900">฿{pet.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <Input
            label="Full Name"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your full name"
            icon={<UserIcon className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="08x-xxx-xxxx"
              icon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Payment / Deposit Method</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['PromptPay', 'Credit Card', 'Cash on Pickup'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-2.5 rounded-xl border text-center font-medium transition cursor-pointer ${
                    paymentMethod === method
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Adoption Notes / Home Environment (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fenced yard, first time pet owner, experienced with puppies..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={submitting}
            icon={<Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />}
            className="shadow-md shadow-emerald-600/30 font-bold"
          >
            Confirm Adoption
          </Button>
        </div>
      </form>
    </Modal>
  );
};
