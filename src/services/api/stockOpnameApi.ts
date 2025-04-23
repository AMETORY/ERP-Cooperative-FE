import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getStockOpnames = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/stock-opname/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};
export const getStockOpnameDetail = async (id: string) => {
  return await customFetch(`api/v1/stock-opname/${id}`, {
    method: "GET",
  });
};

export const createStockOpname = async (data: any) => {
  return await customFetch("api/v1/stock-opname/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateStockOpname = async (id: string, data: any) => {
  return await customFetch(`api/v1/stock-opname/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addItemStockOpname = async (id: string, data: any) => {
  return await customFetch(`api/v1/stock-opname/${id}/add-item`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const updateItemStockOpname = async (id: string, detailId: string, data: any) => {
  return await customFetch(`api/v1/stock-opname/${id}/update-item/${detailId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const completeStockOpname = async (id: string, data: any) => {
  return await customFetch(`api/v1/stock-opname/${id}/complete`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const deleteItemStockOpname = async (id: string, detailId: string) => {
  return await customFetch(`api/v1/stock-opname/${id}/delete-item/${detailId}`, {
    method: "DELETE",
  });
};

export const deleteStockOpname = async (id: string) => {
  return await customFetch(`api/v1/stock-opname/${id}`, {
    method: "DELETE",
  });
};
