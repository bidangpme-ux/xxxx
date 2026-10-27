import { Publication } from '../types/publication';
import { FlagshipProgram } from '../types/program';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';
import { AppUser } from '../types/user';

export async function fetchPublicationsApi(): Promise<Publication[] | null> {
  try {
    const res = await fetch('/api/publications');
    if (!res.ok) throw new Error('Failed to fetch publications');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchPublicationsApi:', err);
    return null;
  }
}

export async function savePublicationApi(pub: Publication): Promise<Publication | null> {
  try {
    const res = await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pub),
    });
    if (!res.ok) throw new Error('Failed to save publication');
    return await res.json();
  } catch (err) {
    console.warn('API error savePublicationApi:', err);
    return null;
  }
}

export async function deletePublicationApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('API error deletePublicationApi:', err);
    return false;
  }
}

export async function fetchProgramsApi(): Promise<FlagshipProgram[] | null> {
  try {
    const res = await fetch('/api/programs');
    if (!res.ok) throw new Error('Failed to fetch programs');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchProgramsApi:', err);
    return null;
  }
}

export async function saveProgramApi(program: FlagshipProgram): Promise<FlagshipProgram | null> {
  try {
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });
    if (!res.ok) throw new Error('Failed to save program');
    return await res.json();
  } catch (err) {
    console.warn('API error saveProgramApi:', err);
    return null;
  }
}

export async function deleteProgramApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('API error deleteProgramApi:', err);
    return false;
  }
}

export async function fetchCategoriesApi(): Promise<string[] | null> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchCategoriesApi:', err);
    return null;
  }
}

export async function saveCategoriesApi(categories: string[]): Promise<string[] | null> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    if (!res.ok) throw new Error('Failed to save categories');
    return await res.json();
  } catch (err) {
    console.warn('API error saveCategoriesApi:', err);
    return null;
  }
}

export async function fetchActivityCategoriesApi(): Promise<string[] | null> {
  try {
    const res = await fetch('/api/activity-categories');
    if (!res.ok) throw new Error('Failed to fetch activity categories');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchActivityCategoriesApi:', err);
    return null;
  }
}

export async function saveActivityCategoriesApi(categories: string[]): Promise<string[] | null> {
  try {
    const res = await fetch('/api/activity-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    if (!res.ok) throw new Error('Failed to save activity categories');
    return await res.json();
  } catch (err) {
    console.warn('API error saveActivityCategoriesApi:', err);
    return null;
  }
}

export async function fetchInstagramPhotosApi(): Promise<InstagramPhotoItem[] | null> {
  try {
    const res = await fetch('/api/instagram-photos');
    if (!res.ok) throw new Error('Failed to fetch instagram photos');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchInstagramPhotosApi:', err);
    return null;
  }
}

export async function saveInstagramPhotoApi(photo: InstagramPhotoItem): Promise<InstagramPhotoItem | null> {
  try {
    const res = await fetch('/api/instagram-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });
    if (!res.ok) throw new Error('Failed to save instagram photo');
    return await res.json();
  } catch (err) {
    console.warn('API error saveInstagramPhotoApi:', err);
    return null;
  }
}

export async function deleteInstagramPhotoApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/instagram-photos/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('API error deleteInstagramPhotoApi:', err);
    return false;
  }
}

export async function resetSystemDataApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/reset-data', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.warn('API error resetSystemDataApi:', err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// User Management & Authentication API
// -----------------------------------------------------------------------------

export async function loginApi(credentials: {
  username: string;
  password: string;
}): Promise<{ success: boolean; user?: AppUser; error?: string }> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Login gagal.' };
    }
    return data;
  } catch (err: any) {
    console.warn('API error loginApi:', err);
    return { success: false, error: err.message || 'Koneksi ke server terganggu.' };
  }
}

export async function fetchUsersApi(): Promise<AppUser[] | null> {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  } catch (err) {
    console.warn('API error fetchUsersApi:', err);
    return null;
  }
}

export async function createUserApi(user: Partial<AppUser>): Promise<AppUser | null> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to create user');
    }
    return await res.json();
  } catch (err) {
    console.warn('API error createUserApi:', err);
    throw err;
  }
}

export async function updateUserApi(id: string, user: Partial<AppUser>): Promise<AppUser | null> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update user');
    }
    return await res.json();
  } catch (err) {
    console.warn('API error updateUserApi:', err);
    throw err;
  }
}

export async function deleteUserApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete user');
    }
    return true;
  } catch (err) {
    console.warn('API error deleteUserApi:', err);
    throw err;
  }
}

export async function downloadBackupApi(): Promise<void> {
  const res = await fetch('/api/backup');
  if (!res.ok) throw new Error('Gagal mengunduh backup');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_warung_rimbun_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function restoreBackupApi(backupJson: any): Promise<boolean> {
  const res = await fetch('/api/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backupJson),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal memulihkan backup');
  }
  return true;
}
