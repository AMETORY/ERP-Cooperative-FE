import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getProductAttributes = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/product-attribute/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const createProductAttribute = async (data: any) => {
  return await customFetch("api/v1/product-attribute/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProductAttribute = async (id: string, data: any) => {
  return await customFetch(`api/v1/product-attribute/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProductAttribute = async (id: string) => {
  return await customFetch(`api/v1/product-attribute/${id}`, {
    method: "DELETE",
  });
};
