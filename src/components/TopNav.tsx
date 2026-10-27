import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Printer, 
  ChevronDown, 
  LayoutGrid, 
  Image as ImageIcon, 
  BookOpen, 
  SlidersHorizontal,
  Check,
  Compass,
  X,
  Camera
} from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateModal: () => void;
  onQuickPrintAll: () => void;
  totalPublicationsCount?: number;
  totalPhotosCount?: number;
  isLoggedIn?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateModal,
  onQuickPrintAll,
  totalPublicationsCount = 4,
  totalPhotosCount = 8,
  isLoggedIn = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Unified menu items configuration
  const menuItems = [
    {
      id: 'overview',
      title: 'Ikhtisar Kegiatan',
      description: 'Katalog utama, linimasa & sebaran wilayah',
      icon: LayoutGrid,
    },
    {
      id: 'gallery',
      title: 'Galeri Dokumentasi',
      description: 'Koleksi foto resolusi tinggi & arsip visual',
      icon: ImageIcon,
    },
    {
      id: 'photo-feed',
      title: 'Foto Kegiatan (Instagram)',
      description: 'Feed dokumentasi visual kegiatan bergaya Instagram',
      icon: Camera,
    },
    ...(isLoggedIn
      ? [
          {
            id: 'manage',
            title: 'Kelola & Arsip',
            description: 'Pusat administrasi, sunting status & ekspor',
            icon: SlidersHorizontal,
          },
        ]
      : []),
  ];

  const currentItem = menuItems.find((item) => item.id === currentTab) || menuItems[0];
  const CurrentIcon = currentItem.icon;

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark with Official Logo */}
          <button
            onClick={() => handleSelectTab('overview')}
            className="flex items-center gap-2.5 font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-neutral-700 transition-colors text-left"
          >
            <img
              src="/logo.jpeg"
              alt="Logo Resmi Warung Rimbun"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-600/30 shadow-xs"
            />
            <span className="text-base sm:text-lg font-serif">Warung Rimbun</span>
          </button>

          {/* Zone 2: Single Unified, Responsive & Aesthetic Navigation Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              className={`group inline-flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                isMenuOpen
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white border-emerald-700 shadow-sm shadow-emerald-700/25'
                  : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 border-emerald-200/80 hover:border-emerald-300'
              }`}
            >
              <div className={`p-1 rounded-md transition-colors ${
                isMenuOpen ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 shadow-2xs'
              }`}>
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>

              <span className="font-semibold whitespace-nowrap">
                {currentItem.title}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180 text-white' : 'text-emerald-600 group-hover:text-emerald-800'
              }`} />
            </button>

            {/* Aesthetic Floating Menu Popover (Responsive for Desktop & Mobile) */}
            {isMenuOpen && (
              <>
                {/* Mobile backdrop scrim */}
                <div 
                  className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-2 z-50 w-[92vw] max-w-xs sm:w-80 bg-white/98 backdrop-blur-md border border-emerald-200/80 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2">
                  <div className="px-3 pt-2.5 pb-2 border-b border-emerald-100 flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-wider font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-emerald-600" />
                      Navigasi Portal Kegiatan
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 text-emerald-600 hover:text-emerald-900 rounded-md sm:hidden"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Menu Items List */}
                  <div className="py-1 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group/item ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm shadow-emerald-700/25'
                              : 'hover:bg-emerald-50/80 text-neutral-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-emerald-800/80 text-white'
                              : 'bg-emerald-50 group-hover/item:bg-white text-emerald-700 border border-emerald-200/50'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-semibold ${
                                isActive ? 'text-white' : 'text-neutral-900'
                              }`}>
                                {item.title}
                              </span>
                              {isActive && (
                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                              )}
                            </div>
                            <p className={`text-2xs leading-snug mt-0.5 line-clamp-1 ${
                              isActive ? 'text-emerald-100' : 'text-neutral-500'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Aesthetic Footer Strip within Menu Card */}
                  <div className="mt-1 pt-2 border-t border-emerald-100 px-3 pb-1 flex items-center justify-between text-2xs text-emerald-700 font-medium">
                    <span className="font-mono tabular-nums">
                      {totalPublicationsCount} Kegiatan Terbit
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">
                      {totalPhotosCount} Arsip Foto
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isLoggedIn && (
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm shadow-emerald-600/30 active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publikasikan Kegiatan</span>
                <span className="sm:hidden">Publikasi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
