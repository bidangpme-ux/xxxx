import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  BookOpen, 
  Target, 
  SlidersHorizontal, 
  LogOut, 
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AdminWorkspaceBannerProps {
  currentUser: { name: string; role: string; email: string } | null;
  onOpenCreatePublication: () => void;
  onOpenCreateJournal: () => void;
  onOpenCreateProgram: () => void;
  onNavigateToManage: () => void;
  onLogout: () => void;
  totalPublications: number;
  draftCount: number;
}

export const AdminWorkspaceBanner: React.FC<AdminWorkspaceBannerProps> = ({
  currentUser,
  onOpenCreatePublication,
  onOpenCreateJournal,
  onOpenCreateProgram,
  onNavigateToManage,
  onLogout,
  totalPublications,
  draftCount,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-600/50 shadow-emerald-950/20 animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Admin Status & User Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-amber-300 to-teal-300 shrink-0 shadow-xs">
            <img
              src="/logo.jpeg"
              alt="Logo Warung Rimbun"
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/25 text-emerald-200 text-3xs font-bold uppercase tracking-wider border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Mode Pengelola Aktif
              </span>
              <span className="text-2xs text-emerald-200/70 hidden sm:inline">
                Akses Langsung: Unggah · Sunting · Hapus Data
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mt-0.5">
              Selamat Bekerja, {currentUser?.name || 'Administrator'}
            </h3>
            <p className="text-2xs text-emerald-200/80">
              {currentUser?.role || 'Kurator & Editor Publikasi'} · <span className="font-mono">{currentUser?.email}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick In-Context Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-emerald-700/40">
          {/* Quick Upload Publication */}
          <button
            onClick={onOpenCreatePublication}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Unggah Foto & Kegiatan Baru"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>Unggah Kegiatan</span>
          </button>

          {/* Quick Create Journal */}
          <button
            onClick={onOpenCreateJournal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/50 hover:bg-emerald-600/60 text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Tulis Naskah Jurnal Lapangan"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tulis Jurnal</span>
          </button>

          {/* Quick Create Program */}
          <button
            onClick={onOpenCreateProgram}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/50 hover:bg-emerald-600/60 text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Tambah Target Program 2025-2029"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Program</span>
          </button>

          {/* Manage Archive Link */}
          <button
            onClick={onNavigateToManage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/50 hover:bg-emerald-600/60 text-emerald-100 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all"
            title="Buka Pusat Arsip Lengkap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pusat Arsip</span>
            {draftCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 text-3xs font-mono font-bold">
                {draftCount} Draf
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors ml-1"
            title="Keluar dari Sesi Administrator"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
