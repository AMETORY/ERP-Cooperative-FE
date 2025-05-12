import { ProductModel } from "./product";

// types.ts
export interface MenuItem {
  id: string;
  name: string;
  price?: number;
  product?: ProductModel;
  description?: string;
  children?: MenuItem[];
}

export type MenuCategory = MenuItem[];