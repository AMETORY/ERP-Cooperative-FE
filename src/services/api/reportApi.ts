import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const cogsReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/cogs", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const profitLossReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/profit-loss", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const balanceSheetReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/balance-sheet", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const capitalChangeReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/capital-change", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const cashFlowReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/cash-flow", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const trialBalanceReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/trial-balance", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
export const getClosingBooks = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.status) queryParams.set("status", req.status);
  return await customFetch(`api/v1/report/closing-book?${queryParams}`);
};

export const createClosingBook = async (data: any) => {
  return await customFetch("api/v1/report/closing-book", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getClosingBookDetail = async (id: string) => {
  return await customFetch(`api/v1/report/closing-book/${id}`);
};
export const deleteClosingBook = async (id: string) => {
  return await customFetch(`api/v1/report/closing-book/${id}`, {
    method: "DELETE",
  });
};

export const generateClosingBook = async (id: string, data: any) => {
  return await customFetch(`api/v1/report/closing-book/${id}/generate`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const getProductSalesCustomers = async (data: any) => {
  let params =  {
    method: "POST",
    body: JSON.stringify(data),
  }
 
  return await customFetch(`api/v1/report/product-sales-customers`, {
    ...params,
    isBlob: data.is_download
  },);
};


export const getAccountReceivableLedger = async (data: any) => {
  let params =  {
    method: "POST",
    body: JSON.stringify(data),
  }
 
  return await customFetch(`api/v1/report/account-receivable-ledger`, {
    ...params,
    isBlob: data.is_download
  },);
};
export const getAccountPayableLedger = async (data: any) => {
  let params =  {
    method: "POST",
    body: JSON.stringify(data),
  }
 
  return await customFetch(`api/v1/report/account-payable-ledger`, {
    ...params,
    isBlob: data.is_download
  },);
};
