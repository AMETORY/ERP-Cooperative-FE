import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getTaxes = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/tax/list?${queryParams}`);
};

export const getTaxDetail = async (id: string) => {
  return await customFetch(`api/v1/tax/${id}`);
};

export const createTax = async (data: any) => {
  return await customFetch("api/v1/tax/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTax = async (id: string, data: any) => {
  return await customFetch(`api/v1/tax/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTax = async (id: string) => {
  return await customFetch(`api/v1/tax/${id}`, {
    method: "DELETE",
  });
};
