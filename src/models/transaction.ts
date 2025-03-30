import { AccountModel } from "./account";

export interface TransactionModel {
  id: string;
  code: string;
  description: string;
  notes: string;
  credit: number;
  balance: number;
  debit: number;
  amount: number;
  date: string;
  is_opening_balance: boolean;
  is_income: boolean;
  is_expense: boolean;
  is_equity: boolean;
  is_transfer: boolean;
  is_journal: boolean;
  is_refund: boolean;
  is_lending: boolean;
  is_saving: boolean;
  is_account_receivable: boolean;
  is_account_payable: boolean;
  account_id: string;
  account: AccountModel;
  transaction_ref_id: string;
  transaction_ref_type: string;
  transaction_ref?: TransactionModel;
  company_id: string;
  user_id: string;
}
