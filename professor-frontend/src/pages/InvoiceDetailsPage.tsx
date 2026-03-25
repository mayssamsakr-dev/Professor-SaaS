import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import { apiClient } from "../api/client";
import { paymentApi } from "../api/paymentApi";
import { invoiceApi } from "../api/invoiceApi";

import {

Card,
Typography,
Tag,
Button,
Space,
Table,
Form,
InputNumber,
DatePicker,
Input,
Select,
Modal,
message

} from "antd";

import { formatDate, formatCurrency } from "../utils/format";

const { Title, Text } = Typography;

export default function InvoiceDetailsPage() {

const { id } = useParams();

const [invoice,setInvoice] = useState<any>(null);

const [payments,setPayments] = useState<any[]>([]);

const [adjustmentOpen,setAdjustmentOpen] =
useState(false);

const [form] = Form.useForm();

const [adjustmentForm] = Form.useForm();

useEffect(()=>{

loadData();

},[]);

const loadData = async ()=>{

const invoiceRes =
await apiClient.get(`/invoices/${id}`);

setInvoice(invoiceRes.data);

const paymentsRes =
await paymentApi.getPayments(Number(id));

setPayments(paymentsRes);

};

/*
PDF
*/

const downloadPdf = async ()=>{

const response =
await apiClient.get(

`/invoices/${id}/pdf`,

{ responseType:"blob" }

);

const url =
window.URL.createObjectURL(

new Blob([response.data])

);

const link =
document.createElement("a");

link.href = url;

link.setAttribute(

"download",

`invoice-${id}.pdf`

);

document.body.appendChild(link);

link.click();

link.remove();

};

/*
finalize
*/

const finalizeInvoice = async ()=>{

try{

await apiClient.post(

`/invoices/${id}/finalize`

);

message.success(

"Invoice finalized"

);

loadData();

}catch(error:any){

const msg =
error?.response?.data?.message
||
"Error finalizing invoice";

message.error(msg);

}

};

/*
add payment
*/

const handleAddPayment = async (values:any)=>{

/*
جلب أحدث نسخة من الفاتورة
بعد أي adjustments
*/

const invoiceRes =
await apiClient.get(`/invoices/${id}`);

const freshInvoice =
invoiceRes.data;

setInvoice(freshInvoice);

/*
حساب المدفوع
*/

const paymentsRes =
await paymentApi.getPayments(Number(id));

setPayments(paymentsRes);

const paidAmount =
paymentsRes.reduce(

(sum:number,p:any)=> 
sum + Number(p.amount),

0

);

const remainingAmount =
Number(freshInvoice.totalAmount) - paidAmount;

/*
التحقق
*/

if(remainingAmount<=0){

message.error(

"Invoice already fully paid"

);

return;

}

/*
التحقق من القيمة
*/

if(!values.amount || values.amount<=0){

message.error("Invalid amount");

return;

}

if(values.amount>remainingAmount){

message.error(

"Amount exceeds remaining"

);

return;

}

try{

await paymentApi.createPayment({

invoiceId:Number(id),

amount:values.amount,

amountBase:values.amount,

paymentDate:
values.paymentDate.format("YYYY-MM-DD"),

method:values.method,

referenceNumber:
values.referenceNumber,

});

message.success("Payment added");

form.resetFields();

/*
إعادة تحميل البيانات بعد الدفع
*/

loadData();

}catch(error:any){

const msg =
error?.response?.data?.message
||
"Error adding payment";

message.error(msg);

}

};

/*
add adjustment
*/

const handleAddAdjustment = async () => {

try {

const values =
await adjustmentForm.validateFields();

await invoiceApi.addAdjustment(
Number(id),
values
);

/*
تحميل أحدث بيانات الفاتورة
بعد إعادة الحساب
*/

const invoiceRes =
await apiClient.get(`/invoices/${id}`);

setInvoice(invoiceRes.data);

const paymentsRes =
await paymentApi.getPayments(Number(id));

setPayments(paymentsRes);

message.success("Adjustment added");

setAdjustmentOpen(false);

adjustmentForm.resetFields();

} catch (error:any) {

const msg =
error?.response?.data?.message
||
"Error adding adjustment";

message.error(msg);

}

};

if(!invoice)
return <div>Loading...</div>;

const sessions =
invoice.teachingSessions || [];

const activities =
invoice.serviceActivities || [];

const adjustments =
invoice.adjustments || [];

const paidAmount =
payments.reduce(

(sum,p)=> sum+Number(p.amount),

0

);

const remainingAmount =
Number(invoice.totalAmount) - Number(paidAmount);

/*
payment table
*/

const paymentColumns = [

{
title:"Amount",

dataIndex:"amount",

render:(v:number)=>

formatCurrency(

v,

invoice.currency?.code

)

},

{
title:"Date",

dataIndex:"paymentDate",

render:(v:string)=>
formatDate(v)

},

{
title:"Method",

dataIndex:"method"

},

{
title:"Reference",

dataIndex:"referenceNumber"

}

];

return(

<AppLayout>

<Card>

<Space

style={{

width:"100%",

justifyContent:"space-between",

marginBottom:20

}}

>

<Title level={4}>

Invoice #{invoice.invoiceNumber}

</Title>

<Space>

{invoice.status==="DRAFT" && (

<Button

type="primary"

onClick={finalizeInvoice}

>

Finalize

</Button>

)}

<Button onClick={downloadPdf}>

Download PDF

</Button>

</Space>

</Space>

<Space

direction="vertical"

style={{width:"100%"}}

>

<p>

<Text strong>

Subtotal:

</Text>{" "}

{formatCurrency(

invoice.subtotal,

invoice.currency?.code

)}

</p>

<p>

<Text strong>

VAT:

</Text>{" "}

{formatCurrency(

invoice.vatAmount || 0,

invoice.currency?.code

)}

</p>

<p>

<Text strong>

Total:

</Text>{" "}

{formatCurrency(

invoice.totalAmount,

invoice.currency?.code

)}

</p>

<p>

<Text strong>

Paid:

</Text>{" "}

{formatCurrency(

paidAmount,

invoice.currency?.code

)}

</p>

<p>

<Text strong>

Remaining:

</Text>{" "}

<Text type="danger">

{formatCurrency(

remainingAmount,

invoice.currency?.code

)}

</Text>

</p>

</Space>

<div style={{marginTop:20}}>

<p>

<Text strong>

Status:

</Text>{" "}

<Tag

color={

invoice.status==="FINALIZED"

? "green"

: "orange"

}

>

{invoice.status}

</Tag>

</p>

<p>

<Text strong>

Payment:

</Text>{" "}

<Tag>

{invoice.paymentStatus}

</Tag>

</p>

</div>

</Card>

<Card

style={{marginTop:20}}

title="Teaching Sessions"

>

<Table

dataSource={sessions}

rowKey="id"

pagination={false}

columns={[

{

title:"Date",

dataIndex:"date",

render:(v:string)=>

formatDate(v)

},

{

title:"Subject",

render:(_:any,r:any)=>

r.universitySubject?.subject?.name

},

{

title:"Qty",

dataIndex:"quantity"

},

{

title:"Rate",

dataIndex:"unitRate",

render:(v:number)=>

formatCurrency(

v,

invoice.currency?.code

)

},

{

title:"Total",

dataIndex:"totalAmount",

render:(v:number)=>

formatCurrency(

v,

invoice.currency?.code

)

}

]}

/>

</Card>

<Card

style={{marginTop:20}}

title="Service Activities"

>

<Table

dataSource={activities}

rowKey="id"

pagination={false}

columns={[

{

title:"Date",

dataIndex:"date",

render:(v:string)=>
formatDate(v)

},

{

title:"Type",

render:(_:any,r:any)=>

r.serviceType?.name

},

{

title:"Qty",

dataIndex:"quantity"

},

{

title:"Rate",

dataIndex:"unitRate",

render:(v:number)=>

formatCurrency(

v,

invoice.currency?.code

)

},

{

title:"Total",

dataIndex:"totalAmount",

render:(v:number)=>

formatCurrency(

v,

invoice.currency?.code

)

}

]}

/>

</Card>

<Card
  style={{ marginTop: 20 }}
  title="Adjustments"
>

<Table

  dataSource={adjustments}

  rowKey="id"

  pagination={false}

  columns={[

    {
      title: "Type",
      dataIndex: "type"
    },

    {
      title: "Description",
      dataIndex: "description"
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (v: number) =>
        formatCurrency(
          v,
          invoice.currency?.code
        )
    }

  ]}

/>

{
  invoice.status === "FINALIZED" && (

    <div style={{ marginTop: 20 }}>

      <Button

        type="primary"

        onClick={() =>
          setAdjustmentOpen(true)
        }

      >

        Add Adjustment

      </Button>

    </div>

  )
}

</Card>

<Card

style={{marginTop:20}}

title="Payments"

>

<Table

dataSource={payments}

columns={paymentColumns}

rowKey="id"

pagination={false}

/>

</Card>

<Card

style={{marginTop:20}}

title="Add Payment"

>

<p>

<Text strong>

Remaining:

</Text>{" "}

{formatCurrency(

remainingAmount,

invoice.currency?.code

)}

</p>

<Form

form={form}

layout="vertical"

onFinish={handleAddPayment}

>

<Form.Item

label="Amount"

name="amount"

rules={[{required:true}]}

>

<InputNumber

style={{width:"100%"}}

max={remainingAmount}

min={0.01}

/>

</Form.Item>

<Form.Item

label="Payment Date"

name="paymentDate"

rules={[{required:true}]}

>

<DatePicker style={{width:"100%"}}/>

</Form.Item>

<Form.Item

label="Method"

name="method"

>

<Input/>

</Form.Item>

<Form.Item

label="Reference"

name="referenceNumber"

>

<Input/>

</Form.Item>

<Button

type="primary"

htmlType="submit"

>

Add Payment

</Button>

</Form>

</Card>

<Modal

title="Add Adjustment"

open={adjustmentOpen}

onCancel={()=>

setAdjustmentOpen(false)

}

onOk={handleAddAdjustment}

>

<Form

form={adjustmentForm}

layout="vertical"

>

<Form.Item

name="type"

label="Type"

rules={[{required:true}]}

>

<Select>

<Select.Option value="DISCOUNT">

Discount

</Select.Option>

<Select.Option value="EXTRA">

Extra

</Select.Option>

</Select>

</Form.Item>

<Form.Item

name="description"

label="Description"

rules={[{required:true}]}

>

<Input/>

</Form.Item>

<Form.Item

name="amount"

label="Amount"

rules={[{required:true}]}

>

<InputNumber

style={{width:"100%"}}

/>

</Form.Item>

</Form>

</Modal>

</AppLayout>

);

}