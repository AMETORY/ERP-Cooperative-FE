import { TransactionModel } from "./transaction";

export interface JournalModel {
    id?: string;
    description: string;
    date: string;
    transactions: TransactionModel[];
    is_opening_balance: boolean;
    unbalanced: boolean;
}
