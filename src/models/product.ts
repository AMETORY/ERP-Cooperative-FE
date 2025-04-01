import { BrandModel } from "./brand";
import { CompanyModel } from "./company";
import { DiscountModel } from "./discount";
import { FileModel } from "./file";
import { ProductPriceModel } from "./price";
import { ProductCategoryModel } from "./product_category";


export interface ProductModel {
  id?: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  price: number;
  original_price?: number;
  company_id?: string;
  company?: CompanyModel;
  category_id?: string;
  category?: ProductCategoryModel;
  prices: ProductPriceModel[];
  brand?: BrandModel;
  brand_id?: string;
  product_images: FileModel[];
  total_stock?: number;
  active_discount?: DiscountModel | null;
  tags?: Tag[]
  height?: number;
  length?: number;
  weight?: number;
  width?: number;
  status?: string;

}


export interface VariantModel {
  id: string;
  product_id: string;
  product?: ProductModel;
  sku?: string;
  barcode?: string;
  price: number;
  original_price?: number;
  total_stock?: number;
  attributes: VariantProductAttributeModel[];
  display_name?: string;
  tags?: Tag[]
  height?: number;
  length?: number;
  weight?: number;
  width?: number;

}

export type VariantProductAttributeModel = {
  id?: string;
  variant_id: string;
  attribute_id: string;
  attribute?: ProductAttributeModel;
  value: string;
}


export interface ProductAttributeModel  {
  name: string;
  priority: number;
}

export interface ProductRecommendation {
  id: string;
  product_id: string;
  product?: ProductModel;
  score: number;
}


export interface SumProductRecommendation {
  product_id: string;
  total_score: number;
  product_name: string;
}


export interface PopularProduct  {
  id: string;
  product_id: string;
  product?: BrandModel;
  score: number;
}


export interface Tag  {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon_url?: string;
}
