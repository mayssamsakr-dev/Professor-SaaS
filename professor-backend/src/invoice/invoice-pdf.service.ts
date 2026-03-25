// // import { Injectable } from '@nestjs/common';
// // import PDFDocument from 'pdfkit';
// // import { PrismaService } from '../prisma/prisma.service';
// // import { Response } from 'express';

// // const rowHeight = 26;
// // const textY = 8;

// // /*
// // format currency
// // */
// // function money(
// //   value:number,
// //   symbol:string
// // ){
// //   return symbol + " " +
// //   new Intl.NumberFormat("en-US")
// //   .format(Number(value));
// // }

// // /*
// // draw box
// // */
// // function box(
// //   doc:any,
// //   x:number,
// //   y:number,
// //   w:number,
// //   h:number
// // ){
// //   doc.rect(x,y,w,h).stroke();
// // }

// // /*
// // page break
// // */
// // function ensureSpace(
// //   doc:any,
// //   y:number,
// //   needed:number
// // ){
// //   if(y + needed > 720){
// //     doc.addPage();
// //     return 40;
// //   }
// //   return y;
// // }

// // /*
// // bold label normal value
// // */
// // function labelValue(
// //   doc:any,
// //   label:string,
// //   value:string | undefined,
// //   x:number,
// //   y:number
// // ){
// //   if(!value) return;

// //   doc.font("Helvetica-Bold")
// //      .fontSize(10)
// //      .text(label + ":",x,y);

// //   doc.font("Helvetica")
// //      .fontSize(9)
// //      .text(value,x+85,y);
// // }

// // /*
// // table header
// // */
// // function tableHeader(
// //   doc:any,
// //   y:number,
// //   columns:any[]
// // ){
// //   box(doc,40,y,530,rowHeight);

// //   doc.font("Helvetica-Bold")
// //      .fontSize(10);

// //   columns.forEach(c=>{

// //     doc.text(
// //       c.label,
// //       c.x,
// //       y+textY,
// //       {
// //         width:c.w,
// //         align:c.align || "left"
// //       }
// //     );

// //   });

// // }

// // @Injectable()
// // export class InvoicePdfService {

// // constructor(
// // private prisma:PrismaService
// // ){}

// // async generate(
// // invoiceId:number,
// // tenantId:number,
// // res:Response
// // ){

// // const invoice =
// // await this.prisma.invoice.findFirst({

// // where:{
// // id:invoiceId,
// // tenantId
// // },

// // include:{

// // currency:true,

// // tenant:{
// // include:{
// // baseCurrency:true
// // }
// // },

// // university:true,

// // teachingSessions:{
// // include:{
// // universitySubject:{
// // include:{
// // subject:true
// // }
// // }
// // }
// // },

// // serviceActivities:{
// // include:{
// // serviceType:true
// // }
// // }

// // }

// // });

// // if(!invoice)
// // throw new Error("Invoice not found");

// // const doc =
// // new PDFDocument({
// // margin:40
// // });

// // res.setHeader(
// // "Content-Disposition",
// // `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
// // );

// // res.setHeader(
// // "Content-Type",
// // "application/pdf"
// // );

// // doc.pipe(res);

// // /*
// // HEADER
// // */

// // doc.font("Helvetica-Bold")
// //    .fontSize(24)
// //    .text("INVOICE",{align:"center"});

// // let y = 60;

// // /*
// // INVOICE INFO
// // */

// // box(doc,40,y,530,70);

// // labelValue(
// // doc,
// // "Invoice #",
// // invoice.invoiceNumber,
// // 50,
// // y+10
// // );

// // labelValue(
// // doc,
// // "Issue Date",
// // invoice.issueDate
// // ?.toISOString()
// // .slice(0,10),
// // 50,
// // y+28
// // );

// // labelValue(
// // doc,
// // "Period",
// // invoice.periodStart
// // ?.toISOString()
// // .slice(0,10)
// // +
// // " - " +
// // invoice.periodEnd
// // ?.toISOString()
// // .slice(0,10),
// // 50,
// // y+46
// // );

