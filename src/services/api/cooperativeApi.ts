import { customFetch } from "./baseApi";

export const updateCooperativeSetting = async (data: any) => {
  return await customFetch(`api/v1/cooperative/setting`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
