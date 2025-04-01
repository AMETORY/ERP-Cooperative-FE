import { ProductModel } from "./product";

export const enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  AMOUNT = "AMOUNT",
}

export interface DiscountModel  {
  id?: string;
  product_id?: string;
  product?: ProductModel;
  type: DiscountType;
  value: number;
  start_date: Date;
  end_date?: Date | null;
  is_active: boolean;
  notes?: string;

}
