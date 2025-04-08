import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getSavings = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/cooperative/saving/list?${queryParams}`, {
    method: "GET",
  });
};

export const createSaving = async (data: any) => {
  return await customFetch(`api/v1/cooperative/saving/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


export const deleteSaving = async (id: string) => {
  return await customFetch(`api/v1/cooperative/saving/${id}`, {
    method: "DELETE",
  });
};
