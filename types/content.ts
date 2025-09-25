export interface BlogLine {
  text: string;
  color?: string;
  delay: number; // ms after line before next starts
}

export interface BlogPostMeta {
  id: string;
  title: string;
  date: string; // ISO
  tags?: string[];
  content?: string;
}

export interface MediaBase {
  title: string;
  date: string;
  thumbnail: string;
}

export interface VideoItem extends MediaBase {
  url: string;
}

export interface PhotoItem {
  type: 'photo';
  title: string;
  description: string;
  date: string;
  image: string;
  thumbnail: string;
  tags: string[];
}

export interface AlbumItem {
  type: 'album';
  title: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
  photos: PhotoItem[];
}

export type PhotoEntry = PhotoItem | AlbumItem;

export interface Render3DItem {
  title: string;
  date: string;
  thumbnail: string;
  image?: string;
  tags?: string[];
}

export interface WebdevProjectItem {
  title: string;
  date: string;
  image: string;
  description?: string;
  url?: string;
}
