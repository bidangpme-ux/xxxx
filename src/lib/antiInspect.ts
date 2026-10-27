/**
 * Anti-Inspect Protection System:
 * 1. Klik kanan tetap 100% aktif (dilayani oleh Custom Context Menu tanpa opsi Inspect).
 * 2. Memblokir shortcut inspect & devtools: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S.
 * 3. AMAN UNTUK ZOOM: Tidak menggunakan perbandingan dimensi window (outerWidth - innerWidth)
 *    yang menyebabkan layar blank putih saat laptop di-zoom out/zoom in atau menggunakan display scale 125%/150%.
 * 4. Tanpa merusak struktur DOM React.
 */

let isProtectionActive = true;

export function initAntiInspect() {
  if (typeof window === 'undefined') return;

  // 1. Blokir shortcut inspect & view-source keyboard
  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      // Toggle rahasia untuk Pengelola/Developer: Ctrl + Alt + D
      if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
        isProtectionActive = !isProtectionActive;
        console.info(`[Security] Mode Proteksi: ${isProtectionActive ? 'AKTIF' : 'NONAKTIF'}`);
        return;
      }

      if (!isProtectionActive) return;

      // F12 (DevTools)
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C / Cmd+Option+I/J/C
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && ['s', 'S'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true
  );

  // 2. Proteksi dragging aset sensitif
  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 3. Bersihkan log konsol sensitif secara berkala tanpa merusak DOM React
  try {
    const noop = () => {};
    // Lindungi konsol dari inspeksi variabel internal di production
    if (process.env.NODE_ENV === 'production') {
      console.debug = noop;
    }
  } catch {
    // ignore
  }
}
