import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  /*
  currencies
  */

  await prisma.currency.createMany({

    data:[

      {
        id:1,
        code:'USD',
        name:'US Dollar',
        symbol:'$'
      },

      {
        id:2,
        code:'EUR',
        name:'Euro',
        symbol:'€'
      },

      {
        id:3,
        code:'LBP',
        name:'Lebanese Pound',
        symbol:'ل.ل'
      }

    ],

    skipDuplicates:true

  });

  /*
  plans
  */

  await prisma.plan.createMany({

    data:[

      {
        name:'Basic',

        priceMonthly:20,

        currencyId:1
      },

      {
        name:'Professional',

        priceMonthly:50,

        currencyId:1
      },

      {
        name:'Enterprise',

        priceMonthly:120,

        currencyId:1
      }

    ],

    skipDuplicates:true

  });

  console.log('Seed completed');

}

main()

.catch((e)=>{

  console.error(e);

  process.exit(1);

})

.finally(async()=>{

  await prisma.$disconnect();

});