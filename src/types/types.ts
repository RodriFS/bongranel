export interface Product {
  productId: string;
  Name: string;
  units: string;
  Total: number;
  Limit: number;
}

export interface LastConnectionResponse {
  lastConnection: string;
}

export interface FindProductResponse {
  products: Product[];
}
