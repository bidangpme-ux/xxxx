# Panduan Deployment Otomatis ke CasaOS & Domain Permanen (Tahan Mati Listrik & Router Restart)

Panduan ini dibuat agar aplikasi **Warung Rimbun** dapat berjalan di CasaOS secara **100% otomatis**:
1. **Tanpa perlu konfigurasi PostgreSQL** (database sudah otomatis persisten).
2. **Tanpa perlu ubah URL/IP saat listrik mati atau router restart** (domain tersambung permanen).

---

## 1. Panduan Deployment CasaOS: Pilih Metode yang Anda Sukai

Tersedia 3 metode yang dapat Anda gunakan di CasaOS.

---

### CARA 2: Lewat Menu "Files" di Browser CasaOS (Solusi Error Anda)

#### 🔴 Kenapa Terjadi Error Saat Menggunakan Menu "Files"?
Jika Anda masuk ke menu **Files** di browser CasaOS, membuat folder (misalnya `/DATA/AppData/warung-rimbun`), dan **hanya meng-upload file `docker-compose.yml` saja**, maka instalasi akan gagal dengan pesan error:
- `failed to read dockerfile: open Dockerfile: no such file or directory` ATAU
- `pull access denied for warung-rimbun, repository does not exist or may require 'docker login'`

**Penyebabnya:**
File `docker-compose.yml` memerlukan **`Dockerfile`**, file **`package.json`**, **`server.ts`**, dan folder **`src/`** untuk merakit (*build*) aplikasi web Warung Rimbun. Jika hanya ada file `docker-compose.yml` sendirian di folder tersebut, Docker tidak memiliki bahan untuk merakit aplikasinya.

