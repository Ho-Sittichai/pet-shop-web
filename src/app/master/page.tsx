'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PetFormModal, PetDetailModal, DeleteModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { Pet, Category, PetFilterParams } from '@/types';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  LayoutGrid,
  List,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  PawPrint,
} from 'lucide-react';

export default function MasterPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [pets, setPets] = useState<Pet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPetsCount, setTotalPetsCount] = useState(0);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [petToView, setPetToView] = useState<Pet | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New Category prompt
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/master');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

  // Load Categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await api.petshop.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch Pets
  const loadPets = useCallback(async () => {
    setLoading(true);
    try {
      const params: PetFilterParams = {
        search: search.trim() || undefined,
        categoryId: selectedCategory,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        page: currentPage,
        pageSize: pageSize,
        sortBy: 'CreatedAt',
        sortOrder: 'desc',
      };

      const res = await api.petshop.getPets(params);
      if (res.success && res.data) {
        setPets(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalPetsCount(res.data.totalCount || 0);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error fetching inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedStatus, currentPage, pageSize]);

  useEffect(() => {
    if (user && isAdmin) {
      loadCategories();
      loadPets();
    }
  }, [user, isAdmin, loadCategories, loadPets]);

  // Save Pet (Create or Update)
  const savePet = async (petData: Partial<Pet>) => {
    try {
      if (petToEdit) {
        const res = await api.petshop.updatePet(petToEdit.id, petData);
        if (res.success) {
          showToast(`Updated "${res.data.name}" successfully`, 'success');
          setPetToEdit(null);
          loadPets();
        }
      } else {
        const res = await api.petshop.createPet(petData);
        if (res.success) {
          showToast(`Created "${res.data.name}" successfully`, 'success');
          loadPets();
        }
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save operation failed', 'error');
    }
  };

  // Delete Pet
  const deletePet = async () => {
    if (!petToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await api.petshop.deletePet(petToDelete.id);
      if (res.success) {
        showToast(`Deleted "${petToDelete.name}" successfully`, 'success');
        setPetToDelete(null);
        loadPets();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle Status
  const toggleStatus = async (pet: Pet) => {
    const nextStatus = pet.status === 'Available' ? 'Adopted' : 'Available';
    try {
      const res = await api.petshop.updatePet(pet.id, { ...pet, status: nextStatus });
      if (res.success) {
        showToast(`Status updated to "${nextStatus}" for ${pet.name}`, 'success');
        if (petToView && petToView.id === pet.id) {
          setPetToView({ ...petToView, status: nextStatus });
        }
        loadPets();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Status toggle failed', 'error');
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategorySubmitting(true);
    try {
      const res = await api.petshop.createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
      });
      if (res.success) {
        showToast(`Category "${newCategoryName}" created!`, 'success');
        setNewCategoryName('');
        setNewCategoryDesc('');
        setIsCategoryModalOpen(false);
        loadCategories();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to create category', 'error');
    } finally {
      setCategorySubmitting(false);
    }
  };

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

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Checking permissions...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1">
              You must have an <strong>Admin</strong> role to manage master data.
            </p>
          </div>
          <Button variant="primary" size="sm" className="w-full" onClick={() => router.push('/')}>
            Back to Store
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'success' ? 'bg-slate-900 text-white border-slate-800' : 'bg-rose-900 text-white border-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 flex-1 space-y-6">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
              <PawPrint className="w-3.5 h-3.5" />
              <span>Catalog &amp; Inventory Administration</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pets Data Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage inventory, update pet profiles, and monitor availability across all categories
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPets}
              title="Refresh Records"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCategoryModalOpen(true)}
              icon={<FolderPlus className="w-3.5 h-3.5" />}
            >
              Add Category
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPetToEdit(null);
                setIsFormOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Pet
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Categories Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === undefined
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Categories ({totalPetsCount})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search, Status & View Mode */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search inventory..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-600 transition cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Adopted">Adopted</option>
            </select>

            <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pet CRUD Records */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-xs">Loading master records...</span>
          </div>
        ) : pets.length === 0 ? (
          <Card className="py-16 text-center p-6">
            <PawPrint className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No pets match search</h3>
            <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or click "Add Pet" to create one.</p>
          </Card>
        ) : viewMode === 'table' ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Pet Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Breed</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Toggle Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pets.map((pet) => (
                    <tr key={pet.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
                          alt={pet.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{pet.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: #{pet.id}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{pet.categoryName}</td>
                      <td className="py-3 px-4 text-slate-600">{pet.breed}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {pet.age} {pet.ageUnit} • {pet.gender}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ฿{pet.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(pet.status)} size="sm">
                          {pet.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(pet)}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition cursor-pointer"
                        >
                          {pet.status === 'Available' ? 'Mark Adopted' : 'Mark Available'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPetToView(pet)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setPetToEdit(pet);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPetToDelete(pet)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition">
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <Badge variant={getStatusVariant(pet.status)} size="sm">
                      {pet.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-900/90 text-white font-bold text-xs shadow-xs">
                    ฿{pet.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">{pet.name}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {pet.age} {pet.ageUnit} • {pet.gender}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">{pet.breed} • {pet.categoryName}</p>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {pet.description || 'Health checked companion.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleStatus(pet)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                    >
                      {pet.status === 'Available' ? 'Mark Adopted' : 'Mark Available'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPetToView(pet)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setPetToEdit(pet);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPetToDelete(pet)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Responsive Rich Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPetsCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[20, 40, 60, 80, 100]}
          itemLabel="inventory records"
          className="mt-6"
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PetFormModal
        isOpen={isFormOpen}
        pet={petToEdit}
        categories={categories}
        onClose={() => {
          setIsFormOpen(false);
          setPetToEdit(null);
        }}
        onSubmit={savePet}
      />

      <PetDetailModal
        pet={petToView}
        onClose={() => setPetToView(null)}
        onEdit={(p) => {
          setPetToEdit(p);
          setIsFormOpen(true);
        }}
        onDelete={(p) => setPetToDelete(p)}
        onToggle={toggleStatus}
      />

      <DeleteModal
        isOpen={!!petToDelete}
        pet={petToDelete}
        loading={deleteLoading}
        onClose={() => setPetToDelete(null)}
        onConfirm={deletePet}
      />

      {/* Create Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Reptiles, Rabbits"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Category description"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={categorySubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={categorySubmitting}
                >
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
