import { apiClient } from "./client";

/*
API الأنشطة الإضافية
*/

export interface CreateServiceActivityDto {

  date: string;

  quantity?: number;

  unitRate: number;

  serviceTypeId: number;

  universityId: number;

}

export const serviceActivityApi = {

  /*
  جميع الأنشطة
  */
  getAll: async () => {

    const res =
      await apiClient.get(
        "/service-activities"
      );

    return res.data;

  },

  /*
  إنشاء activity
  */
  create: async (

    data: CreateServiceActivityDto

  ) => {

    const res =
      await apiClient.post(

        "/service-activities",

        data

      );

    return res.data;

  },

  /*
  تعديل
  */
  update: async (

    id: number,

    data: CreateServiceActivityDto

  ) => {

    const res =
      await apiClient.patch(

        `/service-activities/${id}`,

        data

      );

    return res.data;

  },

  /*
  حذف soft delete
  */
  delete: async (

    id: number

  ) => {

    const res =
      await apiClient.delete(

        `/service-activities/${id}`

      );

    return res.data;

  }

};