export interface ProductPriceModel {
    id: string;
    amount: number;
    currency: string; // ISO 4217 currency code
    product_id?: string;
    price_category_id: string;
    price_category?: PriceCategoryModel;
    effective_date?: Date;
    min_quantity: number;
  }
  
  
  export interface PriceCategoryModel {
    id: string;
    name: string;
    description: string;
  }