import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getUnits = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/unit/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const createUnit = async (data: any) => {
  return await customFetch("api/v1/unit/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUnit = async (id: string, data: any) => {
  return await customFetch(`api/v1/unit/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUnit = async (id: string) => {
  return await customFetch(`api/v1/unit/${id}`, {
    method: "DELETE",
  });
};
