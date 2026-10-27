import React, { useState } from 'react';
import { Publication, GalleryPhoto } from '../types/publication';
import { Eye, MapPin, Calendar, Camera, Maximize2, BookOpen } from 'lucide-react';

interface GallerySectionProps {
  publications: Publication[];
  onOpenPhotoLightbox: (photo: GalleryPhoto, relatedPublication: Publication) => void;
  onOpenJournal: (pub: Publication) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  publications,
  onOpenPhotoLightbox,
  onOpenJournal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Flatten all photos with their parent publication
  const allPhotosWithPub = publications.flatMap((pub) =>
    (pub.gallery || []).map((photo) => ({
      photo,
      publication: pub,
    }))
  );

  const filteredPhotos = selectedCategory === 'all'
    ? allPhotosWithPub
    : allPhotosWithPub.filter((item) => item.publication.category === selectedCategory);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const categories = Array.from(new Set(publications.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* Category filter strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Koleksi Dokumentasi Foto Kegiatan
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Arsip fotografi resolusi tinggi dari setiap tahapan dan pelaksanaan kegiatan.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setVisibleCount(12);
            }}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-semibold shadow-xs shadow-emerald-700/20'
                : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            Semua Foto ({allPhotosWithPub.length})
          </button>
          {categories.map((cat) => {
            const count = allPhotosWithPub.filter((i) => i.publication.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-semibold shadow-xs shadow-emerald-700/20'
                    : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <Camera className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800">Belum Ada Dokumentasi Foto</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Tidak ada foto yang cocok dengan kategori yang dipilih.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {visiblePhotos.map(({ photo, publication }) => (
              <div
                key={photo.id}
                className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-all hover:shadow-xs flex flex-col"
              >
                {/* Image with overlay action */}
                <div
                  className="relative aspect-16/9 bg-neutral-100 overflow-hidden cursor-pointer"
                  onClick={() => onOpenPhotoLightbox(photo, publication)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPhotoLightbox(photo, publication);
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-white/95 text-emerald-900 rounded-lg hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Perbesar Foto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Photo Metadata & Caption */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
                      <span className="font-medium text-neutral-700">{publication.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{photo.timestamp || publication.date}</span>
                    </div>
                    
                    <p className="text-sm font-medium text-neutral-900 mb-2 leading-snug">
                      {photo.caption}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      {photo.photographer && (
                        <span className="flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Foto: {photo.photographer}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate max-w-[150px]">{publication.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 truncate max-w-[220px]">
                      Kegiatan: <strong className="text-neutral-700 font-medium">{publication.title}</strong>
                    </span>
                    <button
                      onClick={() => onOpenJournal(publication)}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Baca Jurnal</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button if remaining */}
          {visiblePhotos.length < filteredPhotos.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-6 py-2.5 bg-white border border-emerald-600 text-emerald-800 font-semibold text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Tampilkan Lebih Banyak Foto</span>
                <span className="bg-emerald-100 text-emerald-800 text-2xs px-2 py-0.5 rounded-full font-mono">
                  +{filteredPhotos.length - visiblePhotos.length}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
