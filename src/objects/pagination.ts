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
    start_date?: string | null;
    end_date?: string | null;
    warehouse_id?: string;
    product_id?: string;
    merchant_id?: string;
    is_tax?: boolean;
    is_customer?: boolean;
    is_vendor?: boolean;
    is_supplier?: boolean;
    is_published?: boolean;
    is_profit_loss_account?: boolean;
    is_profit_loss_closing_account?: boolean;
    is_net_surplus?: boolean;
    is_cogs_closing_account?: boolean;
    is_cogs_account?: boolean;
    is_inventory_account?: boolean;
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