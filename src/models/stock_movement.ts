import { MerchantModel } from "./merchant";
import {  ProductModel } from "./product";
import { WarehouseModel } from "./warehouse";


export enum MovementType {
  MovementTypeIn = "IN",
  MovementTypeOut = "OUT",
  MovementTypeTransfer = "TRANSFER",
  MovementTypeAdjust = "ADJUST",
}
export interface StockMovement {
  id: string;
  date: Date;
  description?: string | null;
  product_id: string;
  product?: ProductModel;
  source_warehouse_id?: string;
  warehouse_id: string;
  warehouse?: WarehouseModel;
  merchant_id?: string | null;
  merchant?: MerchantModel| null;
  distributor_id?: string | null;
  company_id?: string | null;
  quantity: number;
  type: MovementType;
  reference_id?: string | null;
}
