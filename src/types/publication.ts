export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  photographer?: string;
  timestamp?: string;
}

export interface JournalComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export type PublicationCategory =
  | 'Pendidikan & Pelatihan'
  | 'Bakti Sosial & Lingkungan'
  | 'Seminar & Riset'
  | 'Ekspedisi & Lapangan'
  | 'Organisasi & Tata Kelola'
  | string;

export type PublicationType = 'hybrid' | 'offline' | 'online' | string;

export type DashboardViewMode = 'grid' | 'timeline' | 'location';

export interface FilterState {
  search: string;
  category: string;
  type: string;
  status: string;
  onlyBookmarked?: boolean;
  sortBy: 'date-desc' | 'date-asc' | 'views-desc' | 'likes-desc' | string;
}

export interface PublicationAuthor {
  name: string;
  role: string;
  division?: string;
}

export interface PublicationJournal {
  abstract: string;
  background: string;
  activitiesProcess: string[];
  findingsAndResults: string[];
  evaluation: string;
  followUpPlan: string;
  participantsCount: number;
  impactMetrics: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  type: PublicationType;
  category: PublicationCategory;
  date: string;
  location: string;
  organizer: string;
  author: PublicationAuthor;
  status: 'published' | 'draft' | 'archived' | string;
  summary: string;
  coverImage: string;
  gallery: GalleryPhoto[];
  journal: PublicationJournal;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  isBookmarked: boolean;
  comments: JournalComment[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
