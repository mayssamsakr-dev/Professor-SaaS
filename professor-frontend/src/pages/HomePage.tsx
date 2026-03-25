import {
  Layout,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Grid
} from "antd";

import {
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

const {
  Header,
  Content,
  Footer
} = Layout;

const {
  Title,
  Paragraph,
  Text
} = Typography;

export default function HomePage(){
    const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;

  const navigate = useNavigate();

  const [token,setToken] =
    useState<string | null>(null);


  /*
  sync token
  */

  useEffect(()=>{

    const syncToken = ()=>{

      setToken(

        localStorage.getItem(
          "token"
        )

      );

    };

    syncToken();

    window.addEventListener(

      "storage",

      syncToken

    );

    return ()=>{

      window.removeEventListener(

        "storage",

        syncToken

      );

    };

  },[]);


  /*
  logout
  */

  const handleLogout = ()=>{

    localStorage.removeItem(

      "token"

    );

    setToken(null);

  };


  return(

    <Layout
      style={{
        minHeight:"100vh"
      }}
    >

      {/* HEADER */}

      <Header

  style={{

    background:"#fff",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    padding: isMobile ? "0 16px" : "0 40px",

    borderBottom:"1px solid #eee",

    flexWrap:"wrap",

    gap:10

  }}

>

        <Title
          level={4}
          style={{margin:0}}
        >

          Professor SaaS

        </Title>


        {!token ? (

          <Space

  direction={isMobile ? "vertical" : "horizontal"}

  style={{ width:"100%" }}

>

            <Button

              onClick={()=>

                navigate("/login")

              }

            >

              Login

            </Button>


            <Button

              type="primary"

              onClick={()=>

                navigate("/register")

              }

            >

              Get Started

            </Button>

          </Space>

        ) : (

          <Space>

            <Button

              onClick={()=>

                navigate("/subscription")

              }

            >

              Subscription

            </Button>

            <Button

              type="primary"

              onClick={()=>

                navigate("/dashboard")

              }

            >

              Dashboard

            </Button>

            <Button

              danger

              onClick={handleLogout}

            >

              Logout

            </Button>

          </Space>

        )}

      </Header>


      {/* HERO */}

      <Content

  style={{

    padding:

      isMobile

        ? "40px 16px"

        : "60px 40px"

  }}

>

        <Row justify="center">

          <Col
            xs={24}
            md={16}
            style={{
              textAlign:"center"
            }}
          >

            <Space
              direction="vertical"
              size={20}
            >

              <Title>

                Manage Teaching
                & Invoices Easily

              </Title>


              <Paragraph
                style={{
                  fontSize:18,
                  maxWidth:700,
                  margin:"auto"
                }}
              >

                Professional platform
                for professors to manage
                teaching sessions,
                services,
                invoices
                and payments.

              </Paragraph>


              <Space>

                {!token && (

                  <Button

                    type="primary"

                    size="large"
                    block={isMobile}

                    onClick={()=>

                      navigate("/register")

                    }

                  >

                    Start Now

                  </Button>

                )}


                <Button

                  size="large"
                  block={isMobile}

                  onClick={()=>

                    navigate("/subscription")

                  }

                >

                  View Plans

                </Button>

              </Space>

            </Space>

          </Col>

        </Row>


        {/* FEATURES */}

        <Row
          gutter={[16,16]}
          style={{
            marginTop:60
          }}
        >

          <Col xs={24} md={8}>

            <Card title="Invoices">

              Create invoices automatically
              from sessions and activities.

            </Card>

          </Col>


          <Col xs={24} md={8}>

            <Card title="Teaching">

              Track teaching sessions
              per university and subject.

            </Card>

          </Col>


          <Col xs={24} md={8}>

            <Card title="Reports">

              Analyze revenue across
              multiple currencies.

            </Card>

          </Col>

        </Row>

      </Content>


      {/* FOOTER */}

      <Footer
        style={{
          textAlign:"center"
        }}
      >

        <Text type="secondary">

          Professor SaaS © 2026

        </Text>

      </Footer>

    </Layout>

  );

}