import React, { useState } from 'react';
import { FlagshipProgram } from '../types/program';
import { 
  X, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle,
  FolderTree,
  Sparkles
} from 'lucide-react';

interface ProgramCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  programs: FlagshipProgram[];
  onAddCategory: (categoryName: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string, replacementCategory?: string) => void;
}

export const ProgramCategoryModal: React.FC<ProgramCategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  programs,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  if (!isOpen) return null;

  const [newCatName, setNewCatName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State for editing in-place
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  // State for deletion confirmation with reassignment
  const [deletingCat, setDeletingCat] = useState<string | null>(null);
  const [replacementCat, setReplacementCat] = useState<string>('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setErrorMsg('Nama kategori tidak boleh kosong.');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Kategori dengan nama tersebut sudah ada.');
      return;
    }

    onAddCategory(trimmed);
    setNewCatName('');
    setErrorMsg(null);
  };

  const startEdit = (cat: string) => {
    setEditingCat(cat);
    setEditedName(cat);
    setDeletingCat(null);
    setErrorMsg(null);
  };

  const handleSaveEdit = (oldName: string) => {
    const trimmed = editedName.trim();
    if (!trimmed) {
      setErrorMsg('Nama kategori tidak boleh kosong.');
      return;
    }
    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrorMsg('Kategori dengan nama tersebut sudah ada.');
      return;
    }

    onEditCategory(oldName, trimmed);
    setEditingCat(null);
    setEditedName('');
    setErrorMsg(null);
  };

  const startDelete = (cat: string) => {
    if (categories.length <= 1) {
      setErrorMsg('Minimal harus ada 1 kategori program dalam sistem.');
      return;
    }
    const count = programs.filter((p) => p.category === cat).length;
    const remaining = categories.filter((c) => c !== cat);
    setDeletingCat(cat);
    setReplacementCat(remaining[0] || '');
    setEditingCat(null);
    setErrorMsg(null);
  };

  const handleConfirmDelete = (cat: string) => {
    onDeleteCategory(cat, replacementCat);
    setDeletingCat(null);
    setReplacementCat('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                Kelola Kategori Program
              </h3>
              <p className="text-2xs text-neutral-500">
                Tambah, sunting nama, atau hapus kategori untuk pengelompokan program kerja
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Tambah Kategori */}
          <form onSubmit={handleAddSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700">
              Tambah Kategori Baru
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Contoh: Konservasi Sumber Daya Air..."
                className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </form>

          {/* Daftar Kategori */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-neutral-700">
                Daftar Kategori Aktif ({categories.length})
              </span>
              <span className="text-2xs text-neutral-400">
                Total {programs.length} program terhubung
              </span>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const count = programs.filter((p) => p.category === cat).length;
                const isEditing = editingCat === cat;
                const isDeleting = deletingCat === cat;

                return (
                  <div
                    key={cat}
                    className="p-3 bg-neutral-50/90 border border-neutral-200/90 rounded-2xl transition-all"
                  >
                    {isEditing ? (
                      /* Mode Edit In-Place */
                      <div className="space-y-2">
                        <span className="text-2xs font-semibold text-neutral-500 block">
                          Sunting Nama Kategori:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-neutral-900"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat)}
                            className="p-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer"
                            title="Simpan Perubahan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCat(null)}
                            className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-xl transition-colors"
                            title="Batal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : isDeleting ? (
                      /* Mode Konfirmasi Hapus dengan Reassignment */
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">
                              Konfirmasi Hapus Kategori &ldquo;{cat}&rdquo;
                            </p>
                            {count > 0 ? (
                              <p className="text-2xs mt-1 text-amber-700">
                                Ada <strong>{count} program</strong> yang saat ini menggunakan kategori ini. Silakan pilih kategori baru untuk program-program tersebut:
                              </p>
                            ) : (
                              <p className="text-2xs mt-1 text-amber-700">
                                Kategori ini tidak memiliki program aktif dan aman untuk dihapus.
                              </p>
                            )}
                          </div>
                        </div>

                        {count > 0 && (
                          <div>
                            <label className="block text-2xs font-semibold text-neutral-600 mb-1">
                              Pindahkan {count} program ke kategori:
                            </label>
                            <select
                              value={replacementCat}
                              onChange={(e) => setReplacementCat(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900"
                            >
                              {categories
                                .filter((c) => c !== cat)
                                .map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setDeletingCat(null)}
                            className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded-xl"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(cat)}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
                          >
                            Ya, Hapus Kategori
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display Row */
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 block truncate">
                              {cat}
                            </span>
                            <span className="text-2xs text-neutral-500 font-mono">
                              {count} program aktif
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            title="Sunting Nama Kategori"
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-neutral-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startDelete(cat)}
                            title="Hapus Kategori Ini"
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
