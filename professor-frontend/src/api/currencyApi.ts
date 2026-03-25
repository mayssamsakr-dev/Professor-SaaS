import { apiClient } from "./client";

/*
Currency type
*/

export interface Currency {

  id:number;

  code:string;

  name:string;

  symbol:string;

}

/*
Currency API
*/

export const currencyApi = {

  /*
  all currencies
  */

  getAll: async():Promise<Currency[]> => {

    const res =
      await apiClient.get(

        "/currencies"

      );

    return res.data;

  }

};