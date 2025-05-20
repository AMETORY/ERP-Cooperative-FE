import { AccountModel } from "./account";
import { ContactModel } from "./contact";
import { TransactionModel } from "./transaction";
import { TrialBalanceReportModel } from "./trial_balance";

export interface AccountReportModel {
  account: AccountModel;
  total_balance: number;
  balance_before: number;
  current_balance: number;
  start_date: string;
  end_date: string;
  transactions: TransactionModel[];
}

export interface CogsReportModel {
  title: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  company_id: string;
  beginning_inventory: number;
  purchases: number;
  freight_in_and_other_cost: number;
  total_purchases: number;
  purchase_returns: number;
  purchase_discounts: number;
  total_purchase_discounts: number;
  net_purchases: number;
  goods_available: number;
  ending_inventory: number;
  cogs: number;
  stock_opname: number;
  inventory_account: AccountModel;
}

export interface ProfitLossModel {
  title: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  company_id: string;
  profit: ProfitLossAccount[];
  net_surplus: ProfitLossAccount[];
  loss: ProfitLossAccount[];
  tax: ProfitLossAccount[];
  income_tax: number;
  net_profit_after_tax: number;
  gross_profit: number;
  total_expense: number;
  total_net_surplus: number;
  net_profit: number;
}

export interface ProfitLossAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  sum: number;
  link: string;
}

export interface BalanceSheetAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  sum: number;
  link: string;
}

export interface BalanceSheetModel {
  title: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  company_id: string;
  fixed_assets: BalanceSheetAccount[];
  total_fixed: number;
  current_assets: BalanceSheetAccount[];
  total_current: number;
  total_assets: number;
  liable_assets: BalanceSheetAccount[];
  total_liability: number;
  equity: BalanceSheetAccount[];
  total_equity: number;
  total_liabilities_and_equity: number;
}

export interface CapitalChangeModel {
  opening_balance: number;
  profit_loss: number;
  prived_balance: number;
  capital_change_balance: number;
  ending_balance: number;
}

export interface CashFlowReport {
  operating: CashflowSubGroup[];
  investing: CashflowSubGroup[];
  financing: CashflowSubGroup[];
  total_operating: number;
  total_investing: number;
  total_financing: number;
}

export interface CashflowSubGroup {
  name: string;
  description: string;
  amount: number;
}

export interface ClosingBookReport {
  id?: string;
  title: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: string;
  profit_loss: ProfitLossModel;
  balance_sheet: BalanceSheetModel;
  cash_flow: CashFlowReport;
  trial_balance: TrialBalanceReportModel;
  capital_change: CapitalChangeModel;
  transactions: TransactionModel[];
  closing_summary: ClosingSummary;
}

export interface ClosingSummary {
  total_income: number;
  total_expense: number;
  net_income: number;
  income_tax: number;
  tax_payable_id: string | null;
  earning_retain_id: string | null;
  tax_expense_id: string | null;
  tax_percentage: number;
  earning_retain: AccountModel;
}


export interface ProductSalesCustomer {
  product_id: string;
  contact_id: string;
  product_code: string;
  contact_code: string;
  unit_code: string;
  unit_name: string;
  product_name: string;
  contact_name: string;
  quantity: number;
  total_quantity: number;
  total_price: number;
}

export interface ProductSalesCustomerReport {
  contacts: Record<string, ProductSalesCustomer>;
  products: Record<string, ProductSalesCustomer>;
  data: Record<string, Record<string, ProductSalesCustomer[]>>;
  grand_total_amount: Record<string, number>;
  grand_total_quantity: Record<string, number>;
  message: string;
}


export interface LedgerReport {
  total_debit_before: number;
  total_debit: number;
  total_debit_after: number;
  total_credit_before: number;
  total_credit: number;
  total_credit_after: number;
  total_balance_before: number;
  total_balance: number;
  total_balance_after: number;
  grand_total_debit: number;
  grand_total_credit: number;
  grand_total_balance: number;
  ledgers: Ledger[];
  contact: ContactModel;
}

export interface Ledger {
  id: string;
  description: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
  ref_id: string;
  ref: string;
  ref_type: string;
}
