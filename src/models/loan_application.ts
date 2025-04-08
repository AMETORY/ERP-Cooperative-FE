import { CooperativeMemberModel } from "./cooperative_member";
import { TransactionModel } from "./transaction";

export interface LoanApplicationModel {
  id?: string;
  company_id?: string;
  user_id?: string;
  member_id?: string;
  member?: CooperativeMemberModel;
  loan_number: string;
  loan_amount: number;
  loan_purpose: string;
  loan_type?: string;
  interest_rate?: number;
  expected_profit_rate?: number;
  projected_profit?: number;
  submission_date: Date;
  repayment_term?: number;
  status: string;
  approved_by?: string;
  disbursement_date?: Date;
  remarks?: string;
  profit_type?: string;
  admin_fee: number;
  account_receivable_id?: string;
  account_income_id?: string;
  account_admin_fee_id?: string;
  account_asset_id?: string;
  data?: string;
  preview?: { [key: string]: InstallmentDetail[] };
  term_condition?: string;
  payments?: InstallmentPayment[];
  last_payment?: InstallmentPayment;
  transactions?: TransactionModel[];
  installments?: InstallmentDetail[];
  net_surplus_id?: string;
}

export interface InstallmentPayment {
  id?: string;
  loan_application_id?: string; // ID of the loan this payment belongs to
  loan_application?: LoanApplicationModel; // Loan application associated with the payment
  member_id?: string; // ID of the member making the payment
  installment_no: number; // Installment number (e.g., 1, 2, 3, ...)
  payment_date: Date; // Date of payment
  principal_paid: number; // Amount paid towards the principal
  profit_paid: number; // Amount paid as profit (interest or share)
  admin_fee_paid: number; // Administrative fee paid (if any)
  total_paid: number; // Total payment made (sum of principal, profit, admin fee)
  remaining_loan: number; // Remaining loan balance after the payment
  payment_amount: number;
  remarks?: string; // Additional remarks or notes (optional)
}

export interface InstallmentDetail {
  installment_number: number; // Nomor cicilan
  principal_amount: number; // Angsuran pokok
  interest_amount: number; // Bunga per cicilan
  admin_fee: number; // Biaya administrasi
  total_paid: number; // Total pembayaran (pokok + bunga + admin)
  remaining_loan: number; // Sisa pinjaman setelah cicilan
}
