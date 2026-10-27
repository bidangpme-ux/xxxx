export interface AppUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    password: 'admin',
    name: 'Administrator',
    email: 'admin@tanggamus.go.id',
    role: 'Super Admin & Pengelola Portal',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-bapperida',
    username: 'bapperida',
    password: 'bapperida123',
    name: 'Tim BAPPERIDA Tanggamus',
    email: 'bapperida@tanggamus.go.id',
    role: 'Admin Perencanaan & Inovasi',
    createdAt: '2026-02-15',
  },
];
