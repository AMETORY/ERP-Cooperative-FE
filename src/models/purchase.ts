import { CompanyModel } from "./company"
import { ContactModel } from "./contact"
import { UserModel } from "./user"
import { ProductModel, VariantModel } from "./product";
import { WarehouseModel } from "./warehouse";
import { AccountModel } from "./account";
import { TaxModel } from "./tax";
import { UnitModel } from "./unit";

export interface PurchaseModel {
  id?: string
  purchase_number?: string
  code?: string
  description?: string
  notes?: string
  total?: number
  paid?: number
  subtotal?: number
  total_before_tax?: number
  total_before_disc?: number
  total_tax?: number
  total_discount?: number
  status?: string
  stock_status?: string
  purchase_date?: string
  due_date?: Date
  discount_due_date?: Date
  payment_discount_amount?: number
  payment_terms?: string
  payment_terms_code?: string
  term_condition?: string
  company_id?: string
  company?: CompanyModel
  contact_id?: string
  contact?: ContactModel
  contact_data?: string
  type?: string
  document_type?: string
  items?: PurchaseItemModel[]
  published_at?: string;
  published_by_id?: string
  published_by?: UserModel
  ref_id?: string
  ref_type?: string
  secondary_ref_id?: string
  secondary_ref_type?: string
  contact_data_parsed?: Record<string, any>
  purchase_ref?: PurchaseModel
  secondary_purchase_ref?: PurchaseModel
  payment_account_id?: string;
  payment_account?: AccountModel;
  purchase_payments: PurchasePaymentModel[]
}


export interface PurchaseItemModel {
  id?: string;
  purchase_id: string;
  purchase: PurchaseModel;
  description: string;
  notes?: string;
  quantity: number;
  unit_price: number;
  total: number;
  discount_percent: number;
  discount_amount: number;
  subtotal_before_disc: number;
  product_id?: string;
  product?: ProductModel;
  variant_id?: string;
  variant?: VariantModel;
  warehouse_id?: string;
  warehouse?: WarehouseModel;
  tax_id?: string;
  tax?: TaxModel;
  total_tax?: number;
  unit_id?: string;
  unit?: UnitModel;
  unit_value?: number;
  is_cost?: boolean;
}


export interface PurchasePaymentModel {
  id?: string;
  payment_date: Date;
  sales_id?: string | null;
  sales?: PurchaseModel;
  amount: number;
  payment_discount: number;
  notes: string;
  company_id?: string | null;
  company?: CompanyModel;
  user_id?: string | null;
  user?: UserModel;
  asset_account_id?: string | null;
  asset_account?: AccountModel;
  is_refund?: boolean;
  payment_method: string;
  payment_method_notes: string;
  
}