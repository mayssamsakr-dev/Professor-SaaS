import { useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space
} from "antd";

const { Title, Text } = Typography;

export default function LoginPage(){

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);


  /*
  remove old token
  */
  useEffect(()=>{

    localStorage.removeItem("token");

  },[]);


  /*
  login
  */
  const handleLogin = async(values:any)=>{

    try{

      setLoading(true);

      const res =
        await apiClient.post(

          "/auth/login",

          values

        );

      localStorage.setItem(

        "token",

        res.data.accessToken

      );

      /*
      بعد login
      نعود الى homepage
      */

      navigate("/");

    }
    catch(error:any){

      const msg =
        error?.response?.data?.message
        ||
        "Login failed";

      message.error(msg);

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

              Login

            </Title>

            <Text type="secondary">

              Access your account

            </Text>

          </div>

          <Form

            layout="vertical"

            onFinish={handleLogin}

          >

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

              <Input placeholder="email"/>

            </Form.Item>


            <Form.Item

              name="password"

              label="Password"

              rules={[

                {
                  required:true
                }

              ]}

            >

              <Input.Password/>

            </Form.Item>


            <Button

              type="primary"

              htmlType="submit"

              loading={loading}

              block

            >

              Login

            </Button>

          </Form>


          <Text>

            Don't have account?{" "}

            <a href="/register">

              Register

            </a>

          </Text>

        </Space>

      </Card>

    </div>

  );

}