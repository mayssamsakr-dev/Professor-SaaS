import { apiClient } from "./client";

/*
API خاص بالمصادقة (Authentication)
*/

export const authApi = {

  /*
  تسجيل الدخول
  */
  login: async (email: string, password: string) => {

    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    // إرجاع التوكن
    return response.data;

  }

};