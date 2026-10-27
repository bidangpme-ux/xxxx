import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Globe, 
  Users, 
  Layers, 
  Shield, 
  FileText, 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Upload, 
  FolderTree, 
  Target, 
  BookOpen, 
  Printer, 
  Eye, 
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Save,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { UserManagementView } from './UserManagementView.tsx';
import { Publication } from '../types/publication.ts';
import { FlagshipProgram } from '../types/program.ts';
import { ProgramCategoryModal } from './ProgramCategoryModal.tsx';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos.ts';

export interface SiteSettings {
  webTitle: string;
  webDescription: string;
  logoText: string;
  favIconText: string;
  favIconColor: string;
  footerText: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  webTitle: 'Warung Rimbun - Wadah Urun Rembuk Perencanaan & Inovasi Pembangunan',
  webDescription: 'Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan BAPPERIDA Kabupaten Tanggamus. Dari Gagasan, Menjadi Rencana dan Aksi Pembangunan.',
  logoText: 'Warung Rimbun',
  favIconText: 'WR',
  favIconColor: '#15803d',
  footerText: '©{{YEAR}} <a href="#">Warung Rimbun</a> — BAPPERIDA Kabupaten Tanggamus',
};

const SITE_SETTINGS_KEY = 'warungrimbun_site_settings_v1';

