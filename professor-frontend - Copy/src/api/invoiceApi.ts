import { apiClient } from "./client";

export const invoiceApi = {

getInvoices: async (params?: any) => {

const res =
await apiClient.get(
"/invoices",
{ params }
);

return res.data;

},

getInvoiceById: async (id:number) => {

const res =
await apiClient.get(
`/invoices/${id}`
);

return res.data;

},

createInvoice: async (data:any) => {

const res =
await apiClient.post(
"/invoices",
data
);

return res.data;

},

updateInvoice: async (id:number,data:any) => {

const res =
await apiClient.patch(
`/invoices/${id}`,
data
);

return res.data;

},

deleteInvoice: async (id:number) => {

const res =
await apiClient.delete(
`/invoices/${id}`
);

return res.data;

},

finalizeInvoice: async (id:number) => {

const res =
await apiClient.post(
`/invoices/${id}/finalize`
);

return res.data;

},

downloadPdf: async (id:number) => {

const res =
await apiClient.get(
`/invoices/${id}/pdf`,
{ responseType:"blob" }
);

return res.data;

},

addAdjustment: async (
id:number,
data:{
type:"DISCOUNT"|"EXTRA",
description:string,
amount:number
}
)=>{

const res =
await apiClient.post(
`/invoices/${id}/adjustments`,
data
);

return res.data;

},

preview: async(params:any)=>{

const res =
await apiClient.get(
"/invoices/preview",
{ params }
);

return res.data;

}

};