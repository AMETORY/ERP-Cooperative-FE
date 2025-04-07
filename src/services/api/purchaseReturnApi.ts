import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getPurchaseReturns = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/purchase-return/list?${queryParams}`, {
    method: "GET",
  });
};

export const getPurchaseReturn = async (id: string) => {
  return await customFetch(`api/v1/purchase-return/${id}`, {
    method: "GET",
  });
};

export const createPurchaseReturn = async (data: any) => {
  return await customFetch("api/v1/purchase-return/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updatePurchaseReturn = async (id: string, data: any) => {
  return await customFetch(`api/v1/purchase-return/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const releasePurchaseReturn = async (id: string, data: any) => {
  return await customFetch(`api/v1/purchase-return/${id}/release`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const addPurchaseReturnItem = async (id: string, itemId: string, data: any) => {
  return await customFetch(`api/v1/purchase-return/${id}/add-item`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updatePurchaseReturnItem = async (id: string, itemId: string, data: any) => {
  return await customFetch(`api/v1/purchase-return/${id}/update-item/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const deletePurchaseReturnItem = async (id: string, itemId: string) => {
  return await customFetch(`api/v1/purchase-return/${id}/delete-item/${itemId}`, {
    method: "DELETE",
  });
};

export const deletePurchaseReturn = async (id: string) => {
  return await customFetch(`api/v1/purchase-return/${id}`, {
    method: "DELETE",
  });
};




