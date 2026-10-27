import React, { useState } from 'react';
import { Publication, GalleryPhoto } from '../types/publication';
import { 
  Calendar, 
  MapPin, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Bookmark, 
  Image as ImageIcon,
  Edit3,
  Trash2
} from 'lucide-react';

interface TimelineViewProps {
  publications: Publication[];
  onOpenJournal: (pub: Publication) => void;
  onOpenPhotoLightbox: (photo: GalleryPhoto, pub: Publication) => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  isLoggedIn?: boolean;
  onEdit?: (pub: Publication) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  publications,
  onOpenJournal,
  onOpenPhotoLightbox,
  onToggleLike,
  onToggleBookmark,
  isLoggedIn = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort publications chronologically
  const sortedPubs = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Linimasa Kronologis Kegiatan
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Telusuri rekam jejak pelaksanaan kegiatan, ekspedisi, dan simposium secara kronologis waktu.
          </p>
        </div>
        <div className="text-xs text-neutral-500 font-mono tabular-nums">
          {sortedPubs.length} Titik Milestoni Tercatat
        </div>
      </div>

      {/* Timeline track container */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-200 ml-4 sm:ml-6 space-y-8 my-6">
        {sortedPubs.map((pub, idx) => {
          const isExpanded = expandedId === pub.id;
          const formattedDate = new Date(pub.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

          return (
            <div key={pub.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all shadow-xs">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  {/* Photo Thumbnail */}
                  <div 
                    className="w-full md:w-56 aspect-16/9 md:aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 shrink-0 cursor-pointer relative"
                    onClick={() => {
                      if (pub.gallery && pub.gallery[0]) {
                        onOpenPhotoLightbox(pub.gallery[0], pub);
                      } else {
                        onOpenJournal(pub);
                      }
                    }}
                  >
                    <img
                      src={pub.coverImage}
                      alt={pub.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    {pub.gallery && pub.gallery.length > 1 && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-2xs bg-black/70 text-white rounded font-mono">
                        +{pub.gallery.length} Foto
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-neutral-900">{pub.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {formattedDate}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span className="truncate max-w-[140px]">{pub.location}</span>
                        </span>
                      </div>

                      {/* Micro actions & Admin controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isLoggedIn && onToggleStatus && (
                          <button
                            onClick={() => onToggleStatus(pub.id)}
                            title="Klik untuk ubah status"
                            className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase ${
                              pub.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {pub.status === 'published' ? 'Diterbitkan' : 'Draf'}
                          </button>
                        )}

                        {isLoggedIn && onEdit && (
                          <button
                            onClick={() => onEdit(pub)}
                            title="Sunting Kegiatan Ini"
                            className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isLoggedIn && onDelete && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus kegiatan "${pub.title}"?`)) {
                                onDelete(pub.id);
                              }
                            }}
                            title="Hapus Kegiatan Ini"
                            className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onToggleBookmark(pub.id)}
                          className={`p-1 rounded ${pub.isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-neutral-400 hover:text-neutral-900'}`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${pub.isBookmarked ? 'fill-amber-600' : ''}`} />
                        </button>
                        <button
                          onClick={() => onToggleLike(pub.id)}
                          className="flex items-center gap-1 p-1 rounded text-neutral-500 hover:text-red-600"
                        >
                          <Heart className={`w-3.5 h-3.5 ${pub.likesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                          <span className="text-2xs font-mono">{pub.likesCount}</span>
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => onOpenJournal(pub)}
                      className="text-base font-bold text-neutral-900 hover:text-neutral-700 cursor-pointer leading-snug mb-2"
                    >
                      {pub.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-3">
                      {pub.summary}
                    </p>

                    {/* Inline Expandable Journal Drawer */}
                    {isExpanded && (
                      <div className="my-3 pt-3 border-t border-neutral-100 text-xs space-y-3 bg-neutral-50 p-3 rounded-lg">
                        <div>
                          <strong className="text-neutral-900 font-semibold block mb-0.5">Abstrak Pelaksanaan:</strong>
                          <p className="text-neutral-700 italic">"{pub.journal.abstract}"</p>
                        </div>
                        <div>
                          <strong className="text-neutral-900 font-semibold block mb-0.5">Capaian & Temuan Utama:</strong>
                          <ul className="list-disc list-inside space-y-1 text-neutral-700">
                            {pub.journal.findingsAndResults.slice(0, 2).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between text-2xs text-neutral-500 pt-1">
                          <span>Sasaran: {pub.journal.participantsCount} Peserta</span>
                          <span>{pub.journal.impactMetrics}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Tutup Ringkasan</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Buka Ringkasan Lapangan</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {pub.gallery && pub.gallery[0] && (
                          <button
                            onClick={() => onOpenPhotoLightbox(pub.gallery[0], pub)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md font-medium"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Foto</span>
                          </button>
                        )}
                        <button
                          onClick={() => onOpenJournal(pub)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Baca Jurnal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
