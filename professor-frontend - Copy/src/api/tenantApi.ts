import { apiClient } from "./client";

export const tenantApi = {

getMyData: async()=>{

const res =
await apiClient.get("/tenants/me");

return res.data;

},

updateMyData: async(data:any)=>{

const res =
await apiClient.patch(

"/tenants/me",

data

);

return res.data;

}

};