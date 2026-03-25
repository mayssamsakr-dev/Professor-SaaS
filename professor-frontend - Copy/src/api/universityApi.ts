import { apiClient } from "./client";

/*
API الخاصة بالجامعات
*/

export const universityApi = {

  /*
  جلب جميع الجامعات
  */
  getAll: async () => {

    const res = await apiClient.get("/universities");
    return res.data;

  },

  /*
  إنشاء جامعة جديدة
  */
  create: async (data: any) => {

    const res = await apiClient.post("/universities", data);
    return res.data;

  }

};