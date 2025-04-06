import { AccountModel } from "./account";
import { CompanyModel } from "./company";
import { ContactModel } from "./contact";
import { ProductPriceModel } from "./price";
import { ProductModel, VariantModel } from "./product";
import { TaxModel } from "./tax";
import { UnitModel } from "./unit";
import { UserModel } from "./user";
import { WarehouseModel } from "./warehouse";

export interface SalesModel {
  id?: string;
  sales_number?: string;
  code?: string;
  description?: string;
  notes?: string;
  total?: number;
  subtotal?: number;
  paid?: number;
  total_before_tax?: number;
  total_before_disc?: number;
  total_tax?: number;
  total_discount?: number;
  status?: string;
  stock_status?: string;
  sales_date?: string;
  due_date?: string;
  discount_due_date?: string;
  payment_terms?: string;
  payment_terms_code?: string;
  term_condition?: string;
  company_id?: string;
  company?: CompanyModel;
  contact_id?: string;
  contact?: ContactModel;
  contact_data?: string;
  delivery_id?: string;
  delivery?: ContactModel;
  delivery_data?: string;
  type?: string;
  ref_id?: string;
  ref_type?: string;
  document_type?: string;
  items?: SalesItemModel[];
  published_at?: string;
  taxes?: TaxModel[];
  is_compound?: boolean;
  tax_breakdown?: string;
  contact_data_parsed?: ContactModel;
  delivery_data_parsed?: ContactModel;
  tax_breakdown_parsed?: TaxModel[];
  payment_account_id?: string;
  payment_account?: AccountModel;
  sales_payments?: SalesPaymentModel[]
}

export interface SalesItemModel {
  id?: string;
  sales_id?: string | null;
  sales: SalesModel;
  description: string;
  notes?: string;
  quantity: number;
  unit_price: number;
  total: number;
  sub_total: number;
  discount_percent: number;
  discount_amount: number;
  subtotal_before_disc: number;
  product_id?: string;
  product?: ProductModel;
  variant_id?: string;
  variant?: VariantModel;
  warehouse_id?: string;
  warehouse?: WarehouseModel;
  sale_account_id?: string;
  sale_account?: AccountModel;
  asset_account_id?: string;
  asset_account?: AccountModel;
  tax_id?: string;
  tax?: TaxModel;
  total_tax: number;
  is_editing?: boolean;
  availablePrices?: { id: string; name: string; prices: ProductPriceModel[] }[];
  unit?: UnitModel;
  unit_id?: string;
  unit_value?: number;
  sales_payments: SalesPaymentModel[]
}
export interface SalesPaymentModel {
  id?: string;
  payment_date: Date;
  sales_id?: string | null;
  sales?: SalesModel;
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

