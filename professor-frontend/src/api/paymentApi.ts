import { apiClient } from "./client";

/*
Payment API
*/

export const paymentApi = {

  /*
  إنشاء دفعة
  */
  createPayment: async (data: {
    invoiceId: number;
    amount: number;
    amountBase: number;
    paymentDate: string;
    method?: string;
    referenceNumber?: string;
  }) => {

    const response = await apiClient.post("/payments", data);

    return response.data;

  },

  /*
  جلب الدفعات
  */
  getPayments: async (invoiceId: number) => {

    const response = await apiClient.get(
      `/payments?invoiceId=${invoiceId}`
    );

    return response.data;

  }

};