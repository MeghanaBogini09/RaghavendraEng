export interface Generator {
  id: number;
  name: string;
  brand: string;
  type: string;
  powerKVA: number;
  frequency: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface GeneratorFilter {
  type?: string;
  brand?: string;
  minKVA?: number;
  maxKVA?: number;
}
