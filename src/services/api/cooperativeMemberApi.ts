import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getCooperativeMembers = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/cooperative/member/list?${queryParams}`, {
    method: "GET",
  });
};