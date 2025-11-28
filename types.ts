export interface Site {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: number;
}

export interface GeneratedMetadata {
  title?: string;
  description?: string;
  category?: string;
}