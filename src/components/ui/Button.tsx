import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none gap-2 tracking-tight active:scale-[0.98]';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 focus:ring-2 focus:ring-emerald-500/30',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200/80 shadow-xs focus:ring-2 focus:ring-slate-300/30',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/20 focus:ring-2 focus:ring-rose-500/30',
    outline:
      'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs hover:border-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900',
  };

  const sizes = {
    sm: 'text-xs sm:text-sm px-4 py-2 rounded-xl min-h-[38px]',
    md: 'text-sm sm:text-base px-5 py-2.5 rounded-xl min-h-[44px]',
    lg: 'text-base sm:text-lg px-7 py-3.5 rounded-2xl min-h-[50px]',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : icon}
      {children}
    </button>
  );
};
