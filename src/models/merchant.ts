import { CompanyModel } from "./company";
import { FileModel } from "./file";
import { PriceCategoryModel } from "./price_category";
import { UserModel } from "./user";
import { WarehouseModel } from "./warehouse";

export interface MerchantModel  {
  id?: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  merchant_type_id?: string | null;
  merchant_type?: string | null;
  company_id?: string | null;
  default_warehouse?: WarehouseModel | null;
  default_warehouse_id?: string | null;
  default_price_category_id?: string | null;
  default_price_category?: PriceCategoryModel | null;
  company?: CompanyModel | null;
  province_id?: string | null;
  regency_id?: string | null;
  district_id?: string | null;
  village_id?: string | null;
  user?: UserModel
  status?: string
  picture?: FileModel | null
  workflow?: any
  menu?: any
}

export interface MerchantLayoutModel {
  id: string;
  created_at: string;
  name: string;
  description: string;
  merchant_id: string;
  merchant_desks: any[];
}

