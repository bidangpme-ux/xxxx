import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAntiInspect } from './lib/antiInspect.ts';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Inisialisasi proteksi anti-inspect (klik kanan tetap aktif & aman zoom)
initAntiInspect();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

