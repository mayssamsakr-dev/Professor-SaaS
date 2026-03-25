import { apiClient } from "./client";

/*
Reports API
*/

export const reportApi = {

getSummary: async (query = "") => {
  const res = await apiClient.get(`/reports/summary${query}`);
  return res.data;
},

getByUniversity: async (query = "") => {
  const res = await apiClient.get(`/reports/by-university${query}`);
  return res.data;
},

getMonthly: async (query = "") => {
  const res = await apiClient.get(`/reports/monthly${query}`);
  return res.data;
}

};