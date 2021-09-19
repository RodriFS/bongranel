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
