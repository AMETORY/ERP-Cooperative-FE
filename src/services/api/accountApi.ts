import { customFetch } from "./baseApi";


export const getChartOfAccounts = async (template: string) => {
  return await customFetch(`api/v1/account/chart-of-accounts?template=${template}`);
};