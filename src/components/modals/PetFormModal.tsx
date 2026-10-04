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

const getBlankFormData = (defaultCategoryId: number = 1): Partial<Pet> => ({
  name: '',
  categoryId: defaultCategoryId,
  breed: '',
  age: undefined,
  ageUnit: 'Months',
  gender: 'Male',
  price: undefined,
  status: 'Available',
  healthStatus: '',
  imageUrl: '',
  description: '',
});

export const PetFormModal: React.FC<PetFormProps> = ({
  isOpen,
  pet,
  categories,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const defaultCatId = categories[0]?.id || 1;

  const [formData, setFormData] = useState<Partial<Pet>>(getBlankFormData(defaultCatId));
  const [loading, setLoading] = useState(false);

  // Sync form data with current pet or reset cleanly for Add mode
  useEffect(() => {
    if (isOpen) {
      if (pet) {
        setFormData({ ...pet });
      } else {
        setFormData(getBlankFormData(categories[0]?.id || 1));
      }
    } else {
      setFormData(getBlankFormData(categories[0]?.id || 1));
    }
  }, [pet, categories, isOpen]);

  const handleClose = () => {
    setFormData(getBlankFormData(categories[0]?.id || 1));
    onClose();
  };

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
      const payload: Partial<Pet> = {
        ...formData,
        name: formData.name.trim(),
        breed: formData.breed.trim(),
        categoryId: formData.categoryId || defaultCatId,
        age: formData.age !== undefined && formData.age !== null ? Number(formData.age) : 0,
        healthStatus: formData.healthStatus?.trim() || '',
        imageUrl: formData.imageUrl?.trim() || '',
        description: formData.description?.trim() || '',
      };

      await onSubmit(payload);
      handleClose();
    } catch {
      // master/page.tsx handles toast
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Bella"
          />

          <Select
            label="Category *"
            value={formData.categoryId || defaultCatId}
            onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: parseInt(e.target.value, 10) }))}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Breed *"
            required
            value={formData.breed || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, breed: e.target.value }))}
            placeholder="e.g. Golden Retriever"
          />

          <Select
            label="Gender"
            value={formData.gender || 'Male'}
            onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
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
                placeholder="0"
                value={formData.age !== undefined && formData.age !== null ? formData.age : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    age: val === '' ? undefined : Math.max(0, parseInt(val, 10) || 0),
                  }));
                }}
                className="w-2/3 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
              <select
                value={formData.ageUnit || 'Months'}
                onChange={(e) => setFormData((prev) => ({ ...prev, ageUnit: e.target.value }))}
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
            placeholder="0.00"
            value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({
                ...prev,
                price: val === '' ? undefined : Math.max(0, parseFloat(val) || 0),
              }));
            }}
          />

          <Select
            label="Status"
            value={formData.status || 'Available'}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
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
          onChange={(e) => setFormData((prev) => ({ ...prev, healthStatus: e.target.value }))}
          placeholder="e.g. Vaccinated, Dewormed, Microchipped"
        />

        <div className="space-y-1.5">
          <Input
            label="Photo URL"
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://images.unsplash.com/..."
          />
          {formData.imageUrl && formData.imageUrl.trim() !== '' && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-slate-400">Live image preview</p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe temperament, history, and background..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="md" onClick={handleClose}>
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
