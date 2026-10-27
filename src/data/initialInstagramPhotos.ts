export interface InstagramPhotoComment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
}

export interface InstagramPhotoItem {
  id: string;
  title: string;
  photoUrl: string;
  carouselPhotos?: string[];
  caption: string;
  category: string;
  location: string;
  photographer: string;
  authorName?: string;
  date: string;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  comments: InstagramPhotoComment[];
}

export const INITIAL_INSTAGRAM_PHOTOS: InstagramPhotoItem[] = [
  {
    "id": "ig-001",
    "title": "Lokakarya Kolaborasi Rekayasa Perangkat Lunak & Alur Kerja Digital",
    "photoUrl": "/src/assets/images/kegiatan_workshop_pelatihan_1792596996674.jpg",
    "carouselPhotos": [
      "/src/assets/images/kegiatan_workshop_pelatihan_1792596996674.jpg",
      "/src/assets/images/kegiatan_seminar_nasional_1792596997928.jpg"
    ],
    "caption": "Momen intensif tim praktisi saat memetakan arsitektur sistem kolaboratif dan standardisasi otomasi alur kerja digital di sentra percontohan Jakarta. Semangat kolaborasi nyata demi dampak keberlanjutan!",
    "category": "Pendidikan & Pelatihan",
    "location": "Auditorium Inovasi Nusantara, Jakarta Pusat",
    "photographer": "Ahmad Faisal",
    "authorName": "warungrimbun.official",
    "date": "14 Okt 2026",
    "likesCount": 342,
    "isLiked": false,
    "isBookmarked": false,
    "tags": [
      "#WarungRimbun",
      "#TransformasiDigital",
      "#PelatihanSDM",
      "#InovasiTeknologi"
    ],
    "comments": [
      {
        "id": "c1",
        "username": "budi_hartono",
        "text": "Keren banget materinya, modul praktis langsung bisa diaplikasikan! 🔥",
        "timeAgo": "2 jam lalu"
      },
      {
        "id": "c2",
        "username": "sarah.lestari",
        "text": "Semoga ada batch selanjutnya di kota lain 🙌",
        "timeAgo": "1 jam lalu"
      }
    ]
  },
  {
    "id": "ig-002",
    "title": "Distribusi Bantuan Sarana Air Bersih & Konservasi Sumber Mata Air",
    "photoUrl": "/src/assets/images/kegiatan_bakti_sosial_1792596997632.jpg",
    "carouselPhotos": [
      "/src/assets/images/kegiatan_bakti_sosial_1792596997632.jpg",
      "/src/assets/images/kegiatan_ekspedisi_lapangan_1792596998900.jpg"
    ],
    "caption": "Penyaluran unit filtrasi higienis dan gotong royong pembersihan resapan air pegunungan bersama komunitas warga setempat di Lereng Semaka. Air bersih adalah hak dasar setiap generasi masa depan.",
    "category": "Bakti Sosial & Lingkungan",
    "location": "Kecamatan Semaka, Tanggamus, Lampung",
    "photographer": "Dedi Kurniawan",
    "authorName": "warungrimbun.peduli",
    "date": "10 Okt 2026",
    "likesCount": 528,
    "isLiked": true,
    "isBookmarked": true,
    "tags": [
      "#BaktiSosial",
      "#AirBersihUntukSemua",
      "#SemakaPeduli",
      "#LingkunganLestari"
    ],
    "comments": [
      {
        "id": "c3",
        "username": "hendra_wijaya",
        "text": "Terima kasih tim Warung Rimbun atas kepedulian nyatanya untuk warga Semaka! ❤️",
        "timeAgo": "5 jam lalu"
      },
      {
        "id": "c4",
        "username": "dian.pertiwi",
        "text": "Semoga membawa manfaat berkah dan berkelanjutan.",
        "timeAgo": "3 jam lalu"
      }
    ]
  },
  {
    "id": "ig-003",
    "title": "Seminar Nasional Riset Kebijakan Tata Kelola & Resiliensi Iklim",
    "photoUrl": "/src/assets/images/kegiatan_seminar_nasional_1792596997928.jpg",
    "carouselPhotos": [
      "/src/assets/images/kegiatan_seminar_nasional_1792596997928.jpg",
      "/src/assets/images/kegiatan_workshop_pelatihan_1792596996674.jpg"
    ],
    "caption": "Pleno paparan naskah evaluasi dampak dan diseminasi rekomendasi kebijakan resiliensi iklim bersama perwakilan akademisi dan pemangku kepentingan lintas sektoral.",
    "category": "Seminar & Riset",
    "location": "Ballroom Graha Cipta Inovasi, Yogyakarta",
    "photographer": "Citra Kirana",
    "authorName": "warungrimbun.riset",
    "date": "06 Okt 2026",
    "likesCount": 289,
    "isLiked": false,
    "isBookmarked": false,
    "tags": [
      "#SeminarNasional",
      "#RisetKebijakan",
      "#ResiliensiIklim",
      "#WarungRimbun"
    ],
    "comments": [
      {
        "id": "c5",
        "username": "prof_mulyadi",
        "text": "Analisis datanya sangat komprehensif dan tajam.",
        "timeAgo": "1 hari lalu"
      }
    ]
  },
  {
    "id": "ig-004",
    "title": "Ekspedisi Lapangan: Penjelajahan Koridor Satwa & Vegetasi Alam",
    "photoUrl": "/src/assets/images/kegiatan_ekspedisi_lapangan_1792596998900.jpg",
    "carouselPhotos": [
      "/src/assets/images/kegiatan_ekspedisi_lapangan_1792596998900.jpg",
      "/src/assets/images/kegiatan_bakti_sosial_1792596997632.jpg"
    ],
    "caption": "Catatan perjalanan tim patroli lapangan menembus rute terjal pegunungan untuk inventarisasi titik monitoring keanekaragaman hayati dan habitat endemik.",
    "category": "Ekspedisi & Lapangan",
    "location": "Kawasan Konservasi Hutan Lindung Bukit Barisan",
    "photographer": "Bambang Sudrajat",
    "authorName": "warungrimbun.ekspedisi",
    "date": "28 Sep 2026",
    "likesCount": 461,
    "isLiked": false,
    "isBookmarked": false,
    "tags": [
      "#EkspedisiAlam",
      "#KonservasiHayati",
      "#BukitBarisan",
      "#EksplorasiNusantara"
    ],
    "comments": [
      {
        "id": "c6",
        "username": "adityapratama",
        "text": "Pemandangan luar biasa, salut perjuangan rekan-rekan di lapangan! 🌿✨",
        "timeAgo": "3 hari lalu"
      }
    ]
  }
];
