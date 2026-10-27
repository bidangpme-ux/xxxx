import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  X, 
  Save, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AppUser, DEFAULT_USERS } from '../types/user';
import { fetchUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../lib/api';

interface UserManagementViewProps {
  currentUser: {
    id?: string;
    username?: string;
    name: string;
    role: string;
    email: string;
    avatar?: string;
  } | null;
  onUpdateCurrentUser: (updatedUser: {
    id?: string;
    username?: string;
    name: string;
    role: string;
    email: string;
    avatar?: string;
  }) => void;
  initialTab?: 'profile' | 'users';
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onUpdateCurrentUser,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>(initialTab);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Self Profile Form State
  const [selfName, setSelfName] = useState(currentUser?.name || '');
  const [selfUsername, setSelfUsername] = useState(currentUser?.username || 'admin');
  const [selfEmail, setSelfEmail] = useState(currentUser?.email || '');
  const [selfRole, setSelfRole] = useState(currentUser?.role || 'Super Admin & Pengelola Portal');
  const [selfPassword, setSelfPassword] = useState('');
  const [selfConfirmPassword, setSelfConfirmPassword] = useState('');
  const [showSelfPass, setShowSelfPass] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Editor Publikasi & Jurnal');
  const [showNewPass, setShowNewPass] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Edit User (admin modifying another user) Modal State
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPass, setShowEditPass] = useState(false);
  const [editUserError, setEditUserError] = useState<string | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Delete confirmation
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load users list
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsersApi();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch {
      setUsers(DEFAULT_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Sync profile form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setSelfName(currentUser.name || '');
      setSelfUsername(currentUser.username || 'admin');
      setSelfEmail(currentUser.email || '');
      setSelfRole(currentUser.role || 'Super Admin & Pengelola Portal');
    }
  }, [currentUser]);

  // Handle Save Own Profile
  const handleSaveSelfProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!selfName.trim() || !selfUsername.trim()) {
      setProfileMsg({ type: 'error', text: 'Nama Lengkap dan Username wajib diisi.' });
      return;
    }

    if (selfPassword && selfPassword !== selfConfirmPassword) {
      setProfileMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    if (selfPassword && selfPassword.length < 4) {
      setProfileMsg({ type: 'error', text: 'Password minimal 4 karakter.' });
      return;
    }

    setIsSavingProfile(true);

    const targetUserId = currentUser?.id || 'usr-admin';
    const payload: Partial<AppUser> = {
      name: selfName.trim(),
      username: selfUsername.trim().toLowerCase(),
      email: selfEmail.trim(),
      role: selfRole.trim(),
    };

    if (selfPassword.trim()) {
      payload.password = selfPassword.trim();
    }

    try {
      const updated = await updateUserApi(targetUserId, payload);
      const safeUser = {
        id: updated?.id || targetUserId,
        username: updated?.username || selfUsername.trim().toLowerCase(),
        name: updated?.name || selfName.trim(),
        email: updated?.email || selfEmail.trim(),
        role: updated?.role || selfRole.trim(),
        avatar: updated?.avatar,
      };

      onUpdateCurrentUser(safeUser);
      setProfileMsg({ type: 'success', text: 'Data profil akun Anda berhasil disimpan dan diperbarui!' });
      setSelfPassword('');
      setSelfConfirmPassword('');
      loadUsers();
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Gagal menyimpan perubahan profil.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Add New User
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);

    const cleanUser = newUsername.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanUser || !newName.trim() || !newPassword.trim()) {
      setAddUserError('Username, Nama Lengkap, dan Password wajib diisi.');
      return;
    }

    if (newPassword.length < 4) {
      setAddUserError('Password minimal 4 karakter.');
      return;
    }

    setIsAddingUser(true);
    try {
      await createUserApi({
        username: cleanUser,
        name: newName.trim(),
        email: newEmail.trim() || `${cleanUser}@tanggamus.go.id`,
        password: newPassword.trim(),
        role: newRole,
      });

      setIsAddUserModalOpen(false);
      setNewUsername('');
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      loadUsers();
    } catch (err: any) {
      setAddUserError(err.message || 'Gagal menambahkan user baru.');
    } finally {
      setIsAddingUser(false);
    }
  };

  // Open Edit User Modal
  const handleOpenEditUser = (u: AppUser) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditUsername(u.username);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditPassword('');
    setEditUserError(null);
  };

  // Save Edit User
  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditUserError(null);

    if (!editName.trim() || !editUsername.trim()) {
      setEditUserError('Nama Lengkap dan Username wajib diisi.');
      return;
    }

    setIsUpdatingUser(true);
    try {
      const payload: Partial<AppUser> = {
        name: editName.trim(),
        username: editUsername.trim().toLowerCase(),
        email: editEmail.trim(),
        role: editRole.trim(),
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      await updateUserApi(editingUser.id, payload);

      // If editing current logged in user, sync current session
      if (currentUser?.id === editingUser.id || currentUser?.username === editingUser.username) {
        onUpdateCurrentUser({
          ...currentUser,
          name: editName.trim(),
          username: editUsername.trim().toLowerCase(),
          email: editEmail.trim(),
          role: editRole.trim(),
        });
      }

      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      setEditUserError(err.message || 'Gagal memperbarui user.');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Confirm Delete User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleteError(null);

    try {
      await deleteUserApi(deletingUser.id);
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus user.');
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800">
              Manajemen Pengguna &amp; Akun
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Kelola Akses Pengguna &amp; Profil Akun
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Ubah data profil pada masing-masing akun, atur kata sandi, dan tambahkan pengguna baru ke sistem.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Profil Akun Saya</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-700" />
            <span>Kelola Semua User ({users.length})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: EDIT DATA USER DI AKUN SENDIRI (PROFIL SAYA)                   */}
      {/* ===================================================================== */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Account Identity Summary */}
          <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/90 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-amber-400 to-teal-500 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.jpeg"
                    alt="Avatar Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>

            <h3 className="text-base font-bold text-neutral-900">
              {currentUser?.name || 'Administrator'}
            </h3>
            <p className="text-xs font-mono text-emerald-700 font-semibold mt-0.5">
              @{currentUser?.username || 'admin'}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-2xs font-bold">
              {currentUser?.role || 'Super Admin'}
            </span>

            <div className="w-full mt-6 pt-5 border-t border-neutral-100 text-left space-y-3 text-xs">
              <div>
                <span className="text-3xs uppercase tracking-wider text-neutral-400 block font-semibold">
                  Email Akun:
                </span>
                <span className="text-neutral-800 font-medium">
                  {currentUser?.email || 'admin@tanggamus.go.id'}
                </span>
              </div>
              <div>
                <span className="text-3xs uppercase tracking-wider text-neutral-400 block font-semibold">
                  Status Hak Akses:
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pengelola Resmi Terverifikasi
                </span>
              </div>
              <div>
                <span className="text-3xs uppercase tracking-wider text-neutral-400 block font-semibold">
                  Instansi / Unit Kerja:
                </span>
                <span className="text-neutral-700 font-medium">
                  BAPPERIDA Kabupaten Tanggamus
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-neutral-200/90 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Formulir Edit Data Akun Saya
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Perubahan nama, username, email, dan kata sandi akan segera berlaku setelah disimpan.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-700 font-mono">
                ID: {currentUser?.id || 'usr-admin'}
              </span>
            </div>

            {profileMsg && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveSelfProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={selfName}
                      onChange={(e) => setSelfName(e.target.value)}
                      placeholder="Nama Lengkap Pengguna"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Username (ID Login)
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={selfUsername}
                      onChange={(e) => setSelfUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="username"
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={selfEmail}
                      onChange={(e) => setSelfEmail(e.target.value)}
                      placeholder="email@tanggamus.go.id"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Jabatan / Peran
                  </label>
                  <select
                    value={selfRole}
                    onChange={(e) => setSelfRole(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                  >
                    <option value="Super Admin & Pengelola Portal">Super Admin &amp; Pengelola Portal</option>
                    <option value="Admin Perencanaan & Inovasi">Admin Perencanaan &amp; Inovasi</option>
                    <option value="Editor Publikasi & Jurnal">Editor Publikasi &amp; Jurnal</option>
                    <option value="Verifikator & Dokumentator Lapangan">Verifikator &amp; Dokumentator Lapangan</option>
                  </select>
                </div>
              </div>

              {/* Password Change Box */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">
                    Ganti Kata Sandi (Kosongkan bila tidak ingin mengubah)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-semibold text-neutral-600 mb-1">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showSelfPass ? 'text' : 'password'}
                        value={selfPassword}
                        onChange={(e) => setSelfPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-8 pr-8 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSelfPass(!showSelfPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                      >
                        {showSelfPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-neutral-600 mb-1">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showSelfPass ? 'text' : 'password'}
                        value={selfConfirmPassword}
                        onChange={(e) => setSelfConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-70 active:scale-95"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Akun</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: KELOLA PENGGUNA & TAMBAH USER                                  */}
      {/* ===================================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/90 overflow-hidden">
          {/* Action Toolbar */}
          <div className="p-4 sm:p-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari user berdasarkan nama, username, atau peran..."
                className="w-full text-xs pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoading}
                title="Muat Ulang Data User"
                className="p-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* TOMBOL TAMBAH USER BARU */}
              <button
                type="button"
                onClick={() => {
                  setNewUsername('');
                  setNewName('');
                  setNewEmail('');
                  setNewPassword('');
                  setAddUserError(null);
                  setIsAddUserModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah User Baru</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider text-3xs border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 font-bold">Nama &amp; Avatar</th>
                  <th className="px-6 py-3 font-bold">Username (Login ID)</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Peran / Jabatan</th>
                  <th className="px-6 py-3 font-bold text-center">Status Sesi</th>
                  <th className="px-6 py-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                      Tidak ada pengguna yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf =
                      currentUser?.id === u.id || currentUser?.username === u.username;
                    return (
                      <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#563d7c] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                              {u.name ? u.name.charAt(0) : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-3xs font-semibold">
                                    Akun Anda
                                  </span>
                                )}
                              </div>
                              <span className="text-3xs text-neutral-400">
                                Ditambahkan: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : 'Sistem Default'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-emerald-800 font-semibold">
                          @{u.username}
                        </td>
                        <td className="px-6 py-3.5 text-neutral-600">
                          {u.email}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold ${
                              u.role.includes('Super')
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : u.role.includes('Perencanaan')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-2xs font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Sedang Aktif
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-2xs">Siap Login</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Tombol Edit User */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(u)}
                              title={`Edit Data User ${u.name}`}
                              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-2xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3 text-emerald-700" />
                              <span>Edit</span>
                            </button>

                            {/* Tombol Hapus User */}
                            <button
                              type="button"
                              onClick={() => {
                                setDeletingUser(u);
                                setDeleteError(null);
                              }}
                              disabled={users.length <= 1 || isSelf}
                              title={
                                isSelf
                                  ? 'Tidak dapat menghapus akun yang sedang Anda gunakan'
                                  : users.length <= 1
                                  ? 'Tidak dapat menghapus user terakhir'
                                  : `Hapus User ${u.name}`
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: TAMBAH USER BARU                                               */}
      {/* ===================================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-white/10 text-emerald-300">
                  <UserPlus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Tambah Pengguna Baru</h3>
                  <p className="text-3xs text-emerald-200/80">
                    Akun baru dapat langsung digunakan untuk login ke Warung Rimbun
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4">
              {addUserError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{addUserError}</span>
                </div>
              )}

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Ir. Herman Syahputra, M.T."
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Username (ID Login) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="misal: herman_bapperida"
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-mono"
                  />
                  <span className="text-3xs text-neutral-400 mt-0.5 block">
                    Gunakan huruf kecil tanpa spasi
                  </span>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="herman@tanggamus.go.id"
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    className="w-full text-xs pl-3.5 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Peran / Jabatan Pengguna
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                >
                  <option value="Editor Publikasi & Jurnal">Editor Publikasi &amp; Jurnal</option>
                  <option value="Admin Perencanaan & Inovasi">Admin Perencanaan &amp; Inovasi</option>
                  <option value="Super Admin & Pengelola Portal">Super Admin &amp; Pengelola Portal</option>
                  <option value="Verifikator & Dokumentator Lapangan">Verifikator &amp; Dokumentator Lapangan</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingUser}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-70"
                >
                  {isAddingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan User...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Simpan User Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: EDIT DATA USER                                                 */}
      {/* ===================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-white/10 text-emerald-300">
                  <Edit3 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Data Pengguna</h3>
                  <p className="text-3xs text-emerald-200/80">
                    Memperbarui data akun @{editingUser.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4">
              {editUserError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{editUserError}</span>
                </div>
              )}

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Username (Login ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Ganti Password (Kosongkan bila tidak ingin diubah)
                </label>
                <div className="relative">
                  <input
                    type={showEditPass ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Ketik password baru..."
                    className="w-full text-xs pl-3.5 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                  >
                    {showEditPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Peran / Jabatan Pengguna
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-neutral-900 font-medium"
                >
                  <option value="Super Admin & Pengelola Portal">Super Admin &amp; Pengelola Portal</option>
                  <option value="Admin Perencanaan & Inovasi">Admin Perencanaan &amp; Inovasi</option>
                  <option value="Editor Publikasi & Jurnal">Editor Publikasi &amp; Jurnal</option>
                  <option value="Verifikator & Dokumentator Lapangan">Verifikator &amp; Dokumentator Lapangan</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingUser}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-70"
                >
                  {isUpdatingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: KONFIRMASI HAPUS USER                                          */}
      {/* ===================================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Hapus Pengguna Ini?
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Apakah Anda yakin ingin menghapus akun <span className="font-bold text-neutral-800">{deletingUser.name}</span> (@{deletingUser.username})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-2xs border border-red-200">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
              >
                Ya, Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
