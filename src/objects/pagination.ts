export interface PaginationRequest {
    page: number;
    size: number;
    search?: string;
    status?: string;
    type?: string;
    category?: string;
    cashflow_group?: string;
    cashflow_sub_group?: string;
    project_id?: string;
    account_id?: string;
    team_id?: string;
    doc_type?: string;
    start_date?: string;
    end_date?: string;
    warehouse_id?: string;
    product_id?: string;
    merchant_id?: string;
    is_tax?: boolean;
    is_customer?: boolean;
    is_vendor?: boolean;
    is_supplier?: boolean;
  }
  
  

export interface PaginationResponse {
    page: number;
    size: number;
    max_page?: number;
    total_pages: number;
    total: number;
    last?: boolean;
    first?: boolean;
    visible?: number;
  }