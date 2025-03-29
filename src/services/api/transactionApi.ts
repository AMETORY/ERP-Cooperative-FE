import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getTransactions = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.type) queryParams.set("type", req.type);
  if (req.account_id) queryParams.set("account_id", req.account_id);
  return await customFetch(`api/v1/transaction/list?${queryParams}`);
};

export const getTransactionDetail = async (id: string) => {
  return await customFetch(`api/v1/transaction/${id}`);
};

export const createTransaction = async (data: any) => {
  return await customFetch("api/v1/transaction/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTransaction = async (id: string, data: any) => {
  return await customFetch(`api/v1/transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTransaction = async (id: string) => {
  return await customFetch(`api/v1/transaction/${id}`, {
    method: "DELETE",
  });
};
