export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  cover: string;
  description: string;
  isbn13: string;
  priceStandard: number;
  priceSales: number;
  link: string;
  categoryName?: string;
  status?: BookStatus; 
}

export type BookStatus = 'discovery' | 'review' | 'confirmed';

export interface ApiKeys {
  aladinTtb: string;
  nlkApiKey?: string; 
}

export type FetchSource = 'combined' | 'bestseller' | 'itemNewSpecial' | 'editorRecommend';

export type SearchTarget = 'Keyword' | 'Title' | 'Author' | 'Publisher';

export interface CartItem extends Book {
  addedAt: number;
}

export interface GeminiAnalysis {
  summary: string;
  budgetAnalysis: string;
  categoryBreakdown: string;
  recommendationScore: number;
}