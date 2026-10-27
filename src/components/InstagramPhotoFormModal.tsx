import React, { useState, useRef } from 'react';
import { X, Upload, Camera, MapPin, Sparkles, Image as ImageIcon, Check, Trash2, Plus, Star } from 'lucide-react';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';
import { compressImageFile } from '../lib/imageOptimizer.ts';

interface InstagramPhotoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: InstagramPhotoItem) => void;
  initialData?: InstagramPhotoItem | null;
  categories: string[];
}

export const InstagramPhotoFormModal: React.FC<InstagramPhotoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialPhotos = initialData?.carouselPhotos && initialData.carouselPhotos.length > 0
    ? initialData.carouselPhotos
    : (initialData?.photoUrl ? [initialData.photoUrl] : []);

  const [title, setTitle] = useState(initialData?.title || '');
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [urlInput, setUrlInput] = useState('');
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [category, setCategory] = useState(initialData?.category || categories[0] || 'Pendidikan & Pelatihan');
  const [location, setLocation] = useState(initialData?.location || 'Jakarta Pusat');
  const [photographer, setPhotographer] = useState(initialData?.photographer || 'Tim Dokumentasi');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(' ') || '#WarungRimbun #DokumentasiLapangan');
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressing(true);
      const fileList = Array.from(files);
      const compressedList = await Promise.all(
        fileList.map((file) => compressImageFile(file, { maxWidth: 1440, maxHeight: 1440, quality: 0.82 }))
      );

      setPhotos((prev) => [...prev, ...compressedList]);
      if (!title && fileList[0]) {
        setTitle(fileList[0].name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('Failed to compress Instagram photos:', err);
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const updated = [...prev];
      const [target] = updated.splice(index, 1);
      return [target, ...updated];
    });
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setPhotos((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || photos.length === 0 || !caption.trim()) {
      if (photos.length === 0) {
        alert('Harap unggah minimal 1 foto kegiatan.');
      }
      return;
    }

    const parsedTags = tagsInput
      .split(/[\s,]+/)
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    const photoItem: InstagramPhotoItem = {
      id: initialData?.id || `ig-${Date.now()}`,
      title: title.trim(),
      photoUrl: photos[0],
      carouselPhotos: photos,
      caption: caption.trim(),
      category,
      location: location.trim(),
      photographer: photographer.trim(),
      authorName: initialData?.authorName || 'warungrimbun.official',
      date: initialData?.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      likesCount: initialData?.likesCount ?? Math.floor(Math.random() * 200 + 50),
      isLiked: initialData?.isLiked ?? false,
      isBookmarked: initialData?.isBookmarked ?? false,
      tags: parsedTags.length > 0 ? parsedTags : ['#WarungRimbun', '#DokumentasiKegiatan'],
      comments: initialData?.comments || [],
    };

    onSave(photoItem);
    onClose();
  };

  const handleInsertTag = (tag: string) => {
    if (!tagsInput.includes(tag)) {
      setTagsInput((prev) => `${prev} ${tag}`.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white border border-emerald-100 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                {isEditing ? 'Sunting Foto Feed Instagram' : 'Upload Foto Kegiatan Baru (Instagram Feed)'}
              </h3>
              <p className="text-2xs text-neutral-500">
                Publikasikan satu atau beberapa foto kegiatan (Carousel) dengan teks dan tagar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Multi-Photo Upload & Gallery Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-neutral-800 text-xs">
                Dokumentasi Foto Kegiatan ({photos.length} Terpilih)
              </label>
              <span className="text-3xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                Mendukung Carousel (Banyak Foto)
              </span>
            </div>

            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Clickable Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-950 group-hover:text-emerald-700">
                Klik untuk Pilih & Upload Foto dari Laptop / HP
              </span>
              <p className="text-2xs text-neutral-500 mt-1">
                Bisa memilih <strong>lebih dari 1 foto sekaligus</strong> (Tahan Shift / Ctrl di Laptop, atau pilih banyak di Galeri HP)
              </p>
            </div>

            {/* Multi-photo Thumbnails Grid */}
            {photos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-2xs text-neutral-500">
                  <span>Daftar Foto Carousel (Foto #1 adalah Sampul Utama):</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto Lagi</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-square border border-neutral-200 bg-neutral-900 shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`Foto ke-${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Number Index Badge */}
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white rounded text-3xs font-mono font-bold backdrop-blur-xs">
                        #{idx + 1}
                      </span>

                      {/* Primary Cover Badge or Button */}
                      {idx === 0 ? (
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-700/90 text-white rounded text-3xs font-semibold text-center backdrop-blur-xs flex items-center justify-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                          <span>Sampul Utama</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          title="Jadikan Foto Sampul Utama"
                          className="opacity-0 group-hover:opacity-100 absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 bg-neutral-900/85 hover:bg-emerald-700 text-white rounded text-3xs font-semibold text-center backdrop-blur-xs transition-opacity cursor-pointer"
                        >
                          Jadikan Sampul
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        title="Hapus Foto Ini"
                        className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-opacity cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add more button tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center p-3 text-emerald-700 transition-all cursor-pointer aspect-square"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-3xs font-bold text-center">Tambah Foto</span>
                  </button>
                </div>
              </div>
            )}

            {/* Optional URL Input */}
            <div className="pt-1">
              <span className="block text-2xs text-neutral-400 font-medium mb-1">
                Atau tambahkan tautan gambar eksternal (URL):
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-emerald-700 hover:text-white disabled:opacity-50 text-neutral-700 rounded-xl font-semibold transition-all shrink-0 cursor-pointer text-xs"
                >
                  + Tambah URL
                </button>
              </div>
            </div>
          </div>

          {/* Judul Kegiatan */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Judul Foto / Kegiatan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Lokakarya Akselerasi Digital & Kolaborasi Lapangan"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900"
            />
          </div>

          {/* Kategori & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Kategori Kegiatan</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Lokasi Geotag</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Semaka, Tanggamus, Lampung"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Fotografer */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Nama Fotografer</label>
            <input
              type="text"
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
              placeholder="Contoh: Ahmad Faisal"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Caption Instagram */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Caption Kiriman Instagram</label>
            <textarea
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tuliskan cerita menarik di balik momen kegiatan ini..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-neutral-700">Tagar / Hashtag</label>
              <span className="text-3xs text-neutral-400">Klik rekomendasi tagar untuk menambahkan</span>
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#WarungRimbun #DokumentasiLapangan #AksiNyata"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white mb-1.5"
            />
            <div className="flex flex-wrap gap-1 text-3xs">
              {['#WarungRimbun', '#DokumentasiKegiatan', '#BaktiSosial', '#TransformasiDigital', '#SemakaPeduli', '#KonservasiAlam'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleInsertTag(t)}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-emerald-100 text-neutral-700 hover:text-emerald-800 font-mono transition-colors"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-xl font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Foto Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