// // labelValue(
// // doc,
// // "Currency",
// // invoice.currency.code,
// // 300,
// // y+10
// // );

// // labelValue(
// // doc,
// // "Exchange Rate",
// // "1 "
// // +
// // invoice.currency.code
// // +
// // " = "
// // +
// // new Intl.NumberFormat("en-US")
// // .format(
// // Number(invoice.exchangeRateToBase)
// // ),
// // 300,
// // y+28
// // );

// // y += 85;

// // /*
// // BILL TO
// // */

// // box(doc,40,y,530,90);

// // doc.font("Helvetica-Bold")
// //    .fontSize(12)
// //    .text("BILL TO",50,y+10);

// // doc.font("Helvetica-Bold")
// //    .fontSize(11)
// //    .text(
// //      invoice.university.name,
// //      50,
// //      y+28
// //    );

// // labelValue(doc,"Address",(invoice.university.addressLine || ""),50,y+48);
// // labelValue(doc,"City",(invoice.university.city || ""),50,y+63);
// // labelValue(doc,"Country",(invoice.university.country || ""),50,y+78);

// // labelValue(doc,"Email",(invoice.university.contactEmail || ""),300,y+48);
// // labelValue(doc,"Phone",(invoice.university.contactPhone || ""),300,y+63);

// // y += 105;

// // /*
// // FROM
// // */

// // box(doc,40,y,530,135);

// // doc.font("Helvetica-Bold")
// //    .fontSize(12)
// //    .text("FROM",50,y+10);

// // doc.font("Helvetica-Bold")
// //    .fontSize(11)
// //    .text(
// //      invoice.tenant.displayName
// //      ||
// //      invoice.tenant.legalName,
// //      50,
// //      y+28
// //    );

// // labelValue(doc,"Email",invoice.tenant.email,50,y+48);
// // labelValue(doc,"Phone",(invoice.tenant.phone || ""),50,y+63);
// // labelValue(doc,"Address",(invoice.tenant.addressLine || ""),50,y+78);

// // labelValue(doc,"City",(invoice.tenant.city || ""),300,y+48);
// // labelValue(doc,"Country",(invoice.tenant.country || ""),300,y+63);
// // labelValue(doc,"Tax",(invoice.tenant.taxNumber || ""),300,y+78);

// // labelValue(doc,"Bank",(invoice.tenant.bankName || ""),50,y+98);
// // labelValue(doc,"IBAN",(invoice.tenant.iban || ""),300,y+98);
// // labelValue(doc,"SWIFT",(invoice.tenant.swiftCode || ""),50,y+113);

// // y += 155;

// // /*
// // TEACHING TABLE
// // */

// // doc.font("Helvetica-Bold")
// //    .fontSize(12)
// //    .text("Teaching Sessions",40,y);

// // y += 20;

// // const teachingCols = [

// // {label:"Date",x:50,w:100},

// // {label:"Subject",x:150,w:180},

// // {label:"Rate",x:330,w:100,align:"right"},

// // {label:"Total",x:430,w:120,align:"right"}

// // ];

// // tableHeader(doc,y,teachingCols);

// // y += rowHeight;

// // invoice.teachingSessions.forEach(s=>{

// // y = ensureSpace(doc,y,rowHeight);

// // doc.font("Helvetica")
// //    .fontSize(10);

// // doc.text(
// // s.date.toISOString().slice(0,10),
// // 50,
// // y+textY,
// // {width:100}
// // );

// // doc.text(
// // s.universitySubject.subject.name,
// // 150,
// // y+textY,
// // {width:180}
// // );

// // doc.text(
// // money(
// // Number(s.unitRate),
// // invoice.currency.symbol
// // ),
// // 330,
// // y+textY,
// // {width:100,align:"right"}
// // );

