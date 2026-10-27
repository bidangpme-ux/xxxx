import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Grid3X3, 
  Square, 
  MoreHorizontal, 
  MapPin, 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Smile, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  X,
  Volume2,
  VolumeX,
  Play,
  Plus
} from 'lucide-react';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';

interface InstagramPhotoFeedProps {
  photos: InstagramPhotoItem[];
  onToggleLike: (photoId: string) => void;
  onToggleBookmark: (photoId: string) => void;
  onAddComment: (photoId: string, text: string) => void;
  categories?: string[];
  isLoggedIn?: boolean;
  onOpenUploadModal?: () => void;
}

export const InstagramPhotoFeed: React.FC<InstagramPhotoFeedProps> = ({
  photos,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  categories = [
    'Pendidikan & Pelatihan',
    'Bakti Sosial & Lingkungan',
    'Seminar & Riset',
    'Ekspedisi & Lapangan',
  ],
  isLoggedIn = false,
  onOpenUploadModal,
}) => {
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<InstagramPhotoItem | null>(null);
  
  // Double-tap heart animation per photo
  const [heartAnimId, setHeartAnimId] = useState<string | null>(null);

  // Carousel slide index per photo: { [photoId]: number }
  const [carouselIndex, setCarouselIndex] = useState<{ [id: string]: number }>({});

  // Comment input per photo
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  // Show all comments toggle per photo
  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({});

  // Performance pagination limits
  const [feedVisibleCount, setFeedVisibleCount] = useState<number>(6);
  const [gridVisibleCount, setGridVisibleCount] = useState<number>(12);

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const visibleFeedPhotos = filteredPhotos.slice(0, feedVisibleCount);
  const visibleGridPhotos = filteredPhotos.slice(0, gridVisibleCount);

  const handleDoubleTap = (photo: InstagramPhotoItem) => {
    if (!photo.isLiked) {
      onToggleLike(photo.id);
    }
    setHeartAnimId(photo.id);
    setTimeout(() => {
      setHeartAnimId(null);
    }, 800);
  };

  const handleCommentSubmit = (photoId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (commentInputs[photoId] || '').trim();
    if (!text) return;
    onAddComment(photoId, text);
    setCommentInputs((prev) => ({ ...prev, [photoId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [photoId]: true }));
  };

  const handleAddEmoji = (photoId: string, emoji: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || '') + emoji,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* INSTAGRAM PROFILE / FEED HEADER BAR */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0 shadow-xs">
            <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="Logo Resmi Warung Rimbun"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                warungrimbun.official
              </h2>
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xs font-bold" title="Akun Resmi Terverifikasi">
                ✓
              </span>
            </div>
            <p className="text-2xs text-neutral-500">
              Wadah Urun Rembuk Perencanaan &bull; <strong className="text-neutral-800">{photos.length} Kiriman</strong>
            </p>
          </div>
        </div>

        {/* View Switcher: Feed vs Grid */}
        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
            <button
              onClick={() => setViewMode('feed')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                viewMode === 'feed'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Tampilan Aliran Beranda (Feed)"
            >
              <Square className="w-4 h-4" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Tampilan Kotak Kisi (Grid 3x3)"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY PILL FILTER */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setFeedVisibleCount(6);
            setGridVisibleCount(12);
          }}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs transition-all font-semibold cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-emerald-50'
          }`}
        >
          Semua ({photos.length})
        </button>
        {categories.map((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setFeedVisibleCount(6);
                setGridVisibleCount(12);
              }}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs transition-all font-medium cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-emerald-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* 4. MODE A: INSTAGRAM FEED VIEW (SINGLE POST CARDS) */}
      {viewMode === 'feed' && (
        <div className="space-y-6">
          {visibleFeedPhotos.map((post) => {
            const allImages = post.carouselPhotos && post.carouselPhotos.length > 0 
              ? post.carouselPhotos 
              : [post.photoUrl];
            const currentIdx = carouselIndex[post.id] || 0;
            const currentImg = allImages[currentIdx] || post.photoUrl;
            const isCommentsOpen = expandedComments[post.id];

            return (
              <article
                key={post.id}
                className="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden shadow-2xs transition-all"
              >
                {/* Post Header */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                      <div className="p-0.5 bg-white rounded-full">
                        <img
                          src={
                            post.authorName?.toLowerCase().includes('warungrimbun') || post.authorName?.toLowerCase().includes('official')
                              ? '/logo.jpeg'
                              : post.photoUrl
                          }
                          alt={post.authorName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-neutral-900 leading-none">
                          {post.authorName}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-blue-500 text-white inline-flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="text-3xs text-neutral-500 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{post.location}</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-2xs font-semibold px-2 py-0.5 bg-neutral-100 rounded-lg text-neutral-600">
                    {post.category}
                  </span>
                </div>

                {/* Post Photo Canvas with Carousel & Double-Tap Heart */}
                <div 
                  className="relative aspect-square sm:aspect-4/3 bg-neutral-900 select-none cursor-pointer overflow-hidden group/canvas"
                  onDoubleClick={() => handleDoubleTap(post)}
                >
                  <img
                    src={currentImg}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Carousel Multiple Photos Badge */}
                  {allImages.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neutral-900/70 backdrop-blur-md text-white text-3xs font-mono font-bold tracking-wider">
                      {currentIdx + 1}/{allImages.length}
                    </div>
                  )}

                  {/* Carousel Left / Right Arrows */}
                  {allImages.length > 1 && (
                    <>
                      {currentIdx > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((prev) => ({
                              ...prev,
                              [post.id]: currentIdx - 1,
                            }));
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-900 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}

                      {currentIdx < allImages.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((prev) => ({
                              ...prev,
                              [post.id]: currentIdx + 1,
                            }));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-900 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Animated Big Pop Heart on Double Tap */}
                  {heartAnimId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
                      <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-pulse" />
                    </div>
                  )}

                  {/* Carousel Dot Indicators */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                      {allImages.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === currentIdx ? 'bg-white w-3' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Action Bar (Instagram Core Icons) */}
                <div className="p-3.5 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Heart Button */}
                      <button
                        onClick={() => onToggleLike(post.id)}
                        className="transition-transform active:scale-125 focus:outline-none"
                        title={post.isLiked ? 'Batal Suka' : 'Sukai Foto'}
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            post.isLiked
                              ? 'text-red-500 fill-red-500 scale-105'
                              : 'text-neutral-800 hover:text-neutral-500'
                          }`}
                        />
                      </button>

                      {/* Comment Bubble Button */}
                      <button
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className="text-neutral-800 hover:text-neutral-500 transition-colors"
                        title="Buka Komentar"
                      >
                        <MessageCircle className="w-6 h-6 -rotate-90" />
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: post.title, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Tautan foto berhasil disalin!');
                          }
                        }}
                        className="text-neutral-800 hover:text-neutral-500 transition-colors"
                        title="Bagikan"
                      >
                        <Send className="w-5 h-5 -rotate-12" />
                      </button>
                    </div>

                    {/* Bookmark / Save Button */}
                    <button
                      onClick={() => onToggleBookmark(post.id)}
                      className="text-neutral-800 hover:text-neutral-500 transition-transform active:scale-110"
                      title={post.isBookmarked ? 'Hapus Simpanan' : 'Simpan Foto'}
                    >
                      <Bookmark
                        className={`w-6 h-6 ${
                          post.isBookmarked ? 'text-neutral-900 fill-neutral-900' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-bold text-neutral-900 font-mono tabular-nums">
                    {post.likesCount.toLocaleString('id-ID')} suka
                  </div>

                  {/* Title & Caption */}
                  <div className="text-xs text-neutral-800 leading-relaxed space-y-1">
                    <p>
                      <strong className="font-bold text-neutral-900 mr-1.5">
                        {post.authorName}
                      </strong>
                      <span className="font-semibold text-neutral-900 block sm:inline mr-1">
                        [{post.title}]
                      </span>
                      {post.caption}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-2xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {post.photographer && (
                      <div className="text-3xs text-neutral-400 flex items-center gap-1 pt-0.5">
                        <Camera className="w-3 h-3" />
                        <span>Dokumentasi: {post.photographer}</span>
                      </div>
                    )}
                  </div>

                  {/* Comments Preview & Expand */}
                  {post.comments.length > 0 && (
                    <div className="pt-1">
                      {!isCommentsOpen && post.comments.length > 1 && (
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [post.id]: true,
                            }))
                          }
                          className="text-2xs text-neutral-500 hover:text-neutral-800 font-medium"
                        >
                          Lihat semua {post.comments.length} komentar
                        </button>
                      )}

                      <div className="space-y-1 mt-1 text-2xs">
                        {(isCommentsOpen ? post.comments : post.comments.slice(-1)).map((c) => (
                          <div key={c.id} className="flex items-start justify-between gap-2">
                            <p className="text-neutral-800">
                              <strong className="font-bold mr-1 text-neutral-900">{c.username}</strong>
                              <span>{c.text}</span>
                            </p>
                            <span className="text-3xs text-neutral-400 shrink-0 font-mono">
                              {c.timeAgo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Timestamp */}
                  <div className="text-3xs font-mono uppercase text-neutral-400 tracking-wider pt-0.5">
                    {post.date}
                  </div>

                  {/* Add Comment Input Form */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="pt-2 border-t border-neutral-100 flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1 text-neutral-400">
                      {['❤️', '🔥', '👏', '🙌'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddEmoji(post.id, emoji)}
                          className="text-xs hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      placeholder="Tambahkan komentar..."
                      className="flex-1 bg-transparent text-xs text-neutral-800 focus:outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="submit"
                      disabled={!(commentInputs[post.id] || '').trim()}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:hover:text-blue-600 transition-colors"
                    >
                      Kirim
                    </button>
                  </form>
                </div>
              </article>
            );
          })}

          {/* Load More Feed Posts */}
          {visibleFeedPhotos.length < filteredPhotos.length && (
            <div className="text-center pt-2 pb-4">
              <button
                onClick={() => setFeedVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-white border border-emerald-600 text-emerald-800 font-semibold text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Muat Lebih Banyak Kiriman Feed</span>
                <span className="bg-emerald-100 text-emerald-800 text-2xs px-2 py-0.5 rounded-full font-mono">
                  +{filteredPhotos.length - visibleFeedPhotos.length}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. MODE B: INSTAGRAM 3x3 SQUARE GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {visibleGridPhotos.map((post) => {
            const hasMultiple = post.carouselPhotos && post.carouselPhotos.length > 1;

            return (
              <div
                key={`grid-${post.id}`}
                onClick={() => setSelectedPhotoModal(post)}
                className="group relative aspect-square bg-neutral-900 cursor-pointer overflow-hidden rounded-xl"
              >
                <img
                  src={post.photoUrl}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Multiple Photos Icon Indicator */}
                {hasMultiple && (
                  <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-md text-white">
                    <Square className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Instagram Hover Overlay with Likes & Comments */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white -rotate-90" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More Grid Photos */}
          {visibleGridPhotos.length < filteredPhotos.length && (
            <div className="text-center pt-4 col-span-2 sm:col-span-3">
              <button
                onClick={() => setGridVisibleCount((prev) => prev + 12)}
                className="px-6 py-2.5 bg-white border border-emerald-600 text-emerald-800 font-semibold text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Muat Lebih Banyak Kotak Foto</span>
                <span className="bg-emerald-100 text-emerald-800 text-2xs px-2 py-0.5 rounded-full font-mono">
                  +{filteredPhotos.length - visibleGridPhotos.length}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. FULL INSTAGRAM PHOTO MODAL (When clicking a grid item) */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo Left/Top */}
            <div className="md:w-1/2 bg-emerald-950 flex items-center justify-center overflow-hidden aspect-square md:aspect-auto">
              <img
                src={selectedPhotoModal.photoUrl}
                alt={selectedPhotoModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Right */}
            <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 via-amber-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    WR
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block leading-tight">
                      {selectedPhotoModal.authorName}
                    </span>
                    <span className="text-3xs text-neutral-500">{selectedPhotoModal.location}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
                  <h3 className="font-bold text-neutral-900 text-sm">
                    {selectedPhotoModal.title}
                  </h3>
                  <p>{selectedPhotoModal.caption}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPhotoModal.tags.map((t) => (
                      <span key={t} className="text-2xs text-blue-600 font-semibold">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Comments list */}
                <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-2xs">
                  <span className="font-bold text-neutral-800 block mb-1">Komentar:</span>
                  {selectedPhotoModal.comments.map((c) => (
                    <div key={c.id} className="p-2 bg-neutral-50 rounded-xl">
                      <strong className="text-neutral-900 block">{c.username}</strong>
                      <p className="text-neutral-600">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bottom */}
              <div className="pt-4 border-t border-neutral-100 mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleLike(selectedPhotoModal.id)}
                      className="text-neutral-900"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          selectedPhotoModal.isLiked ? 'text-red-500 fill-red-500' : ''
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold font-mono">
                      {selectedPhotoModal.likesCount} suka
                    </span>
                  </div>
                  <span className="text-3xs text-neutral-400 font-mono">{selectedPhotoModal.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
