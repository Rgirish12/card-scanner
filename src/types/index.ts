export interface CardData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  website?: string;
  jobTitle?: string;
  rawText: string;
  imageUri?: string;
  timestamp: string;
  tags?: string[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  blocks?: TextBlock[];
}

export interface TextBlock {
  text: string;
  boundingBox: BoundingBox;
  confidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ParsedCardData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  website?: string;
  jobTitle?: string;
}

export interface ParsedDataType {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}