// // doc.text(
// // money(
// // Number(s.totalAmount),
// // invoice.currency.symbol
// // ),
// // 430,
// // y+textY,
// // {width:120,align:"right"}
// // );

// // doc.moveTo(40,y+rowHeight)
// //    .lineTo(570,y+rowHeight)
// //    .stroke();

// // y += rowHeight;

// // });

// // /*
// // SERVICE TABLE
// // */

// // if(invoice.serviceActivities.length){

// // y += 25;

// // doc.font("Helvetica-Bold")
// //    .fontSize(12)
// //    .text("Service Activities",40,y);

// // y += 20;

// // const serviceCols = [

// // {label:"Date",x:50,w:100},

// // {label:"Service",x:150,w:230},

// // {label:"Amount",x:430,w:120,align:"right"}

// // ];

// // tableHeader(doc,y,serviceCols);

// // y += rowHeight;

// // invoice.serviceActivities.forEach(a=>{

// // y = ensureSpace(doc,y,rowHeight);

// // doc.font("Helvetica")
// //    .fontSize(10);

// // doc.text(
// // a.date.toISOString().slice(0,10),
// // 50,
// // y+textY,
// // {width:100}
// // );

// // doc.text(
// // a.serviceType?.name || "",
// // 150,
// // y+textY,
// // {width:230}
// // );

// // doc.text(
// // money(
// // Number(a.totalAmount),
// // invoice.currency.symbol
// // ),
// // 430,
// // y+textY,
// // {width:120,align:"right"}
// // );

// // doc.moveTo(40,y+rowHeight)
// //    .lineTo(570,y+rowHeight)
// //    .stroke();

// // y += rowHeight;

// // });

// // }

// // /*
// // TOTALS
// // */

// // y += 30;

// // y = ensureSpace(doc,y,120);

// // box(doc,320,y,250,115);

// // labelValue(
// // doc,
// // "Subtotal",
// // money(Number(invoice.subtotal),invoice.currency.symbol),
// // 330,
// // y+10
// // );

// // labelValue(
// // doc,
// // "VAT",
// // money(Number(invoice.vatAmount),invoice.currency.symbol),
// // 330,
// // y+30
// // );

// // doc.font("Helvetica-Bold")
// //    .fontSize(12)
// //    .text("TOTAL",330,y+55);

// // doc.text(
// // money(
// // Number(invoice.totalAmount),
// // invoice.currency.symbol
// // ),
// // 470,
// // y+55,
// // {align:"right"}
// // );

// // /*
// // TOTAL second currency
// // */

// // if(
// // invoice.exchangeRateToBase
// // &&
// // Number(invoice.exchangeRateToBase) !== 1
// // ){

// // const totalSecond =
// // Number(invoice.totalAmount)
// // *
// // Number(invoice.exchangeRateToBase);

// // doc.font("Helvetica")
// //    .fontSize(10)
// //    .text(
// //      "Total ("+
// //      (invoice.tenant.baseCurrency?.symbol || "")
// //      +")",
// //      330,
// //      y+80
// //    );

// // doc.text(

// // money(
// // totalSecond,
// // invoice.tenant.baseCurrency?.symbol || ""
// // ),

// // 470,
// // y+80,
// // {align:"right"}

// // );

// // }

// // doc.end();

// // }
// // }




// ////////////////////////////////////////////////////////////////////////////////////




// import { Injectable } from '@nestjs/common';
// import PDFDocument from 'pdfkit';
// import { PrismaService } from '../prisma/prisma.service';
// import { Response } from 'express';

// const rowHeight = 26;
// const textY = 8;

// /*
// format currency
// */
// function money(
//   value:number,
//   symbol:string
// ){
//   return symbol + " " +
//   new Intl.NumberFormat("en-US")
//   .format(Number(value));
// }

// /*
// draw box
// */
// function box(
//   doc:any,
//   x:number,
//   y:number,
//   w:number,
//   h:number
// ){
//   doc.rect(x,y,w,h).stroke();
// }

