import { apiClient } from "./client";

/*
API ربط الجامعة بالمادة
*/

export interface CreateUniversitySubjectDto {

  universityId: number;

  subjectId: number;

  ratePerSession: number;

}

export const universitySubjectApi = {

  /*
  جميع العلاقات
  */
  getAll: async () => {

    const res =
      await apiClient.get(
        "/university-subjects"
      );

    return res.data;

  },

  /*
  حسب جامعة
  مفيد لاحقاً في TeachingSession
  */
  getByUniversity: async (

    universityId: number

  ) => {

    const res =
      await apiClient.get(

        `/university-subjects/university/${universityId}`

      );

    return res.data;

  },

  /*
  إنشاء
  */
  create: async (

    data: CreateUniversitySubjectDto

  ) => {

    const res =
      await apiClient.post(

        "/university-subjects",

        data

      );

    return res.data;

  },

  /*
  تعديل السعر فقط
  */
  update: async (

    id: number,

    ratePerSession: number

  ) => {

    const res =
      await apiClient.patch(

        `/university-subjects/${id}`,

        { ratePerSession }

      );

    return res.data;

  },

  /*
  حذف
  */
  delete: async (

    id: number

  ) => {

    const res =
      await apiClient.delete(

        `/university-subjects/${id}`

      );

    return res.data;

  }

};