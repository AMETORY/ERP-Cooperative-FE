import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getMerchants = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/list?${queryParams}`, {
    method: "GET",
  });
};

export const getMerchantDetail = async (id: string) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "GET",
  });
};
export const getMerchantProducts = async (
  id: string,
  req: PaginationRequest
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/products?${queryParams}`, {
    method: "GET",
  });
};

export const createMerchant = async (data: any) => {
  return await customFetch("api/v1/merchant/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addProductMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-product`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMerchant = async (id: string) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "DELETE",
  });
};
export const deleteMerchantProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/delete-product`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

export const addUserMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-user`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMerchantUser = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/delete-user`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

export const getMerchantUsers = async (id: string, req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/users?${queryParams}`, {
    method: "GET",
  });
};

export const addMerchantDesk = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-desk`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getMerchantDesk = async (id: string,req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/desk?${queryParams}`, {
    method: "GET",
  });
};

export const updateMerchantDesk = async (
  id: string,
  deskId: string,
  data: any
) => {
  return await customFetch(`api/v1/merchant/${id}/desk/${deskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMerchantDesk = async (id: string, deskId: string) => {
  return await customFetch(`api/v1/merchant/${id}/desk/${deskId}`, {
    method: "DELETE",
  });
};