interface AdminDashboardLayoutProps {
  currentUser: { id?: string; username?: string; name: string; role: string; email: string; avatar?: string } | null;
  onUpdateCurrentUser?: (updatedUser: { id?: string; username?: string; name: string; role: string; email: string; avatar?: string }) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  publications: Publication[];
  programs: FlagshipProgram[];
  categories: string[];
  activityCategories?: string[];
  onAddProgram: (program: FlagshipProgram) => void;
  onEditProgram: (program: FlagshipProgram) => void;
  onDeleteProgram: (id: string) => void;
  onAddCategory: (category: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (category: string, replacement?: string) => void;
  onAddActivityCategory?: (category: string) => void;
  onEditActivityCategory?: (oldName: string, newName: string) => void;
  onDeleteActivityCategory?: (category: string, replacement?: string) => void;
  onOpenCreatePublication: () => void;
  onEditPublication: (pub: Publication) => void;
  onDeletePublication: (id: string) => void;
  onTogglePublicationStatus: (id: string) => void;
  onOpenJournalReader: (pub: Publication) => void;
  onPrintPublication: (pub: Publication) => void;
  onPrintAll: () => void;
  onResetData: () => void;
  onOpenProgramModal: () => void;
  instagramPhotos?: InstagramPhotoItem[];
  onOpenCreateInstagramPhoto?: () => void;
  onEditInstagramPhoto?: (photo: InstagramPhotoItem) => void;
  onDeleteInstagramPhoto?: (id: string) => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onLogout,
  onViewPublicSite,
  publications,
  programs,
  categories,
  activityCategories,
  onAddProgram,
  onEditProgram,
  onDeleteProgram,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddActivityCategory,
  onEditActivityCategory,
  onDeleteActivityCategory,
  onOpenCreatePublication,
  onEditPublication,
  onDeletePublication,
  onTogglePublicationStatus,
  onOpenJournalReader,
  onPrintPublication,
  onPrintAll,
  onResetData,
  onOpenProgramModal,
  instagramPhotos = [],
  onOpenCreateInstagramPhoto,
  onEditInstagramPhoto,
  onDeleteInstagramPhoto,
}) => {
  // Active Sidebar Menu
  // Options: 'website-setting' | 'kategori-kegiatan' | 'kategori-program' | 'program-unggulan' | 'publikasi' | 'foto-instagram' | 'jurnal' | 'arsip' | 'user'
  const [activeMenu, setActiveMenu] = useState<string>('website-setting');
  const [categoryTab, setCategoryTab] = useState<'kegiatan' | 'program'>('kegiatan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWebsiteSubmenuOpen, setIsWebsiteSubmenuOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SITE_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(siteSettings));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3000);
    } catch {
      // ignore
    }
  };

  // Program Category in-line creation on category page
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');

  // Activity Category in-line creation & edit
  const [newActivityCatInput, setNewActivityCatInput] = useState('');
  const [editingActivityCatOldName, setEditingActivityCatOldName] = useState<string | null>(null);
  const [editingActivityCatNewName, setEditingActivityCatNewName] = useState('');

  const currentActivityCategories = activityCategories && activityCategories.length > 0 ? activityCategories : [
    'Pendidikan & Pelatihan',
    'Bakti Sosial & Lingkungan',
    'Seminar & Riset',
    'Ekspedisi & Lapangan',
    'Seni & Kebudayaan',
    'Organisasi & Tata Kelola'
  ];

  const handleAddNewActivityCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityCatInput.trim()) return;
    if (onAddActivityCategory) {
      onAddActivityCategory(newActivityCatInput.trim());
    }
    setNewActivityCatInput('');
  };

  const handleSaveEditedActivityCategory = (oldName: string) => {
    if (!editingActivityCatNewName.trim()) return;
    if (onEditActivityCategory) {
      onEditActivityCategory(oldName, editingActivityCatNewName.trim());
    }
    setEditingActivityCatOldName(null);
    setEditingActivityCatNewName('');
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    onAddCategory(newCatInput.trim());
    setNewCatInput('');
  };

  const handleSaveEditedCategory = (oldName: string) => {
    if (!editingCatNewName.trim()) return;
    onEditCategory(oldName, editingCatNewName.trim());
    setEditingCatOldName(null);
    setEditingCatNewName('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-neutral-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR (Purple Theme matching Jagowebdev screenshot) */}
      <header className="h-14 bg-[#563d7c] text-white flex items-center justify-between px-0 shrink-0 z-30 shadow-md">
        {/* Brand Section with Darker Background & Official Logo */}
        <div className="w-64 bg-[#363847] h-full flex items-center justify-between px-3 shrink-0 transition-all">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-teal-400 shrink-0 shadow-xs">
              <img
                src="/logo.jpeg"
                alt="Logo Warung Rimbun"
                className="w-8 h-8 rounded-full object-contain bg-white p-0.5"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-sans font-black text-sm tracking-tight text-white select-none truncate leading-none">
                WARUNG <span className="text-emerald-400 font-black">RIMBUN</span>
              </span>
              <span className="text-[9px] text-amber-300 font-bold tracking-wider uppercase truncate leading-none mt-1">
                BAPPERIDA TANGGAMUS
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Sembunyikan / Tampilkan Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Top Header Controls */}
        <div className="flex-1 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/80 hidden md:inline">
              Panel Administrasi &amp; Tata Kelola Kegiatan
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Upload Action (Only in logged in admin) */}
            <button
              onClick={onOpenCreatePublication}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold rounded-lg transition-all shadow-xs"
              title="Upload / Publikasikan Kegiatan Baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Kegiatan</span>
            </button>

            {/* View Public Website */}
            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors border border-white/20"
              title="Buka Pratinjau Tampilan Web Publik"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </button>

            {/* Quick Settings Icon */}
            <button
              onClick={() => setActiveMenu('website-setting')}
              className={`p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ${
                activeMenu === 'website-setting' ? 'bg-white/20 text-white' : ''
              }`}
              title="Pengaturan Website"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Avatar & Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white text-[#563d7c] font-bold text-xs flex items-center justify-center border-2 border-white/80 shadow-2xs">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <span className="text-xs font-semibold text-white hidden md:inline max-w-[120px] truncate">
                  {currentUser?.name?.split(' ')[0] || 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1 z-50 text-neutral-800 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {currentUser?.name || 'Administrator'}
                    </p>
                    <p className="text-2xs text-neutral-500 font-mono truncate">
                      {currentUser?.email || 'admin'}
                    </p>
                    <span className="inline-block mt-1 text-3xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                      {currentUser?.role || 'Administrator'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMenu('user-profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit Akun Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('user-management');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Kelola &amp; Tambah User</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('website-setting');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Setting Website</span>
                  </button>

                  <button
                    onClick={() => {
                      onViewPublicSite();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Halaman Depan Publik</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Dark Charcoal Theme matching screenshot: #363847) */}
        {isSidebarOpen && (
          <aside className="w-64 bg-[#363847] text-neutral-300 shrink-0 flex flex-col justify-between overflow-y-auto select-none border-r border-[#2d2f3d]">
            <div className="py-2">
              {/* Quick Upload Menu Button */}
              <div className="px-3 pb-2 pt-1">
                <button
                  onClick={onOpenCreatePublication}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Kegiatan Baru</span>
                </button>
              </div>

              {/* Menu Group 1: Website & Content */}
              <div>
                <button
                  onClick={() => setIsWebsiteSubmenuOpen(!isWebsiteSubmenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-neutral-200 hover:bg-[#2e303e] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span>Website</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                      isWebsiteSubmenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isWebsiteSubmenuOpen && (
                  <div className="bg-[#2e303e]/60 py-1 space-y-0.5 text-xs">
                    {/* Setting Website (Active item in user screenshot) */}
                    <button
                      onClick={() => setActiveMenu('website-setting')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'website-setting'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Setting Website</span>
                    </button>

                    {/* Kategori Kegiatan (Directly responsive to user request) */}
                    <button
                      onClick={() => {
                        setActiveMenu('kategori-kegiatan');
                        setCategoryTab('kegiatan');
                      }}
                      className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'kategori-kegiatan'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FolderTree className="w-4 h-4 text-emerald-400" />
                        <span>Kategori Kegiatan</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full">
                        {currentActivityCategories.length}
                      </span>
                    </button>

                    {/* Kategori Program */}
                    <button
                      onClick={() => {
                        setActiveMenu('kategori-program');
                        setCategoryTab('program');
                      }}
                      className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'kategori-program'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FolderTree className="w-4 h-4 text-amber-400" />
                        <span>Kategori Program</span>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded-full">
                        {categories.length}
                      </span>
                    </button>

                    {/* Program Unggulan */}
                    <button
                      onClick={() => setActiveMenu('program-unggulan')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'program-unggulan'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span>Program Unggulan</span>
                    </button>

                    {/* Publikasi Kegiatan */}
                    <button
                      onClick={() => setActiveMenu('publikasi')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'publikasi'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Publikasi Kegiatan</span>
                    </button>

                    {/* Foto Kegiatan (Instagram Feed) */}
                    <button
                      onClick={() => setActiveMenu('foto-instagram')}
                      className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'foto-instagram'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4 text-pink-400" />
                        <span>Foto Kegiatan (Instagram)</span>
                      </div>
                      <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.2 rounded-full">
                        {instagramPhotos.length}
                      </span>
                    </button>

                    {/* Naskah Jurnal */}
                    <button
                      onClick={() => setActiveMenu('jurnal')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'jurnal'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Naskah Jurnal</span>
                    </button>

                    {/* Cetak & Arsip Laporan */}
                    <button
                      onClick={() => setActiveMenu('arsip')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'arsip'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak &amp; Arsip Laporan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Menu Group 2: User / Admin */}
              <div className="pt-2 border-t border-[#2d2f3d] mt-2 space-y-1">
                <button
                  onClick={() => setActiveMenu('user-profile')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors text-left ${
                    activeMenu === 'user-profile' || activeMenu === 'user'
                      ? 'bg-[#23242e] text-white font-bold border-l-4 border-emerald-500'
                      : 'text-neutral-300 hover:text-white hover:bg-[#2e303e]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Edit Akun Saya</span>
                </button>

                <button
                  onClick={() => setActiveMenu('user-management')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors text-left ${
                    activeMenu === 'user-management'
                      ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                      : 'text-neutral-300 hover:text-white hover:bg-[#2e303e]'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  <span>Kelola &amp; Tambah User</span>
                </button>
              </div>
            </div>

            {/* Sidebar Bottom Footer Info */}
            <div className="p-4 border-t border-[#2d2f3d] bg-[#2e303e]/40 text-2xs text-neutral-400">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-neutral-300">Admin Mode Aktif</span>
              </div>
              <p className="font-mono text-3xs text-neutral-400 truncate">
                {currentUser?.email || 'admin'}
              </p>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* TOAST FEEDBACK */}
            {settingsSavedToast && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Pengaturan website berhasil disimpan!</span>
              </div>
            )}

            {/* VIEW 1: SETTING WEBSITE (Exact representation of user screenshot) */}
            {activeMenu === 'website-setting' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                {/* Header Title */}
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Website
                  </h1>
                </div>

                {/* Form fields in two-column format matching screenshot */}
                <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-6">
                  {/* Judul Web */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Judul Web
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={2}
                        value={siteSettings.webTitle}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, webTitle: e.target.value })
                        }
                        placeholder="Admin Template Jagowebdev"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Deskripsi Web */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Deskripsi Web
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={3}
                        value={siteSettings.webDescription}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, webDescription: e.target.value })
                        }
                        placeholder="Template administrasi lengkap dengan fitur penting dalam..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Fav Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Fav Icon
                    </label>
                    <div className="sm:col-span-3 space-y-2">
                      {/* Icon preview matching screenshot red shield */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm"
                          style={{ backgroundColor: siteSettings.favIconColor }}
                        >
                          {siteSettings.favIconText || 'W'}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={2}
                            value={siteSettings.favIconText}
                            onChange={(e) =>
                              setSiteSettings({ ...siteSettings, favIconText: e.target.value.toUpperCase() })
                            }
                            className="w-14 px-2 py-1 text-center font-bold text-xs bg-white border border-neutral-300 rounded-lg"
                            title="Huruf Ikon"
                          />
                          <input
                            type="color"
                            value={siteSettings.favIconColor}
                            onChange={(e) =>
                              setSiteSettings({ ...siteSettings, favIconColor: e.target.value })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 p-0.5"
                            title="Warna Ikon"
                          />
                        </div>
                      </div>

                      {/* Browse mock matching screenshot */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <button
                          type="button"
                          onClick={() => alert('Logo dan ikon resmi Warung Rimbun terpasang.')}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-800 font-medium"
                        >
                          Browse...
                        </button>
                        <span>logo.jpeg (Logo Resmi Warung Rimbun)</span>
                      </div>

                      <p className="text-2xs text-neutral-500 leading-normal">
                        Logo resmi tersimpan di /logo.jpeg dan aktif di seluruh antarmuka aplikasi.
                      </p>
                    </div>
                  </div>

                  {/* Logo Aplikasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Logo Aplikasi
                    </label>
                    <div className="sm:col-span-3 space-y-2">
                      {/* Logo preview with official logo image matching installed logo */}
                      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl inline-flex items-center gap-3">
                        <img
                          src="/logo.jpeg"
                          alt="Logo Warung Rimbun"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600/30 shadow-xs"
                        />
                        <span className="font-serif italic font-bold text-xl text-neutral-800 tracking-wide">
                          {siteSettings.logoText || 'Warung Rimbun'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={siteSettings.logoText}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, logoText: e.target.value })
                          }
                          placeholder="Warung Rimbun"
                          className="max-w-xs px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <button
                          type="button"
                          onClick={() => alert('Logo terpasang otomatis dari nama brand di atas.')}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-800 font-medium"
                        >
                          Browse...
                        </button>
                        <span>No file selected.</span>
                      </div>

                      <p className="text-2xs text-neutral-500 leading-normal">
                        Gunakan file PNG transparan, lebar maksimal 150px. Maksimal 300Kb, Minimal 50px x 50px, Tipe file: JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>

                  {/* Background Logo */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-1">
                      Background Logo
                    </label>
                    <div className="sm:col-span-3 text-xs text-neutral-600 pt-1">
                      <span>Ubah di menu setting tampilan</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Footer
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={3}
                        value={siteSettings.footerText}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, footerText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 font-mono text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 2: KELOLA KATEGORI (KEGIATAN & PROGRAM) */}
            {(activeMenu === 'kategori-kegiatan' || activeMenu === 'kategori-program') && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                {/* Header & Category Tabs Switcher */}
                <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                      <FolderTree className="w-5 h-5 text-indigo-600" />
                      <span>{categoryTab === 'kegiatan' ? 'Kelola Kategori Kegiatan' : 'Kelola Kategori Program'}</span>
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {categoryTab === 'kegiatan'
                        ? 'Tambah, sunting nama, atau hapus kategori untuk publikasi & naskah jurnal kegiatan.'
                        : 'Tambah, sunting nama, atau hapus kategori untuk target program kerja institusi 2025–2029.'}
                    </p>
                  </div>

                  {/* Tab Selector */}
                  <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryTab('kegiatan');
                        setActiveMenu('kategori-kegiatan');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        categoryTab === 'kegiatan'
                          ? 'bg-white text-emerald-800 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Kategori Kegiatan ({currentActivityCategories.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryTab('program');
                        setActiveMenu('kategori-program');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        categoryTab === 'program'
                          ? 'bg-white text-amber-800 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Kategori Program ({categories.length})
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* TAB CONTENT 1: KATEGORI KEGIATAN */}
                  {categoryTab === 'kegiatan' && (
                    <div className="space-y-6">
                      {/* Form Tambah Kategori Kegiatan */}
                      <form onSubmit={handleAddNewActivityCategory} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
                        <label className="block text-xs font-bold text-emerald-950">
                          Tambah Kategori Kegiatan Baru
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newActivityCatInput}
                            onChange={(e) => setNewActivityCatInput(e.target.value)}
                            placeholder="Contoh: Bimbingan Teknis &amp; Sertifikasi"
                            className="flex-1 px-3.5 py-2 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Kategori</span>
                          </button>
                        </div>
                      </form>

                      {/* Tabel Daftar Kategori Kegiatan */}
                      <div className="border border-neutral-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                            <tr>
                              <th className="py-3 px-4">No.</th>
                              <th className="py-3 px-4">Nama Kategori Kegiatan</th>
                              <th className="py-3 px-4">Jumlah Publikasi / Jurnal Terhubung</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {currentActivityCategories.map((cat, idx) => {
                              const count = publications.filter((p) => p.category === cat).length;
                              const isEditing = editingActivityCatOldName === cat;

                              return (
                                <tr key={cat} className="hover:bg-neutral-50/80">
                                  <td className="py-3 px-4 font-mono text-neutral-400">{idx + 1}</td>
                                  <td className="py-3 px-4 font-semibold text-neutral-900">
                                    {isEditing ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={editingActivityCatNewName}
                                          onChange={(e) => setEditingActivityCatNewName(e.target.value)}
                                          className="px-2 py-1 text-xs border border-emerald-500 rounded bg-white"
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => handleSaveEditedActivityCategory(cat)}
                                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                          title="Simpan"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setEditingActivityCatOldName(null)}
                                          className="p-1 text-neutral-500 hover:bg-neutral-100 rounded"
                                          title="Batal"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                        <span>{cat}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 font-mono text-neutral-600">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      {count} publikasi / jurnal
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingActivityCatOldName(cat);
                                          setEditingActivityCatNewName(cat);
                                        }}
                                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md cursor-pointer"
                                        title="Sunting Nama Kategori"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (currentActivityCategories.length <= 1) {
                                            alert('Minimal harus ada 1 kategori kegiatan.');
                                            return;
                                          }
                                          if (window.confirm(`Hapus kategori kegiatan "${cat}"? Publikasi yang menggunakan kategori ini akan dialihkan ke kategori lain.`)) {
                                            if (onDeleteActivityCategory) {
                                              onDeleteActivityCategory(cat);
                                            }
                                          }
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                        title="Hapus Kategori"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT 2: KATEGORI PROGRAM */}
                  {categoryTab === 'program' && (
                    <div className="space-y-6">
                      {/* Form Tambah Kategori */}
                      <form onSubmit={handleAddNewCategory} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
                        <label className="block text-xs font-bold text-amber-950">
                          Tambah Kategori Program Baru
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newCatInput}
                            onChange={(e) => setNewCatInput(e.target.value)}
                            placeholder="Contoh: Pemberdayaan UMKM &amp; Ekonomi Kreatif"
                            className="flex-1 px-3.5 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah</span>
                          </button>
                        </div>
                      </form>

                      {/* Tabel Daftar Kategori */}
                      <div className="border border-neutral-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                            <tr>
                              <th className="py-3 px-4">No.</th>
                              <th className="py-3 px-4">Nama Kategori</th>
                              <th className="py-3 px-4">Jumlah Program Terhubung</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {categories.map((cat, idx) => {
                              const count = programs.filter((p) => p.category === cat).length;
                              const isEditing = editingCatOldName === cat;

                              return (
                                <tr key={cat} className="hover:bg-neutral-50/80">
                                  <td className="py-3 px-4 font-mono text-neutral-400">{idx + 1}</td>
                                  <td className="py-3 px-4 font-semibold text-neutral-900">
                                    {isEditing ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={editingCatNewName}
                                          onChange={(e) => setEditingCatNewName(e.target.value)}
                                          className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => handleSaveEditedCategory(cat)}
                                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                          title="Simpan"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setEditingCatOldName(null)}
                                          className="p-1 text-neutral-500 hover:bg-neutral-100 rounded"
                                          title="Batal"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        <span>{cat}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 font-mono text-neutral-600">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-800 border border-amber-200">
                                      {count} program aktif
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingCatOldName(cat);
                                          setEditingCatNewName(cat);
                                        }}
                                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md cursor-pointer"
                                        title="Sunting Nama"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (categories.length <= 1) {
                                            alert('Minimal harus ada 1 kategori program.');
                                            return;
                                          }
                                          if (window.confirm(`Hapus kategori "${cat}"? Program yang ada akan dialihkan ke kategori lain.`)) {
                                            onDeleteCategory(cat);
                                          }
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                        title="Hapus Kategori"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: PROGRAM UNGGULAN */}
            {activeMenu === 'program-unggulan' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Kelola Program Unggulan
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Daftar peta jalan program strategis institusi 2025–2029
                    </p>
                  </div>
                  <button
                    onClick={onOpenProgramModal}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Program</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4">Kode</th>
                          <th className="py-3 px-4">Judul Program</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Unit / Sasaran 5 Thn</th>
                          <th className="py-3 px-4">Warna Aksen</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {programs.map((prog) => (
                          <tr key={prog.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-mono font-bold text-neutral-900">{prog.code}</td>
                            <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs truncate">{prog.title}</td>
                            <td className="py-3 px-4 text-neutral-600">{prog.category}</td>
                            <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                              {prog.totalFiveYearTarget.toLocaleString('id-ID')} {prog.unit}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              <span className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-0.5 rounded bg-neutral-100">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      prog.accentColor === 'emerald' ? '#059669' :
                                      prog.accentColor === 'amber' ? '#d97706' :
                                      prog.accentColor === 'rose' ? '#e11d48' :
                                      prog.accentColor === 'violet' ? '#7c3aed' : '#4f46e5'
                                  }}
                                />
                                {prog.accentColor}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => onEditProgram(prog)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Edit Program &amp; Grafik"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus program "${prog.title}"?`)) {
                                      onDeleteProgram(prog.id);
                                    }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                  title="Hapus Program"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: PUBLIKASI KEGIATAN */}
            {activeMenu === 'publikasi' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Manajemen Publikasi Kegiatan
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Total {publications.length} kegiatan tersimpan di sistem
                    </p>
                  </div>
                  <button
                    onClick={onOpenCreatePublication}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publikasikan Baru</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4">Judul Kegiatan</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Tanggal</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {publications.map((pub) => (
                          <tr key={pub.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-semibold text-neutral-900 max-w-sm truncate">
                              {pub.title}
                            </td>
                            <td className="py-3 px-4 text-neutral-600">{pub.category}</td>
                            <td className="py-3 px-4 font-mono text-neutral-500">{pub.date}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => onTogglePublicationStatus(pub.id)}
                                className={`px-2 py-0.5 rounded text-3xs font-bold uppercase ${
                                  pub.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                                title="Klik untuk ubah status"
                              >
                                {pub.status === 'published' ? 'Diterbitkan' : 'Draf'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => onOpenJournalReader(pub)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Lihat Jurnal"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onEditPublication(pub)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Sunting"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus publikasi "${pub.title}"?`)) {
                                      onDeletePublication(pub.id);
                                    }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: NASKAH JURNAL */}
            {activeMenu === 'jurnal' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h1 className="text-xl font-bold text-neutral-800">
                        Naskah Catatan Lapangan &amp; Jurnal
                      </h1>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Kelola laporan evaluasi, sunting naskah riset, tambah naskah baru, dan kelola arsip naskah kegiatan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPrintAll}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-200 transition-colors cursor-pointer"
                      title="Cetak Seluruh Rekap Jurnal"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Semua</span>
                    </button>
                    <button
                      onClick={onOpenCreatePublication}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      title="Tambah Naskah Jurnal Baru"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Naskah Baru</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {publications.filter((p) => p.journal).length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
                      <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-neutral-700">Belum ada naskah jurnal yang terdaftar</p>
                      <p className="text-xs text-neutral-500 mt-1 mb-4">Tambahkan catatan lapangan atau naskah kajian riset baru sekarang.</p>
                      <button
                        onClick={onOpenCreatePublication}
                        className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tulis Naskah Jurnal Baru</span>
                      </button>
                    </div>
                  ) : (
                    publications
                      .filter((p) => p.journal)
                      .map((pub) => (
                        <div
                          key={pub.id}
                          className="p-4 sm:p-5 bg-neutral-50/80 hover:bg-neutral-50 rounded-xl border border-neutral-200/90 hover:border-neutral-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-3xs font-semibold uppercase tracking-wide">
                                {pub.category}
                              </span>
                              <span className="text-2xs text-neutral-500 font-medium">
                                &bull; {pub.date}
                              </span>
                              {pub.author && (
                                <span className="text-2xs text-neutral-500">
                                  &bull; Penulis: <span className="font-medium text-neutral-700">{pub.author.name}</span>
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold ${
                                pub.status === 'published' 
                                  ? 'bg-teal-100 text-teal-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {pub.status === 'published' ? 'Terbit' : 'Draf'}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                              {pub.title}
                            </h3>

                            <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                              {pub.journal?.abstract || 'Belum ada ringkasan abstrak untuk naskah ini.'}
                            </p>

                            {pub.journal?.findingsAndResults && pub.journal.findingsAndResults.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                                <span className="text-3xs font-semibold text-neutral-400 uppercase tracking-wider">Hasil/Temuan:</span>
                                {pub.journal.findingsAndResults.slice(0, 2).map((item: string, idx: number) => (
                                  <span key={idx} className="text-3xs bg-white text-neutral-600 px-2 py-0.5 rounded border border-neutral-200 line-clamp-1 max-w-xs">
                                    {item}
                                  </span>
                                ))}
                                {pub.journal.findingsAndResults.length > 2 && (
                                  <span className="text-3xs text-neutral-400 font-medium">
                                    +{pub.journal.findingsAndResults.length - 2} temuan lainnya
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-200/80">
                            <button
                              onClick={() => onOpenJournalReader(pub)}
                              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Baca Naskah Lengkap"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Buka</span>
                            </button>

                            <button
                              onClick={() => onPrintPublication(pub)}
                              className="p-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                              title="Cetak Naskah Jurnal"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onEditPublication(pub)}
                              className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-emerald-600 hover:text-emerald-700 text-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              title="Sunting / Edit Naskah Jurnal"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus naskah jurnal "${pub.title}"? Tindakan ini akan menghapus arsip publikasi secara permanen.`)) {
                                  onDeletePublication(pub.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 hover:text-rose-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              title="Hapus Naskah Jurnal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* VIEW 5.5: PUBLIKASI FOTO KEGIATAN (INSTAGRAM FEED) */}
            {activeMenu === 'foto-instagram' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                        <Camera className="w-4 h-4" />
                      </div>
                      <h1 className="text-xl font-bold text-neutral-800">
                        Publikasi Foto Kegiatan (Feed Instagram)
                      </h1>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Unggah, sunting takarir, kelola tagar, fotografer, dan pantau apresiasi dari publik.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onViewPublicSite}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-200 transition-colors"
                      title="Lihat Tampilan Feed Publik"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat di Web Publik</span>
                    </button>
                    {onOpenCreateInstagramPhoto && (
                      <button
                        onClick={onOpenCreateInstagramPhoto}
                        className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Foto Baru</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* KPI metric summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Foto Publikasi</span>
                      <span className="text-xl font-bold text-neutral-900 mt-1 font-mono block">{instagramPhotos.length}</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Apresiasi (Likes)</span>
                      <span className="text-xl font-bold text-pink-600 mt-1 font-mono block">
                        {instagramPhotos.reduce((acc, p) => acc + (p.likesCount || 0), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Komentar</span>
                      <span className="text-xl font-bold text-indigo-600 mt-1 font-mono block">
                        {instagramPhotos.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Tampilan di Publik</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1.5">
                        Aktif Bergaya IG
                      </span>
                    </div>
                  </div>

                  {instagramPhotos.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl p-6">
                      <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900">Belum ada foto kegiatan yang dipublikasikan</h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                        Mulai bagikan dokumentasi visual kegiatan lapangan Anda dengan format feed bergaya Instagram.
                      </p>
                      {onOpenCreateInstagramPhoto && (
                        <button
                          onClick={onOpenCreateInstagramPhoto}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Upload Foto Pertama</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                          <tr>
                            <th className="py-3 px-4">Foto / Thumbnail</th>
                            <th className="py-3 px-4">Judul &amp; Takarir</th>
                            <th className="py-3 px-4">Kategori &amp; Lokasi</th>
                            <th className="py-3 px-4">Fotografer / Tanggal</th>
                            <th className="py-3 px-4">Interaksi</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {instagramPhotos.map((photo) => (
                            <tr key={photo.id} className="hover:bg-neutral-50">
                              {/* Thumbnail */}
                              <td className="py-3 px-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative">
                                  <img
                                    src={photo.photoUrl}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  {photo.carouselPhotos && photo.carouselPhotos.length > 1 && (
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                                      +{photo.carouselPhotos.length - 1}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Title & Caption */}
                              <td className="py-3 px-4 max-w-xs">
                                <p className="font-semibold text-neutral-900 truncate" title={photo.title}>
                                  {photo.title}
                                </p>
                                <p className="text-neutral-500 line-clamp-1 mt-0.5 text-2xs" title={photo.caption}>
                                  {photo.caption}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {photo.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="text-[10px] text-pink-600 font-medium">
                                      {tag}
                                    </span>
                                  ))}
                                  {photo.tags.length > 2 && (
                                    <span className="text-[10px] text-neutral-400">+{photo.tags.length - 2}</span>
                                  )}
                                </div>
                              </td>

                              {/* Category & Location */}
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-2xs font-semibold bg-neutral-100 text-neutral-800">
                                  {photo.category}
                                </span>
                                <div className="flex items-center gap-1 text-2xs text-neutral-500 mt-1 max-w-[140px] truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                                  <span className="truncate">{photo.location}</span>
                                </div>
                              </td>

                              {/* Photographer & Date */}
                              <td className="py-3 px-4">
                                <p className="font-medium text-neutral-800">{photo.photographer}</p>
                                <p className="text-2xs text-neutral-500 font-mono mt-0.5">{photo.date}</p>
                              </td>

                              {/* Interactions */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-pink-600">
                                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                                    <span>{photo.likesCount}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-neutral-600">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{photo.comments?.length || 0}</span>
                                  </span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1">
                                  {onEditInstagramPhoto && (
                                    <button
                                      onClick={() => onEditInstagramPhoto(photo)}
                                      className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                      title="Sunting Foto &amp; Takarir"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {onDeleteInstagramPhoto && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Hapus publikasi foto "${photo.title}"?`)) {
                                          onDeleteInstagramPhoto(photo.id);
                                        }
                                      }}
                                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                      title="Hapus Foto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 6: ARSIP & CETAK */}
            {activeMenu === 'arsip' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Pusat Arsip &amp; Manajemen Data
                  </h1>
                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  <div className="p-5 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-red-900">
                        Atur Ulang Data ke Bawaan Sistem
                      </h3>
                      <p className="text-xs text-red-700 mt-1">
                        Kembalikan seluruh data program, kegiatan, dan kategori ke data asli bawaan.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin mengatur ulang semua data ke bawaan?')) {
                          onResetData();
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shrink-0"
                    >
                      Atur Ulang Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 7: USER MANAGEMENT & PROFILE EDITING */}
            {(activeMenu === 'user' || activeMenu === 'user-profile' || activeMenu === 'user-management') && (
              <UserManagementView
                currentUser={currentUser}
                onUpdateCurrentUser={onUpdateCurrentUser || (() => {})}
                initialTab={activeMenu === 'user-management' ? 'users' : 'profile'}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