// /*
// page break
// */
// function ensureSpace(
//   doc:any,
//   y:number,
//   needed:number
// ){
//   if(y + needed > 720){
//     doc.addPage();
//     return 40;
//   }
//   return y;
// }

// /*
// label + value
// */
// function labelValue(
//   doc:any,
//   label:string,
//   value:string | undefined,
//   x:number,
//   y:number
// ){

//   if(!value) return;

//   doc.font("Helvetica-Bold")
//      .fontSize(10)
//      .text(label + ":",x,y);

//   doc.font("Helvetica")
//      .fontSize(9)
//      .text(value,x+85,y);

// }

// /*
// table header
// */
// function tableHeader(
//   doc:any,
//   y:number,
//   columns:any[]
// ){

//   box(doc,40,y,530,rowHeight);

//   doc.font("Helvetica-Bold")
//      .fontSize(10);

//   columns.forEach(c=>{

//     doc.text(
//       c.label,
//       c.x,
//       y+textY,
//       {
//         width:c.w,
//         align:c.align || "left"
//       }
//     );

//   });

// }

// @Injectable()
// export class InvoicePdfService {

// constructor(
// private prisma:PrismaService
// ){}

// async generate(
// invoiceId:number,
// tenantId:number,
// res:Response
// ){

// const invoice =
// await this.prisma.invoice.findFirst({

// where:{
// id:invoiceId,
// tenantId
// },

// include:{

// currency:true,

// tenant:{
// include:{
// baseCurrency:true
// }
// },

// university:true,

// teachingSessions:{
// include:{
// universitySubject:{
// include:{
// subject:true
// }
// }
// }
// },

// serviceActivities:{
// include:{
// serviceType:true
// }
// }

// }

// });

// if(!invoice)
// throw new Error("Invoice not found");

// const doc =
// new PDFDocument({
// margin:40
// });

// res.setHeader(
// "Content-Disposition",
// `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
// );

// res.setHeader(
// "Content-Type",
// "application/pdf"
// );

// doc.pipe(res);

// /*
// HEADER
// */

// doc.font("Helvetica-Bold")
//    .fontSize(24)
//    .text("INVOICE",{align:"center"});

// let y = 60;

// /*
// INVOICE INFO
// */

// box(doc,40,y,530,70);

// labelValue(
// doc,
// "Invoice #",
// invoice.invoiceNumber,
// 50,
// y+10
// );

// labelValue(
// doc,
// "Issue Date",
// invoice.issueDate
// ?.toISOString()
// .slice(0,10),
// 50,
// y+28
// );

// labelValue(
// doc,
// "Period",
// invoice.periodStart
// ?.toISOString()
// .slice(0,10)
// +
// " - " +
// invoice.periodEnd
// ?.toISOString()
// .slice(0,10),
// 50,
// y+46
// );

// labelValue(
// doc,
// "Currency",
// invoice.currency.symbol,
// 300,
// y+10
// );

// /*
// exchange rate with symbols
// */

// const baseSymbol =
// invoice.tenant.baseCurrency?.symbol
// || "";

// labelValue(
// doc,
// "Exchange Rate",

// "1 "
// +
// invoice.currency.symbol
// +
// " = "
// +
// baseSymbol
// +
// " "
// +
// new Intl.NumberFormat("en-US")
// .format(
// Number(invoice.exchangeRateToBase)
// ),

// 300,
// y+28
// );

// y += 85;

// /*
// BILL TO
// */

// box(doc,40,y,530,90);

// doc.font("Helvetica-Bold")
//    .fontSize(12)
//    .text("BILL TO",50,y+10);

// doc.font("Helvetica-Bold")
//    .fontSize(11)
//    .text(
//      invoice.university.name,
//      50,
//      y+28
//    );

// labelValue(doc,"Address",(invoice.university.addressLine || ""),50,y+48);
// labelValue(doc,"City",(invoice.university.city || ""),50,y+63);
// labelValue(doc,"Country",(invoice.university.country || ""),50,y+78);

