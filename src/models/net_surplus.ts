import { AccountModel } from "./account";
import { ProfitLossAccount, ProfitLossModel } from "./report";
import { TransactionModel } from "./transaction";

export interface NetSurplusModel {
  id: string;
  company_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  date: string;
  description: string;
  net_surplus_total: number;
  distribution: NetSurplusDistribution[];
  members: NetSurplusMember[];
  profit_loss: NetSurplusProfitLoss;
  status: string;
  net_surplus_number?: string;
  savings_total: number;
  loan_total: number;
  transaction_total: number;
  transactions: TransactionModel[]
}

export interface NetSurplusDistribution {
  key: string;
  name: string;
  percentage: number;
  amount: number;
  account_id: string;
  account?:AccountModel;
  account_cash_id: string | null;
  account_cash?:AccountModel;
  account_expense_id: string | null;
  account_expense?:AccountModel;
  balance: number;
}
export interface NetSurplusMember {
  id: string;
  full_name: string;
  member_id: string;
  savings_total: number;
  loan_total: number;
  transaction_total: number;
  net_surplus_mandatory_savings_allocation: number;
  net_surplus_business_profit_allocation: number;
  status: string;
}

export interface NetSurplusProfitLoss {
  start_date: string;
  end_date: string;
  profit: ProfitLossAccount[];
  loss: ProfitLossAccount[];
  gross_profit: number;
  total_expense: number;
  net_profit: number;
}
