export interface SalesPurchase {
    id: string;
    number: string;
    contact_name: string;
    total: number;
    balance: number;
    due_date: Date | null;
}

