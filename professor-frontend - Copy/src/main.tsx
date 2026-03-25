import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

/*
هذا الملف هو نقطة تشغيل التطبيق.
RouterProvider يجعل React Router يعمل في التطبيق.
*/

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);