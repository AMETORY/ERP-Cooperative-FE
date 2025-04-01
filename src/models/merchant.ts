import { CompanyModel } from "./company";
import { FileModel } from "./file";
import { UserModel } from "./user";

export interface MerchantModel  {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  merchant_type_id?: string | null;
  merchant_type?: string | null;
  company_id?: string | null;
  company?: CompanyModel | null;
  province_id?: string | null;
  regency_id?: string | null;
  district_id?: string | null;
  village_id?: string | null;
  user?: UserModel
  status?: string
  picture?: FileModel | null
}
