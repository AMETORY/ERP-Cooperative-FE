import { customFetch } from "./baseApi";

export const getPaymentTerms = async () => {
  return await customFetch(`api/v1/payment-term/list`);
};
export const getPaymentTermGroups = async () => {
  return await customFetch(`api/v1/payment-term/group`);
};
