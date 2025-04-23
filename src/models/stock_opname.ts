import { ProductModel, VariantModel } from "./product";
import { UnitModel } from "./unit";
import { UserModel } from "./user";
import { WarehouseModel } from "./warehouse";

export interface StockOpnameModel {
  id?: string;
  stock_opname_number: string;
  warehouse_id: string;
  warehouse?: WarehouseModel;
  status: string;
  opname_date: Date;
  notes: string;
  created_by_id: string;
  created_by?: UserModel;
  details?: StockOpnameDetailModel[];
}

export interface StockOpnameDetailModel {
  id?: string;
  stock_opname_id: string;
  product_id: string;
  product: ProductModel;
  variant_id?: string;
  variant?: VariantModel;
  quantity: number;
  system_qty: number;
  difference: number;
  unit_id?: string;
  unit?: UnitModel;
  unit_value: number;
  unit_price: number;
  notes?: string;
}
