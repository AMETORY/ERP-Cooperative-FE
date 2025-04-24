import { CashFlowSetting, CooperationSetting } from "./setting";
import { UserModel } from "./user";

export interface CompanyModel {
  id?: string;
  name: string;
  logo: string;
  cover: string;
  legal_entity: string;
  email: string;
  phone: string;
  fax: string;
  address: string;
  contact_person: string;
  contact_person_position: string;
  tax_payer_number?: string;
  user_id?: string;
  user?: UserModel;
  status: string;
  setting?: CompanySetting;
  is_cooperation?: boolean;
  cooperative_setting?: CooperationSetting;
  cashflow_group_setting: CashFlowSetting;
  sales_static_character?: string;
  sales_order_static_character?: string;
  sales_quote_static_character?: string;
  sales_return_static_character?: string;
  delivery_static_character?: string;
  purchase_static_character?: string;
  purchase_order_static_character?: string;
  purchase_return_static_character?: string;
  sales_format?: string;
  sales_order_format?: string;
  sales_quote_format?: string;
  sales_return_format?: string;
  delivery_format?: string;
  purchase_format?: string;
  purchase_order_format?: string;
  purchase_return_format?: string;
  auto_numeric_length?: number;
  random_numeric_length?: number;
  random_character_length?: number;
}

export interface CompanySetting {
  company_id?: string;
  gemini_api_key?: string;
  whatsapp_web_host?: string;
  whatsapp_web_mock_number?: string;
  whatsapp_web_is_mocked?: boolean;
}

export interface CompanySectorModel {
  id: string;
  name: string;
  is_cooperative: boolean;
  categories: CompanyCategoryModel[];
}

export interface CompanyCategoryModel {
  id: string;
  name: string;
  is_cooperative: boolean;
  sector_id: string;
}
