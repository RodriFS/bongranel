export interface Product {
  productId: string;
  Name: string;
  units: string;
  quantity: number;
  lowStock: number;
}

export interface LastConnectionResponse {
  lastConnection: string;
}

export interface FindProductResponse {
  products: Product[];
}

export interface ScaleRow {
  SKU: string;
  Nombre: string;
  Receta: string;
  Origen: string;
  Alergenos: string;
  Lote: string;
  Precio: string;
}

export type ScaleData = { items: ScaleRow[]; total: number };

export interface ScaleEvent {
  body: Partial<ScaleRow>;
  column: keyof ScaleRow;
}
