
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

const rowHeight = 26;
const textY = 8;

function money(
value:number,
symbol:string
){
return symbol + " " +
new Intl.NumberFormat("en-US")
.format(Number(value));
}

function numberFormat(
value:number
){
return new Intl.NumberFormat("en-US")
.format(Number(value));
}

/*
soft box style
*/

function box(
doc:any,
x:number,
y:number,
w:number,
h:number
){

doc
.lineWidth(0.6)
.strokeColor("#d1d5db")
.roundedRect(x,y,w,h,6)
.stroke();

}

function ensureSpace(
doc:any,
y:number,
needed:number
){
if(y+needed>720){

doc.addPage();

return 40;

}

return y;
}

function labelValue(

doc:any,

label:string,

value:string|undefined,

x:number,

y:number

){

if(!value) return;

doc
.fillColor("#374151")
.font("Helvetica-Bold")
.fontSize(10)
.text(label+":",x,y);

doc
.font("Helvetica")
.fontSize(10)
.text(value,x+90,y);

}

function tableHeader(

doc:any,

y:number,

cols:any[]

){

doc
.fillColor("#f3f4f6")
.roundedRect(40,y,530,rowHeight,4)
.fill();

doc
.fillColor("#374151")
.font("Helvetica-Bold")
.fontSize(10);

cols.forEach(c=>{

doc.text(

c.label,

c.x,

y+textY,

{
width:c.w,
align:c.align||"left"
}

);

});

}

