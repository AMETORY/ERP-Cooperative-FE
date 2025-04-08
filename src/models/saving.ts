import { AccountModel } from "./account";
import { CompanyModel } from "./company";
import { CooperativeMemberModel } from "./cooperative_member";
import { TransactionModel } from "./transaction";
import { UserModel } from "./user";

export interface SavingModel {
  id?: string;
  company_id?: string;
  company?: CompanyModel;
  user_id?: string;
  user?: UserModel;
  cooperative_member_id?: string;
  cooperative_member?: CooperativeMemberModel;
  account_destination_id?: string;
  account_destination?: AccountModel;
  net_surplus_id?: string;
  saving_type: "PRINCIPAL" | "MANDATORY" | "VOLUNTARY";
  amount: number;
  notes?: string;
  description?: string;
  date?: Date;
  transactions?: TransactionModel[]
}
