'use client';

import React from 'react';
import { PawPrint, GitBranch } from 'lucide-react';

export const Footer: React.FC = () => {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'v1.0.0-dev';

  return (
    <footer className="border-t border-slate-200 bg-white py-5 mt-auto">
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

        {/* Clean Version Tag & Rights */}
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-[11px] font-mono text-slate-600 transition select-none cursor-default"
            title={`Application Version: ${version}`}
          >
            <GitBranch className="w-3 h-3 text-slate-400" />
            <span className="font-medium">{version}</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="text-[11px] text-slate-400 font-medium">
            All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
