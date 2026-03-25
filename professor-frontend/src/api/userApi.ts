import { apiClient } from "./client";

export const userApi = {

  getAll: async () => {
    const res = await apiClient.get("/users");
    return res.data;
  },

  create: async (data: any) => {
    const res = await apiClient.post("/users", data);
    return res.data;
  }

};