import { MerchantModel } from "./merchant";
import {  ProductModel } from "./product";
import { PurchaseModel } from "./purchase";
import { ReturnModel } from "./return";
import { SalesModel } from "./sales";
import { UnitModel } from "./unit";
import { WarehouseModel } from "./warehouse";


export enum MovementType {
  MovementTypeIn = "IN",
  MovementTypeOut = "OUT",
  MovementTypeTransfer = "TRANSFER",
  MovementTypeAdjust = "ADJUST",
}
export interface StockMovementModel {
  id: string;
  date: Date;
  description?: string | null;
  product_id: string;
  product?: ProductModel;
  source_warehouse_id?: string;
  warehouse_id: string;
  warehouse?: WarehouseModel;
  unit?: UnitModel;
  merchant_id?: string | null;
  merchant?: MerchantModel| null;
  distributor_id?: string | null;
  company_id?: string | null;
  quantity: number;
  type: MovementType;
  reference_id?: string | null;
  reference_type?: string | null;
  sales_ref?: SalesModel;
  purchase_ref?: PurchaseModel;
  return_ref?: ReturnModel;
}
