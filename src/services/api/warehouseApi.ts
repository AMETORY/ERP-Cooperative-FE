import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getWarehouses = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/warehouse/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const getWarehouseDetail = async (id: string) => {
  return await customFetch(`api/v1/warehouse/${id}`, {
    method: "GET",
  });
};

export const createWarehouse = async (data: any) => {
  return await customFetch("api/v1/warehouse/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateWarehouse = async (id: string, data: any) => {
  return await customFetch(`api/v1/warehouse/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteWarehouse = async (id: string) => {
  return await customFetch(`api/v1/warehouse/${id}`, {
    method: "DELETE",
  });
};
