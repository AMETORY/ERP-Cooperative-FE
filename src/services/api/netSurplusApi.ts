import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const createNetSurplus = async (data: any) => {
  return await customFetch(`api/v1/cooperative/net-surplus/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getNetSurplus = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/cooperative/net-surplus/list?${queryParams}`, {
    method: "GET",
  });
};

export const getNetSurplusDetail = async (netSurplusId: string) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}`, {
    method: "GET",
  });
};

export const deleteNetSurplus = async (netSurplusId: string) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}`, {
    method: "DELETE",
  });
};

export const updateNetSurplus = async (netSurplusId: string, data: any) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const disbursementNetSurplus = async (netSurplusId: string, data: any) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}/disbursement`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const createNetSurplusPayment = async (netSurplusId: string, data: any) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}/payment`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const approvalNetSurplus = async (netSurplusId: string, data: {approval_status: string, remarks: string}) => {
  return await customFetch(`api/v1/cooperative/net-surplus/${netSurplusId}/approval`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
