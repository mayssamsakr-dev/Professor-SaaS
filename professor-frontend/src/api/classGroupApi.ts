import { apiClient } from "./client";


export interface ClassGroup {

  id: number;

  name: string;

  universitySubject: {

    id: number;

    university: {

      id: number;
      name: string;

    };

    subject: {

      id: number;
      name: string;

    };

  };

}

export const classGroupApi = {

  getAll: async (): Promise<ClassGroup[]> => {

    const res =
      await apiClient.get("/class-groups");

    return res.data;

  },

  create: async (data: {

    name: string;

    universitySubjectId: number;

  }) => {

    const res =
      await apiClient.post(

        "/class-groups",

        data

      );

    return res.data;

  },

  update: async (

    id: number,

    data: {

      name?: string;

      universitySubjectId?: number;

    }

  ) => {

    const res =
      await apiClient.put(

        `/class-groups/${id}`,

        data

      );

    return res.data;

  },

  delete: async (id: number) => {

    const res =
      await apiClient.delete(

        `/class-groups/${id}`

      );

    return res.data;

  }

};