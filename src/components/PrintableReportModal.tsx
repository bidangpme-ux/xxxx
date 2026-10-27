import React from 'react';
import { Publication } from '../types/publication';
import { X, Printer } from 'lucide-react';

interface PrintableReportModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  publication,
  onClose,
}) => {
  if (!publication) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(publication.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/70 backdrop-blur-xs flex justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Action Toolbar (no-print) */}
        <div className="no-print sticky top-0 z-20 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-6 py-3.5 flex items-center justify-between border-b border-emerald-700/60 shadow-xs">
          <div className="text-xs">
            <span className="font-semibold text-amber-300">Pratinjau Dokumen Cetak</span>
            <span className="text-emerald-200/80 ml-2">(Siap Dicetak / Disimpan ke PDF)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-white text-emerald-950 rounded-xl hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cetak Sekarang / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Paper (A4 Formal Document Style) */}
        <div className="overflow-y-auto p-8 sm:p-14 bg-white text-neutral-900 space-y-6 print:p-0 print:m-0">
          {/* Formal Letterhead */}
          <div className="border-b-2 border-neutral-900 pb-4 flex items-center justify-between gap-4">
            <img
              src="/logo.jpeg"
              alt="Logo Warung Rimbun"
              className="w-16 h-16 rounded-full object-cover shrink-0 ring-1 ring-neutral-300"
            />
            <div className="flex-1 text-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-0.5">
                WARUNG RIMBUN · BAPPERIDA KABUPATEN TANGGAMUS
              </h4>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                LAPORAN PUBLIKASI KEGIATAN & JURNAL PELAKSANAAN
              </h1>
              <p className="text-2xs text-neutral-600 mt-1">
                Wadah Urun Rembuk Perencanaan & Inovasi Pembangunan · Nomor Berkas: LP-KT/{new Date().getFullYear()}/{publication.id.replace('pub-', '')}
              </p>
            </div>
            <img
              src="/logo.jpeg"
              alt="Logo Warung Rimbun"
              className="w-16 h-16 rounded-full object-cover shrink-0 ring-1 ring-neutral-300 hidden sm:block opacity-90"
            />
          </div>

          {/* Activity Identity Table */}
          <table className="w-full text-xs border border-neutral-300">
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="w-1/4 bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Judul Kegiatan
                </td>
                <td className="p-2 font-medium text-neutral-900" colSpan={3}>
                  {publication.title}
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="w-1/4 bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Kategori
                </td>
                <td className="w-1/4 p-2 border-r border-neutral-300">
                  {publication.category}
                </td>
                <td className="w-1/4 bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Tanggal Pelaksanaan
                </td>
                <td className="w-1/4 p-2 font-mono tabular-nums">
                  {formattedDate}
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Lokasi
                </td>
                <td className="p-2 border-r border-neutral-300">
                  {publication.location}
                </td>
                <td className="bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Penyelenggara
                </td>
                <td className="p-2">
                  {publication.organizer}
                </td>
              </tr>
              <tr>
                <td className="bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Penyusun Jurnal
                </td>
                <td className="p-2 border-r border-neutral-300">
                  {publication.author.name} ({publication.author.role})
                </td>
                <td className="bg-neutral-100 font-semibold p-2 border-r border-neutral-300">
                  Capaian & Partisipan
                </td>
                <td className="p-2 font-mono tabular-nums">
                  {publication.journal.participantsCount} Peserta ({publication.journal.impactMetrics})
                </td>
              </tr>
            </tbody>
          </table>

          {/* Abstract */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
              I. Ringkasan Eksekutif & Abstrak
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed italic bg-neutral-50 p-3 border-l-2 border-neutral-900">
              "{publication.journal.abstract}"
            </p>
          </div>

          {/* Background */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
              II. Latar Belakang Pelaksanaan
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {publication.journal.background}
            </p>
          </div>

          {/* Activities Process */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
              III. Kronologi dan Rangkaian Pelaksanaan
            </h3>
            <ul className="text-xs text-neutral-700 space-y-1.5 list-decimal list-inside pl-1">
              {publication.journal.activitiesProcess.map((step, idx) => (
                <li key={idx} className="leading-relaxed">{step}</li>
              ))}
            </ul>
          </div>

          {/* Findings & Results */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
              IV. Hasil Nyata & Temuan Lapangan
            </h3>
            <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside pl-1">
              {publication.journal.findingsAndResults.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* Evaluation & Next steps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                V. Evaluasi Pelaksanaan
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {publication.journal.evaluation}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                VI. Rencana Tindak Lanjut
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {publication.journal.followUpPlan}
              </p>
            </div>
          </div>

          {/* Photo Documentation Section */}
          {publication.gallery && publication.gallery.length > 0 && (
            <div className="page-break-before">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
                VII. Lampiran Bukti Dokumentasi Fotografi
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {publication.gallery.map((photo) => (
                  <div key={photo.id} className="border border-neutral-200 p-2 rounded-sm bg-neutral-50 text-xs">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-16/9 object-cover rounded-sm mb-1.5"
                    />
                    <div className="font-medium text-neutral-900 text-2xs">{photo.caption}</div>
                    <div className="text-neutral-500 text-2xs mt-0.5">
                      Fotografer: {photo.photographer || 'Dokumentasi Lapangan'} · {photo.timestamp || publication.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Signatures Row */}
          <div className="pt-8 border-t border-neutral-300 flex justify-between text-xs text-neutral-800">
            <div className="text-center w-52">
              <p className="text-neutral-500 text-2xs">Disusun oleh,</p>
              <div className="h-16 flex items-end justify-center font-medium">
                {publication.author.name}
              </div>
              <div className="border-t border-neutral-400 pt-1 font-semibold">
                {publication.author.role}
              </div>
              <p className="text-2xs text-neutral-500">{publication.author.division}</p>
            </div>

            <div className="text-center w-52">
              <p className="text-neutral-500 text-2xs">Mengetahui / Mengesahkan,</p>
              <div className="h-16 flex items-end justify-center font-medium">
                (Penanggung Jawab Wilayah)
              </div>
              <div className="border-t border-neutral-400 pt-1 font-semibold">
                Kepala Divisi Operasional
              </div>
              <p className="text-2xs text-neutral-500">Kepanitiaan & Hubungan Masyarakat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
