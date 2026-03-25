/*
تنسيق التاريخ
*/
export const formatDate = (date: string) => {

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;

};


/*
تنسيق المبالغ المالية بناءً على العملة
يدعم:
"USD"
أو
{ code: "USD" }
*/
export const formatCurrency = (

  amount: number,

  currency?: any

) => {

  let currencyCode = "USD";

  if (typeof currency === "string") {

    currencyCode = currency;

  }
  else if (

    currency &&
    typeof currency === "object" &&
    currency.code

  ) {

    currencyCode = currency.code;

  }

  return new Intl.NumberFormat(

    "en-US",

    {

      style: "currency",

      currency: currencyCode

    }

  ).format(Number(amount) || 0);

};