'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PetDetailModal, LoginPromptModal, AdoptModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { Pet, Category, PetFilterParams } from '@/types';
import {
  PawPrint,
  Search,
  Heart,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Filter,
  ArrowRight,
  ChevronDown,
  Check,
} from 'lucide-react';

function StoreContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // State
  const [pets, setPets] = useState<Pet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPetsCount, setTotalPetsCount] = useState(0);

  // Modals
  const [petToView, setPetToView] = useState<Pet | null>(null);
  const [petToPromptLogin, setPetToPromptLogin] = useState<Pet | null>(null);
  const [petToAdopt, setPetToAdopt] = useState<Pet | null>(null);

  // Picture Carousel Slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const promoSlides = [
    {
      id: 1,
      badge: 'Forever Families Project',
      title: 'Every Pet Deserves a Warm & Loving Home',
      description:
        'Over 1,200+ companions have found their forever families. Discover healthy, vaccinated puppies, cats, and small pets waiting to bring lifelong joy into your home.',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80',
      stats: '1,200+ Happy Adoptions • 100% Health Certified',
      ctaText: 'Explore Available Pets',
    },
    {
      id: 2,
      badge: 'Ethical Care & Adoption',
      title: 'Give Love, Gain a Lifelong Companion',
      description:
        'Complete veterinary medical history, verified vaccinations, and microchipped safety before every pet meets their new loving parents.',
      imageUrl: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=1600&q=80',
      stats: '100% Vet Checked • Transparent Adoption Process',
      ctaText: 'Find Your Pet Companion',
    },
    {
      id: 3,
      badge: 'Warm & Loving Matches',
      title: 'Your Journey to Pet Parenthood Starts Here',
      description:
        'From energetic dogs ready for outdoor adventures to gentle lap cats seeking quiet cuddles, match with the perfect companion for your lifestyle.',
      imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1600&q=80',
      stats: 'Dedicated Care Coordinators • Safe Home Transitions',
      ctaText: 'Start Your Adoption Today',
    },
  ];

  // Custom Status Dropdown
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusOptions = [
    { value: 'All', label: 'All Status', dotColor: 'bg-slate-400' },
    { value: 'Available', label: 'Available', dotColor: 'bg-emerald-500' },
    { value: 'Adopted', label: 'Adopted', dotColor: 'bg-blue-500' },
  ];

  // Auto-advance promotional slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

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
    setPetsLoading(true);
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

        // Check if there's an adoptPetId from return URL
        const adoptPetIdParam = searchParams.get('adoptPetId');
        if (adoptPetIdParam && user) {
          const targetPet = res.data.items.find((p) => p.id === parseInt(adoptPetIdParam, 10));
          if (targetPet && targetPet.status === 'Available') {
            setPetToAdopt(targetPet);
          }
        }
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error loading catalog', 'error');
    } finally {
      setPetsLoading(false);
      setLoading(false);
    }
  }, [search, selectedCategory, selectedStatus, currentPage, pageSize, searchParams, user]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  // Click Adopt Handler
  const handleAdoptClick = (pet: Pet) => {
    if (pet.status !== 'Available') return;

    if (!user) {
      // Guest: Prompt to Login
      setPetToPromptLogin(pet);
    } else {
      // Authenticated User/Admin: Open Adopt Modal
      setPetToAdopt(pet);
    }
  };

  const handleAdoptionSuccess = (petName: string, orderNumber: string) => {
    showToast(`Adoption order #${orderNumber} submitted successfully! Welcome home, ${petName}! 🎉`, 'success');
    loadPets();
  };

  const currentPromo = promoSlides[currentSlide] || promoSlides[0];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-900 text-white border-rose-800'
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

      {/* Promotional Hero Banner: Giving Pets a Warm Forever Home */}
      <section className="relative overflow-hidden w-full pt-2 sm:pt-4 pb-0 px-4 sm:px-8 lg:px-12">
        <div className="w-full">
          <div className="relative w-full h-[420px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group bg-slate-100">
            <img
              src={currentPromo.imageUrl}
              alt={currentPromo.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            />

            {/* Floating Warm Glass Promo Card - Zero gloomy shadow on the photo! */}
            <div className="absolute top-5 bottom-5 left-5 right-5 sm:right-auto sm:top-auto sm:bottom-8 sm:left-8 max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl flex flex-col justify-between gap-4 animate-in fade-in duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentPromo.badge}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentPromo.title}
                </h1>

                <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                  {currentPromo.description}
                </p>
              </div>

              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 px-3.5 py-1.5 rounded-xl border border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{currentPromo.stats}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={scrollToCatalog}
                    icon={<Heart className="w-4 h-4 text-emerald-100 fill-emerald-100" />}
                    className="text-xs sm:text-sm px-6 py-3 font-extrabold shadow-md shadow-emerald-600/30"
                  >
                    <span>{currentPromo.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? promoSlides.length - 1 : prev - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 backdrop-blur-md flex items-center justify-center text-2xl font-bold transition hover:scale-105 cursor-pointer z-10"
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === promoSlides.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 backdrop-blur-md flex items-center justify-center text-2xl font-bold transition hover:scale-105 cursor-pointer z-10"
              aria-label="Next Slide"
            >
              ›
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4 right-6 sm:right-8 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full z-10">
              {promoSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/90'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section - tightly spaced below hero */}
      <main className="w-full px-4 sm:px-8 lg:px-12 pt-3 sm:pt-4 pb-8 sm:pb-12 flex-1 space-y-5">
        {/* Search & Filter Bar */}
        <div id="catalog" className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === undefined
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Breeds
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Wider Search & Status Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80 md:w-96 lg:w-[440px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, breed, species (dog, cat, husky)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
                className="h-11 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-xs flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition cursor-pointer select-none"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${statusOptions.find((o) => o.value === selectedStatus)?.dotColor || 'bg-slate-400'}`} />
                <span>{statusOptions.find((o) => o.value === selectedStatus)?.label || 'All Status'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {isStatusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsStatusDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    {statusOptions.map((opt) => {
                      const isSelected = selectedStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(opt.value);
                            setCurrentPage(1);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {petsLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-sm font-medium">Finding friendly companions...</span>
          </div>
        ) : pets.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <PawPrint className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <h3 className="text-base font-bold text-slate-700">No pets available at the moment</h3>
            <p className="text-xs text-slate-400 mt-1">
              No pets found matching your request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => {
              const isAvailable = pet.status === 'Available';

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Image & Badges */}
                  <div className="relative h-56 sm:h-52 w-full bg-slate-100 overflow-hidden">
                    {pet.imageUrl && pet.imageUrl.trim() !== '' ? (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-1.5 select-none">
                        <PawPrint className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <span className="text-[11px] font-medium text-slate-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge
                        variant={isAvailable ? 'emerald' : 'blue'}
                        size="sm"
                      >
                        {pet.status}
                      </Badge>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        {pet.categoryName}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white font-black text-xs sm:text-sm shadow-md backdrop-blur-md">
                      ฿{pet.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-base">{pet.name}</h3>
                        <span className="text-xs text-slate-500 font-semibold">
                          {pet.age} {pet.ageUnit} • {pet.gender}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-700 font-bold mt-0.5">{pet.breed}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {pet.description || 'Gentle companion with complete health records and vaccination.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2.5">
                      <Button
                        variant="outline"
                        size="md"
                        className="flex-1 text-xs sm:text-sm font-bold"
                        onClick={() => setPetToView(pet)}
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Details
                      </Button>

                      {isAvailable ? (
                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1 text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20"
                          onClick={() => handleAdoptClick(pet)}
                          icon={<Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />}
                        >
                          Adopt
                        </Button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs sm:text-sm font-bold cursor-not-allowed text-center"
                        >
                          Adopted
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
          itemLabel="pets"
          className="mt-6"
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PetDetailModal
        pet={petToView}
        onClose={() => setPetToView(null)}
        onAdopt={handleAdoptClick}
      />

      <LoginPromptModal
        isOpen={!!petToPromptLogin}
        pet={petToPromptLogin}
        onClose={() => setPetToPromptLogin(null)}
      />

      <AdoptModal
        isOpen={!!petToAdopt}
        pet={petToAdopt}
        currentUser={user}
        onClose={() => setPetToAdopt(null)}
        onSuccess={handleAdoptionSuccess}
      />
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
