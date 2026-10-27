import React, { useState } from 'react';
import { FlagshipProgram } from '../types/program';
import { X, Target, Plus, Check } from 'lucide-react';

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: FlagshipProgram) => void;
  categories: string[];
  initialData?: FlagshipProgram | null;
  onOpenCategoryManager?: () => void;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
  onOpenCategoryManager,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [code, setCode] = useState(initialData?.code || `PRG-EXP-${Math.floor(Math.random() * 900 + 100)}`);
  const [category, setCategory] = useState(initialData?.category || categories[0] || 'Pendidikan & Pelatihan');
  const [leadAgency, setLeadAgency] = useState(initialData?.leadAgency || '');
  const [unit, setUnit] = useState(initialData?.unit || 'Penerima Manfaat');
  const [description, setDescription] = useState(initialData?.description || '');
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'violet'>(
    initialData?.accentColor || 'indigo'
  );

  // Targets 2025 - 2029
  const target2025 = initialData?.targets?.find(t => t.year === 2025);
  const target2026 = initialData?.targets?.find(t => t.year === 2026);
  const target2027 = initialData?.targets?.find(t => t.year === 2027);
  const target2028 = initialData?.targets?.find(t => t.year === 2028);
  const target2029 = initialData?.targets?.find(t => t.year === 2029);

  const [t2025, setT2025] = useState(target2025?.targetValue ?? 500);
  const [r2025, setR2025] = useState(target2025?.realizationValue ?? 520);
  const [t2026, setT2026] = useState(target2026?.targetValue ?? 1200);
  const [r2026, setR2026] = useState(target2026?.realizationValue ?? 980);
  const [t2027, setT2027] = useState(target2027?.targetValue ?? 2400);
  const [t2028, setT2028] = useState(target2028?.targetValue ?? 4200);
  const [t2029, setT2029] = useState(target2029?.targetValue ?? 7000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leadAgency.trim()) return;

    const totalFiveYear = t2025 + t2026 + t2027 + t2028 + t2029;
    const progData: FlagshipProgram = {
      id: initialData?.id || `prg-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category,
      leadAgency: leadAgency.trim(),
      unit: unit.trim(),
      baseline2024: initialData?.baseline2024 ?? Math.round(t2025 * 0.4),
      totalFiveYearTarget: totalFiveYear,
      cagrRate: initialData?.cagrRate || '+65% / thn',
      accentColor,
      description: description.trim() || 'Inisiatif akselerasi program terpadu dengan pemantauan indikator kinerja tahunan terukur.',
      strategicOutcomes: initialData?.strategicOutcomes || [
        `Realisasi target terpadu ${totalFiveYear.toLocaleString('id-ID')} ${unit}`,
        'Penguatan kolaborasi lintas institusi dan komunitas lapangan',
        'Dokumentasi berkala dan publikasi jurnal evaluasi dampak',
      ],
      budgetEstimate: initialData?.budgetEstimate || '',
      iconName: accentColor === 'emerald' ? 'ecology' : accentColor === 'amber' ? 'research' : accentColor === 'rose' ? 'species' : accentColor === 'violet' ? 'community' : 'digital',
      targets: [
        {
          year: 2025,
          targetValue: Number(t2025),
          realizationValue: Number(r2025),
          status: 'completed',
          growthYoY: '+100%',
          milestone: target2025?.milestone || 'Fase pilot dan konsolidasi modul awal',
          notes: target2025?.notes,
        },
        {
          year: 2026,
          targetValue: Number(t2026),
          realizationValue: Number(r2026),
          status: 'in_progress',
          growthYoY: '+120%',
          milestone: target2026?.milestone || 'Fase ekspansi lapangan dan integrasi kemitraan',
          notes: target2026?.notes,
        },
        {
          year: 2027,
          targetValue: Number(t2027),
          status: 'projected',
          growthYoY: '+90%',
          milestone: target2027?.milestone || 'Penguatan skala menengah dan sertifikasi mutu',
        },
        {
          year: 2028,
          targetValue: Number(t2028),
          status: 'projected',
          growthYoY: '+75%',
          milestone: target2028?.milestone || 'Replikasi ke sentra regional lainnya',
        },
        {
          year: 2029,
          targetValue: Number(t2029),
          status: 'projected',
          growthYoY: '+60%',
          milestone: target2029?.milestone || 'Puncak kemandirian program dan transfer tata kelola',
        },
      ],
    };

    onSave(progData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                {isEditing ? 'Sunting Data Program Unggulan' : 'Tambah Program Unggulan (2025–2029)'}
              </h3>
              <p className="text-2xs text-neutral-500">
                {isEditing ? 'Perbarui target tahunan, sasaran milestone, dan rincian program' : 'Fitur Administrator Khusus untuk merencanakan target strategis institusi 5 tahunan'}
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-neutral-700 mb-1">Kode Program</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRG-DGT-01"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-neutral-700">Kategori Program</label>
                {onOpenCategoryManager && (
                  <button
                    type="button"
                    onClick={onOpenCategoryManager}
                    className="text-2xs font-semibold text-neutral-600 hover:text-neutral-900 underline flex items-center gap-1"
                  >
                    + Kelola / Tambah Kategori
                  </button>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Nama / Judul Program Unggulan</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Akselerasi Sanitasi Berkelanjutan & Sumur Resapan"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Unit Pengukuran Target</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Contoh: Penerima Manfaat, Titik Sumur, dll."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Divisi / Penanggung Jawab</label>
              <input
                type="text"
                required
                value={leadAgency}
                onChange={(e) => setLeadAgency(e.target.value)}
                placeholder="Contoh: Divisi Konservasi & Pemberdayaan"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Ringkasan Narasi Strategis</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan urgensi program unggulan ini..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>


          {/* Warna Aksen Kurva Grafik - Rapi, responsif, dan tidak labas dari jalur */}
          <div className="p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-neutral-800 text-xs">
                Warna Aksen Kurva Grafik
              </label>
              <span className="text-2xs text-neutral-400 font-mono">
                {accentColor === 'indigo' && '#4f46e5'}
                {accentColor === 'emerald' && '#059669'}
                {accentColor === 'amber' && '#d97706'}
                {accentColor === 'rose' && '#e11d48'}
                {accentColor === 'violet' && '#7c3aed'}
              </span>
            </div>

            {/* Selection buttons grid: strictly fits 5 columns or responsive wrap without overflowing */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {[
                { id: 'indigo', name: 'Indigo', hex: '#4f46e5' },
                { id: 'emerald', name: 'Emerald', hex: '#059669' },
                { id: 'amber', name: 'Amber', hex: '#d97706' },
                { id: 'rose', name: 'Rose', hex: '#e11d48' },
                { id: 'violet', name: 'Violet', hex: '#7c3aed' },
              ].map((item) => {
                const isSelected = accentColor === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccentColor(item.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-2xs font-semibold transition-all border ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Preview Canvas of Accent Curve - Strictly Contained */}
            <div className="p-2.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-xl flex items-center justify-between gap-3 overflow-hidden border border-emerald-700/60">
              <div className="flex items-center gap-2 min-w-0">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" 
                  style={{
                    backgroundColor: 
                      accentColor === 'indigo' ? '#4f46e5' :
                      accentColor === 'emerald' ? '#059669' :
                      accentColor === 'amber' ? '#d97706' :
                      accentColor === 'rose' ? '#e11d48' : '#7c3aed'
                  }} 
                />
                <span className="text-2xs text-neutral-300 truncate">
                  Pratinjau Garis Spektrum &bull; <strong className="capitalize text-white">{accentColor}</strong>
                </span>
              </div>
              
              <div className="w-24 h-7 shrink-0 overflow-hidden">
                <svg viewBox="0 0 100 28" className="w-full h-full">
                  <path 
                    d="M 0 24 C 25 22, 45 6, 70 12 C 85 15, 92 4, 100 3 L 100 28 L 0 28 Z" 
                    fill={
                      accentColor === 'indigo' ? '#4f46e5' :
                      accentColor === 'emerald' ? '#059669' :
                      accentColor === 'amber' ? '#d97706' :
                      accentColor === 'rose' ? '#e11d48' : '#7c3aed'
                    }
                    fillOpacity="0.25"
                  />
                  <path 
                    d="M 0 24 C 25 22, 45 6, 70 12 C 85 15, 92 4, 100 3" 
                    fill="none" 
                    stroke={
                      accentColor === 'indigo' ? '#4f46e5' :
                      accentColor === 'emerald' ? '#059669' :
                      accentColor === 'amber' ? '#d97706' :
                      accentColor === 'rose' ? '#e11d48' : '#7c3aed'
                    } 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  <circle 
                    cx="100" 
                    cy="3" 
                    r="2.5" 
                    fill="#ffffff" 
                    stroke={
                      accentColor === 'indigo' ? '#4f46e5' :
                      accentColor === 'emerald' ? '#059669' :
                      accentColor === 'amber' ? '#d97706' :
                      accentColor === 'rose' ? '#e11d48' : '#7c3aed'
                    } 
                    strokeWidth="1.5" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Target Matrix 2025 - 2029 */}
          <div className="pt-3 border-t border-neutral-200/80">
            <h4 className="font-bold text-neutral-900 mb-2 flex items-center justify-between">
              <span>Target Tahunan (2025 — 2029)</span>
              <span className="text-2xs font-normal text-neutral-500">Nilai dalam ({unit})</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-2xs font-bold text-neutral-700 block mb-1">2025 (Selesai)</span>
                <label className="text-3xs text-neutral-400 block">Target</label>
                <input
                  type="number"
                  min="0"
                  value={t2025}
                  onChange={(e) => setT2025(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg mb-1"
                />
                <label className="text-3xs text-neutral-400 block">Realisasi</label>
                <input
                  type="number"
                  min="0"
                  value={r2025}
                  onChange={(e) => setR2025(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-2xs font-bold text-neutral-700 block mb-1">2026 (Berjalan)</span>
                <label className="text-3xs text-neutral-400 block">Target</label>
                <input
                  type="number"
                  min="0"
                  value={t2026}
                  onChange={(e) => setT2026(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg mb-1"
                />
                <label className="text-3xs text-neutral-400 block">Realisasi</label>
                <input
                  type="number"
                  min="0"
                  value={r2026}
                  onChange={(e) => setR2026(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-2xs font-bold text-neutral-700 block mb-1">2027 (Rencana)</span>
                <label className="text-3xs text-neutral-400 block">Target</label>
                <input
                  type="number"
                  min="0"
                  value={t2027}
                  onChange={(e) => setT2027(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-2xs font-bold text-neutral-700 block mb-1">2028 (Rencana)</span>
                <label className="text-3xs text-neutral-400 block">Target</label>
                <input
                  type="number"
                  min="0"
                  value={t2028}
                  onChange={(e) => setT2028(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-2xs font-bold text-neutral-700 block mb-1">2029 (Puncak)</span>
                <label className="text-3xs text-neutral-400 block">Target</label>
                <input
                  type="number"
                  min="0"
                  value={t2029}
                  onChange={(e) => setT2029(Number(e.target.value))}
                  className="w-full py-1 px-1.5 font-mono text-xs bg-white border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
          </div>

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
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Program Unggulan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
