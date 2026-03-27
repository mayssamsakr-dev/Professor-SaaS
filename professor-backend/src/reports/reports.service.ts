import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class ReportsService {

  constructor(private prisma: PrismaService) {}

  /*
  Helper: filter by date
  */
  private buildDateFilter(dateFrom?: string, dateTo?: string) {

    const filter: any = {};

    if (dateFrom || dateTo) {

      filter.issueDate = {};

      if (dateFrom) {
        filter.issueDate.gte = new Date(dateFrom);
      }

      if (dateTo) {
        filter.issueDate.lte = new Date(dateTo);
      }

    }

    return filter;

  }

  async revenueSummary(tenantId: number, dateFrom?: string, dateTo?: string) {

  const invoices = await this.prisma.invoice.findMany({

    where:{
      tenantId,
      status:'FINALIZED',
      ...this.buildDateFilter(dateFrom,dateTo)
    },

    include:{
      currency:true
    }

  });


  const map:any = {};


  for(const inv of invoices){

    const code = inv.currency.code;

    if(!map[code]){

      map[code] = {

        currencyCode:code,

        totalRevenue:0,

        paidRevenue:0,

        unpaidRevenue:0,

        invoiceCount:0

      };

    }


    map[code].totalRevenue += Number(inv.totalAmount);

    map[code].invoiceCount += 1;


    if(inv.paymentStatus === PaymentStatus.PAID){

      map[code].paidRevenue += Number(inv.totalAmount);

    }
    else{

      map[code].unpaidRevenue += Number(inv.totalAmount);

    }

  }


  return Object.values(map);

}

  async revenueByUniversity(

tenantId:number,

dateFrom?:string,

dateTo?:string

){

const invoices = await this.prisma.invoice.findMany({

where:{
tenantId,
status:'FINALIZED',
...this.buildDateFilter(dateFrom,dateTo)
},

include:{
university:true,
currency:true
}

});


const map:any = {};


for(const inv of invoices){

const key =
inv.university.name + "_" + inv.currency.code;


if(!map[key]){

map[key] = {

universityName:inv.university.name,

currencyCode:inv.currency.code,

total:0

};

}


map[key].total += Number(inv.totalAmount);

}


return Object.values(map);

}

  async monthlyRevenue(

tenantId:number,

dateFrom?:string,

dateTo?:string

){

const invoices = await this.prisma.invoice.findMany({

where:{
tenantId,
status:'FINALIZED',
...this.buildDateFilter(dateFrom,dateTo)
},

include:{
currency:true
}

});


const map:any = {};


for(const inv of invoices){

const month =
new Date(inv.issueDate)
.toISOString()
.slice(0,7);


const key =
month + "_" + inv.currency.code;


if(!map[key]){

map[key] = {

month,

currencyCode:inv.currency.code,

total:0

};

}


map[key].total += Number(inv.totalAmount);

}


return Object.values(map);

}

}