#### 🟢 Cara Benar Menggunakan Menu "Files" di CasaOS:
1. **Download ZIP Proyek Lengkap**:
   - Download file ZIP dari GitHub resmi:
     [https://github.com/yodestawibowo/rmb7/archive/refs/heads/main.zip](https://github.com/yodestawibowo/rmb7/archive/refs/heads/main.zip)
2. **Buka Menu "Files" di CasaOS**:
   - Masuk ke folder `/DATA/AppData/`.
   - Buat folder baru dengan nama: `warung-rimbun`.
   - Masuk ke dalam folder `warung-rimbun` tersebut.
3. **Upload & Ekstrak**:
   - Upload file `main.zip` yang baru saja Anda download ke folder tersebut.
   - Klik kanan file `main.zip` di menu Files CasaOS, pilih **Extract** (Ekstrak di sini).
   - Pastikan file-file berikut berada di dalam folder tersebut:
     - `Dockerfile`
     - `docker-compose.yml`
     - `package.json`
     - `server.ts`
     - folder `src/`, `public/`, `data/`
4. **Jalankan Aplikasi**:
   - Klik file `docker-compose.yml` di menu Files CasaOS > pilih **Install** / **Construct App**.
   - Docker akan membaca `Dockerfile` dan merakit aplikasi secara mulus 100%!
   - Aplikasi langsung aktif di port **3080** (`http://ip-casaos-anda:3080`).

---

### CARA ALTERNATIF PALING CEPAT (1 Baris Perintah di Terminal CasaOS - 1 Menit Selesai):
Jika tidak ingin repot upload dan ekstrak file satu per satu di browser:
1. Di dashboard CasaOS, klik ikon **Terminal** di pojok kiri atas (masukkan username & password CasaOS Anda).
2. Salin dan tempel perintah berikut lalu tekan Enter:
   ```bash
   mkdir -p /DATA/AppData/warung-rimbun && cd /DATA/AppData/warung-rimbun && git clone https://github.com/yodestawibowo/rmb7.git . && docker compose up -d --build
   ```
3. Docker akan otomatis mengunduh semua file, merakit aplikasi, dan langsung menyalakannya di port `3080`.

---

### CARA 1: Lewat Menu "+" (Install a Customized App) di Dashboard CasaOS
1. Buka dashboard **CasaOS** di browser.
2. Di pojok kanan atas, klik ikon **`+`** lalu pilih **"Install a customized app"**.
3. Di pojok kanan atas jendela formulir yang muncul, klik ikon dokumen kecil **"Import"**.
4. Salin (copy) seluruh isi file **`docker-compose.yml`** dan tempel (paste) ke kotak tersebut, lalu klik **Submit**.
5. CasaOS akan otomatis mengisi nama aplikasi, ikon, port luar `3080`, dan volume storage `./data`.
6. Klik **Install**.

---

## 2. Kenapa Anda Tidak Perlu Setup PostgreSQL?

Aplikasi Warung Rimbun telah dirancang dengan **Dual-Engine Persistence**:
- **Engine Bawaan (Persistent File Storage)**: Menggunakan engine penyimpanan JSON persisten berkecepatan tinggi yang disimpan di folder `./data/db.json`.
- Dalam `docker-compose.yml`, folder `./data` telah di-*mount* ke storage CasaOS Anda (`./data:/app/data`).
- **Keunggulan**:
  - Anda **tidak perlu menginstal, menyetel user, password, atau port PostgreSQL**.
  - Semua perubahan (tambah kegiatan, edit jurnal, upload foto kegiatan, tambah akun pengelola) otomatis tersimpan **permanen**.
  - Saat container restart, server mati lampu, atau diperbarui, data tidak akan hilang.

*(Catatan opsional: Jika suatu saat nanti Anda diwajibkan menggunakan PostgreSQL terpisah dari dinas, Anda cukup menambahkan 1 baris variabel `DATABASE_URL=postgres://...` di environment CasaOS tanpa perlu menyentuh kode aplikasi).*

---

## 3. Cara Menghubungkan Domain Permanen (Bebas Ganti URL saat Listrik/Router Mati)

### Masalah yang Sering Terjadi:
Saat listrik padam atau router mati, dua hal biasanya terjadi:
1. ISP (Indihome, Biznet, MyRepublic, dll.) akan memberikan **IP Publik baru** (Dynamic Public IP).
2. Router memberikan **IP Lokal baru** ke CasaOS lewat DHCP.
Jika Anda menghubungkan domain dengan cara manual (IP biasa), setiap kali mati lampu Anda harus repot mengubah settingan DNS/URL lagi.

### Solusi Terbaik & Permanen: Gunakan **Cloudflare Tunnel (Gratis & 100% Otomatis)**

Cloudflare Tunnel adalah teknologi modern untuk server rumahan/kantor:
- **TIDAK butuh IP publik statis**.
- **TIDAK butuh Port Forwarding** di router (sangat aman).
- **Tahan Mati Lampu & Restart**: Begitu CasaOS menyala kembali dan router tersambung ke internet, Cloudflare Tunnel langsung menyambungkan domain Anda (`warungrimbun.domainanda.com`) ke aplikasi di port `3000` dalam waktu kurang dari 5 detik secara otomatis.

#### Cara Pasang Cloudflare Tunnel di CasaOS (Hanya 3 Menit):
1. **Daftar/Buka Cloudflare**:
   - Buka [Zero Trust Dashboard](https://one.dash.cloudflare.com/) (Gratis).
   - Masuk ke menu **Networks** > **Tunnels** > Klik **Create a Tunnel**.
   - Pilih nama (misal: `casaos-tanggamus`) > Klik **Save tunnel**.
2. **Dapatkan Token Tunnel**:
   - Di bagian *Choose your environment*, pilih **Docker**.
   - Cloudflare akan menampilkan perintah seperti:
     `docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <TOKEN_PANJANG_ANDA>`
   - Salin kode `<TOKEN_PANJANG_ANDA>` tersebut.
3. **Pasang di CasaOS**:
   - Buka **App Store** di CasaOS > Cari aplikasi **Cloudflared** > Klik **Install**.
   - Masukkan token yang Anda salin tadi ke kolom Token.
   - Klik **Apply**.
4. **Sambungkan ke Domain Anda di Cloudflare**:
   - Kembali ke halaman Cloudflare Tunnel di browser.
   - Pada tab **Public Hostname**, klik **Add a public hostname**.
   - Masukkan subdomain Anda, misalnya:
     - Subdomain: `warungrimbun`
     - Domain: `namadomainanda.com`
   - Pada bagian **Service**:
     - Type: `HTTP`
     - URL: `host.docker.internal:3080` (atau IP lokal CasaOS Anda `192.168.1.x:3080`)
   - Klik **Save hostname**.

🎉 **SELESAI!**
Mulai saat ini:
- Website Anda bisa diakses dari seluruh dunia melalui `https://warungrimbun.namadomainanda.com` dengan SSL HTTPS aman gratis.
- Kapan pun listrik mati, router mati, atau IP internet berubah, domain Anda akan **tetap terhubung otomatis tanpa Anda perlu menyetel ulang apa pun**.

---

## 4. Tips Tambahan: Kunci IP Lokal di Router (DHCP Static Lease)

Agar IP lokal CasaOS di jaringan WiFi/LAN tidak berpindah:
1. Buka halaman admin router Anda (biasanya `192.168.1.1` atau `192.168.0.1`).
2. Masuk ke menu **DHCP** / **LAN IP Binding** / **Static Lease**.
3. Temukan nama server CasaOS Anda, lalu klik **Bind** / **Reserve**.
4. Dengan ini, CasaOS akan selalu mendapatkan alamat IP lokal yang sama selamanya.
