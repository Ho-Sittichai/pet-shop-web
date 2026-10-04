'use client';

import React from 'react';
import { PawPrint } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <PawPrint className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-800">Pet Store</span>
          <span className="text-slate-300">|</span>
          <span>© 2026 Pet Shop Management System</span>
        </div>

          <div className="text-[11px] text-slate-400 font-medium">
            All Rights Reserved
          </div>
        </div>
    </footer>
  );
};
