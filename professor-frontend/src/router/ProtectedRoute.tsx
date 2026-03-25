import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { apiClient } from "../api/client";

/*
يحمي الصفحات التي تحتاج login + subscription
*/

export default function ProtectedRoute({ children }: any){

  const [loading,setLoading] =
    useState(true);

  const [allowed,setAllowed] =
    useState(false);

  useEffect(()=>{

    checkAccess();

  },[]);

  const checkAccess =
    async ()=>{

      const token =
        localStorage.getItem("token");

      /*
      لا يوجد login
      */

      if(!token){

        setAllowed(false);

        setLoading(false);

        return;

      }

      try{

        /*
        تحقق من الاشتراك
        */

        await apiClient.get(

          "/subscriptions/me"

        );

        setAllowed(true);

      }
      catch{

        setAllowed(false);

      }
      finally{

        setLoading(false);

      }

    };

  if(loading){

    return null;

  }

  /*
  غير مسجل
  */

  if(!localStorage.getItem("token")){

    return <Navigate to="/login" />;

  }

  /*
  لا يوجد اشتراك
  */

  if(!allowed){

    return <Navigate to="/subscription" />;

  }

  return children;

}