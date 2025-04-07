import { ProductModel, VariantModel } from "./product";
import { PurchaseModel } from "./purchase";
import { SalesModel } from "./sales";
import { TaxModel } from "./tax";
import { UnitModel } from "./unit";
import { UserModel } from "./user";
import { WarehouseModel } from "./warehouse";

export interface ReturnModel {
  id?: string;
  date?: Date;
  return_number?: string;
  return_type?: string;
  ref_id?: string;
  user_id?: string;
  user?: UserModel;
  reason?: string;
  notes?: string;
  description?: string;
  status?: string;
  released_at?: Date;
  released_by_id?: string;
  released_by?: UserModel;
  items?: ReturnItemModel[];
  purchase_ref?: PurchaseModel;
  sales_ref?: SalesModel;
}

export interface ReturnItemModel {
  id?: string;
  description?: string;
  notes?: string;
  return_id?: string;
  return?: ReturnModel;
  product_id?: string;
  product?: ProductModel;
  variant_id?: string;
  variant?: VariantModel;
  quantity?: number;
  original_quantity?: number;
  unit_price?: number;
  unit_id?: string;
  unit?: UnitModel;
  tax_id?: string;
  tax?: TaxModel;
  warehouse_id?: string;
  warehouse?: WarehouseModel;
  value?: number;
  total?: number;
  discount_percent?: number;
  discount_amount?: number;
  sub_total?: number;
}
