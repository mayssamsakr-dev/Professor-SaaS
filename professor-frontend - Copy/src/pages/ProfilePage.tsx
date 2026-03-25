import {
Card,
Form,
Input,
Button,
Typography,
Row,
Col,
Switch,
InputNumber,
message,
Space
} from "antd";

import {
useEffect,
useState
} from "react";

import {
tenantApi
} from "../api/tenantApi";

import AppLayout from "../layouts/AppLayout";

const { Title } = Typography;

export default function ProfilePage(){

const [form] = Form.useForm();

const [editing,setEditing] =
useState(false);

useEffect(()=>{

load();

},[]);

const load = async()=>{

const data =
await tenantApi.getMyData();

form.setFieldsValue(data);

};

const save = async(values:any)=>{

await tenantApi.updateMyData(values);

message.success("Saved");

setEditing(false);

};

/*
cancel editing
reload original data
*/

const cancel = ()=>{

load();

setEditing(false);

};

return(

<AppLayout>

<Card style={{maxWidth:900}}>

<Space
style={{
width:"100%",
justifyContent:"space-between",
marginBottom:20
}}
>

<Title level={4} style={{margin:0}}>

Doctor Profile

</Title>

{
!editing && (

<Button
onClick={()=>setEditing(true)}
>
Edit
</Button>

)
}

</Space>

<Form
form={form}
layout="vertical"
onFinish={save}
>

<Row gutter={16}>

<Col span={12}>

<Form.Item
name="legalName"
label="Legal Name"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

<Col span={12}>

<Form.Item
name="displayName"
label="Display Name"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

</Row>

<Row gutter={16}>

<Col span={12}>

<Form.Item
name="email"
label="Email"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

<Col span={12}>

<Form.Item
name="phone"
label="Phone"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

</Row>

<Form.Item
name="addressLine"
label="Address"
>

<Input disabled={!editing}/>

</Form.Item>

<Row gutter={16}>

<Col span={8}>

<Form.Item
name="city"
label="City"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

<Col span={8}>

<Form.Item
name="country"
label="Country"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

<Col span={8}>

<Form.Item
name="taxNumber"
label="Tax Number"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

</Row>

<Title level={5}>

Bank Details

</Title>

<Row gutter={16}>

<Col span={12}>

<Form.Item
name="bankName"
label="Bank"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

<Col span={12}>

<Form.Item
name="iban"
label="IBAN"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

</Row>

<Row gutter={16}>

<Col span={12}>

<Form.Item
name="swiftCode"
label="SWIFT"
>

<Input disabled={!editing}/>

</Form.Item>

</Col>

</Row>

<Title level={5}>

VAT

</Title>

<Row gutter={16}>

<Col span={8}>

<Form.Item
name="vatEnabled"
label="Enable VAT"
valuePropName="checked"
>

<Switch disabled={!editing}/>

</Form.Item>

</Col>

<Col span={8}>

<Form.Item
name="vatRate"
label="VAT %"
>

<InputNumber
style={{width:"100%"}}
disabled={!editing}
/>

</Form.Item>

</Col>

</Row>

{
editing && (

<Space>

<Button
onClick={cancel}
>
Cancel
</Button>

<Button
type="primary"
htmlType="submit"
>
Save
</Button>

</Space>

)
}

</Form>

</Card>

</AppLayout>

);

}