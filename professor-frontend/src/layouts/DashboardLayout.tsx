import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";

/*
Dashboard Layout (بدون أي logic)
*/

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }: any) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Sider>
        <Menu theme="dark" mode="inline">

          <Menu.Item key="dashboard">
            <Link to="/">Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="invoices">
            <Link to="/invoices">Invoices</Link>
          </Menu.Item>

          <Menu.Item key="reports">
            <Link to="/reports">Reports</Link>
          </Menu.Item>

          <Menu.Item key="universities">
            <Link to="/universities">Universities</Link>
          </Menu.Item>

          <Menu.Item key="subjects">
            <Link to="/subjects">Subjects</Link>
          </Menu.Item>

          <Menu.Item key="university-subjects">
            <Link to="/university-subjects">University Subjects</Link>
          </Menu.Item>

          <Menu.Item key="teaching-sessions">
            <Link to="/teaching-sessions">Teaching Sessions</Link>
          </Menu.Item>

          <Menu.Item key="service-types">
            <Link to="/service-types">Service Types</Link>
          </Menu.Item>

          <Menu.Item key="service-activities">
            <Link to="/service-activities">Service Activities</Link>
          </Menu.Item>

          <Menu.Item key="users">
            <Link to="/users">Users</Link>
          </Menu.Item>

        </Menu>
      </Sider>

      <Layout>

        <Header style={{ background: "#fff", display: "flex", justifyContent: "flex-end" }}>
          <Button
            danger
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </Header>

        <Content style={{ margin: "20px" }}>
          {children}
        </Content>

      </Layout>
    </Layout>
  );
}