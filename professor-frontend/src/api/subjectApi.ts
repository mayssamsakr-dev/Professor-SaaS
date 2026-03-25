import { apiClient } from "./client";

/*
API الخاصة بالمواد
*/

export interface CreateSubjectDto {

  name: string;

  description?: string;

}

export const subjectApi = {

  /*
  جلب جميع المواد
  */
  getAll: async () => {

    const res = await apiClient.get(

      "/subjects"

    );

    return res.data;

  },

  /*
  إنشاء مادة
  */
  create: async (

    data: CreateSubjectDto

  ) => {

    const res = await apiClient.post(

      "/subjects",

      data

    );

    return res.data;

  },

  /*
  تعديل مادة
  */
  update: async (

    id: number,

    data: CreateSubjectDto

  ) => {

    const res = await apiClient.patch(

      `/subjects/${id}`,

      data

    );

    return res.data;

  },

  /*
  حذف مادة
  */
  delete: async (

    id: number

  ) => {

    const res = await apiClient.delete(

      `/subjects/${id}`

    );

    return res.data;

  }

};