import React, { useState, useRef, useEffect } from 'react';
import { Publication, GalleryPhoto, JournalComment } from '../types/publication';
import { 
  X, 
  MapPin, 
  Building, 
  Printer, 
  Share2, 
  Check, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Heart, 
  Bookmark, 
  Send, 
  MessageSquare,
  Type
} from 'lucide-react';

interface JournalReaderModalProps {
  publication: Publication | null;
  onClose: () => void;
  onOpenPhotoLightbox: (photo: GalleryPhoto, relatedPublication: Publication) => void;
  onPrintReport: (publication: Publication) => void;
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onAddComment?: (pubId: string, comment: Omit<JournalComment, 'id' | 'date'>) => void;
}

export const JournalReaderModal: React.FC<JournalReaderModalProps> = ({
  publication,
  onClose,
  onOpenPhotoLightbox,
  onPrintReport,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
}) => {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'medium' | 'large'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Comment state
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  // TTS Audio Narration handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !publication) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${publication.title}. Ringkasan kegiatan: ${publication.journal.abstract}. Latar belakang: ${publication.journal.background}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!publication) return null;

  const formattedDate = new Date(publication.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(publication.id, {
        author: commenterName.trim() || 'Pembaca Terdaftar',
        text: commentText.trim(),
      });
      setCommentText('');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fontSizeClasses = {
    normal: 'text-sm leading-relaxed',
    medium: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Sticky Reading Progress Indicator Bar */}
        <div className="w-full h-1 bg-neutral-100">
          <div 
            className="h-full bg-neutral-900 transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Modal Top Header with Interactive Controls */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <span className="font-medium text-neutral-900">Jurnal Aktivitas</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[180px] sm:max-w-xs">{publication.category}</span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-1.5">
            {/* Audio narration button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Hentikan Audio' : 'Dengarkan Pembacaan Naskah (Audio)'}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                isSpeaking 
                  ? 'bg-neutral-900 text-white animate-pulse' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-2xs hidden sm:inline">{isSpeaking ? 'Berhenti' : 'Dengarkan'}</span>
            </button>

            {/* Font size toggle */}
            <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg p-0.5 text-2xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'normal' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 hover:text-emerald-800'}`}
                title="Ukuran Standar"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'medium' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 hover:text-emerald-800'}`}
                title="Ukuran Sedang"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'large' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 hover:text-emerald-800'}`}
                title="Ukuran Besar"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(publication.id)}
                title={publication.isBookmarked ? 'Hapus Simpanan' : 'Simpan Kegiatan'}
                className={`p-1.5 rounded-lg transition-colors ${
                  publication.isBookmarked
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${publication.isBookmarked ? 'fill-amber-600' : ''}`} />
              </button>
            )}

            {/* Like button */}
            {onToggleLike && (
              <button
                onClick={() => onToggleLike(publication.id)}
                title="Beri Apresiasi"
                className="flex items-center gap-1 p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${publication.likesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                <span className="text-2xs font-mono">{publication.likesCount}</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              title="Salin Tautan"
              className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onPrintReport(publication)}
              title="Cetak Laporan / PDF"
              className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Table of Contents (TOC) Nav Strip */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-2 flex items-center gap-3 overflow-x-auto text-2xs font-medium text-neutral-600">
          <span className="text-neutral-400 font-normal shrink-0">Navigasi Bab:</span>
          <button onClick={() => scrollToSection('sec-abstrak')} className="hover:text-neutral-900 whitespace-nowrap">
            Abstrak
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-latar')} className="hover:text-neutral-900 whitespace-nowrap">
            1. Latar Belakang
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-kronologi')} className="hover:text-neutral-900 whitespace-nowrap">
            2. Kronologi
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-temuan')} className="hover:text-neutral-900 whitespace-nowrap">
            3. Temuan & Hasil
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-evaluasi')} className="hover:text-neutral-900 whitespace-nowrap">
            4. Evaluasi
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-lampiran')} className="hover:text-neutral-900 whitespace-nowrap">
            5. Foto ({publication.gallery?.length || 0})
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection('sec-catatan')} className="hover:text-neutral-900 whitespace-nowrap">
            6. Catatan Pembaca
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-6 sm:px-12 py-8 space-y-8"
        >
          {/* Article Header */}
          <header className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">{publication.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formattedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {publication.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-snug text-balance">
              {publication.title}
            </h1>

            {/* Author and Organizer row */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-semibold text-xs shadow-2xs">
                  {publication.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-neutral-900">{publication.author.name}</div>
                  <div className="text-neutral-500 text-2xs">{publication.author.role} · {publication.author.division}</div>
                </div>
              </div>

              <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-neutral-500">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                <span>Penyelenggara: <strong className="text-neutral-700 font-medium">{publication.organizer}</strong></span>
              </div>
            </div>
          </header>

          {/* Hero Cover Image */}
          <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src={publication.coverImage}
              alt={publication.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {publication.gallery && publication.gallery[0] && (
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-xs flex justify-between items-center">
                <span className="truncate mr-4">{publication.gallery[0].caption}</span>
                {publication.gallery[0].photographer && (
                  <span className="text-neutral-300 font-mono text-2xs shrink-0">
                    Foto: {publication.gallery[0].photographer}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Key Metrics Strip (Tabular Figures) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs">
            <div>
              <span className="text-neutral-500 block text-2xs mb-0.5">Partisipan / Sasaran</span>
              <span className="font-semibold text-neutral-900 text-sm font-mono tabular-nums">
                {publication.journal.participantsCount} Orang
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-2xs mb-0.5">Tolak Ukur Capaian</span>
              <span className="font-semibold text-neutral-900 text-sm">
                {publication.journal.impactMetrics}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-2xs mb-0.5">Tingkat Minat Pembaca</span>
              <span className="font-semibold text-neutral-900 text-sm font-mono tabular-nums">
                {publication.viewsCount} Kunjungan · {publication.likesCount} Apresiasi
              </span>
            </div>
          </div>

          {/* Journal Sections with dynamic fontSize */}
          <article className={`space-y-7 text-neutral-800 ${fontSizeClasses}`}>
            {/* Abstract */}
            <div id="sec-abstrak" className="bg-neutral-50 border-l-2 border-neutral-900 p-4 rounded-r-lg">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Abstrak Kegiatan
              </h2>
              <p className="text-neutral-700 italic leading-normal">
                "{publication.journal.abstract}"
              </p>
            </div>

            {/* Background */}
            <div id="sec-latar">
              <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-1.5 mb-2.5">
                1. Latar Belakang & Konteks Pelaksanaan
              </h2>
              <p className="text-neutral-700">
                {publication.journal.background}
              </p>
            </div>

            {/* Activities Process */}
            <div id="sec-kronologi">
              <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-1.5 mb-2.5">
                2. Kronologi & Tahapan Pelaksanaan
              </h2>
              <ul className="space-y-2.5 mt-2">
                {publication.journal.activitiesProcess.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-neutral-700">
                    <span className="font-mono text-neutral-400 text-xs mt-0.5">0{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Findings & Results */}
            <div id="sec-temuan">
              <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-1.5 mb-2.5">
                3. Temuan, Hasil Nyata & Capaian
              </h2>
              <ul className="space-y-2 mt-2">
                {publication.journal.findingsAndResults.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evaluation & Follow-Up */}
            <div id="sec-evaluasi" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-1.5">
                  Evaluasi & Hambatan
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {publication.journal.evaluation}
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-1.5">
                  Rencana Tindak Lanjut
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {publication.journal.followUpPlan}
                </p>
              </div>
            </div>

            {/* Photo Documentation Appendix */}
            {publication.gallery && publication.gallery.length > 0 && (
              <div id="sec-lampiran">
                <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-1.5 mb-3 flex items-center justify-between">
                  <span>5. Lampiran Dokumentasi Foto</span>
                  <span className="text-xs font-mono text-neutral-400 font-normal">
                    {publication.gallery.length} Berkas Foto
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {publication.gallery.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => onOpenPhotoLightbox(photo, publication)}
                      className="group cursor-pointer border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 hover:border-neutral-400 transition-all"
                    >
                      <div className="aspect-16/9 overflow-hidden bg-neutral-200 relative">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <span className="text-xs font-medium px-2.5 py-1 bg-black/60 rounded-md">
                            Perbesar Foto
                          </span>
                        </div>
                      </div>
                      <div className="p-3 text-xs">
                        <p className="font-medium text-neutral-800 line-clamp-1">{photo.caption}</p>
                        {photo.photographer && (
                          <p className="text-neutral-500 text-2xs mt-0.5">Fotografer: {photo.photographer}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Interactive Readers' Reflection & Discussion */}
          <div id="sec-catatan" className="pt-6 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                <span>6. Catatan Pembaca & Diskusi Refleksi ({publication.comments?.length || 0})</span>
              </h3>
              <span className="text-xs text-neutral-500">Tinggalkan umpan balik untuk tim lapangan</span>
            </div>

            {/* Comments List */}
            {publication.comments && publication.comments.length > 0 ? (
              <div className="space-y-3">
                {publication.comments.map((c) => (
                  <div key={c.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{c.author}</span>
                      <span className="text-2xs text-neutral-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">Belum ada catatan pembaca. Jadilah yang pertama memberikan refleksi.</p>
            )}

            {/* Comment Form */}
            {onAddComment && (
              <form onSubmit={handleCommentSubmit} className="space-y-3 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    placeholder="Nama Anda (opsional)..."
                    className="text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tulis tanggapan atau catatan tindak lanjut kegiatan ini..."
                    className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors shrink-0 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
