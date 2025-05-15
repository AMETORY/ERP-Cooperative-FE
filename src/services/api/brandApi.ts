import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getBrands = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/brand/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const getBrandDetail = async (id: string) => {
  return await customFetch(`api/v1/brand/${id}`, {
    method: "GET",
  });
};


export const createBrand = async (data: any) => {
  return await customFetch("api/v1/brand/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateBrand = async (id: string, data: any) => {
  return await customFetch(`api/v1/brand/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteBrand = async (id: string) => {
  return await customFetch(`api/v1/brand/${id}`, {
    method: "DELETE",
  });
};
