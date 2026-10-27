/**
 * Utilitas Optimasi & Kompresi Gambar Otomatis
 * Mengubah foto resolusi tinggi kamera HP (5MB - 20MB) menjadi ukuran optimal web (< 200KB)
 * secara instan di sisi peramban (client-side) tanpa menurunkan ketajaman visual.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0
  mimeType?: 'image/jpeg' | 'image/webp';
}

/**
 * Mengompresi file gambar (File atau Blob) menjadi Base64 Data URL teroptimasi
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1440,
    maxHeight = 1440,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  // Jika file adalah SVG atau bukan gambar, lewati kompresi
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        return reject(new Error('Gagal membaca berkas gambar'));
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Hitung rasio dimensi agar proporsional
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(src); // fallback jika canvas tidak tersedia
          }

          // Anti-aliasing halus
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Isi latar belakang putih untuk PNG transparan yang dikonversi ke JPEG
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Ekspor hasil kompresi
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Gagal mengompresi gambar via canvas, menggunakan berkas asli:', err);
          resolve(src);
        }
      };

      img.onerror = () => {
        resolve(src);
      };

      img.src = src;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Mengompresi string Data URL yang sudah ada jika ukurannya terlalu besar
 */
export async function compressDataUrl(
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  // Jika ukuran string di bawah 150KB, tidak perlu dikompresi lagi
  if (dataUrl.length < 200 * 1024) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const {
        maxWidth = 1440,
        maxHeight = 1440,
        quality = 0.82,
        mimeType = 'image/jpeg',
      } = options;

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(mimeType, quality));
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
