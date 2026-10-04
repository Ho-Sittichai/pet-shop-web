'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PetDetailModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Counter } from '@/components/ui/Counter';
import { DashboardSummary, Order, Pet } from '@/types';
import {
  PawPrint,
  DollarSign,
  Package,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Tag,
  Eye,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [petToView, setPetToView] = useState<Pet | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth & Role Guard: Admin Only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/dashboard');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

  // Load Dashboard Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, ordRes] = await Promise.all([
        api.petshop.getDashboardSummary(),
        api.petshop.getOrders(),
      ]);

      if (sumRes.success && sumRes.data) setSummary(sumRes.data);
      if (ordRes.success && ordRes.data) setOrders(ordRes.data);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error fetching dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      loadData();
    }
  }, [user, isAdmin, loadData]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Verifying administrator privileges...</span>
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
              You must have an <strong>Admin</strong> role to view the executive dashboard.
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 flex-1 space-y-6">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Admin Analytics & Metrics</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live business statistics, adoption revenue, and real-time transaction records
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              title="Refresh Data"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inventory</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PawPrint className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">
                <Counter end={summary?.totalPets ?? 0} />
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">pets registered</span>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold text-emerald-600">
                <Counter end={summary?.availablePets ?? 0} />
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">ready for adoption</span>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adopted</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold text-blue-600">
                <Counter end={summary?.adoptedPets ?? 0} />
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">placed with families</span>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">
                <Counter end={summary?.totalRevenue ?? 0} prefix="฿" />
              </span>
            </div>
          </Card>
        </div>

        {/* Category Breakdown & Quick Recent Pets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Category Distribution */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Category Breakdown
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  <Counter end={summary?.totalCategories ?? 0} /> Categories
                </span>
              </div>

              <div className="space-y-3">
                {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
                  summary.categoryBreakdown.map((item) => {
                    const total = summary.totalPets || 1;
                    const percent = Math.round((item.count / total) * 100);

                    return (
                      <div key={item.categoryName} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.categoryName}</span>
                          <span className="text-slate-500 font-mono">
                            {item.count} pets ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">No category breakdown data available.</p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                href="/master"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between group"
              >
                <span>Manage Categories &amp; Inventory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </Card>

          {/* Recently Added Pets Glance */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Recent Inventory Entries
                </h3>
                <p className="text-xs text-slate-500">Newly added pets to the database</p>
              </div>
              <Link href="/master">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Inventory
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Pet</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Breed</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary?.recentPets && summary.recentPets.length > 0 ? (
                    summary.recentPets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-slate-50 transition">
                        <td className="py-2 px-3 flex items-center gap-2.5">
                          <img
                            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
                            alt={pet.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <span className="font-semibold text-slate-900">{pet.name}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">{pet.categoryName}</td>
                        <td className="py-2 px-3 text-slate-600">{pet.breed}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">฿{pet.price.toLocaleString()}</td>
                        <td className="py-2 px-3">
                          <Badge variant={pet.status === 'Available' ? 'emerald' : 'blue'} size="sm">
                            {pet.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => setPetToView(pet)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title="Inspect Pet Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                        No recent pets registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Transactions / Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Adoption Transactions & Orders
              </h2>
              <p className="text-xs text-slate-500">
                Recent customer adoptions and order fulfillment status
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              <Counter end={orders.length} /> Total Transactions
            </span>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Pet Item</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length > 0 ? (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">{ord.orderNumber}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{ord.customerName}</div>
                          {ord.customerEmail && (
                            <div className="text-[10px] text-slate-400 font-mono">{ord.customerEmail}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{ord.petName}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ฿{ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{ord.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <Badge variant={ord.status === 'Completed' ? 'emerald' : 'amber'} size="sm">
                            {ord.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                        No orders recorded yet. Adopt pets from the Storefront to create orders!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PetDetailModal
        pet={petToView}
        onClose={() => setPetToView(null)}
      />
    </div>
  );
}
