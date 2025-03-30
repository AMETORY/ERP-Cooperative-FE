import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getJournals = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/journal/list?${queryParams}`);
};

export const getJournalDetail = async (id: string) => {
  return await customFetch(`api/v1/journal/${id}`);
};

export const createJournal = async (data: any) => {
  return await customFetch("api/v1/journal/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateJournal = async (id: string, data: any) => {
  return await customFetch(`api/v1/journal/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addTransactionJournal = async (id: string, data: any) => {
  return await customFetch(`api/v1/journal/${id}/add-transaction`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteJournal = async (id: string) => {
  return await customFetch(`api/v1/journal/${id}`, {
    method: "DELETE",
  });
};
