import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(data: CreateTenantDto){

    return this.prisma.tenant.create({

      data:{

        legalName:
          data.legalName,

        email:
          data.email,

        baseCurrencyId:
          data.baseCurrencyId,

        /*
        optional fields (متوافقة مع schema)
        */

        displayName:
          data.displayName,

        phone:
          data.phone,

        addressLine:
          data.addressLine,

        city:
          data.city,

        country:
          data.country,

        taxNumber:
          data.taxNumber,

        licenseNumber:
          data.licenseNumber,

        bankName:
          data.bankName,

        iban:
          data.iban,

        swiftCode:
          data.swiftCode,

        vatEnabled:
          data.vatEnabled,

        vatRate:
          data.vatRate,

        vatExemptionNote:
          data.vatExemptionNote

      }

    });

  }

  async findAll(){

    return this.prisma.tenant.findMany({

      include:{

        baseCurrency:true

      }

    });

  }

  async findOne(id:number){

return this.prisma.tenant.findUnique({

where:{ id },

include:{
baseCurrency:true
}

});

}

async update(

id:number,

data:any

){

return this.prisma.tenant.update({

where:{ id },

data

});

}

}