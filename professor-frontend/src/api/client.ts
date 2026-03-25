// import axios from "axios";
// import { message } from "antd";

// /*
// axios instance
// */

// export const apiClient = axios.create({

//   baseURL: "http://localhost:3000",

// });


// /*
// attach token to every request
// */

// apiClient.interceptors.request.use(

//   (config)=>{

//     const token =
//       localStorage.getItem("token");

//     if(token){

//       config.headers.Authorization =
//         `Bearer ${token}`;

//     }

//     return config;

//   }

// );


// /*
// global error handler
// */

// apiClient.interceptors.response.use(

//   (response)=>response,

//   (error)=>{

//     const status =
//       error?.response?.status;

//     const msg =
//       error?.response?.data?.message;

//     /*
//     token invalid
//     */

//     if(status === 401){

//       localStorage.removeItem("token");

//       window.location.href =
//         "/login";

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




///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////




// import axios from "axios";
// import { message } from "antd";

// /*
// axios instance
// */

// export const apiClient = axios.create({

//   baseURL: import.meta.env.VITE_API_URL,

// });


// /*
// attach token to every request
// */

// apiClient.interceptors.request.use(

//   (config)=>{

//     const token =
//       localStorage.getItem("token");

//     if(token){

//       config.headers.Authorization =
//         `Bearer ${token}`;

//     }

//     return config;

//   }

// );


// /*
// global error handler
// */

// apiClient.interceptors.response.use(

//   (response)=>response,

//   (error)=>{

//     const status =
//       error?.response?.status;

//     const msg =
//       error?.response?.data?.message;

//     /*
//     token invalid
//     */

//     if(status === 401){

//       localStorage.removeItem("token");

//       window.location.href =
//         "/login";

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


///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////


import axios from "axios";
import { message } from "antd";

/*
dynamic base url
*/

const API_URL =
  import.meta.env.VITE_API_URL
  || "http://localhost:3000";


export const apiClient = axios.create({

  baseURL: API_URL

});


/*
attach token
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
error handler
*/

apiClient.interceptors.response.use(

  (response)=>response,

  (error)=>{

    const status =
      error?.response?.status;

    const msg =
      error?.response?.data?.message;

    if(status === 401){

      localStorage.removeItem("token");

      window.location.href =
        "/login";

      return Promise.reject(error);

    }

    if(

      status === 403 &&

      msg === "No active subscription"

    ){

      window.location.href =
        "/subscription";

      return Promise.reject(error);

    }

    message.error(

      msg ||
      "Server error"

    );

    return Promise.reject(error);

  }

);


