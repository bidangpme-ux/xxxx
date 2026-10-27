import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  initPostgres, 
  getDbStatus,
  getAllPublications, 
  upsertPublication, 
  deletePublicationById,
  getAllPrograms, 
  upsertProgram, 
  deleteProgramById,
  getAllCategories, 
  saveCategoriesList,
  getAllActivityCategories,
  saveActivityCategoriesList,
  getAllInstagramPhotos, 
  upsertInstagramPhoto, 
  deleteInstagramPhotoById,
  resetSystemData,
  getAllUsers,
  getUserById,
  getUserByUsername,
  upsertUser,
  deleteUserById,
  verifyUserCredentials,
  getCompleteBackupData,
  restoreCompleteBackupData
} from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Support dynamic PORT from environment (default: 3000)
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable trust proxy for reverse proxies, CasaOS, Cloudflare Tunnel, and custom domains
  app.set('trust proxy', 1);

  // CORS handling for smooth multi-domain, tunnel, and local network IP access
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Large payload allowance for base64 / documentation images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize PostgreSQL Connection in background without blocking server boot
  initPostgres().catch(() => {});

  // ---------------------------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------------------------

  // Health and Database Engine Status
  app.get('/api/status', async (_req: Request, res: Response) => {
    try {
      const status = await getDbStatus();
      res.json({ ok: true, status });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Publications API
  app.get('/api/publications', async (_req: Request, res: Response) => {
    try {
      const publications = await getAllPublications();
      res.json(publications);
    } catch (e: any) {
      console.error('API Error /api/publications:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/publications', async (req: Request, res: Response) => {
    try {
      const pub = req.body;
      if (!pub || !pub.id || !pub.title) {
        return res.status(400).json({ error: 'Valid publication payload is required' });
      }
      const saved = await upsertPublication(pub);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/publications:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/publications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deletePublicationById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/publications/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Programs API
  app.get('/api/programs', async (_req: Request, res: Response) => {
    try {
      const programs = await getAllPrograms();
      res.json(programs);
    } catch (e: any) {
      console.error('API Error /api/programs:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/programs', async (req: Request, res: Response) => {
    try {
      const program = req.body;
      if (!program || !program.id || !program.title) {
        return res.status(400).json({ error: 'Valid program payload is required' });
      }
      const saved = await upsertProgram(program);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/programs:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/programs/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deleteProgramById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/programs/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Categories API
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const categories = await getAllCategories();
      res.json(categories);
    } catch (e: any) {
      console.error('API Error /api/categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    try {
      const { categories } = req.body;
      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: 'categories must be an array' });
      }
      const saved = await saveCategoriesList(categories);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Activity Categories API (Kategori Kegiatan)
  app.get('/api/activity-categories', async (_req: Request, res: Response) => {
    try {
      const categories = await getAllActivityCategories();
      res.json(categories);
    } catch (e: any) {
      console.error('API Error /api/activity-categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/activity-categories', async (req: Request, res: Response) => {
    try {
      const { categories } = req.body;
      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: 'categories must be an array' });
      }
      const saved = await saveActivityCategoriesList(categories);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/activity-categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Instagram Photo Feed API
  app.get('/api/instagram-photos', async (_req: Request, res: Response) => {
    try {
      const photos = await getAllInstagramPhotos();
      res.json(photos);
    } catch (e: any) {
      console.error('API Error /api/instagram-photos:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/instagram-photos', async (req: Request, res: Response) => {
    try {
      const photo = req.body;
      if (!photo || !photo.id || !photo.title) {
        return res.status(400).json({ error: 'Valid photo payload is required' });
      }
      const saved = await upsertInstagramPhoto(photo);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/instagram-photos:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/instagram-photos/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deleteInstagramPhotoById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/instagram-photos/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Explicit Reset Endpoint
  app.post('/api/reset-data', async (_req: Request, res: Response) => {
    try {
      await resetSystemData();
      res.json({ success: true, message: 'System data reset to initial seed' });
    } catch (e: any) {
      console.error('API Error /api/reset-data:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Complete System Backup (Downloads complete JSON with all data + photos)
  app.get('/api/backup', async (_req: Request, res: Response) => {
    try {
      const backup = await getCompleteBackupData();
      const filename = `backup_warung_rimbun_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(backup, null, 2));
    } catch (e: any) {
      console.error('API Error GET /api/backup:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // System Restore Endpoint
  app.post('/api/restore', async (req: Request, res: Response) => {
    try {
      const backupPayload = req.body;
      await restoreCompleteBackupData(backupPayload);
      res.json({ success: true, message: 'Data dan foto berhasil dipulihkan secara penuh!' });
    } catch (e: any) {
      console.error('API Error POST /api/restore:', e);
      res.status(400).json({ error: e.message });
    }
  });

  // ---------------------------------------------------------------------------
  // User Management & Login API
  // ---------------------------------------------------------------------------
  // Verify Login
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username dan password wajib diisi.' });
      }
      const user = await verifyUserCredentials(username, password);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Username atau password tidak sesuai.' });
      }
      res.json({ success: true, user });
    } catch (e: any) {
      console.error('API Error POST /api/login:', e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Get all users
  app.get('/api/users', async (_req: Request, res: Response) => {
    try {
      const users = await getAllUsers();
      const safe = users.map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }));
      res.json(safe);
    } catch (e: any) {
      console.error('API Error GET /api/users:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Create new user (Tambah User)
  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data.username || !data.name || !data.password) {
        return res.status(400).json({ error: 'Username, nama lengkap, dan password wajib diisi.' });
      }
      const existing = await getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ error: `Username "${data.username}" sudah digunakan.` });
      }
      const saved = await upsertUser(data);
      res.json({
        id: saved.id,
        username: saved.username,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        avatar: saved.avatar,
        createdAt: saved.createdAt,
      });
    } catch (e: any) {
      console.error('API Error POST /api/users:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Update user data (Edit Data User di Akun Masing-Masing)
  app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const existing = await getUserById(id);
      if (!existing) {
        return res.status(404).json({ error: 'User tidak ditemukan.' });
      }
      if (data.username && data.username.toLowerCase() !== existing.username.toLowerCase()) {
        const usernameTaken = await getUserByUsername(data.username);
        if (usernameTaken && usernameTaken.id !== id) {
          return res.status(400).json({ error: `Username "${data.username}" sudah digunakan oleh akun lain.` });
        }
      }
      const updated = await upsertUser({
        ...existing,
        ...data,
        id,
        password: data.password && data.password.trim().length > 0 ? data.password.trim() : existing.password,
      });
      res.json({
        id: updated.id,
        username: updated.username,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatar: updated.avatar,
        updatedAt: updated.updatedAt,
      });
    } catch (e: any) {
      console.error('API Error PUT /api/users/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Delete user
  app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deleteUserById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/users/:id:', e);
      res.status(400).json({ error: e.message });
    }
  });

  // ---------------------------------------------------------------------------
  // Static Assets & Image Serving (Guarantees no broken spotlight images)
  // ---------------------------------------------------------------------------
  const imagesPath = path.resolve(__dirname, 'public/assets/images');
  if (fs.existsSync(imagesPath)) {
    app.use('/assets/images', express.static(imagesPath));
    app.use('/src/assets/images', express.static(imagesPath));
    app.use('/public/assets/images', express.static(imagesPath));
  }

  // ---------------------------------------------------------------------------
  // Vite Middleware / Static Serving
  // ---------------------------------------------------------------------------
  const distPath = path.resolve(__dirname, 'dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development (with HMR disabled to prevent WebSocket errors)
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Warung Rimbun server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
