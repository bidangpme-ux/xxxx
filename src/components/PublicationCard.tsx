import React from 'react';
import { Publication } from '../types/publication';
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Eye, 
  ArrowUpRight, 
  Heart, 
  Bookmark,
  Edit3,
  Trash2
} from 'lucide-react';

interface PublicationCardProps {
  publication: Publication;
  onOpenJournal: (pub: Publication) => void;
  onOpenGallery: (pub: Publication) => void;
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  isLoggedIn?: boolean;
  onEdit?: (pub: Publication) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onOpenJournal,
  onOpenGallery,
  onToggleLike,
  onToggleBookmark,
  isLoggedIn = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const formattedDate = new Date(publication.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const photoCount = publication.gallery?.length || 0;
  const hasJournal = publication.type === 'journal' || publication.type === 'hybrid';
  const hasPhotos = publication.type === 'gallery' || publication.type === 'hybrid';

  return (
    <article className="group bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col hover:border-neutral-300 transition-all hover:shadow-xs">
      {/* Cover Image Container */}
      <div 
        className="relative aspect-16/9 bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => onOpenJournal(publication)}
      >
        <img
          src={publication.coverImage}
          alt={publication.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              const fallback = target.parentElement.querySelector('.image-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }
          }}
        />
        <div className="image-fallback hidden absolute inset-0 bg-neutral-800 text-neutral-300 flex flex-col items-center justify-center p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs">{publication.category}</span>
        </div>

        {/* Quiet overlay scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status pill (Admin Only - clickable to toggle Draf / Diterbitkan) */}
        {isLoggedIn && onToggleStatus && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(publication.id);
              }}
              title="Klik untuk mengubah status (Draf / Diterbitkan)"
              className={`px-2 py-0.5 rounded-md text-3xs sm:text-2xs font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-xs flex items-center gap-1 ${
                publication.status === 'published'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{publication.status === 'published' ? 'Diterbitkan' : 'Draf'}</span>
            </button>
          </div>
        )}

        {/* Quick action overlay buttons - Neatly contained capsule */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10 bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-neutral-200/80 shadow-xs">
          {/* Admin Edit Action */}
          {isLoggedIn && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(publication);
              }}
              title="Sunting Publikasi Ini"
              className="p-1.5 rounded-lg text-neutral-800 hover:text-white hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Admin Delete Action */}
          {isLoggedIn && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Hapus publikasi "${publication.title}"?`)) {
                  onDelete(publication.id);
                }
              }}
              title="Hapus Publikasi Ini"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(publication.id);
              }}
              title={publication.isBookmarked ? 'Hapus Simpanan' : 'Simpan Kegiatan'}
              className={`p-1.5 rounded-lg transition-colors ${
                publication.isBookmarked
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${publication.isBookmarked ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>

        {/* Quick photo counter overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {hasPhotos && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery(publication);
              }}
              title="Lihat Galeri Foto"
              className="px-2.5 py-1 text-xs bg-white/95 text-neutral-900 rounded-md font-medium hover:bg-white shadow-sm flex items-center gap-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="tabular-nums font-mono">{photoCount} Foto</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Clean unboxed text with subtle typographic separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mb-2.5">
            <span className="font-medium text-neutral-700">{publication.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>{formattedDate}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              <span className="truncate max-w-[130px]">{publication.location}</span>
            </span>
          </div>

          {/* Primary Title with text-wrap: balance */}
          <h3 
            onClick={() => onOpenJournal(publication)}
            className="text-base font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer leading-snug tracking-tight mb-2 text-balance"
          >
            {publication.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
            {publication.summary}
          </p>
        </div>

        {/* Card Footer: Author + Interactive Actions */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {onToggleLike && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(publication.id);
                }}
                title="Beri Apresiasi"
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-red-600 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${publication.likesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                <span className="font-mono tabular-nums text-2xs">{publication.likesCount}</span>
              </button>
            )}

            <div className="text-neutral-400 flex items-center gap-1 font-mono tabular-nums text-2xs ml-1">
              <Eye className="w-3 h-3" />
              <span>{publication.viewsCount}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenJournal(publication)}
            className="inline-flex items-center gap-1 font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            {hasJournal ? 'Buka Jurnal' : 'Buka Dokumentasi'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
