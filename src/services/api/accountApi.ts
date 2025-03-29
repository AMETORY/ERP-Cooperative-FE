import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";


export const getChartOfAccounts = async (template: string) => {
  return await customFetch(`api/v1/account/chart-of-accounts?template=${template}`);
};

export const getAccounts = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.type) queryParams.set("type", req.type);
  return await customFetch(`api/v1/account/list?${queryParams}`);
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
