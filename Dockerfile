# =============================================================
# Production Multi-Stage Dockerfile for CasaOS & Docker
# Mendukung arsitektur:
# - linux/amd64 (Mini PC Intel/AMD, Laptop, Server, Synology/QNAP x86)
# - linux/arm64 (Raspberry Pi 4/5, Orange Pi, NAS berbasis ARM)
# =============================================================

# -------------------------------------------------------------
# TAHAP 1: Builder (Kompilasi Frontend Vite)
# -------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Salin manifest dependensi & instal paket
COPY package.json ./
RUN npm install --legacy-peer-deps

# Salin seluruh kode sumber & lakukan build aplikasi ke folder dist/
COPY . .
RUN npm run build

# -------------------------------------------------------------
# TAHAP 2: Runner Produksi (Ringan, Cepat & Aman)
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Variabel Lingkungan Produksi
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/data

# Salin file eksekusi dan dependensi dari tahap builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Inisialisasi folder data persisten bawaan
COPY --from=builder /app/data ./data

# Buka port internal web
EXPOSE 3000

# Healthcheck otomatis untuk monitor CasaOS / Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/status || exit 1

# Jalankan server full-stack Warung Rimbun
CMD ["npm", "start"]