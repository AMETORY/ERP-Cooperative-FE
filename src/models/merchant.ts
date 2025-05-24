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
  enable_xendit?: boolean
  xendit_api_key?: string
  xendit_api_key_censored?: string
  xendit?: Xendit
}

export interface Xendit {
  enable_qris?: boolean;
  enable_dana?: boolean;
  enable_link_aja?: boolean;
  enable_shopee_pay?: boolean;
  enable_ovo?: boolean;
  enable_bca?: boolean;
  enable_mandiri?: boolean;
  enable_bni?: boolean;
  enable_bri?: boolean;
  qris_fee?: number;
  dana_fee?: number;
  ovo_fee?: number;
  link_aja_fee?: number;
  shopee_pay_fee?: number;
  va_fee?: number;
}

export interface MerchantLayoutModel {
  id: string;
  created_at: string;
  name: string;
  description: string;
  merchant_id: string;
  merchant_desks: any[];
}
export interface MerchantStationModel {
  id: string;
  station_name: string;
  description: string;
}

