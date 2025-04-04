export interface PaymentTermModel  {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
    category?: string;
    due_days?: number | null;
    discount_amount?: number | null;
    discount_due_days?: number | null;
}


