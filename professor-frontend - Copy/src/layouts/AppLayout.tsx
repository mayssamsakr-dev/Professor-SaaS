import { Layout, Menu, Input, Avatar, Dropdown, Space} from "antd";
import type { MenuProps } from "antd";
import { Button } from "antd";
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
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";



const { Header, Sider, Content } = Layout;
const { Search } = Input;

export default function AppLayout({ children }: any) {

  const [collapsed, setCollapsed] = useState(false);

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
      type: "divider" as const,
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

      {/* Sidebar */}
      <Sider breakpoint="lg"

  collapsedWidth="0"

  onBreakpoint={(broken) => {

    setCollapsed(broken);

  }}

  collapsed={collapsed} width={250} style={{ background: "#0f172a" }}>

        <div style={{ padding: 20, color: "#fff", fontWeight: 600, fontSize: 18 }}>
          Professor SaaS
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: "#0f172a", borderRight: 0 }}
        >

          {/* Core */}
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="/invoices" icon={<FileTextOutlined />}>
            <Link to="/invoices">Invoices</Link>
          </Menu.Item>

          <Menu.Item key="/reports" icon={<BarChartOutlined />}>
            <Link to="/reports">Reports</Link>
          </Menu.Item>

          {/* Divider */}
          <Menu.Divider />

          {/* Academic */}
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

          {/* Services */}
          <Menu.Item key="/service-types" icon={<ToolOutlined />}>
            <Link to="/service-types">Service Types</Link>
          </Menu.Item>

          <Menu.Item key="/service-activities" icon={<ToolOutlined />}>
            <Link to="/service-activities">Service Activities</Link>
          </Menu.Item>

          <Menu.Divider />

          {/* System */}
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>

        </Menu>
      </Sider>

      {/* Main */}
      <Layout>

        {/* Header */}
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}

        >

          {/* Search */}
          <Search
            placeholder="Search..."
            style={{ width: 300 }}
          />

          {/* Right side */}
          <Space size="middle">

            <BellOutlined style={{ fontSize: 18 }} />

            <Dropdown menu={userMenu}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Dropdown>

          </Space>

          <Button

  type="text"

  onClick={() => setCollapsed(!collapsed)}

  style={{

    fontSize: 18

  }}

>

☰

</Button>

        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
            background: "#f3f4f6",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 16,
              minHeight: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {children}
          </div>
        </Content>

      </Layout>
    </Layout>
  );
}