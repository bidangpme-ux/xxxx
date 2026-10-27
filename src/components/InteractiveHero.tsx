import React, { useState, useEffect } from 'react';
import { Publication, GalleryPhoto } from '../types/publication';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Image as ImageIcon, 
  Heart, 
  Bookmark, 
  Calendar, 
  MapPin, 
  Users 
} from 'lucide-react';

interface InteractiveHeroProps {
  featuredPublications: Publication[];
  onOpenJournal: (pub: Publication) => void;
  onOpenGallery: (photo: GalleryPhoto, pub: Publication) => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  featuredPublications,
  onOpenJournal,
  onOpenGallery,
  onToggleLike,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activePub = featuredPublications[currentIndex] || featuredPublications[0];

  useEffect(() => {
    if (!isAutoPlaying || featuredPublications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPublications.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredPublications.length]);

  if (!activePub) return null;

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featuredPublications.length) % featuredPublications.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredPublications.length);
  };

  const formattedDate = new Date(activePub.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="relative bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition-all mb-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:h-[380px] xl:h-[390px] min-h-0 overflow-hidden">
        {/* Left Visual Area with Photo and Caption */}
        <div className="lg:col-span-7 relative h-[250px] sm:h-[320px] lg:h-full min-h-0 overflow-hidden bg-neutral-900 group">
          {/* Ambient blurred backdrop for portrait or non-standard aspect ratio photos */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 scale-110" 
            style={{ backgroundImage: `url(${activePub.coverImage})` }} 
          />
          <img
            src={activePub.coverImage || '/logo.jpeg'}
            alt={activePub.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== `${window.location.origin}/logo.jpeg`) {
                target.src = '/logo.jpeg';
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-1 bg-gradient-to-t from-emerald-950/95 via-black/25 to-transparent pointer-events-none" />

          {/* Top visual tags */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-2xs font-semibold px-2.5 py-1 bg-emerald-950/85 text-amber-300 backdrop-blur-md rounded-md tracking-wider uppercase border border-emerald-700/40 shadow-xs">
              Sorotan Kegiatan
            </span>
            <span className="text-2xs font-mono tabular-nums px-2 py-1 bg-white/20 text-white backdrop-blur-md rounded-md shadow-xs">
              0{currentIndex + 1} / 0{featuredPublications.length}
            </span>
          </div>

          {/* Bottom Photo Caption & Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-4 text-white">
            <div className="max-w-md">
              <p className="text-xs font-medium text-neutral-100 line-clamp-1 drop-shadow-sm">
                {activePub.gallery?.[0]?.caption || activePub.title}
              </p>
              <div className="flex items-center gap-2 text-2xs text-emerald-200/90 mt-0.5">
                {activePub.gallery?.[0]?.photographer && (
                  <span>Foto: {activePub.gallery[0].photographer}</span>
                )}
                <span>·</span>
                <span className="truncate">{activePub.location}</span>
              </div>
            </div>

            {/* Slide Arrows */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Kegiatan Sebelumnya"
                className="p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-white backdrop-blur-sm transition-colors border border-emerald-700/40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Kegiatan Berikutnya"
                className="p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-white backdrop-blur-sm transition-colors border border-emerald-700/40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Editorial Details */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-white lg:h-full min-h-0 overflow-hidden">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Zero-Pill Header Metadata */}
            <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-semibold text-neutral-900 truncate">{activePub.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums shrink-0">{formattedDate}</span>
              </div>

              {/* Like & Bookmark Quick Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onToggleBookmark(activePub.id)}
                  title={activePub.isBookmarked ? 'Hapus Simpanan' : 'Simpan Kegiatan Ini'}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    activePub.isBookmarked
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${activePub.isBookmarked ? 'fill-amber-600' : ''}`} />
                </button>
                <button
                  onClick={() => onToggleLike(activePub.id)}
                  title="Beri Apresiasi"
                  className="flex items-center gap-1 p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${activePub.likesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                  <span className="text-2xs font-mono tabular-nums">{activePub.likesCount}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h2
              onClick={() => onOpenJournal(activePub)}
              className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 hover:text-emerald-800 cursor-pointer leading-snug line-clamp-2 text-balance transition-colors"
            >
              {activePub.title}
            </h2>

            {/* Summary */}
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {activePub.summary}
            </p>

            {/* Meta Strip */}
            <div className="space-y-1.5 text-xs text-neutral-600 py-2 border-y border-neutral-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{activePub.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-mono tabular-nums truncate">
                  {activePub.journal.participantsCount} Partisipan · {activePub.journal.impactMetrics}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Thumbnail Switcher */}
          <div className="pt-2.5 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-2.5">
              <button
                onClick={() => onOpenJournal(activePub)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-xl hover:from-emerald-800 hover:to-teal-700 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Baca Jurnal Lengkap</span>
              </button>

              {activePub.gallery && activePub.gallery[0] && (
                <button
                  onClick={() => onOpenGallery(activePub.gallery[0], activePub)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Foto ({activePub.gallery.length})</span>
                </button>
              )}
            </div>

            {/* Featured Thumbnail Scrubber */}
            <div className="flex items-center gap-2">
              <span className="text-2xs text-neutral-400 font-medium whitespace-nowrap">Sorotan:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {featuredPublications.map((pub, idx) => (
                  <button
                    key={pub.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={`h-6.5 px-2.5 rounded-lg text-2xs font-medium transition-all whitespace-nowrap truncate max-w-[130px] border cursor-pointer ${
                      idx === currentIndex
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                        : 'bg-emerald-50/50 text-neutral-700 border-emerald-200/60 hover:bg-emerald-100/60'
                    }`}
                  >
                    0{idx + 1}. {pub.category.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
