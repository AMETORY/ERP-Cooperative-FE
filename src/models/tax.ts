import { AccountModel } from "./account";

export interface TaxModel {
    id?: string;
    name?: string;
    code?: string;
    amount?: number;
    account_receivable_id?: string;
    account_payable_id?: string;
    account_receivable?: AccountModel;
    account_payable?: AccountModel;
}