// labelValue(doc,"Email",(invoice.university.contactEmail || ""),300,y+48);
// labelValue(doc,"Phone",(invoice.university.contactPhone || ""),300,y+63);

// y += 105;

// /*
// FROM
// */

// box(doc,40,y,530,135);

// doc.font("Helvetica-Bold")
//    .fontSize(12)
//    .text("FROM",50,y+10);

// doc.font("Helvetica-Bold")
//    .fontSize(11)
//    .text(
//      invoice.tenant.displayName
//      ||
//      invoice.tenant.legalName,
//      50,
//      y+28
//    );

// labelValue(doc,"Email",(invoice.tenant.email || ""),50,y+48);
// labelValue(doc,"Phone",(invoice.tenant.phone || ""),50,y+63);
// labelValue(doc,"Address",(invoice.tenant.addressLine || ""),50,y+78);

// labelValue(doc,"City",(invoice.tenant.city || ""),300,y+48);
// labelValue(doc,"Country",(invoice.tenant.country || ""),300,y+63);
// labelValue(doc,"Tax",(invoice.tenant.taxNumber || ""),300,y+78);

// labelValue(doc,"Bank",(invoice.tenant.bankName || ""),50,y+98);
// labelValue(doc,"IBAN",(invoice.tenant.iban || ""),300,y+98);
// labelValue(doc,"SWIFT",(invoice.tenant.swiftCode || ""),50,y+113);

// y += 155;

// /*
// TEACHING TABLE
// */

// doc.font("Helvetica-Bold")
//    .fontSize(12)
//    .text("Teaching Sessions",40,y);

// y += 20;

// const teachingCols = [

// {label:"Date",x:50,w:100},

// {label:"Subject",x:150,w:180},

// {label:"Rate",x:330,w:100,align:"right"},

// {label:"Total",x:430,w:120,align:"right"}

// ];

// tableHeader(doc,y,teachingCols);

// y += rowHeight;

// invoice.teachingSessions.forEach(s=>{

// y = ensureSpace(doc,y,rowHeight);

// doc.font("Helvetica")
//    .fontSize(10);

// doc.text(
// s.date.toISOString().slice(0,10),
// 50,
// y+textY,
// {width:100}
// );

// doc.text(
// s.universitySubject.subject.name,
// 150,
// y+textY,
// {width:180}
// );

// doc.text(
// money(
// Number(s.unitRate),
// invoice.currency.symbol
// ),
// 330,
// y+textY,
// {width:100,align:"right"}
// );

// doc.text(
// money(
// Number(s.totalAmount),
// invoice.currency.symbol
// ),
// 430,
// y+textY,
// {width:120,align:"right"}
// );

// doc.moveTo(40,y+rowHeight)
//    .lineTo(570,y+rowHeight)
//    .stroke();

// y += rowHeight;

// });

// /*
// SERVICE TABLE
// */

// if(invoice.serviceActivities.length){

// y += 25;

// doc.font("Helvetica-Bold")
//    .fontSize(12)
//    .text("Service Activities",40,y);

// y += 20;

// const serviceCols = [

// {label:"Date",x:50,w:100},

// {label:"Service",x:150,w:230},

// {label:"Amount",x:430,w:120,align:"right"}

// ];

// tableHeader(doc,y,serviceCols);

// y += rowHeight;

// invoice.serviceActivities.forEach(a=>{

// y = ensureSpace(doc,y,rowHeight);

// doc.font("Helvetica")
//    .fontSize(10);

// doc.text(
// a.date.toISOString().slice(0,10),
// 50,
// y+textY,
// {width:100}
// );

// doc.text(
// a.serviceType?.name || "",
// 150,
// y+textY,
// {width:230}
// );

// doc.text(
// money(
// Number(a.totalAmount),
// invoice.currency.symbol
// ),
// 430,
// y+textY,
// {width:120,align:"right"}
// );

// doc.moveTo(40,y+rowHeight)
//    .lineTo(570,y+rowHeight)
//    .stroke();

