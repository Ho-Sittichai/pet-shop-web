'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, PawPrint, ShoppingBag, LayoutDashboard, Database, LogIn, ShieldCheck, User as UserIcon, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/store')) return true;
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Pet Store</span>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">Pet Shop Management</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-2 pl-6 border-l border-slate-200">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                isActive('/')
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                    isActive('/dashboard')
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/master"
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                    isActive('/master')
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Inventory</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile quick links */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link
              href="/"
              className={`p-2.5 rounded-xl text-sm font-bold ${isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
              title="Store"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className={`p-2.5 rounded-xl text-sm font-bold ${isActive('/dashboard') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link
                  href="/master"
                  className={`p-2.5 rounded-xl text-sm font-bold ${isActive('/master') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
                  title="Inventory"
                >
                  <Database className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              {/* User Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200/80 transition cursor-pointer select-none"
              >
                <div
                  className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center border shadow-xs ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-[11px] font-medium flex items-center gap-1 mt-0.5">
                    {isAdmin ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold flex items-center gap-0.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        User
                      </span>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {/* Popover Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user.email || `${user.username}@petshop.local`}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pet Store</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/master"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        >
                          <Database className="w-4 h-4" />
                          <span>Inventory</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold transition shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

