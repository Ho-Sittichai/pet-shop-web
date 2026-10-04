'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  PawPrint,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  RefreshCw,
} from 'lucide-react';

function LoginContent() {
  const { login, register, user, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get('redirect');
  const adoptPetId = searchParams.get('adoptPetId');

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (redirectParam) {
        const fullRedirect = adoptPetId ? `${redirectParam}?adoptPetId=${adoptPetId}` : redirectParam;
        router.push(fullRedirect);
      } else if (user.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router, redirectParam, adoptPetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const targetRedirect = redirectParam
        ? adoptPetId
          ? `${redirectParam}?adoptPetId=${adoptPetId}`
          : redirectParam
        : undefined;

      if (isRegister) {
        if (!fullName || !email || !telephone) {
          showToast('Please fill in all registration fields', 'error');
          return;
        }
        // Public registration is strictly role: 'User'
        await register({ username, password, fullName, telephone, email, role: 'User' }, targetRedirect);
        showToast('Registration successful! Welcome!', 'success');
      } else {
        await login({ username, password }, targetRedirect);
        showToast('Logged in successfully!', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-100/50 via-slate-50 to-teal-100/30 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-300/20 blur-3xl pointer-events-none" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Unified Elevated Auth Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 rounded-3xl p-7 sm:p-10">
          {/* Return to Store inside the modal - clean text link without background */}
          <div className="flex items-center justify-start mb-5">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-3.5 ring-4 ring-emerald-50">
              <PawPrint className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome to Pet Store'}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              {isRegister
                ? 'Register as a member to start adopting your companion'
                : 'Sign in to manage your pet adoptions and orders'}
            </p>
          </div>

          {/* Context Banner if coming from adopt flow */}
          {adoptPetId && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 font-medium shadow-xs">
              <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Please sign in or create an account to finalize your pet adoption order.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              icon={<UserIcon className="w-4 h-4" />}
            />

            {isRegister && (
              <>
                <Input
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  icon={<UserIcon className="w-4 h-4" />}
                />

                <Input
                  label="Telephone"
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="08x-xxx-xxxx"
                  icon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                />
              </>
            )}

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-3 font-extrabold text-sm sm:text-base py-3.5 shadow-md shadow-emerald-600/30"
            >
              <span>{isRegister ? 'Register & Start Adopting' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Swap mode toggle */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs sm:text-sm">
            {!isRegister ? (
              <p className="text-slate-600 font-medium">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
                >
                  Click to register
                </button>
              </p>
            ) : (
              <p className="text-slate-600 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
                >
                  Click to sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
