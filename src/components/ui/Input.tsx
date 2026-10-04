import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full ${icon ? 'pl-10' : 'px-3.5'} pr-3.5 py-2.5 bg-white border ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
          } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition shadow-xs ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
