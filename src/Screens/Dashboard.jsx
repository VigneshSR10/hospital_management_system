import React from "react";
import {
  Card,
  Grid,
  Menu,
  Layout,
  Typography,
  Space
} from "antd";
import { Outlet, Link } from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined
} from "@ant-design/icons";
import HMS from '../assets/Images/HMS.svg'
import '../Styles/dashboard.css';
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
export default function Dashboard() {
  const screens = useBreakpoint();
  return (
    <Layout className="dashboard-layout">
      <Sider
        collapsible
        collapsed={!screens.md}
        breakpoint="md"
        width={80}
        theme="dark"
        className="dashboard-sider"
      >
         <div className="sidebar-logo">
  <img src={HMS} alt="Hospital Logo" className="logo-img" />
  </div>
        <Menu
          mode="vertical"
          theme="dark"
          defaultSelectedKeys={["billing"]}
        >
          <Menu.Item key="billing" icon={<DashboardOutlined color="red" />}>
            <Link to="/billing" />
          </Menu.Item>
          <Menu.Item key="invoices" icon={<FileTextOutlined />}>
          </Menu.Item>
          <Menu.Item key="patients" icon={<UserOutlined />}>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <Space className="header-left">
            <Title level={5} className="app-title">
              Hospital Management System
            </Title>
          </Space>
          <Space size="large" className="header-right">
            <Text type="secondary">Admin</Text>
            <SearchOutlined className="header-icon" />
            <Card size="small" className="menu-button">
              <Space>
                Menu <MenuOutlined />
              </Space>
            </Card>
          </Space>
        </Header>
        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
