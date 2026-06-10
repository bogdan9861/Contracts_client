import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCurrent } from "../api/endpoints/auth";

const { Sider } = Layout;

const SideMenu = ({ defaultSelectedKeys }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const defaultMenu = [
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
      key: "4",
      icon: <FileTextOutlined />,
      label: "Договоры",
      onClick: () => navigate("/contracts"),
    },
  ];

  const [menu, setMenu] = useState(defaultMenu);

  useEffect(() => {
    getCurrent()
      .then((res) => {
        localStorage.setItem("role", res.data.role);
        setUser(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) return;

    const isOwner = role === "COMPANY_OWNER";
    const isAdmin = role === "ADMIN";

    if (isAdmin) {
      setMenu([
        ...defaultMenu,
        {
          key: "3",
          icon: <TeamOutlined />,
          label: "Клиенты",
          onClick: () => navigate("/clients"),
        },
        {
          key: "5",
          icon: <DollarCircleOutlined />,
          label: "Компании",
          onClick: () => navigate("/companies"),
        },
      ]);

      return;
    }

    if (isOwner) {
      setMenu([
        ...defaultMenu,
        {
          key: "3",
          icon: <TeamOutlined />,
          label: "Клиенты",
          onClick: () => navigate("/clients"),
        },
      ]);
    } else {
      setMenu([
        ...defaultMenu,
        {
          key: "5",
          icon: <TeamOutlined />,
          label: "Компании",
          onClick: () => navigate("/companies"),
        },
      ]);
    }
  }, [user]);

  return (
    <Sider
      width={240}
      style={{
        backgroundColor: "#000",
        borderRight: "1px solid rgba(96, 87, 87, 0.3)",
      }}
    >
      <div className="h-20 flex items-center justify-center text-white text-xl font-semibold border-b border-white/10">
        CRM Система
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKeys || "1"]}
        theme="dark"
        className=" border-none mt-4"
        style={{ backgroundColor: "#000" }}
        items={menu}
      />
    </Sider>
  );
};

export default SideMenu;
