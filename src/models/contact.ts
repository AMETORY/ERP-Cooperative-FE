import { CompanyModel } from "./company";
import { FileModel } from "./file";
import { UserModel } from "./user";

export interface ContactModel {
  id?: string;
  name: string;
  email?: string;
  code?: string;
  phone?: string;
  address?: string;
  avatar?: FileModel;
  avatar_id?: string;
  contact_person?: string;
  contact_person_position?: string;
  is_customer: boolean;
  is_vendor: boolean;
  is_supplier: boolean;
  user_id?: string;
  user?: UserModel;
  company_id?: string;
  company?: CompanyModel;
  receivables_limit?: number;
  debt_limit?: number;
  receivables_limit_remain?: number;
  debt_limit_remain?: number;
  total_debt?: number;
  total_receivable?: number;
}
