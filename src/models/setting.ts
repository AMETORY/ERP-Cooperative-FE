import { AccountModel } from "./account";

export interface SettingModel {
  id: string;
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
  status: string;
  bank_account: string | null;
  bank_code: string | null;
  beneficiary_name: string | null;
  cashflow_group_setting: CashFlowSetting;
}

export interface CooperationSetting {
  id: string;
  principal_savings_amount: number;
  mandatory_savings_amount: number;
  voluntary_savings_amount: number;
  net_surplus_mandatory_savings: number;
  net_surplus_reserve: number;
  net_surplus_business_profit: number;
  net_surplus_social_fund: number;
  net_surplus_education_fund: number;
  net_surplus_management: number;
  net_surplus_other_funds: number;
  principal_savings_account_id: string | null;
  mandatory_savings_account_id: string | null;
  voluntary_savings_account_id: string | null;
  loan_account_id: string | null;
  loan_account_income_id: string | null;
  loan_account_admin_fee_id: string | null;
  net_surplus_reserve_account_id: string | null;
  net_surplus_mandatory_savings_account_id: string | null;
  net_surplus_business_profit_account_id: string | null;
  net_surplus_social_fund_account_id: string | null;
  net_surplus_education_fund_account_id: string | null;
  net_surplus_management_account_id: string | null;
  net_surplus_other_funds_account_id: string | null;
  term_condition: string;
  static_character: string;
  number_format: string;
  auto_numeric_length: number;
  random_numeric_length: number;
  random_character_length: number;
  interest_rate_per_month: number;
  expected_profit_rate_per_month: number;
  is_islamic: boolean;
  principal_savings_account?: AccountModel;
  mandatory_savings_account?: AccountModel;
  voluntary_savings_account?: AccountModel;
  loan_account?: AccountModel;
  loan_account_admin_fee?: AccountModel;
  loan_account_income?: AccountModel;
  net_surplus_reserve_account?: AccountModel;
  net_surplus_mandatory_savings_account?: AccountModel;
  net_surplus_business_profit_account?: AccountModel;
  net_surplus_social_fund_account?: AccountModel;
  net_surplus_education_fund_account?: AccountModel;
  net_surplus_management_account?: AccountModel;
  net_surplus_other_funds_account?: AccountModel;
  
}


export interface CashFlowCategory {
  name: string;
  description: string;
}

export interface CashFlowSetting {
  operating: CashFlowCategory[];
  investing: CashFlowCategory[];
  financing: CashFlowCategory[];
}
