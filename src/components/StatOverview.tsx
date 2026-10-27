import React from 'react';
import { Publication } from '../types/publication';
import { BookOpen, Image, CheckCircle2 } from 'lucide-react';

interface StatOverviewProps {
  publications: Publication[];
}

export const StatOverview: React.FC<StatOverviewProps> = ({ publications }) => {
  const totalPublications = publications.length;
  const totalPhotos = publications.reduce((acc, p) => acc + (p.gallery?.length || 0), 0);
  const totalJournals = publications.filter(p => p.type === 'journal' || p.type === 'hybrid').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold tracking-wide text-neutral-600">Total Kegiatan Diterbitkan</span>
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-emerald-950 tabular-nums font-mono">
          {totalPublications}
        </div>
        <div className="mt-1 text-xs text-emerald-800/70 font-medium">
          Publikasi terverifikasi dalam portal
        </div>
      </div>

      <div className="bg-white border border-teal-100 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold tracking-wide text-neutral-600">Dokumentasi Foto</span>
          <div className="p-1 rounded-lg bg-teal-50 text-teal-600">
            <Image className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-teal-950 tabular-nums font-mono">
          {totalPhotos}
        </div>
        <div className="mt-1 text-xs text-teal-800/70 font-medium">
          Foto arsip resolusi tinggi
        </div>
      </div>

      <div className="bg-white border border-amber-100 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold tracking-wide text-neutral-600">Naskah Jurnal & Laporan</span>
          <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-amber-950 tabular-nums font-mono">
          {totalJournals}
        </div>
        <div className="mt-1 text-xs text-amber-800/70 font-medium">
          Laporan kegiatan terstruktur
        </div>
      </div>
    </div>
  );
};
