import React, { useState } from 'react';
import { FlagshipProgram } from '../types/program.ts';
import { FLAGSHIP_PROGRAMS } from '../data/flagshipPrograms.ts';
import { ProgramChartCard } from './ProgramChartCard.tsx';
import { ProgramFormModal } from './ProgramFormModal.tsx';
import { ProgramCategoryModal } from './ProgramCategoryModal.tsx';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Award, 
  CheckCircle2, 
  Search,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Plus,
  FolderTree
} from 'lucide-react';

interface FlagshipProgramsSectionProps {
  programs?: FlagshipProgram[];
  categories?: string[];
  onAddProgram?: (program: FlagshipProgram) => void;
  onDeleteProgram?: (id: string) => void;
  onAddCategory?: (name: string) => void;
  onEditCategory?: (oldName: string, newName: string) => void;
  onDeleteCategory?: (name: string, replacement?: string) => void;
  isLoggedIn?: boolean;
  onNavigateToCategoryJournal?: (category: string) => void;
  onRequireLogin?: (reason?: string) => void;
}

export const FlagshipProgramsSection: React.FC<FlagshipProgramsSectionProps> = ({
  programs = FLAGSHIP_PROGRAMS,
  categories: managedCategories,
  onAddProgram,
  onDeleteProgram,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isLoggedIn = false,
  onNavigateToCategoryJournal,
  onRequireLogin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [focusYear, setFocusYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FlagshipProgram | null>(null);

  // Use managed categories if provided, otherwise derived from programs
  const derivedCategories = Array.from(new Set(programs.map((p) => p.category)));
  const categories = managedCategories && managedCategories.length > 0 ? managedCategories : derivedCategories;

  // Filter programs based on category & search query
  const filteredPrograms = programs.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = 
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate cumulative figures
  const total5YearBeneficiaries = programs.reduce((sum, p) => sum + p.totalFiveYearTarget, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Strategic Roadmap Cockpit Banner with Cheerful Emerald-Teal Identity */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-600/50">
        {/* Subtle decorative cheerful ambient background */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-2xs font-semibold uppercase tracking-wider text-amber-200">
              <Target className="w-3.5 h-3.5 text-white" />
              <span>Rencana Strategis Kabupaten Tanggamus 2025 — 2029</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Target Kinerja & Akselerasi Program Unggulan
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Pantau indikator kinerja utama, serta proyeksi grafis mandiri per program. Didesain transparan untuk menjamin akuntabilitas publik dan realisasi dampak nyata di masyarakat.
            </p>
          </div>

          {/* Quick Metrics Dashboard Pills */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl">
              <span className="text-2xs text-neutral-400 block mb-1">Target Total Kumulatif</span>
              <div className="text-xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                28.000+
              </div>
              <span className="text-2xs text-neutral-400 mt-1 block">Penerima manfaat & entitas</span>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl">
              <span className="text-2xs text-neutral-400 block mb-1">Rata-rata Laju Realisasi</span>
              <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                +72,4%
              </div>
              <span className="text-2xs text-emerald-300/80 mt-1 block">Tingkat pertumbuhan tahunan</span>
            </div>
          </div>
        </div>

        {/* 5-Year Horizon Interactive Rail */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-neutral-400 text-2xs font-semibold uppercase tracking-wide mr-1 whitespace-nowrap">
              Fokus Horizon:
            </span>
            {[2025, 2026, 2027, 2028, 2029].map((yr) => (
              <button
                key={yr}
                onClick={() => setFocusYear(yr)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap border ${
                  focusYear === yr
                    ? 'bg-white text-neutral-900 border-white shadow-sm scale-105'
                    : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/15'
                }`}
              >
                {yr} {yr === 2025 ? '• Selesai' : yr === 2026 ? '• Berjalan' : '• Rencana'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-2xs text-neutral-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tahun Berjalan 2026: Fase Integrasi & Uji Lapangan</span>
          </div>
        </div>
      </div>

      {/* Program Summary Matrix Cards (Quick Jumper) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {programs.map((prog) => {
          const targetInFocus = prog.targets.find((t) => t.year === focusYear);

          return (
            <div
              key={prog.id}
              onClick={() => {
                setSelectedCategory(prog.category);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedCategory === prog.category
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
                  : 'bg-white text-neutral-800 border-neutral-200 hover:border-emerald-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-2xs font-mono font-bold mb-1.5">
                <span className={selectedCategory === prog.category ? 'text-neutral-300' : 'text-neutral-500'}>
                  {prog.code}
                </span>
                <span className={`text-2xs px-1.5 py-0.5 rounded ${
                  selectedCategory === prog.category ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {prog.cagrRate}
                </span>
              </div>

              <h4 className="text-xs font-bold line-clamp-1 mb-2 leading-tight">
                {prog.title.split(' ')[0]} {prog.title.split(' ')[1]}
              </h4>

              <div className="pt-2 border-t border-neutral-100/30 flex items-center justify-between text-2xs">
                <span className="opacity-70">{focusYear}:</span>
                <span className="font-mono font-bold">
                  {targetInFocus?.targetValue.toLocaleString('id-ID')} {prog.unit.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar with Admin Action */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program, kode, atau indikator..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Categories Bar & Add Program Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-neutral-400 font-semibold text-2xs mr-1 whitespace-nowrap">
              Kategori:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs transition-all font-medium ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:bg-emerald-50'
              }`}
            >
              Semua ({programs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs transition-all font-medium ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:bg-emerald-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Action Buttons: Kelola Kategori & Tambah Program - Hanya tampil setelah login */}
          {isLoggedIn && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                title="Kelola, Tambah, Edit, dan Hapus Kategori Program"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-emerald-50 text-neutral-800 text-xs font-semibold rounded-xl transition-all border border-neutral-200/80 shadow-2xs"
              >
                <FolderTree className="w-3.5 h-3.5 text-emerald-700" />
                <span>Kelola Kategori</span>
              </button>

              <button
                onClick={() => {
                  setEditingProgram(null);
                  setIsProgramModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Program</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Dedicated Responsive Charts per Program */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filteredPrograms.map((program) => (
          <ProgramChartCard
            key={program.id}
            program={program}
            onOpenJournalLink={onNavigateToCategoryJournal}
            isLoggedIn={isLoggedIn}
            onEditProgram={(prog) => {
              setEditingProgram(prog);
              setIsProgramModalOpen(true);
            }}
            onDeleteProgram={onDeleteProgram}
          />
        ))}
      </div>

      {/* Institutional Assurance Badge */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="p-3 bg-neutral-100 rounded-2xl shrink-0 text-neutral-900">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Sinkronisasi Jurnal Lapangan & Bukti Dokumentasi Nyata
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Setiap capaian target tahunan pada dashboard ini terhubung langsung dengan bukti naskah jurnal aktivitas lapangan dan arsip dokumentasi kegiatan yang dapat ditelusuri keabsahannya.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateToCategoryJournal) {
              onNavigateToCategoryJournal('all');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-semibold rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer active:scale-95"
        >
          <span>Eksplorasi Jurnal Kegiatan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal Kelola Kategori Program */}
      <ProgramCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        programs={programs}
        onAddCategory={(cat) => onAddCategory?.(cat)}
        onEditCategory={(oldN, newN) => onEditCategory?.(oldN, newN)}
        onDeleteCategory={(cat, repl) => onDeleteCategory?.(cat, repl)}
      />

      {/* Modal Tambah / Sunting Program - Admin Saja */}
      {isLoggedIn && (
        <ProgramFormModal
          isOpen={isProgramModalOpen}
          initialData={editingProgram}
          onClose={() => {
            setIsProgramModalOpen(false);
            setEditingProgram(null);
          }}
          onSave={(prog) => {
            onAddProgram?.(prog);
            setIsProgramModalOpen(false);
            setEditingProgram(null);
          }}
          onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
          categories={categories.length > 0 ? categories : [
            'Pendidikan & Pelatihan',
            'Bakti Sosial & Lingkungan',
            'Seminar & Riset',
            'Ekspedisi & Lapangan',
            'Organisasi & Tata Kelola'
          ]}
        />
      )}
    </div>
  );
};