// y += rowHeight;

// });

// }

// /*
// TOTALS
// */

// y += 30;

// y = ensureSpace(doc,y,120);

// box(doc,320,y,250,115);

// /*
// same font and alignment
// */

// doc.font("Helvetica")
//    .fontSize(10);

// doc.text(
// "Subtotal",
// 330,
// y+10
// );

// doc.text(
// money(
// Number(invoice.subtotal),
// invoice.currency.symbol
// ),
// 470,
// y+10,
// {align:"right"}
// );

// doc.text(
// "VAT",
// 330,
// y+30
// );

// doc.text(
// money(
// Number(invoice.vatAmount),
// invoice.currency.symbol
// ),
// 470,
// y+30,
// {align:"right"}
// );

// doc.font("Helvetica-Bold")
//    .fontSize(12);

// doc.text(
// "TOTAL",
// 330,
// y+55
// );

// doc.text(
// money(
// Number(invoice.totalAmount),
// invoice.currency.symbol
// ),
// 470,
// y+55,
// {align:"right"}
// );

// /*
// second currency total
// */

// if(
// invoice.exchangeRateToBase
// &&
// Number(invoice.exchangeRateToBase) !== 1
// ){

// const totalSecond =
// Number(invoice.totalAmount)
// *
// Number(invoice.exchangeRateToBase);

// const secondSymbol =
// invoice.tenant.baseCurrency?.symbol
// || "";

// doc.font("Helvetica-Bold")
//    .fontSize(12);

// doc.text(
// "TOTAL (" + secondSymbol + ")",
// 330,
// y+80
// );

// doc.text(

// money(
// totalSecond,
// secondSymbol
// ),

// 470,
// y+80,
// {align:"right"}

// );

// }

// doc.end();

// }
// }






// /////////////////////////////////////////////////////////



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

function box(doc:any,x:number,y:number,w:number,h:number){
  doc.rect(x,y,w,h).stroke();
}

function ensureSpace(doc:any,y:number,needed:number){
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

  doc.font("Helvetica-Bold")
     .fontSize(10)
     .text(label+":",x,y);

  doc.font("Helvetica")
     .fontSize(9)
     .text(value,x+85,y);
}

