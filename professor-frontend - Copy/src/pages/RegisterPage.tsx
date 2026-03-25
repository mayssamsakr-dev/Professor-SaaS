import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { currencyApi } from "../api/currencyApi";

import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Select,
  Space
} from "antd";

const { Title, Text } = Typography;

export default function RegisterPage(){

  const [loading,setLoading] = useState(false);

  const [currencies,setCurrencies] = useState<any[]>([]);

  const navigate = useNavigate();


  /*
  load currencies
  */
  useEffect(()=>{

    loadCurrencies();

    /*
    تأكد عدم وجود token قديم
    */
    localStorage.removeItem("token");

  },[]);


  const loadCurrencies = async()=>{

    try{

      const data =
        await currencyApi.getAll();

      setCurrencies(data);

    }
    catch{

      message.error(
        "Cannot load currencies"
      );

    }

  };


  /*
  register
  */
  const handleRegister = async(values:any)=>{

    try{

      setLoading(true);

      await apiClient.post(

        "/auth/register",

        values

      );

      message.success(

        "Account created"

      );

      /*
      بعد التسجيل
      يذهب الى login
      */

      navigate("/login");

    }
    catch(err:any){

      message.error(

        err?.response?.data?.message
        ||
        "Registration failed"

      );

    }
    finally{

      setLoading(false);

    }

  };


  return(

    <div

      style={{

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        height:"100vh",

        background:"#f5f7fa"

      }}

    >

      <Card

        style={{

          width:420,

          boxShadow:

            "0 4px 12px rgba(0,0,0,0.08)"

        }}

      >

        <Space
          direction="vertical"
          style={{width:"100%"}}
          size={20}
        >

          <div>

            <Title level={4}>

              Create Account

            </Title>

            <Text type="secondary">

              Create your tenant and owner user

            </Text>

          </div>

          <Form

            layout="vertical"

            onFinish={handleRegister}

          >

            {/* tenant */}

            <Form.Item

              name="legalName"

              label="Legal Name"

              rules={[{required:true}]}

            >

              <Input placeholder="Dr. John Doe" />

            </Form.Item>


            <Form.Item

              name="baseCurrencyId"

              label="Base Currency"

              rules={[{required:true}]}

            >

              <Select
                placeholder="Select currency"
                showSearch
                optionFilterProp="children"
              >

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


            {/* owner */}

            <Form.Item

              name="fullName"

              label="Full Name"

              rules={[{required:true}]}

            >

              <Input />

            </Form.Item>


            <Form.Item

              name="email"

              label="Email"

              rules={[

                {
                  required:true,
                  type:"email"
                }

              ]}

            >

              <Input />

            </Form.Item>


            <Form.Item

              name="password"

              label="Password"

              rules={[

                {
                  required:true,
                  min:6
                }

              ]}

            >

              <Input.Password />

            </Form.Item>


            <Button

              type="primary"

              htmlType="submit"

              loading={loading}

              block

            >

              Register

            </Button>

          </Form>


          <Text>

            Already have account?{" "}

            <a href="/login">

              Login

            </a>

          </Text>

        </Space>

      </Card>

    </div>

  );

}