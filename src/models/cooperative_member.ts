import { CompanyModel } from "./company";
import { UserModel } from "./user";

import { FileModel } from "./file";
import { TransactionModel } from "./transaction";

export interface CooperativeMemberModel {
    id?: string;
    company_id?: string;
    company?: CompanyModel;
    name: string;
    member_id_number: string;
    join_date: Date;
    active: boolean;
    email: string;
    picture?: FileModel;
    phone_number: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    connected_to?: string;
    user?: UserModel;
    total_savings: number;
    total_loans: number;
    total_remain_loans: number;
    total_transactions: number;
    total_disbursement: number;
    net_surplus_transactions?: TransactionModel[];
    approved_by?: string;
    approved_by_user?: UserModel;
    approved_at?: Date;
    status: string;
}
