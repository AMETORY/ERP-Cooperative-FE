import { customFetch } from "./baseApi";

export const getPopularProducts = async () => {
  return await customFetch(`api/v1/analytic/popular-product`);
};
export const getMonthlySales = async (year: number) => {
  return await customFetch(`api/v1/analytic/monthly-sales?year=${year}`);
};
export const getMonthlySalesPurchase = async (year: number) => {
  return await customFetch(`api/v1/analytic/monthly-sales-purchase?year=${year}`);
};
export const getWeeklySalesPurchase = async (month: number, year: number) => {
  return await customFetch(`api/v1/analytic/weekly-sales-purchase?month=${month}&year=${year}`);
};
export const getMonthlyPurchase = async (year: number) => {
  return await customFetch(`api/v1/analytic/monthly-purchase?year=${year}`);
};
export const getSalesTimeRange = async (timeRange: string) => {
  return await customFetch(`api/v1/analytic/sales-time-range?time_range=${timeRange}`);
};
export const getPurchaseTimeRange = async (timeRange: string) => {
  return await customFetch(`api/v1/analytic/purchase-time-range?time_range=${timeRange}`);
};
export const getNetWorth = async () => {
  return await customFetch(`api/v1/analytic/net-worth`);
};
export const getCashBankSum = async () => {
  return await customFetch(`api/v1/analytic/cash-bank`);
};
export const getSalesPurchaseList = async () => {
  return await customFetch(`api/v1/analytic/sales-purchase-list`);
};