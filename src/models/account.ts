export interface AccountModel {
    id?: string;
    name?: string;
    code?: string;
    color?: string;
    description?: string;
    is_deletable?: boolean;
    is_report?: boolean;
    is_account_report?: boolean;
    is_cashflow_report?: boolean;
    is_pdf?: boolean;
    type?: string;
    category?: string;
    cashflow_group?: string;
    cashflow_subgroup?: string;
    is_tax?: boolean;
    company_id?: string;
    user_id?: string;
}
