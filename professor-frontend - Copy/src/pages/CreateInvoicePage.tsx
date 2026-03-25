import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import { universityApi } from "../api/universityApi";
import { invoiceApi } from "../api/invoiceApi";
import { currencyApi } from "../api/currencyApi";

import {
  Form,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Space,
  message,
  InputNumber,
  Alert
} from "antd";

const { Title, Text } = Typography;

export default function CreateInvoicePage(){

  const navigate = useNavigate();

  

  const [form] = Form.useForm();

  const [universities,setUniversities] =
    useState<any[]>([]);

  const [currencies,setCurrencies] =
    useState<any[]>([]);

  const [preview,setPreview] =
    useState<any>(null);


  useEffect(()=>{

    loadUniversities();

    loadCurrencies();

  },[]);


  /*
  load universities
  */

  const loadUniversities = async()=>{

    const data =
      await universityApi.getAll();

    setUniversities(data);

  };


  /*
  load currencies
  */

  const loadCurrencies = async()=>{

    const data =
      await currencyApi.getAll();

    setCurrencies(data);

  };


  /*
  preview totals
  */

  const loadPreview = async()=>{

    const values =
      form.getFieldsValue();

    if(

      !values.universityId ||

      !values.period ||

      !values.currencyId

    ){

      setPreview(null);

      return;

    }

    try{

      const res =
        await invoiceApi.preview({

          universityId:
            values.universityId,

          periodStart:
            values.period[0]
            .format("YYYY-MM-DD"),

          periodEnd:
            values.period[1]
            .format("YYYY-MM-DD"),

          currencyId:
            values.currencyId,

          exchangeRateToBase:

            values.exchangeRateToBase
              ? Number(values.exchangeRateToBase)
              : 1

        });
        
      setPreview(res);

    }
    catch{

      setPreview(null);

    }

  };


  /*
  when university changes
  auto set default currency
  */

  const handleUniversityChange = (id:number)=>{

    const uni =
      universities.find(
        x=>x.id===id
      );

    if(uni){

      form.setFieldValue(

        "currencyId",

        uni.defaultCurrencyId

      );

    }

    loadPreview();

  };


  /*
  submit
  */

  const handleSubmit = async(values:any)=>{

    try{

      await invoiceApi.createInvoice({

        universityId:
          values.universityId,

        periodStart:
          values.period[0]
          .format("YYYY-MM-DD"),

        periodEnd:
          values.period[1]
          .format("YYYY-MM-DD"),

        currencyId:
          values.currencyId,

        exchangeRateToBase:

          values.exchangeRateToBase
            ? Number(values.exchangeRateToBase)
            : 1

      });

      message.success(
        "Invoice created"
      );

      navigate("/invoices");

    }
    catch(error:any){

      message.error(

        error?.response?.data?.message
        ||
        "Error creating invoice"

      );

    }

  };

const baseCurrencyId =
  universities.find(
    u => u.id === form.getFieldValue("universityId")
  )?.defaultCurrencyId;


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

          <Title
            level={4}
            style={{margin:0}}
          >

            Create Invoice

          </Title>

        </Space>


        <Form

          form={form}

          layout="vertical"

          onValuesChange={loadPreview}

          onFinish={handleSubmit}

        >

          {/* university */}

          <Form.Item

            label="University"

            name="universityId"

            rules={[

              {

                required:true,

                message:"Select university"

              }

            ]}

          >

            <Select

              placeholder="Select University"

              onChange={

                handleUniversityChange

              }

            >

              {universities.map(u=>(

                <Select.Option

                  key={u.id}

                  value={u.id}

                >

                  {u.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>


          {/* period */}

          <Form.Item

            label="Period"

            name="period"

            rules={[

              {

                required:true,

                message:"Select period"

              }

            ]}

          >

            <DatePicker.RangePicker

              style={{width:"100%"}}

            />

          </Form.Item>


          {/* currency */}

          <Form.Item

            label="Invoice Currency"

            name="currencyId"

            rules={[{required:true}]}

          >

            <Select>

              {currencies.map(c=>(

                <Select.Option

                  key={c.id}

                  value={c.id}

                >

                  {c.code} — {c.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>


          {/* exchange */}

          <Form.Item
  label="Exchange Rate"
  name="exchangeRateToBase"
  initialValue={1}
  extra="كم تساوي 1 USD بالعملة المختارة"
>

  <InputNumber

    style={{width:"100%"}}

    min={0.000001}

    step={0.01}

    disabled={

      form.getFieldValue("currencyId") === baseCurrencyId

    }

  />

</Form.Item>


          {/* preview */}

          {preview && (

  <Alert

    type="info"

    showIcon

    message={

      <div>

        <Text>

          Sessions:
          {" "}
          {preview.sessionsCount}

        </Text>

        <br/>

        <Text>

          Activities:
          {" "}
          {preview.activitiesCount}

        </Text>

        <br/><br/>

        {

          form.getFieldValue("currencyId") !== baseCurrencyId && (

            <Text>

              Exchange rate:
              {" "}
              1 USD =

              {" "}

              <strong>

                {

                  form.getFieldValue(
                    "exchangeRateToBase"
                  ) || 1

                }

              </strong>

              {" "}

              {

                currencies.find(

                  c =>
                    c.id ===
                    form.getFieldValue("currencyId")

                )?.code

              }

            </Text>

          )

        }

        {

          form.getFieldValue("currencyId") !== baseCurrencyId && <br/>

        }

        <Text strong>

          Estimated invoice total:
          {" "}

          {Number(preview.convertedTotal).toLocaleString()}

        </Text>

      </div>

    }

    style={{ marginBottom:20 }}

  />

)}


          {/* submit */}

          <Form.Item>

            <Button

              type="primary"

              htmlType="submit"

            >

              Create Invoice

            </Button>

          </Form.Item>

        </Form>

      </Card>

    </AppLayout>

  );

}