import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const createActivity = async (data: any) => {
  return await customFetch(`api/v1/user/activity`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const checkPointFinish = async (activity_id: string, data: any) => {
  return await customFetch(`api/v1/user/activity/${activity_id}/finish`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const clockIn = async (data: any) => {
  return await customFetch(`api/v1/user/clock-in`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const clockOut = async (data: any) => {
  return await customFetch(`api/v1/user/clock-out`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const getLastClockin = async (
  threshold_duration: number,
  threshold_unit: string
) => {
  return await customFetch(`api/v1/user/last-clock-in`, {
    method: "POST",
    body: JSON.stringify({ threshold_duration, threshold_unit }),
  });
};


export const getActivities = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/user/activities?${queryParams}`, {});
};


export const getUser = async (id: string) => {
  return await customFetch(`api/v1/user/${id}`, {});
};

export const getUsers = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(`api/v1/user/list?${queryParams}`, {});
};
