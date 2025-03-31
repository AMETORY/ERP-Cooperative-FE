import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getSales = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.is_customer) queryParams.set("is_customer", "1");
  if (req.is_vendor) queryParams.set("is_vendor", "1");
  if (req.is_supplier) queryParams.set("is_supplier", "1");
  return await customFetch(`api/v1/sales/list?${queryParams}`, {
    method: "GET",
  });
};

export const getSalesDetail = async (id: string) => {
  return await customFetch(`api/v1/sales/${id}`);
};

export const createSales = async (sales: any) => {
  return await customFetch("api/v1/sales/create", {
    method: "POST",
    body: JSON.stringify(sales),
  });
};

export const updateSales = async (id: string, sales: any) => {
  return await customFetch(`api/v1/sales/${id}`, {
    method: "PUT",
    body: JSON.stringify(sales),
  });
};


export const deleteSales = async (id: string) => {
  await customFetch(`api/v1/sales/${id}`);
};
