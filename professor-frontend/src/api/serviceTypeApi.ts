import { apiClient } from "./client";

/*
API أنواع الخدمات
*/

export const serviceTypeApi = {

  getAll: async () => {
    const res = await apiClient.get("/service-types");
    return res.data;
  },

  create: async (data: any) => {
    const res = await apiClient.post("/service-types", data);
    return res.data;
  }

};