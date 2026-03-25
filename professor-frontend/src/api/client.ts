// import axios from "axios";
// import { message } from "antd";

// /*
// axios instance
// */

// export const apiClient = axios.create({

//   baseURL: "http://localhost:3000",

// });

// /*
// add token to header
// */

// apiClient.interceptors.response.use(

//   (response) => response,

//   (error) => {

//     const status =
//       error?.response?.status;

//     const msg =
//       error?.response?.data?.message;

//     /*
//     token expired
//     */

//     if(status === 401){

//       localStorage.removeItem("token");

//       window.location.href = "/login";

//       return Promise.reject(error);

//     }

//     /*
//     no subscription
//     */

//     if(
//       status === 403 &&
//       msg === "No active subscription"
//     ){

//       window.location.href =
//         "/subscription";

//       return Promise.reject(error);

//     }

//     /*
//     other errors
//     */

//     message.error(

//       msg ||
//       "Server error"

//     );

//     return Promise.reject(error);

//   }

// );

// /*
// handle errors globally
// */

// apiClient.interceptors.response.use(

//   (response) => response,

//   (error) => {

//     const status =
//       error?.response?.status;

//     /*
//     token expired or invalid
//     */

// /*
// 401 = token invalid → logout
// */

// if (status === 401){

//   localStorage.removeItem("token");

//   window.location.href = "/login";

//   return Promise.reject(error);

// }

// /*
// 403 بسبب عدم وجود subscription
// */

// if (

//   status === 403 &&

//   error?.response?.data?.message ===
//   "No active subscription"

// ){

//   window.location.href =
//     "/subscription";

//   return Promise.reject(error);

// }

// /*
// 403 أسباب أخرى
// */

// if(status === 403){

//   window.location.href="/";

//   return Promise.reject(error);

// }

//     /*
//     show backend message
//     */

//     const msg =
//       error?.response?.data?.message
//       || "Server error";

//     message.error(msg);

//     return Promise.reject(error);

//   }

// );

import axios from "axios";
import { message } from "antd";

/*
axios instance
*/

export const apiClient = axios.create({

  baseURL: "http://localhost:3000",

});


/*
attach token to every request
*/

apiClient.interceptors.request.use(

  (config)=>{

    const token =
      localStorage.getItem("token");

    if(token){

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  }

);


/*
global error handler
*/

apiClient.interceptors.response.use(

  (response)=>response,

  (error)=>{

    const status =
      error?.response?.status;

    const msg =
      error?.response?.data?.message;

    /*
    token invalid
    */

    if(status === 401){

      localStorage.removeItem("token");

      window.location.href =
        "/login";

      return Promise.reject(error);

    }

    /*
    no subscription
    */

    if(

      status === 403 &&

      msg === "No active subscription"

    ){

      window.location.href =
        "/subscription";

      return Promise.reject(error);

    }

    /*
    other errors
    */

    message.error(

      msg ||
      "Server error"

    );

    return Promise.reject(error);

  }

);