import {
Card,
Table,
Button,
Modal,
Form,
Input,
Space,
Popconfirm,
Typography,
message
} from "antd";

import {
useEffect,
useState
} from "react";

import AppLayout from "../layouts/AppLayout";

import {
apiClient
} from "../api/client";

const { Title } = Typography;

export default function ServiceTypesPage(){

const [data,setData] = useState<any[]>([]);

const [loading,setLoading] = useState(false);

const [open,setOpen] = useState(false);

const [editing,setEditing] = useState<any>(null);

const [form] = Form.useForm();

/*
load data
*/

const load = async()=>{

setLoading(true);

const res =
await apiClient.get("/service-types");

setData(res.data);

setLoading(false);

};

useEffect(()=>{

load();

},[]);

/*
save
*/

const save = async(values:any)=>{

try{

if(editing){

await apiClient.patch(

`/service-types/${editing.id}`,

values

);

message.success("Updated");

}
else{

await apiClient.post(

"/service-types",

values

);

message.success("Created");

}

setOpen(false);

setEditing(null);

form.resetFields();

load();

}
catch(err:any){

message.error(

err?.response?.data?.message
||
"Error"

);

}

};

/*
delete
*/

const remove = async(id:number)=>{

await apiClient.delete(

`/service-types/${id}`

);

message.success("Deleted");

load();

};

return(

<AppLayout>

<Title level={4}>

Service Types

</Title>

<Card
style={{
marginBottom:20
}}
>

<Button
type="primary"
onClick={()=>{

setEditing(null);

form.resetFields();

setOpen(true);

}}
>

Add Service Type

</Button>

</Card>

<Card>

<Table

rowKey="id"

loading={loading}

dataSource={data}

columns={[

{
title:"Name",
dataIndex:"name"
},

{
title:"Actions",

render:(row:any)=>(

<Space>

<Button
onClick={()=>{

setEditing(row);

form.setFieldsValue(row);

setOpen(true);

}}
>

Edit

</Button>

<Popconfirm
title="Delete?"
onConfirm={()=>remove(row.id)}
>

<Button danger>

Delete

</Button>

</Popconfirm>

</Space>

)

}

]}

/>

</Card>

<Modal

open={open}

title={
editing
?
"Edit Service Type"
:
"Add Service Type"
}

onCancel={()=>{

setOpen(false);

setEditing(null);

}}

onOk={()=>
form.submit()
}

>

<Form

form={form}

layout="vertical"

onFinish={save}

>

<Form.Item

name="name"

label="Name"

rules={[{required:true}]}

>

<Input/>

</Form.Item>

</Form>

</Modal>

</AppLayout>

);

}