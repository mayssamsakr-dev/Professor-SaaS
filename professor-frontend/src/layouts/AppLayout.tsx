import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  Space,
  Button,
  Grid
} from "antd";

import type { MenuProps } from "antd";

import { useState } from "react";

import {
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
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

  const [collapsed, setCollapsed] = useState(!screens.md);

  const location = useLocation();

  const isMobile = !screens.md;

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

  return (

    <Layout style={{ minHeight: "100vh" }}>

      <Sider

        breakpoint="md"

        collapsedWidth={isMobile ? 0 : 80}

        collapsed={isMobile ? collapsed : false}

        trigger={null}

        width={250}

        style={{
          background: "#0f172a",
        }}

      >
      <Link
  to="/"
  style={{
    textDecoration:"none"
  }}
>
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
            borderRight: 0
          }}

          onClick={()=>{
            if(isMobile){
              setCollapsed(true);
            }
          }}

        >

          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>

            <Link to="/dashboard">Dashboard</Link>

          </Menu.Item>

          <Menu.Item key="/invoices" icon={<FileTextOutlined />}>

            <Link to="/invoices">Invoices</Link>

          </Menu.Item>

          <Menu.Item key="/reports" icon={<BarChartOutlined />}>

            <Link to="/reports">Reports</Link>

          </Menu.Item>

          <Menu.Divider />

          <Menu.Item key="/universities" icon={<BankOutlined />}>

            <Link to="/universities">Universities</Link>

          </Menu.Item>

          <Menu.Item key="/subjects" icon={<BookOutlined />}>

            <Link to="/subjects">Subjects</Link>

          </Menu.Item>

          <Menu.Item key="/university-subjects" icon={<AppstoreOutlined />}>

            <Link to="/university-subjects">University Subjects</Link>

          </Menu.Item>

          <Menu.Item key="/teaching-sessions" icon={<CalendarOutlined />}>

            <Link to="/teaching-sessions">Teaching Sessions</Link>

          </Menu.Item>

          <Menu.Divider />

          <Menu.Item key="/service-types" icon={<ToolOutlined />}>

            <Link to="/service-types">Service Types</Link>

          </Menu.Item>

          <Menu.Item key="/service-activities" icon={<ToolOutlined />}>

            <Link to="/service-activities">Service Activities</Link>

          </Menu.Item>

          <Menu.Divider />

          <Menu.Item key="/users" icon={<UserOutlined />}>

            <Link to="/users">Users</Link>

          </Menu.Item>

        </Menu>

      </Sider>

      <Layout>

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

                onClick={() => setCollapsed(!collapsed)}

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