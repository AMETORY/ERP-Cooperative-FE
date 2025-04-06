import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getPurchases = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  if (req.is_customer) queryParams.set("is_customer", "1");
  if (req.is_vendor) queryParams.set("is_vendor", "1");
  if (req.is_supplier) queryParams.set("is_supplier", "1");
  if (req.is_published) queryParams.set("is_published", "1");
  if (req.doc_type) queryParams.set("doc_type", req.doc_type);
  return await customFetch(`api/v1/purchase/list?${queryParams}`, {
    method: "GET",
  });
};

export const getPurchaseDetail = async (id: string) => {
  return await customFetch(`api/v1/purchase/${id}`);
};
export const getPurchaseItems= async (id: string) => {
  return await customFetch(`api/v1/purchase/${id}/items`);
};

export const createPurchase = async (purchase: any) => {
  return await customFetch("api/v1/purchase/create", {
    method: "POST",
    body: JSON.stringify(purchase),
  });
};

export const updatePurchase = async (id: string, purchase: any) => {
  return await customFetch(`api/v1/purchase/${id}`, {
    method: "PUT",
    body: JSON.stringify(purchase),
  });
};

export const paymentPurchase = async (id: string, data: any) => {
  return await customFetch(`api/v1/purchase/${id}/payment`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const publishPurchase = async (id: string) => {
    return await customFetch(`api/v1/purchase/${id}/publish`, {
      method: "PUT",
    });
  };

export const postInvoice = async (id: string, data: any) => {
  return await customFetch(`api/v1/purchase/${id}/post`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const purchaseAddItem = async (id: string, data: any) => {
  return await customFetch(`api/v1/purchase/${id}/add-item`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const purchaseDeleteItem = async (id: string, itemId: any) => {
  return await customFetch(`api/v1/purchase/${id}/delete-item/${itemId}`, {
    method: "DELETE",
  });
};
export const purchaseUpdateItem = async (id: string, itemId: string, data: any) => {
  return await customFetch(`api/v1/purchase/${id}/update-item/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const deletePurchase = async (id: string) => {
  await customFetch(`api/v1/purchase/${id}`);
};
