'use client';

import React, { useState, useEffect } from 'react';
import { Pet, Category } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import { useToast } from '@/context/ToastContext';

interface PetFormProps {
  isOpen: boolean;
  pet?: Pet | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: Partial<Pet>) => Promise<void>;
}

export const PetFormModal: React.FC<PetFormProps> = ({
  isOpen,
  pet,
  categories,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    categoryId: categories[0]?.id || 1,
    breed: '',
    age: 6,
    ageUnit: 'Months',
    gender: 'Male',
    price: 15000,
    status: 'Available',
    healthStatus: 'Vaccinated & Health Checked',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({ ...pet });
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || 1,
        breed: '',
        age: 6,
        ageUnit: 'Months',
        gender: 'Male',
        price: 15000,
        status: 'Available',
        healthStatus: 'Vaccinated & Health Checked',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        description: '',
      });
    }
  }, [pet, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Pet name is required', 'error');
      return;
    }
    if (!formData.breed?.trim()) {
      showToast('Breed is required', 'error');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      // master/page.tsx already shows error toast from API
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pet ? `Edit ${pet.name}` : 'Add Pet'}
      description="Enter the details below to save pet profile information"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Pet Name *"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bella"
          />

          <Select
            label="Category *"
            value={formData.categoryId || 1}
            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Breed *"
            required
            value={formData.breed || ''}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            placeholder="e.g. Golden Retriever"
          />

          <Select
            label="Gender"
            value={formData.gender || 'Male'}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={formData.age || 0}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-2/3 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
              <select
                value={formData.ageUnit || 'Months'}
                onChange={(e) => setFormData({ ...formData, ageUnit: e.target.value })}
                className="w-1/3 px-2 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-600 transition"
              >
                <option value="Months">Mo</option>
                <option value="Years">Yr</option>
              </select>
            </div>
          </div>

          <Input
            label="Price (฿)"
            type="number"
            min="0"
            step="100"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          />

          <Select
            label="Status"
            value={formData.status || 'Available'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Adopted', label: 'Adopted' },
            ]}
          />
        </div>

        <Input
          label="Health Status"
          value={formData.healthStatus || ''}
          onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
          placeholder="e.g. Vaccinated, Dewormed"
        />

        <div className="space-y-1.5">
          <Input
            label="Photo URL"
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
          />
          {formData.imageUrl && (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={formData.imageUrl}
                alt="Preview"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe temperament and background..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading} className="shadow-md shadow-emerald-600/30">
            {pet ? 'Save Changes' : 'Create Pet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const PetForm = PetFormModal;
