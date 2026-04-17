import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const SideMenu = ({ defaultSelectedKeys }) => {
  const navigate = useNavigate();

  return (
    <Sider
      width={240}
      style={{
        backgroundColor: "#000",
        borderRight: "1px solid rgba(96, 87, 87, 0.3)",
      }}
    >
      <div className="h-20 flex items-center justify-center text-white text-xl font-semibold border-b border-white/10">
        CRM System
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKeys || "1"]}
        theme="dark"
        className=" border-none mt-4"
        style={{ backgroundColor: "#000" }}
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "Главная",
            onClick: () => navigate("/"),
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: "Профиль",
            onClick: () => navigate("/profile"),
          },
          {
            key: "3",
            icon: <TeamOutlined />,
            label: "Клиенты",
            onClick: () => navigate("/clients"),
          },
          {
            key: "4",
            icon: <FileTextOutlined />,
            label: "Договоры",
            onClick: () => navigate("/contracts"),
          },
        ]}
      />
    </Sider>
  );
};

export default SideMenu;
