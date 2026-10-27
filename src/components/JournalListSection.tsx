import React from 'react';
import { Publication } from '../types/publication';
import { Calendar, MapPin, User, ArrowUpRight, Printer, BookOpen, Plus, Edit3, Trash2 } from 'lucide-react';

interface JournalListSectionProps {
  publications: Publication[];
  onOpenJournal: (publication: Publication) => void;
  onPrintReport: (publication: Publication) => void;
  isLoggedIn?: boolean;
  onOpenCreateJournal?: () => void;
  onEditJournal?: (pub: Publication) => void;
  onDeleteJournal?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const JournalListSection: React.FC<JournalListSectionProps> = ({
  publications,
  onOpenJournal,
  onPrintReport,
  isLoggedIn = false,
  onOpenCreateJournal,
  onEditJournal,
  onDeleteJournal,
  onToggleStatus,
}) => {
  const journalPubs = publications.filter(
    (p) => p.type === 'journal' || p.type === 'hybrid'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Naskah Jurnal & Laporan Aktivitas
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kumpulan catatan lapangan, evaluasi program, dan sintesis temuan kegiatan terstruktur.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-neutral-500 font-mono tabular-nums">
            {journalPubs.length} Naskah Terbit
          </div>
          {isLoggedIn && onOpenCreateJournal && (
            <button
              onClick={onOpenCreateJournal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs shadow-emerald-600/25 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Jurnal Baru</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {journalPubs.map((pub) => {
          const formattedDate = new Date(pub.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

          return (
            <article
              key={pub.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 hover:border-neutral-300 transition-all hover:shadow-xs"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Journal Left Thumbnail */}
                <div 
                  className="lg:w-64 aspect-16/9 lg:aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 shrink-0 cursor-pointer"
                  onClick={() => onOpenJournal(pub)}
                >
                  <img
                    src={pub.coverImage}
                    alt={pub.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  />
                </div>

                {/* Journal Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Zero-Pill Metadata & Admin Status */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mb-2">
                      {isLoggedIn && onToggleStatus && (
                        <>
                          <button
                            onClick={() => onToggleStatus(pub.id)}
                            title="Klik untuk mengubah status (Draf / Diterbitkan)"
                            className={`px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider transition-all ${
                              pub.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {pub.status === 'published' ? 'Diterbitkan' : 'Draf'}
                          </button>
                          <span aria-hidden="true">·</span>
                        </>
                      )}

                      <span className="font-medium text-neutral-800">{pub.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {formattedDate}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{pub.location}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => onOpenJournal(pub)}
                      className="text-base sm:text-lg font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer leading-snug mb-2.5"
                    >
                      {pub.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                      {pub.journal.abstract || pub.summary}
                    </p>

                    {/* Key Findings Preview */}
                    {pub.journal.findingsAndResults && pub.journal.findingsAndResults.length > 0 && (
                      <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-700 mb-4 border border-neutral-100">
                        <span className="font-semibold text-neutral-900 block text-2xs uppercase tracking-wider mb-1">
                          Temuan & Dampak Utama:
                        </span>
                        <p className="line-clamp-2">
                          {pub.journal.findingsAndResults[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{pub.author.name}</span>
                      <span className="hidden sm:inline">({pub.author.role})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Admin inline controls */}
                      {isLoggedIn && onEditJournal && (
                        <button
                          onClick={() => onEditJournal(pub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200/80"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Sunting</span>
                        </button>
                      )}

                      {isLoggedIn && onDeleteJournal && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus naskah jurnal "${pub.title}"?`)) {
                              onDeleteJournal(pub.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Naskah Jurnal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onPrintReport(pub)}
                        className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Format Cetak</span>
                      </button>

                      <button
                        onClick={() => onOpenJournal(pub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 rounded-lg transition-all shadow-xs shadow-emerald-700/25 active:scale-95"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Baca Jurnal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
