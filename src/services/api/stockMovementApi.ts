import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getStockMovements = async (req: PaginationRequest) => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(req.page));
    queryParams.set("size", String(req.size));
    if (req.warehouse_id)
      queryParams.set("warehouse_id", String(req.warehouse_id));
    if (req.product_id) queryParams.set("product_id", String(req.product_id));
    if (req.merchant_id) queryParams.set("merchant_id", String(req.merchant_id));
    if (req.search) queryParams.set("search", req.search);
    return await customFetch(`api/v1/stock-movement/list?${queryParams}`, {
      method: "GET",
    });
  };
  
  export const getStockMovement = async (id: string) => {
    return await customFetch(`api/v1/stock-movement/${id}`, {
      method: "GET",
    });
  };
  export const createStockMovement = async (data: any) => {
    return await customFetch("api/v1/stock-movement/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };
  
  export const updateStockMovement = async (id: string, data: any) => {
    return await customFetch(`api/v1/stock-movement/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };
  
  export const deleteStockMovement = async (id: string) => {
    return await customFetch(`api/v1/stock-movement/${id}`, {
      method: "DELETE",
    });
  };
  