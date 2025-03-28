import { customFetch } from "./baseApi";

export const getProvinces = async () => {
  return await customFetch("api/v1/regional/province", {
    method: "GET",
  });
};

export const getRegencies = async (provinceId: string) => {
  return await customFetch(`api/v1/regional/regency?province_id=${provinceId}`, {
    method: "GET",
  });
};

export const getDistricts = async (regencyId: string) => {
  return await customFetch(`api/v1/regional/district?regency_id=${regencyId}`, {
    method: "GET",
  });
};

export const getVillages = async (districtId: string) => {
  return await customFetch(`api/v1/regional/village?district_id=${districtId}`, {
    method: "GET",
  });
};
