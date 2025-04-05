import { customFetch } from "./baseApi";

export const cogsReport = async (start_date: Date, end_date: Date) => {
  return await customFetch("api/v1/report/cogs", {
    method: "POST",
    body: JSON.stringify({ start_date, end_date }),
  });
};
