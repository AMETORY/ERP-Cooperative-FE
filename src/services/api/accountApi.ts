import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";


export const getChartOfAccounts = async (template: string) => {
  return await customFetch(`api/v1/account/chart-of-accounts?template=${template}`);
};
export const getAccountTypes = async () => {
  return await customFetch(`api/v1/account/account-types`);
};
export const getCashflowsubgroups = async () => {
  return await customFetch(`api/v1/account/cashflow-subgroups`);
};
export const defaultCashflowsubgroups = async () => {
  return await customFetch(`api/v1/account/default-subgroups`);
};
export const getAccountCode = async (type: string) => {
  return await customFetch(`api/v1/account/get-code?type=${type}`);
};

export const getAccounts = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.type) queryParams.set("type", req.type);
  if (req.category) queryParams.set("category", req.category);
  if (req.cashflow_group) queryParams.set("cashflow_group", req.cashflow_group);
  if (req.cashflow_sub_group) queryParams.set("cashflow_sub_group", req.cashflow_sub_group);
  if (req.is_tax) queryParams.set("is_tax", "1");
  if (req.is_profit_loss_account) queryParams.set("is_profit_loss_account", "1");
  if (req.is_profit_loss_closing_account) queryParams.set("is_profit_loss_closing_account", "1");
  if (req.is_cogs_closing_account) queryParams.set("is_cogs_closing_account", "1");
  if (req.is_cogs_account) queryParams.set("is_cogs_account", "1");
  if (req.is_inventory_account) queryParams.set("is_inventory_account", "1");
  if (req.is_net_surplus) queryParams.set("is_net_surplus", "1");
  return await customFetch(`api/v1/account/list?${queryParams}`);
};
export const getAccountReport = async (accountId: string, req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.type) queryParams.set("type", req.type);
  if (req.start_date) queryParams.set("start_date", req.start_date);
  if (req.end_date) queryParams.set("end_date", req.end_date);
  return await customFetch(`api/v1/account/${accountId}/report?${queryParams}`);
};

export const getAccountDetail = async (id: string) => {
  return await customFetch(`api/v1/account/${id}`);
};

export const createAccount = async (data: any) => {
  return await customFetch('api/v1/account/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAccount = async (id: string, data: any) => {
  return await customFetch(`api/v1/account/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAccount = async (id: string) => {
  return await customFetch(`api/v1/account/${id}`, {
    method: 'DELETE',
  });
};