function tableHeader(doc:any,y:number,cols:any[]){

  box(doc,40,y,530,rowHeight);

  doc.font("Helvetica-Bold").fontSize(10);

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

constructor(private prisma:PrismaService){}

async generate(
invoiceId:number,
tenantId:number,
res:Response
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
currency selected when creating invoice
*/

const invoiceCurrencySymbol =
invoice.currency.symbol;

const invoiceCurrencyCode =
invoice.currency.code;

/*
converted total
*/

const totalSecond =
Number(invoice.totalAmount)
*
Number(invoice.exchangeRateToBase);

/*
PDF
*/

const doc =
new PDFDocument({margin:40});

res.setHeader(
"Content-Disposition",
`attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
);

res.setHeader(
"Content-Type",
"application/pdf"
);

doc.pipe(res);

/*
HEADER
*/

doc.font("Helvetica-Bold")
   .fontSize(24)
   .text("INVOICE",{align:"center"});

let y=60;

/*
INFO BOX
*/

box(doc,40,y,530,70);

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
invoice.issueDate?.toISOString().slice(0,10),
50,
y+28
);

labelValue(
doc,
"Period",
invoice.periodStart?.toISOString().slice(0,10)
+
" - " +
invoice.periodEnd?.toISOString().slice(0,10),
50,
y+46
);

labelValue(
doc,
"Currency",
invoiceCurrencyCode,
300,
y+10
);

/*
exchange rate
*/

labelValue(
doc,
"Exchange Rate",

"1 "
+
invoiceCurrencySymbol
+
" = "
+
numberFormat(
Number(invoice.exchangeRateToBase)
)
+
" "
+
invoiceCurrencyCode,

300,
y+28
);

y+=85;

/*
BILL TO
*/

box(doc,40,y,530,90);

doc.font("Helvetica-Bold")
   .fontSize(12)
   .text("BILL TO",50,y+10);

doc.font("Helvetica-Bold")
   .fontSize(11)
   .text(
     invoice.university.name,
     50,
     y+28
   );

labelValue(doc,"Address",(invoice.university.addressLine || ""),50,y+48);
labelValue(doc,"City",(invoice.university.city || ""),50,y+63);
labelValue(doc,"Country",(invoice.university.country || ""),50,y+78);

labelValue(doc,"Email",(invoice.university.contactEmail || ""),300,y+48);
labelValue(doc,"Phone",(invoice.university.contactPhone || ""),300,y+63);

y+=105;

/*
TEACHING
*/

doc.font("Helvetica-Bold")
   .fontSize(12)
   .text("Teaching Sessions",40,y);

y+=20;

const teachingCols=[
{label:"Date",x:50,w:100},
{label:"Subject",x:150,w:180},
{label:"Rate",x:330,w:100,align:"right"},
{label:"Total",x:430,w:120,align:"right"}
];

tableHeader(doc,y,teachingCols);

y+=rowHeight;

invoice.teachingSessions.forEach(s=>{

y=ensureSpace(doc,y,rowHeight);

doc.font("Helvetica").fontSize(10);

doc.text(
s.date.toISOString().slice(0,10),
50,
y+textY,
{width:100}
);

doc.text(
s.universitySubject.subject.name,
150,
y+textY,
{width:180}
);

doc.text(
money(Number(s.unitRate),invoiceCurrencySymbol),
330,
y+textY,
{width:100,align:"right"}
);

doc.text(
money(Number(s.totalAmount),invoiceCurrencySymbol),
430,
y+textY,
{width:120,align:"right"}
);

doc.moveTo(40,y+rowHeight)
   .lineTo(570,y+rowHeight)
   .stroke();

y+=rowHeight;

});

/*
SERVICE
*/

if(invoice.serviceActivities.length){

y+=25;

doc.font("Helvetica-Bold")
   .fontSize(12)
   .text("Service Activities",40,y);

y+=20;

const serviceCols=[
{label:"Date",x:50,w:100},
{label:"Service",x:150,w:230},
{label:"Amount",x:430,w:120,align:"right"}
];

tableHeader(doc,y,serviceCols);

y+=rowHeight;

invoice.serviceActivities.forEach(a=>{

y=ensureSpace(doc,y,rowHeight);

doc.font("Helvetica").fontSize(10);

doc.text(
a.date.toISOString().slice(0,10),
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
money(Number(a.totalAmount),invoiceCurrencySymbol),
430,
y+textY,
{width:120,align:"right"}
);

doc.moveTo(40,y+rowHeight)
   .lineTo(570,y+rowHeight)
   .stroke();

y+=rowHeight;

});

}

/*
TOTAL
*/

y+=30;

box(doc,320,y,250,115);

doc.fontSize(10);

doc.text("Subtotal",330,y+10);
doc.text(
money(
Number(invoice.subtotal),
invoiceCurrencySymbol
),
470,
y+10,
{align:"right"}
);

doc.text("VAT",330,y+30);
doc.text(
money(
Number(invoice.vatAmount),
invoiceCurrencySymbol
),
470,
y+30,
{align:"right"}
);

/*
main total
*/

doc.font("Helvetica-Bold")
   .fontSize(12);

doc.text("TOTAL",330,y+55);

doc.text(
money(
Number(invoice.totalAmount),
invoiceCurrencySymbol
),
470,
y+55,
{align:"right"}
);

/*
second currency total
*/

if(Number(invoice.exchangeRateToBase)!==1){

doc.text(
"TOTAL ("+invoiceCurrencyCode+")",
330,
y+80
);

doc.text(

numberFormat(totalSecond)
+
" "
+
invoiceCurrencyCode,

470,
y+80,
{align:"right"}

);

}

doc.end();

}
}

