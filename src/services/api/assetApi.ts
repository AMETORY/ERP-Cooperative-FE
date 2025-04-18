import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getAssets = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/asset/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};
export const getAssetDetail = async (id: string) => {
  return await customFetch(`api/v1/asset/${id}`, {
    method: "GET",
  });
};
export const getAssetPreview = async (id: string, mode: string, is_monthly: boolean) => {
  if (mode === "") {
    return {
      data: []
    }
  }
  return await customFetch(`api/v1/asset/${id}/preview?mode=${mode}&is_monthly=${is_monthly ? "true" : "false"}`, {
    method: "GET",
  });
};
export const createAsset = async (data: any) => {
  return await customFetch("api/v1/asset/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateAsset = async (id: string, data: any) => {
  return await customFetch(`api/v1/asset/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const activateAsset = async (id: string, data: any) => {
  return await customFetch(`api/v1/asset/${id}/activate`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const depreciationApplyAsset = async (id: string, itemId: any) => {
  return await customFetch(`api/v1/asset/${id}/apply/${itemId}`, {
    method: "PUT",
  });
};

export const deleteAsset = async (id: string) => {
  return await customFetch(`api/v1/asset/${id}`, {
    method: "DELETE",
  });
};
