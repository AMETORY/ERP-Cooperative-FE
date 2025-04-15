import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getProducts = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/product/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};
export const getProductsPending = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/product/status/pending?${queryParams}`,
    {
      method: "GET",
    }
  );
};

export const getProduct = async (id: string) => {
  return await customFetch(`api/v1/product/${id}`, {
    method: "GET",
  });
};
export const getProductStock = async (id: string, warehouseId: string) => {
  return await customFetch(`api/v1/product/${id}/stock/${warehouseId}`, {
    method: "GET",
  });
};
export const createProduct = async (data: any) => {
  return await customFetch("api/v1/product/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/product/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addTagProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/product/${id}/add-tag`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addTagVariant = async (productId: string, id: string, data: any) => {
  return await customFetch(`api/v1/product/${productId}/variant/${id}/add-tag`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const addPriceProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/product/${id}/price`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProduct = async (id: string) => {
  return await customFetch(`api/v1/product/${id}`, {
    method: "DELETE",
  });
};

export const deleteProductPrice = async (id: string, priceId: string) => {
  return await customFetch(`api/v1/product/${id}/price/${priceId}`, {
    method: "DELETE",
  });
};
export const deleteProductUnit = async (id: string, priceId: string) => {
  return await customFetch(`api/v1/product/${id}/unit/${priceId}`, {
    method: "DELETE",
  });
};
export const deleteProductImage = async (id: string, imageId: string) => {
  return await customFetch(`api/v1/product/${id}/image/${imageId}`, {
    method: "DELETE",
  });
};


export const createProductVariant = async (productId: string, data: any) => {
  return await customFetch(`api/v1/product/${productId}/variant`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const addProductUnit = async (productId: string, data: any) => {
  return await customFetch(`api/v1/product/${productId}/unit`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getProductVariants = async (productId: string) => {
  return await customFetch(`api/v1/product/${productId}/variant`, {
    method: "GET",
  });
};

export const updateProductVariant = async (productId: string, variantId: string, data: any) => {
  return await customFetch(`api/v1/product/${productId}/variant/${variantId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProductVariant = async (productId: string, variantId: string) => {
  return await customFetch(`api/v1/product/${productId}/variant/${variantId}`, {
    method: "DELETE",
  });
};


export const getProductRecommendations = async () => {
  return await customFetch(`api/v1/product/recommendation`, {
    method: "GET",
  });
};

export const addProductRecommendation = async ( data: any) => {
  return await customFetch(`api/v1/product/recommendation`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};



export const addPopularProduct = async (data: any) => {
  return await customFetch("api/v1/product/popular", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deletePopularProduct = async (id: string) => {
  return await customFetch(`api/v1/product/popular/${id}`, {
    method: "DELETE",
  });
};

// export const getPopularProducts = async () => {
//   return await customFetch("api/v1/product/popular", {
//     method: "GET",
//   });
// };

export const updatePopularProduct = async (id: string, data: any) => {
  return await customFetch(`api/v1/product/popular/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};



export const addDiscount = async (productId: string, data: any) => {
  return await customFetch(`api/v1/product/${productId}/discount`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const deleteDiscount = async (productId: string, discountId: string) => {
  return await customFetch(`api/v1/product/${productId}/discount/${discountId}`, {
    method: "DELETE",
  });
};

export const getActiveDiscounts = async (productId: string) => {
  return await customFetch(`api/v1/product/${productId}/discount`, {
    method: "GET",
  });
};
export const getDiscounts = async (productId: string) => {
  return await customFetch(`api/v1/product/${productId}/discount`, {
    method: "GET",
  });
};

export const getBestDealByPercentage = async () => {
  return await customFetch("api/v1/product/best-deal/percentage", {
    method: "GET",
  });
};

export const getBestDealByAmount = async () => {
  return await customFetch("api/v1/product/best-deal/amount", {
    method: "GET",
  });
};

export const getBestDealByDiscountedPrice = async () => {
  return await customFetch("api/v1/product/best-deal/discounted-price", {
    method: "GET",
  });
};

export const updateDiscount = async (id: string, data: any) => {
  return await customFetch(`api/v1/product/discount/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deactivateDiscount = async (id: string) => {
  return await customFetch(`api/v1/product/discount/${id}`, {
    method: "DELETE",
  });
};


export const getTags = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/tag?${queryParams}`, {
    method: "GET",
  });
};
export const updateTag = async (id: string, data: any) => {
  return await customFetch(`api/v1/tag/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTag = async (id: string) => {
  return await customFetch(`api/v1/tag/${id}`, {
    method: "DELETE",
  });
};





export const countPendingProducts = async () => {
  return await customFetch(`api/v1/product/count-pending`, {
    method: "GET",
  });
};