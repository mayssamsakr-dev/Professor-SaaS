import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { reportApi } from "../api/reportApi";

import {
Card,
Row,
Col,
Typography,
DatePicker,
Button,
Space,
Alert,
Grid,
Divider
} from "antd";

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts";

import { formatCurrency } from "../utils/format";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function DashboardPage(){

const [summary,setSummary] = useState<any[]>([]);
const [monthly,setMonthly] = useState<any[]>([]);
const [byUniversity,setByUniversity] = useState<any[]>([]);
const [dates,setDates] = useState<any>(null);

const screens = Grid.useBreakpoint();
const isMobile = !screens.md;

useEffect(()=>{

loadData();

},[]);


const loadData = async(customDates?:any)=>{

const d = customDates || dates;

let query = "";

if(d){

const from = d[0].format("YYYY-MM-DD");
const to = d[1].format("YYYY-MM-DD");

query = `?dateFrom=${from}&dateTo=${to}`;

}

const s = await reportApi.getSummary(query);
const m = await reportApi.getMonthly(query);
const u = await reportApi.getByUniversity(query);

setSummary(s);
setMonthly(m);
setByUniversity(u);

};


const handleApply = ()=>loadData(dates);


/*
helpers
*/

const getPaidPercent = (item:any)=>{

if(!item.totalRevenue) return 0;

return (item.paidRevenue / item.totalRevenue) * 100;

};

const getAvgInvoice = (item:any)=>{

if(!item.invoiceCount) return 0;

return item.totalRevenue / item.invoiceCount;

};



/*
top university per currency
*/

const topUniversityPerCurrency = summary.map((s)=>{

const list = byUniversity.filter(
u=>u.currencyCode === s.currencyCode
);

if(!list.length) return null;

return {

currencyCode:s.currencyCode,

...list.sort((a,b)=>b.total-a.total)[0]

};

});
 /*
convert monthly data to single chart structure
*/

const monthlyPivot = Object.values(

monthly.reduce((acc:any, item:any)=>{

if(!acc[item.month]){

acc[item.month] = {
month:item.month
};

}

acc[item.month][item.currencyCode] =
item.total;

return acc;

},{}

)

);

/*
list currencies
*/

const currencies =
summary.map(s=>s.currencyCode);

return(

<AppLayout>

<Title level={4}>

Dashboard

</Title>


{/* filter */}

<Card style={{marginBottom:20}}>

<Space

direction={isMobile?"vertical":"horizontal"}

style={{width:"100%"}}

>

<RangePicker

onChange={(val)=>setDates(val)}

style={{
width:isMobile?"100%":undefined
}}

/>

<Button

type="primary"

onClick={handleApply}

block={isMobile}

>

Apply

</Button>

</Space>

</Card>



{/* KPIs */}

<Row gutter={[16,16]} style={{marginBottom:20}}>

{summary.map((s)=>(
<Col key={s.currencyCode} xs={24} md={summary.length === 1 ? 24 : 12} lg={24 / summary.length}>

<Card style={{height:"100%"}}>

<Title level={5}>

{s.currencyCode}

</Title>

<Divider style={{margin:"8px 0"}}/>

<Text>Total Revenue</Text>

<Title level={4}>

{formatCurrency(s.totalRevenue,s.currencyCode)}

</Title>


<Text>Paid Revenue</Text>

<div>

{formatCurrency(s.paidRevenue,s.currencyCode)}

</div>


<Text>Outstanding</Text>

<div>

{formatCurrency(s.unpaidRevenue,s.currencyCode)}

</div>


<Text>Invoice Count</Text>

<div>

{s.invoiceCount}

</div>


<Text>Avg Invoice</Text>

<div>

{formatCurrency(
getAvgInvoice(s),
s.currencyCode
)}

</div>


<Text>Paid %</Text>

<div>

{getPaidPercent(s).toFixed(1)}%

</div>

</Card>

</Col>
))}

</Row>



{/* university performance */}

<Row gutter={[16,16]} style={{marginBottom:20}}>

{topUniversityPerCurrency.map((u)=>{

if(!u) return null;

return(

<Col key={u.currencyCode} xs={24} md={12}>

<Card title={`Top University (${u.currencyCode})`}>

{u.universityName}

<br/>

<strong>

{formatCurrency(
u.total,
u.currencyCode
)}

</strong>

</Card>

</Col>

);

})}

</Row>



{/* unpaid warning */}

{summary.some(s=>s.unpaidRevenue>0) && (

<Alert

type="warning"

message="Unpaid invoices detected"

style={{marginBottom:20}}

/>

)}



{/* charts */}

<Row>

<Col xs={24}>

<Card title="Revenue Trend">

<ResponsiveContainer width="100%" height={320}>

<LineChart data={monthlyPivot}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

{currencies.map((c)=>(

<Line
key={c}
type="monotone"
dataKey={c}
/>

))}

</LineChart>

</ResponsiveContainer>

</Card>

</Col>

</Row>


</AppLayout>

);

}