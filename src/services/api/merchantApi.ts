import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getMerchants = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/list?${queryParams}`, {
    method: "GET",
  });
};

export const getMerchantDetail = async (id: string) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "GET",
  });
};
export const getMerchantProducts = async (
  id: string,
  req: PaginationRequest
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/products?${queryParams}`, {
    method: "GET",
  });
};

export const createMerchant = async (data: any) => {
  return await customFetch("api/v1/merchant/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addProductMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-product`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const getProductsMerchantStation = async (id: string, stationId: string) => {
  return await customFetch(`api/v1/merchant/${id}/station/${stationId}/product`, {
    method: "GET",
  });
};
export const addProductMerchantStation = async (id: string, stationId: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/station/${stationId}/add-product`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const deleteProductMerchantStation = async (id: string, stationId: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/station/${stationId}/delete-product`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

export const deleteMerchant = async (id: string) => {
  return await customFetch(`api/v1/merchant/${id}`, {
    method: "DELETE",
  });
};
export const deleteMerchantProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/delete-product`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

export const addUserMerchant = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-user`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMerchantUser = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/delete-user`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

export const getMerchantUsers = async (id: string, req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/users?${queryParams}`, {
    method: "GET",
  });
};

export const addMerchantDesk = async (id: string, data: any) => {
  return await customFetch(`api/v1/merchant/${id}/add-desk`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getMerchantDesk = async (id: string,req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/desk?${queryParams}`, {
    method: "GET",
  });
};

export const updateMerchantDesk = async (
  id: string,
  deskId: string,
  data: any
) => {
  return await customFetch(`api/v1/merchant/${id}/desk/${deskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMerchantDesk = async (id: string, deskId: string) => {
  return await customFetch(`api/v1/merchant/${id}/desk/${deskId}`, {
    method: "DELETE",
  });
};


export const getLayouts = async (id: string, req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/layouts?${queryParams}`, {
    method: "GET",
  });
};
export const createLayout = async (id: string, data: any) => {

  return await customFetch(`api/v1/merchant/${id}/add-layout`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const getLayoutDetail = async (id: string, layoutId: any) => {
  return await customFetch(`api/v1/merchant/${id}/layout/${layoutId}`, {
    method: "GET",
  });
};

export const updateLayout = async (id: string, layoutId: string, data: any) => {

  return await customFetch(`api/v1/merchant/${id}/update-layout/${layoutId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};



export const getStations = async (id: string, req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/merchant/${id}/station?${queryParams}`, {
    method: "GET",
  });
};
export const createStation = async (id: string, data: any) => {

  return await customFetch(`api/v1/merchant/${id}/station`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const getStationDetail = async (id: string, layoutId: any) => {
  return await customFetch(`api/v1/merchant/${id}/station/${layoutId}`, {
    method: "GET",
  });
};

export const updateStation = async (id: string, layoutId: string, data: any) => {

  return await customFetch(`api/v1/merchant/${id}/station/${layoutId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const deleteStation = async (id: string, stationId: string) => {
  return await customFetch(`api/v1/merchant/${id}/station/${stationId}`, {
    method: "DELETE",
  });
};
