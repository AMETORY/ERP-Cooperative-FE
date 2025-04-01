import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getPriceCategories = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/price-category?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const createPriceCategory = async (data: any) => {
  return await customFetch("api/v1/price-category", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updatePriceCategory = async (id: string, data: any) => {
  return await customFetch(`api/v1/price-category/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deletePriceCategory = async (id: string) => {
  return await customFetch(`api/v1/price-category/${id}`, {
    method: "DELETE",
  });
};
