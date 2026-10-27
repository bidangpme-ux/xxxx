import React, { useState } from 'react';
import { Publication, PublicationCategory, PublicationType, GalleryPhoto } from '../types/publication';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Check } from 'lucide-react';
import { compressImageFile } from '../lib/imageOptimizer.ts';

interface PublicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publication: Publication) => void;
  initialData?: Publication | null;
  categories: PublicationCategory[];
  onAddCategory?: (newCategory: string) => void;
}

export const PublicationFormModal: React.FC<PublicationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  onAddCategory,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<PublicationType>(initialData?.type || 'hybrid');
  const [category, setCategory] = useState<PublicationCategory>(
    initialData?.category || categories[0]
  );
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(initialData?.location || '');
  const [organizer, setOrganizer] = useState(initialData?.organizer || '');
  const [authorName, setAuthorName] = useState(initialData?.author?.name || '');
  const [authorRole, setAuthorRole] = useState(initialData?.author?.role || '');
  const [authorDivision, setAuthorDivision] = useState(initialData?.author?.division || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  
  // Image & Gallery State
  const [coverImage, setCoverImage] = useState<string>(
    initialData?.coverImage || ''
  );
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(
    initialData?.gallery || []
  );

  // Dynamic Category addition state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Journal details
  const [abstract, setAbstract] = useState(initialData?.journal?.abstract || '');
  const [background, setBackground] = useState(initialData?.journal?.background || '');
  const [activitiesInput, setActivitiesInput] = useState(
    initialData?.journal?.activitiesProcess?.join('\n') || ''
  );
  const [findingsInput, setFindingsInput] = useState(
    initialData?.journal?.findingsAndResults?.join('\n') || ''
  );
  const [evaluation, setEvaluation] = useState(initialData?.journal?.evaluation || '');
  const [followUpPlan, setFollowUpPlan] = useState(initialData?.journal?.followUpPlan || '');
  const [participantsCount, setParticipantsCount] = useState<number>(
    initialData?.journal?.participantsCount || 30
  );
  const [impactMetrics, setImpactMetrics] = useState(
    initialData?.journal?.impactMetrics || '100% Agenda Terlaksana'
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(', ') || 'Publikasi, Kegiatan'
  );

  if (!isOpen) return null;

  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const optimized = await compressImageFile(file, { maxWidth: 1440, maxHeight: 1440, quality: 0.82 });
        setCoverImage(optimized);
        // Also prepend to gallery
        const newPhoto: GalleryPhoto = {
          id: `gal-upload-${Date.now()}`,
          url: optimized,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          photographer: authorName || 'Tim Dokumentasi',
          timestamp: new Date().toLocaleDateString('id-ID'),
        };
        setGalleryPhotos((prev) => [newPhoto, ...prev]);
      } catch (err) {
        console.error('Failed to compress image:', err);
      } finally {
        setIsCompressing(false);
        e.target.value = '';
      }
    }
  };

  const handleCreateNewCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setCategory(trimmed);
    setNewCatName('');
    setIsAddingCategory(false);
  };

  const handleRemovePhoto = (id: string) => {
    setGalleryPhotos(galleryPhotos.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const activitiesProcess = activitiesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const findingsAndResults = findingsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPublication: Publication = {
      id: initialData?.id || `pub-${Date.now()}`,
      title,
      slug,
      type,
      category,
      date,
      location: location || 'Lokasi Kegiatan',
      organizer: organizer || 'Panitia Pelaksana',
      author: {
        name: authorName || 'Pengelola Portal',
        role: authorRole || 'Penyusun Jurnal',
        division: authorDivision || 'Divisi Dokumentasi',
      },
      status: 'published',
      summary: summary || abstract || title,
      coverImage: coverImage || (galleryPhotos[0]?.url || '/logo.jpeg'),
      gallery: galleryPhotos.length > 0 ? galleryPhotos : [
        {
          id: `gal-default-${Date.now()}`,
          url: coverImage || '/logo.jpeg',
          caption: title,
        }
      ],
      journal: {
        abstract: abstract || summary || 'Dokumentasi ringkas pelaksanaan kegiatan.',
        background: background || 'Kegiatan diselenggarakan dalam rangka mencapai target kerja.',
        activitiesProcess: activitiesProcess.length > 0 ? activitiesProcess : ['Pelaksanaan rangkaian agenda kegiatan terpadu.'],
        findingsAndResults: findingsAndResults.length > 0 ? findingsAndResults : ['Agenda kegiatan berjalan lancar sesuai rencana.'],
        evaluation: evaluation || 'Evaluasi umum menunjukkan respon partisipasi yang sangat positif.',
        followUpPlan: followUpPlan || 'Tindak lanjut berupa pelaporan dan monitoring berkala.',
        participantsCount: Number(participantsCount) || 25,
        impactMetrics: impactMetrics || '100% Agenda Terealisasi',
      },
      tags: tags.length > 0 ? tags : ['Kegiatan', 'Publikasi'],
      viewsCount: initialData?.viewsCount || 1,
      likesCount: initialData?.likesCount || 0,
      isBookmarked: initialData?.isBookmarked || false,
      comments: initialData?.comments || [],
      featured: initialData?.featured || false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newPublication);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {initialData ? 'Sunting Publikasi Kegiatan' : 'Publikasikan Kegiatan Baru'}
            </h2>
            <p className="text-xs text-neutral-500">
              Unggah dokumentasi foto dan susun naskah jurnal kegiatan secara terstruktur.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-6 space-y-6">
          {/* Format Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Format Publikasi
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('hybrid')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  type === 'hybrid'
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-2xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-emerald-50'
                }`}
              >
                Lengkap (Foto + Jurnal)
              </button>
              <button
                type="button"
                onClick={() => setType('journal')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  type === 'journal'
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-2xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-emerald-50'
                }`}
              >
                Naskah Jurnal Saja
              </button>
              <button
                type="button"
                onClick={() => setType('gallery')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  type === 'gallery'
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-2xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-emerald-50'
                }`}
              >
                Dokumentasi Foto Saja
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lokakarya Akselerasi Digital & Kolaborasi Tim"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Kategori Kegiatan
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-2xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingCategory ? 'Batal' : '+ Tambah'}</span>
                </button>
              </div>

              {isAddingCategory ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nama kategori baru..."
                    className="flex-1 text-xs px-2.5 py-2 bg-white border border-emerald-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateNewCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewCategory}
                    className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PublicationCategory)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {category && !categories.includes(category) && (
                    <option value={category}>{category}</option>
                  )}
                </select>
              )}
            </div>
          </div>

          {/* Date, Location, Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Lokasi Kegiatan
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kota / Gedung pelaksanaan"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Penyelenggara / Satgas
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Nama unit / kepanitiaan"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Author info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Penyusun Jurnal / Penulis
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nama penyusun"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Jabatan / Peran
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Koordinator / Fasilitator"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Divisi / Unit
              </label>
              <input
                type="text"
                value={authorDivision}
                onChange={(e) => setAuthorDivision(e.target.value)}
                placeholder="Divisi Pengembangan SDM"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Ringkasan Singkat (Lead Summary)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Deskripsi ringkas 1-2 kalimat untuk kartu ikhtisar dan katalog publikasi..."
              className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
            />
          </div>

          {/* Photo Management Section */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Dokumentasi Foto Kegiatan
                </h3>
                <p className="text-2xs text-neutral-500">
                  Unggah foto dokumentasi kegiatan dari perangkat Anda (JPG / PNG / WEBP).
                </p>
              </div>

              {/* Upload trigger */}
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attached Photos List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {galleryPhotos.map((photo, index) => (
                <div key={photo.id} className="flex gap-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-16 h-16 object-cover rounded-md shrink-0 bg-neutral-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = [...galleryPhotos];
                        updated[index].caption = e.target.value;
                        setGalleryPhotos(updated);
                      }}
                      placeholder="Keterangan foto / caption"
                      className="text-2xs w-full px-2 py-1 bg-white border border-neutral-200 rounded-sm"
                    />
                    <div className="flex items-center justify-between mt-1 text-2xs">
                      <button
                        type="button"
                        onClick={() => setCoverImage(photo.url)}
                        className={`text-2xs px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                          coverImage === photo.url
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {coverImage === photo.url ? 'Sampul Utama' : 'Jadikan Sampul'}
                      </button>

                      {galleryPhotos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Sections (Conditional if type is journal or hybrid) */}
          {(type === 'hybrid' || type === 'journal') && (
            <div className="border-t border-neutral-200 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Naskah Jurnal & Laporan Aktivitas
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Abstrak Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Ringkasan eksekutif tentang maksud, durasi, dan output kegiatan..."
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  1. Latar Belakang Masalah & Urgensi
                </label>
                <textarea
                  rows={3}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Mengapa kegiatan ini perlu dilaksanakan..."
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  2. Kronologi / Tahapan Pelaksanaan (1 baris per butir)
                </label>
                <textarea
                  rows={3}
                  value={activitiesInput}
                  onChange={(e) => setActivitiesInput(e.target.value)}
                  placeholder="Tahap 1: Registrasi dan pembukaan&#10;Tahap 2: Diskusi terarah kelompok&#10;Tahap 3: Perumusan dokumen keluaran"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  3. Temuan & Hasil Nyata (1 baris per butir)
                </label>
                <textarea
                  rows={3}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  placeholder="Capaian 1: 42 peserta dinyatakan kompeten&#10;Capaian 2: 1 berkas SOP kolaborasi tersusun&#10;Capaian 3: Peningkatan respon tim hingga 34%"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Evaluasi & Catatan Hambatan
                  </label>
                  <textarea
                    rows={2}
                    value={evaluation}
                    onChange={(e) => setEvaluation(e.target.value)}
                    placeholder="Kendala lapangan dan rekomendasi teknis..."
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rencana Tindak Lanjut
                  </label>
                  <textarea
                    rows={2}
                    value={followUpPlan}
                    onChange={(e) => setFollowUpPlan(e.target.value)}
                    placeholder="Langkah berikutnya pasca kegiatan..."
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Jumlah Partisipan (Orang)
                  </label>
                  <input
                    type="number"
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Metrik Dampak / Ketercapaian
                  </label>
                  <input
                    type="text"
                    value={impactMetrics}
                    onChange={(e) => setImpactMetrics(e.target.value)}
                    placeholder="Contoh: 98% Lulus Asesmen · 6 Dokumen Disahkan"
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Kata Kunci / Tag (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Workshop, Pelatihan, Riset, Lingkungan"
              className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {initialData ? 'Perbarui Publikasi' : 'Publikasikan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
