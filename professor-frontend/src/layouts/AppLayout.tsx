import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  Space,
  Button,
  Grid,
  Drawer
} from "antd";

import type { MenuProps } from "antd";

import { useState } from "react";

import {
  DashboardOutlined,
  FileTextOutlined,
  BankOutlined,
  BookOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ToolOutlined,
  UserOutlined,
  BellOutlined,
  MenuOutlined
} from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

export default function AppLayout({ children }: any) {

  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();


  const userMenu: MenuProps = {

    items: [

      {
        key: "profile",
        label: "Profile",
        onClick: () => {
          window.location.href = "/profile";
        },
      },

      {
        type: "divider",
      },

      {
        key: "logout",
        label: "Logout",
        onClick: () => {

          localStorage.removeItem("token");

          window.location.href = "/login";

        },
      },

    ],

  };


  /*
  sidebar menu
  */

  const menu = (

    <>

      <Link to="/" style={{ textDecoration: "none" }}>

        <div
          style={{
            padding: 20,
            color: "#fff",
            fontWeight: 600,
            fontSize: 18
          }}
        >

          Professor SaaS

        </div>

      </Link>


      <Menu

        theme="dark"

        mode="inline"

        selectedKeys={[location.pathname]}

        style={{

          background: "#0f172a",

          borderRight: 0,
          height:"100%"

        }}

        onClick={() => {

          if (isMobile) {

            setMobileOpen(false);

          }

        }}

        items={[

          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>
          },

          {
            key: "/invoices",
            icon: <FileTextOutlined />,
            label: <Link to="/invoices">Invoices</Link>
          },

          { type: "divider" },

          {
            key: "/universities",
            icon: <BankOutlined />,
            label: <Link to="/universities">Universities</Link>
          },

          {
            key: "/subjects",
            icon: <BookOutlined />,
            label: <Link to="/subjects">Subjects</Link>
          },

          {
            key: "/university-subjects",
            icon: <AppstoreOutlined />,
            label: <Link to="/university-subjects">University Subjects</Link>
          },

          {
            key: "/teaching-sessions",
            icon: <CalendarOutlined />,
            label: <Link to="/teaching-sessions">Teaching Sessions</Link>
          },

          { type: "divider" },

          {
            key: "/service-types",
            icon: <ToolOutlined />,
            label: <Link to="/service-types">Service Types</Link>
          },

          {
            key: "/service-activities",
            icon: <ToolOutlined />,
            label: <Link to="/service-activities">Service Activities</Link>
          },

          { type: "divider" },

          {
            key: "/users",
            icon: <UserOutlined />,
            label: <Link to="/users">Users</Link>
          }

        ]}

      />

    </>

  );


  return (

    <Layout style={{ minHeight: "100vh" }}>


      {/* desktop sidebar */}

      {!isMobile && (

        <Sider

          collapsible

          collapsed={collapsed}

          onCollapse={setCollapsed}

          width={250}

          style={{

            background: "#0f172a"

          }}

        >

          {menu}

        </Sider>

      )}



      {/* mobile drawer */}

      {isMobile && (

        // <Drawer

        //   open={mobileOpen}

        //   onClose={() => setMobileOpen(false)}

        //   placement="left"

        //   bodyStyle={{ padding: 0 }}

        //   width={250}

        // >

        //   {menu}

        // </Drawer>
        <Drawer

  open={mobileOpen}

  onClose={() => setMobileOpen(false)}

  placement="left"

  width={250}

  styles={{

    body:{
      padding:0,
      background:"#0f172a"
    },

    header:{
      display:"none"
    }

  }}
        

>
  {menu}
</Drawer>

      )}



      <Layout>


        {/* header */}

        <Header

          style={{

            background: "#ffffff",

            padding: isMobile ? "0 12px" : "0 24px",

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            borderBottom: "1px solid #e5e7eb",

            gap: 12

          }}

        >

          <Space size="middle">


            {isMobile && (

              <Button

                type="text"

                icon={<MenuOutlined />}

                onClick={() => setMobileOpen(true)}

              />

            )}


            <Search

              placeholder="Search..."

              style={{

                width: isMobile ? 150 : 300

              }}

            />


          </Space>



          <Space size="middle">

            <BellOutlined style={{ fontSize: 18 }} />


            <Dropdown menu={userMenu}>

              <Space style={{ cursor: "pointer" }}>

                <Avatar icon={<UserOutlined />} />

              </Space>

            </Dropdown>


          </Space>


        </Header>



        <Content

          style={{

            margin: isMobile ? 12 : 24,

            background: "#f3f4f6",

            minHeight: "calc(100vh - 64px)"

          }}

        >


          <div

            style={{

              background: "#ffffff",

              padding: isMobile ? 16 : 24,

              borderRadius: 16,

              minHeight: "100%",

              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"

            }}

          >

            {children}

          </div>


        </Content>


      </Layout>


    </Layout>

  );

}