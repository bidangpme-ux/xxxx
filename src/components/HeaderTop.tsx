import React from 'react';
import { 
  Home, 
  Compass, 
  Camera, 
  User, 
  Plus, 
  ShieldCheck, 
  LogOut, 
  Sparkles 
} from 'lucide-react';

interface HeaderTopProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onQuickPrintAll?: () => void;
  onBrandClick?: () => void;
  isLoggedIn?: boolean;
  currentUser?: { id?: string; username?: string; name: string; role: string; email: string; avatar?: string } | null;
  onLogout?: () => void;
  onOpenLogin?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenCreateModal?: () => void;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
  currentTab = 'overview',
  onTabChange,
  onBrandClick,
  isLoggedIn = false,
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenAdminDashboard,
  onOpenCreateModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
      {/* Tricolor Institutional Accent Line: Emerald (Hutan Tanggamus) - Gold (Siger Lampung) - Teal (Sungai/Bahari) */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-700 via-amber-400 to-teal-600" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* ================================================================= */}
          {/* ZONA 1: SUSUNAN LOGO RESMI & BRANDMARK                           */}
          {/* ================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
            <button
              onClick={onBrandClick}
              title="Kembali ke Beranda Warung Rimbun"
              className="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer select-none transition-transform active:scale-[0.98]"
            >
              {/* Susunan Medali Logo dengan Aksen Lingkar Emas & Zamrud */}
              <div className="relative shrink-0">
                <div className="p-[2px] sm:p-[2.5px] rounded-full bg-gradient-to-tr from-emerald-600 via-amber-400 to-teal-500 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 ring-1 ring-emerald-600/20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden">
                    <img
                      src="/logo.jpeg"
                      alt="Logo Resmi Warung Rimbun BAPPERIDA Tanggamus"
                      className="w-full h-full object-contain rounded-full transform transition-transform duration-300 group-hover:rotate-1"
                    />
                  </div>
                </div>
              </div>

              {/* Garis Pemisah Halus (Desktop) */}
              <div className="hidden xl:block h-9 w-px bg-neutral-200 shrink-0" />

              {/* Bentuk Tulisan & Hierarki Tipografi Khas */}
              <div className="flex flex-col justify-center min-w-0">
                {/* Micro-Kicker */}
                <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-800 leading-none">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0 fill-amber-400" />
                  <span className="truncate">BAPPERIDA KAB. TANGGAMUS</span>
                </div>

                {/* Brandmark Utama */}
                <div className="flex items-baseline mt-0.5 leading-none">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 group-hover:text-emerald-950 transition-colors">
                    WARUNG
                  </span>
                  <span className="text-lg sm:text-xl font-black tracking-tight ml-1.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    RIMBUN
                  </span>
                </div>

                {/* Semboyan Ringkas */}
                <span className="text-[9.5px] text-neutral-500 font-medium tracking-tight mt-0.5 hidden xl:inline-block truncate">
                  Wadah Urun Rembuk Perencanaan &amp; Inovasi
                </span>
              </div>
            </button>
          </div>

          {/* ================================================================= */}
          {/* ZONA 2: MENU NAVIGASI (Dipindahkan ke Atas Sebelah Logo)          */}
          {/* ================================================================= */}
          <nav 
            aria-label="Navigasi Utama Warung Rimbun" 
            className="hidden md:flex items-center gap-1 sm:gap-1.5 bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200/90 shadow-2xs"
          >
            {/* 1. Beranda */}
            <button
              onClick={() => onTabChange && onTabChange('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900 hover:bg-white/90'
              }`}
              title="Beranda & Ikhtisar Kegiatan"
            >
              <Home className={`w-4 h-4 ${currentTab === 'overview' ? 'stroke-[2.5px] fill-white' : 'stroke-[1.8px]'}`} />
              <span>Beranda</span>
            </button>

            {/* 2. Program Unggulan */}
            <button
              onClick={() => onTabChange && onTabChange('programs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'programs'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900 hover:bg-white/90'
              }`}
              title="Program Unggulan Renstra 2025-2029"
            >
              <Compass className={`w-4 h-4 ${currentTab === 'programs' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span>Program</span>
            </button>

            {/* 3. Foto Kegiatan */}
            <button
              onClick={() => onTabChange && onTabChange('photo-feed')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'photo-feed'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-pink-600 hover:bg-white/90'
              }`}
              title="Feed Foto Kegiatan Dokumentasi"
            >
              <Camera className={`w-4 h-4 ${currentTab === 'photo-feed' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span>Foto</span>
            </button>

            {/* 4. Upload (+ Button hanya tampil setelah login) */}
            {isLoggedIn && onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-xs active:scale-95 transition-all cursor-pointer ml-1"
                title="Unggah Kegiatan Baru"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Upload</span>
              </button>
            )}
          </nav>

          {/* ================================================================= */}
          {/* ZONA 3: AKUN / MASUK / PANEL ADMIN                                */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* User avatar & badge */}
                <div 
                  onClick={onOpenAdminDashboard}
                  className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/80 cursor-pointer hover:bg-neutral-200/70 transition-colors"
                  title={`Tersambung sebagai ${currentUser?.name || 'Administrator'}`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-500 to-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="text-left">
                    <div className="text-2xs font-bold text-neutral-800 truncate max-w-[110px] leading-tight">
                      {currentUser?.name || 'Admin'}
                    </div>
                    <div className="text-3xs text-neutral-500 leading-none">
                      {currentUser?.role || 'Pengelola'}
                    </div>
                  </div>
                </div>

                {/* Admin Dashboard Button */}
                <button
                  onClick={onOpenAdminDashboard}
                  title={`Masuk ke Panel Pengelolaan (Login sebagai ${currentUser?.name || 'Administrator'})`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-[#563d7c] hover:bg-[#483368] text-white rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Panel Admin</span>
                  <span className="sm:hidden">Admin</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  title="Keluar dari sesi Administrator"
                  className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenLogin) onOpenLogin();
                  else if (onTabChange) onTabChange('login');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'login'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-950 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300'
                }`}
                title="Masuk Akun Pengelola"
              >
                <User className="w-4 h-4 text-emerald-800" />
                <span>Masuk</span>
              </button>
            )}
          </div>

        </div>

        {/* ================================================================= */}
        {/* SUB-BAR NAVIGASI MOBILE (Tampil rapi di layar HP/Tablet)           */}
        {/* ================================================================= */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-100 gap-1 overflow-x-auto">
          <button
            onClick={() => onTabChange && onTabChange('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onTabChange && onTabChange('programs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'programs'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Program</span>
          </button>

          <button
            onClick={() => onTabChange && onTabChange('photo-feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'photo-feed'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-pink-600 hover:bg-neutral-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto</span>
          </button>

          {isLoggedIn && onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Upload</span>
            </button>
          )}

          {!isLoggedIn && (
            <button
              onClick={() => {
                if (onOpenLogin) onOpenLogin();
                else if (onTabChange) onTabChange('login');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'login'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
