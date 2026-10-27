import React, { useState } from 'react';
import { Publication } from '../types/publication';
import { MapPin, Users, Calendar, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface LocationHubViewProps {
  publications: Publication[];
  onOpenJournal: (pub: Publication) => void;
}

export const LocationHubView: React.FC<LocationHubViewProps> = ({
  publications,
  onOpenJournal,
}) => {
  // Extract distinct locations and group publications
  const locationGroups = publications.reduce((acc, pub) => {
    // Simplify location key for grouping
    let groupKey = pub.location;
    if (pub.location.includes('Jakarta')) groupKey = 'DKI Jakarta (Pusat & Wilayah)';
    else if (pub.location.includes('Bogor') || pub.location.includes('Ciliwung')) groupKey = 'Kawasan Bogor & DAS Ciliwung';
    else if (pub.location.includes('Halimun')) groupKey = 'Taman Nasional Gunung Halimun Salak';

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(pub);
    return acc;
  }, {} as Record<string, Publication[]>);

  const [selectedHub, setSelectedHub] = useState<string>(Object.keys(locationGroups)[0] || '');

  const activeHubPubs = locationGroups[selectedHub] || [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-neutral-700" />
            <span>Pusat Sebaran Wilayah Kegiatan</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Peta dan distribusi kegiatan berdasarkan kawasan geografis dan basis komunitas mitra.
          </p>
        </div>
        <div className="text-xs text-neutral-500 font-mono tabular-nums">
          {Object.keys(locationGroups).length} Kawasan Terdaftar
        </div>
      </div>

      {/* Region Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(locationGroups).map(([region, pubs]) => {
          const totalPeople = pubs.reduce((sum, p) => sum + p.journal.participantsCount, 0);
          const isSelected = selectedHub === region;

          return (
            <div
              key={region}
              onClick={() => setSelectedHub(region)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                <span className={`text-2xs font-mono tabular-nums px-2 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {pubs.length} Kegiatan
                </span>
              </div>

              <h3 className="text-sm font-bold mb-1 line-clamp-1">{region}</h3>

              <div className={`text-xs mt-3 pt-3 border-t flex items-center justify-between ${
                isSelected ? 'border-neutral-700 text-neutral-300' : 'border-neutral-100 text-neutral-500'
              }`}>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Users className="w-3.5 h-3.5 opacity-70" />
                  {totalPeople} Partisipan
                </span>
                <span className="text-2xs font-medium">Klik untuk eksplorasi</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publications in Selected Hub */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Daftar Kegiatan di: {selectedHub}
            </h3>
            <p className="text-xs text-neutral-500">
              Dokumentasi foto dan jurnal yang terlaksana pada kawasan ini.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {activeHubPubs.length} publikasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeHubPubs.map((pub) => (
            <div
              key={pub.id}
              className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={pub.coverImage}
                  alt={pub.title}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 object-cover rounded-md shrink-0 bg-neutral-100"
                />
                <div>
                  <div className="text-2xs text-neutral-500 font-medium mb-1">
                    {pub.category} · {pub.date}
                  </div>
                  <h4 
                    onClick={() => onOpenJournal(pub)}
                    className="text-xs font-bold text-neutral-900 hover:text-neutral-700 cursor-pointer line-clamp-2 leading-snug"
                  >
                    {pub.title}
                  </h4>
                  <p className="text-2xs text-neutral-600 line-clamp-2 mt-1">
                    {pub.summary}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-2xs text-neutral-500">
                  {pub.journal.participantsCount} Peserta
                </span>
                <button
                  onClick={() => onOpenJournal(pub)}
                  className="inline-flex items-center gap-1 font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  <span>Buka Jurnal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
