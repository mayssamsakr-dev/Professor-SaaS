import {
  Card,
  Button,
  Typography,
  Layout,
  message
} from "antd";

import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";

const { Content } = Layout;

const {
  Title,
  Paragraph
} = Typography;

export default function SubscriptionPage(){

  const navigate =
    useNavigate();

  const handleSubscribe =
    async ()=>{

      const token =
        localStorage.getItem("token");

      /*
      المستخدم غير مسجل
      */

      if(!token){

        navigate("/login");

        return;

      }

      try{

        await apiClient.post(

          "/subscriptions/activate"

        );

        message.success(

          "Subscription activated"

        );

        /*
        بعد التفعيل نذهب الى dashboard
        */

        navigate("/dashboard");

      }
      catch(error:any){

        const msg =
          error?.response?.data?.message
          ||
          "Error activating subscription";

        message.error(msg);

      }

    };

  return(

    <Layout
      style={{
        minHeight:"100vh"
      }}
    >

      <Content
        style={{

          padding:"60px",

          display:"flex",

          justifyContent:"center"

        }}
      >

        <Card
          style={{

            width:420,

            textAlign:"center"

          }}
        >

          <Title level={3}>

            Subscription Required

          </Title>

          <Paragraph>

            To access the system,
            you need an active subscription.

          </Paragraph>

          <Paragraph>

            ✔ Invoices<br/>

            ✔ Teaching sessions<br/>

            ✔ Reports

          </Paragraph>

          <Button

            type="primary"

            size="large"

            block

            onClick={handleSubscribe}

          >

            Activate Subscription

          </Button>

        </Card>

      </Content>

    </Layout>

  );

}