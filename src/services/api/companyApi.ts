import { customFetch } from "./baseApi";

export const getSectors = async () => {
  return await customFetch(`api/v1/company/sectors`);
};
export const getCategories = async (sectorId: string) => {
  return await customFetch(`api/v1/company/categories?sector_id=${sectorId}`);
};

export const createCompany = async (companyData: {
  name: string;
  address: string;
  email: string;
  phone: string;
  sector_id: string;
  company_category_id: string;
  is_islamic: boolean;
  province_id: string;
  regency_id: string;
  district_id: string;
  village_id: string;
  zip_code: string;
  is_cooperation: boolean;
  accounts: any[];
}) => {
  return await customFetch(`api/v1/company/create`, {
    method: "POST",
    body: JSON.stringify(companyData),
  });
};
