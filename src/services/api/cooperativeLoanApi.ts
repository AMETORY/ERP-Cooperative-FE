import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const createLoan = async (data: any) => {
  return await customFetch(`api/v1/cooperative/loan/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getLoans = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/cooperative/loan/list?${queryParams}`, {
    method: "GET",
  });
};

export const getLoanDetail = async (loanId: string) => {
  return await customFetch(`api/v1/cooperative/loan/${loanId}`, {
    method: "GET",
  });
};

export const deleteLoan = async (loanId: string) => {
  return await customFetch(`api/v1/cooperative/loan/${loanId}`, {
    method: "DELETE",
  });
};

export const updateLoan = async (loanId: string, data: any) => {
  return await customFetch(`api/v1/cooperative/loan/${loanId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
