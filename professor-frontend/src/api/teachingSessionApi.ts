import { apiClient } from "./client";

/*
API الحصص الدراسية
*/

export interface CreateTeachingSessionDto {

  date: string;

  quantity: number;

  universitySubjectId: number;

}

export const teachingSessionApi = {

  /*
  جميع الحصص
  */
  getAll: async () => {

    const res =
      await apiClient.get(
        "/teaching-sessions"
      );

    return res.data;

  },

  /*
  إنشاء session
  */
  create: async (

    data: CreateTeachingSessionDto

  ) => {

    const res =
      await apiClient.post(

        "/teaching-sessions",

        data

      );

    return res.data;

  },

  /*
  تعديل session
  */
  update: async (

    id: number,

    data: CreateTeachingSessionDto

  ) => {

    const res =
      await apiClient.patch(

        `/teaching-sessions/${id}`,

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

        `/teaching-sessions/${id}`

      );

    return res.data;

  }

};