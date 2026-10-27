import React from 'react';
import { FilterState, PublicationCategory, DashboardViewMode } from '../types/publication';
import { Search, X, LayoutGrid, CalendarClock, Compass, Bookmark, Heart } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: PublicationCategory[];
  viewMode: DashboardViewMode;
  onViewModeChange: (mode: DashboardViewMode) => void;
  savedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  categories,
  viewMode,
  onViewModeChange,
  savedCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategorySelect = (cat: string) => {
    onFilterChange({ ...filters, category: cat });
  };

  const handleTypeSelect = (type: string) => {
    onFilterChange({ ...filters, type });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterState['sortBy'],
    });
  };

  const toggleBookmarkedOnly = () => {
    onFilterChange({
      ...filters,
      onlyBookmarked: !filters.onlyBookmarked,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      type: 'all',
      status: 'all',
      onlyBookmarked: false,
      sortBy: 'date-desc',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    Boolean(filters.onlyBookmarked);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 space-y-3.5">
      {/* Top row: Search, View Mode Switcher, and Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Cari kegiatan, lokasi, atau kata kunci naskah..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Segmented Controls (Grid vs Timeline vs Location) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-600 shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Katalog Kartu</span>
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Linimasa Waktu</span>
          </button>
          <button
            onClick={() => onViewModeChange('location')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'location'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sebaran Wilayah</span>
          </button>
        </div>

        {/* Saved Items Filter & Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleBookmarkedOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filters.onlyBookmarked
                ? 'bg-amber-500 text-white border-amber-500 font-semibold'
                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filters.onlyBookmarked ? 'fill-white' : ''}`} />
            <span>Tersimpan</span>
            <span className="font-mono tabular-nums text-2xs">({savedCount})</span>
          </button>

          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            aria-label="Urutkan publikasi kegiatan"
            className="text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="date-desc">Terbaru</option>
            <option value="date-asc">Terlama</option>
            <option value="likes-desc">Apresiasi Tertinggi</option>
            <option value="views-desc">Paling Banyak Dibaca</option>
            <option value="title-asc">Judul (A-Z)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline whitespace-nowrap px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Format / Type filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium text-neutral-600">
          <span className="text-2xs text-neutral-400 font-medium whitespace-nowrap mr-2">
            Format:
          </span>
          <button
            onClick={() => handleTypeSelect('all')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filters.type === 'all'
                ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                : 'text-neutral-600 hover:bg-emerald-50'
            }`}
          >
            Semua Format
          </button>
          <button
            onClick={() => handleTypeSelect('hybrid')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filters.type === 'hybrid'
                ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                : 'text-neutral-600 hover:bg-emerald-50'
            }`}
          >
            Lengkap (Foto & Jurnal)
          </button>
          <button
            onClick={() => handleTypeSelect('journal')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filters.type === 'journal'
                ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                : 'text-neutral-600 hover:bg-emerald-50'
            }`}
          >
            Jurnal Saja
          </button>
          <button
            onClick={() => handleTypeSelect('gallery')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filters.type === 'gallery'
                ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                : 'text-neutral-600 hover:bg-emerald-50'
            }`}
          >
            Galeri Foto
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-2xs text-neutral-400 font-medium whitespace-nowrap mr-1">
            Kategori:
          </span>
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-2 py-0.5 text-2xs rounded whitespace-nowrap transition-colors cursor-pointer ${
              filters.category === 'all'
                ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                : 'text-neutral-500 hover:bg-emerald-50'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-2 py-0.5 text-2xs rounded whitespace-nowrap transition-colors cursor-pointer ${
                filters.category === cat
                  ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                  : 'text-neutral-500 hover:bg-emerald-50'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
