import { AccountModel } from "./account";
import { TransactionModel } from "./transaction";

export interface AccountReportModel {
  account: AccountModel;
  total_balance: number;
  balance_before: number;
  current_balance: number;
  start_date: string;
  end_date: string;
  transactions: TransactionModel[];
}