@Injectable()
export class InvoicePdfService {

constructor(
private prisma:PrismaService
){}

async generate(

invoiceId:number,

tenantId:number,

res:Response,
preview=false

){

const invoice =
await this.prisma.invoice.findFirst({

where:{
id:invoiceId,
tenantId
},

include:{

currency:true,

university:true,

tenant:true,

teachingSessions:{

include:{
universitySubject:{
include:{
subject:true
}
}
}

},

serviceActivities:{

include:{
serviceType:true
}

}

}

});

if(!invoice)
throw new Error("Invoice not found");

/*
currency
*/

const symbol =
invoice.currency.symbol;

const currencyCode =
invoice.currency.code;

/*
second currency total
*/

const totalSecond =

Number(invoice.totalAmount)
*
Number(invoice.exchangeRateToBase);

/*
pdf
*/

const doc =
new PDFDocument({

margin:40

});

/*
PDF headers
*/

res.setHeader(
"Content-Type",
"application/pdf"
);

if(preview){

res.setHeader(
"Content-Disposition",
"inline"
);

}else{

res.setHeader(
"Content-Disposition",
`attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
);

}

doc.pipe(res);

/*
HEADER
*/

doc
.fillColor("#111827")
.font("Helvetica-Bold")
.fontSize(24)
.text(

"INVOICE",

{align:"center"}

);

let y=60;

/*
invoice info
*/

box(

doc,

40,

y,

530,

75

);

labelValue(

doc,

"Invoice #",

invoice.invoiceNumber,

50,

y+10

);

labelValue(

doc,

"Issue Date",

invoice.issueDate
?.toISOString()
.slice(0,10),

50,

y+30

);

labelValue(

doc,

"Period",

invoice.periodStart
?.toISOString()
.slice(0,10)

+

" - "

+

invoice.periodEnd
?.toISOString()
.slice(0,10),

50,

y+50

);

labelValue(

doc,

"Currency",

currencyCode,

300,

y+10

);

labelValue(

doc,

"Exchange Rate",

"1 "
+
symbol
+
" = "
+
numberFormat(
Number(
invoice.exchangeRateToBase
)
)
+
" "
+
currencyCode,

300,

y+30

);

y+=95;

/*
UNIVERSITY
*/

box(

doc,

40,

y,

530,

95

);

doc
.font("Helvetica-Bold")
.fontSize(12)
.text(

"BILL TO",

50,

y+10

);

doc
.fontSize(11)
.text(

invoice.university.name,

50,

y+28

);

labelValue(

doc,

"Address",

(invoice.university.addressLine || ""),

50,

y+48

);

labelValue(

doc,

"City",

(invoice.university.city || ""),

50,

y+63

);

labelValue(

doc,

"Country",

(invoice.university.country || ""),

50,

y+78

);

labelValue(

doc,

"Email",

(invoice.university.contactEmail || ""),

300,

y+48

);

labelValue(

doc,

"Phone",

(invoice.university.contactPhone || ""),

300,

y+63

);

y+=115;

/*
PROFESSOR
*/

box(

doc,

40,

y,

530,

115

);

doc
.font("Helvetica-Bold")
.fontSize(12)
.text(

"PROFESSOR",

50,

y+10

);

labelValue(

doc,

"Name",

invoice.tenant?.legalName,

50,

y+30

);

labelValue(

doc,

"Email",

invoice.tenant?.email,

50,

y+45

);

labelValue(

doc,

"Address",

(invoice.tenant?.addressLine || ""),

50,

y+60

);

labelValue(

doc,

"Country",

(invoice.tenant?.country || ""),

50,

y+75

);

labelValue(

doc,

"IBAN",

(invoice.tenant?.iban || ""),

300,

y+45

);

labelValue(

doc,

"BIC",

(invoice.tenant?.swiftCode || ""),

300,

y+60

);

y+=135;

/*
teaching sessions
*/

doc
.font("Helvetica-Bold")
.fontSize(12)
.text(

"Teaching Sessions",

40,

y

);

y+=20;

const teachingCols=[

{label:"Date",x:50,w:100},

{label:"Subject",x:150,w:180},

{label:"Rate",x:330,w:100,align:"right"},

{label:"Total",x:430,w:120,align:"right"}

];

tableHeader(

doc,

y,

teachingCols

);

y+=rowHeight;

invoice.teachingSessions.forEach(s=>{

y =
ensureSpace(

doc,

y,

rowHeight

);

doc
.font("Helvetica")
.fontSize(10);

doc.text(

s.date
.toISOString()
.slice(0,10),

50,

y+textY,

{width:100}

);

doc.text(

s.universitySubject
.subject.name,

150,

y+textY,

{width:180}

);

doc.text(

money(

Number(s.unitRate),

symbol

),

330,

y+textY,

{
width:100,
align:"right"
}

);

doc.text(

money(

Number(s.totalAmount),

symbol

),

430,

y+textY,

{
width:120,
align:"right"
}

);

doc
.moveTo(

40,

y+rowHeight

)
.lineTo(

570,

y+rowHeight

)
.strokeColor("#e5e7eb")
.stroke();

y+=rowHeight;

});

/*
services
*/

if(

invoice.serviceActivities.length

){

y+=25;

doc
.font("Helvetica-Bold")
.fontSize(12)
.text(

"Service Activities",

40,

y

);

y+=20;

const serviceCols=[

{label:"Date",x:50,w:100},

{label:"Service",x:150,w:230},

{label:"Amount",x:430,w:120,align:"right"}

];

tableHeader(

doc,

y,

serviceCols

);

y+=rowHeight;

invoice.serviceActivities.forEach(a=>{

y =
ensureSpace(

doc,

y,

rowHeight

);

doc
.font("Helvetica")
.fontSize(10);

doc.text(

a.date
.toISOString()
.slice(0,10),

50,

y+textY,

{width:100}

);

doc.text(

a.serviceType?.name||"",

150,

y+textY,

{width:230}

);

doc.text(

money(

Number(a.totalAmount),

symbol

),

430,

y+textY,

{
width:120,
align:"right"
}

);

doc
.moveTo(

40,

y+rowHeight

)
.lineTo(

570,

y+rowHeight

)
.strokeColor("#e5e7eb")
.stroke();

y+=rowHeight;

});

}

/*
total box
*/

y+=30;

box(

doc,

320,

y,

250,

115

);

doc
.fontSize(10)
.fillColor("#374151");

doc.text(

"Subtotal",

330,

y+10

);

doc.text(

money(

Number(invoice.subtotal),

symbol

),

470,

y+10,

{align:"right"}

);

doc.text(

"VAT",

330,

y+30

);

doc.text(

money(

Number(invoice.vatAmount),

symbol

),

470,

y+30,

{align:"right"}

);

/*
main total
*/

doc
.font("Helvetica-Bold")
.fontSize(12);

doc.text(

"TOTAL",

330,

y+55

);

doc.text(

money(

Number(invoice.totalAmount),

symbol

),

470,

y+55,

{align:"right"}

);

/*
second currency
*/

// if(

// Number(invoice.exchangeRateToBase)!==1

// ){

// doc.text(

// "TOTAL ("+currencyCode+")",

// 330,

// y+80

// );

// doc.text(

// numberFormat(
// totalSecond
// )

// +

// " "

// +

// currencyCode,

// 470,

// y+80,

// {align:"right"}

// );

// }

doc.end();

}

}