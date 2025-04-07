import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getSalesReturns = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/sales-return/list?${queryParams}`, {
    method: "GET",
  });
};

export const getSalesReturn = async (id: string) => {
  return await customFetch(`api/v1/sales-return/${id}`, {
    method: "GET",
  });
};

export const createSalesReturn = async (data: any) => {
  return await customFetch("api/v1/sales-return/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateSalesReturn = async (id: string, data: any) => {
  return await customFetch(`api/v1/sales-return/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const releaseSalesReturn = async (id: string, data: any) => {
  return await customFetch(`api/v1/sales-return/${id}/release`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const addSalesReturnItem = async (id: string, itemId: string, data: any) => {
  return await customFetch(`api/v1/sales-return/${id}/add-item`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateSalesReturnItem = async (id: string, itemId: string, data: any) => {
  return await customFetch(`api/v1/sales-return/${id}/update-item/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const deleteSalesReturnItem = async (id: string, itemId: string) => {
  return await customFetch(`api/v1/sales-return/${id}/delete-item/${itemId}`, {
    method: "DELETE",
  });
};

export const deleteSalesReturn = async (id: string) => {
  return await customFetch(`api/v1/sales-return/${id}`, {
    method: "DELETE",
  });
};




