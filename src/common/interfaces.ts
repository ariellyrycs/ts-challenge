export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: number;
  highestQualityFormat: string;
  size: number;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  authorId: number;
  categoryIds: number[];
  highestQualityFormat: string;
  releaseDate: Date;
}