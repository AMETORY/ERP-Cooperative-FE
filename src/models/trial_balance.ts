import { CompanyModel } from "./company"

export interface TrialBalanceReportModel {
  company_id: string | null
  company: CompanyModel
  start_date: Date
  end_date: Date
  trial_balance: TrialBalanceRow[]
  adjustment: TrialBalanceRow[]
  balance_sheet: TrialBalanceRow[]
}

export interface TrialBalanceRow {
  id: string
  name: string
  code: string
  debit: number
  credit: number
  balance: number
}

