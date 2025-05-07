import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";


export const getRoles = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/role/list?${queryParams}`);
};

export const getPermissions = async () => {
  return await customFetch(`api/v1/role/permissions`);
};


export const deleteRole = async (id: string) => {
  return await customFetch(`api/v1/role/${id}`, {
    method: "DELETE",
  });
};
