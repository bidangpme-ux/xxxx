import React, { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, Printer, Share2, ArrowUp, Home, Check } from 'lucide-react';

interface CustomContextMenuProps {
  onNavigateHome?: () => void;
}

export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({ onNavigateHome }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Izinkan klik kanan tetap aktif, namun gantikan dengan menu kustom
      // yang TIDAK MEMILIKI opsi 'Inspect Element' sama sekali!
      e.preventDefault();

      const menuWidth = 220;
      const menuHeight = 240;

      const maxX = Math.max(10, (window.innerWidth || 1000) - menuWidth - 10);
      const maxY = Math.max(10, (window.innerHeight || 800) - menuHeight - 10);

      const x = Math.min(Math.max(10, e.clientX), maxX);
      const y = Math.min(Math.max(10, e.clientY), maxY);

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      if (visible) setVisible(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  const handleCopy = () => {
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim().length > 0) {
      navigator.clipboard.writeText(selection);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setVisible(false);
    }, 600);
  };

  const handleReload = () => {
    setVisible(false);
    window.location.reload();
  };

  const handlePrint = () => {
    setVisible(false);
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      setVisible(false);
      try {
        await navigator.share({
          title: 'Warung Rimbun - BAPPERIDA Tanggamus',
          url: window.location.href,
        });
      } catch {
        // ignore abort
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setVisible(false);
      }, 800);
    }
  };

  const handleScrollTop = () => {
    setVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999999,
      }}
      className="bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xl rounded-2xl py-1.5 w-56 text-xs text-neutral-700 animate-in fade-in zoom-in-95 duration-100 select-none divide-y divide-neutral-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1.5 text-3xs font-bold uppercase tracking-wider text-emerald-800/80 bg-emerald-50/50 rounded-t-xl mb-1 flex items-center justify-between">
        <span>Menu Warung Rimbun</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      <div className="py-1">
        <button
          onClick={handleCopy}
          className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-neutral-500" />
          )}
          <span>{copied ? 'Tersalin!' : 'Salin Teks / Tautan'}</span>
        </button>

        <button
          onClick={handleReload}
          className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
          <span>Muat Ulang Halaman</span>
        </button>
      </div>

      <div className="py-1">
        <button
          onClick={handleShare}
          className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-neutral-500" />
          <span>Bagikan Portal</span>
        </button>

        <button
          onClick={handlePrint}
          className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-500" />
          <span>Cetak Halaman</span>
        </button>
      </div>

      <div className="py-1">
        {onNavigateHome && (
          <button
            onClick={() => {
              setVisible(false);
              onNavigateHome();
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-neutral-500" />
            <span>Ke Beranda</span>
          </button>
        )}

        <button
          onClick={handleScrollTop}
          className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-neutral-500" />
          <span>Kembali ke Atas</span>
        </button>
      </div>
    </div>
  );
};
