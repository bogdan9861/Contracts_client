import React, { useState } from "react";
import { Table, Card, Input, Button, Tag, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import SideMenu from "../components/SideMenu";

const { Search } = Input;

const initialClients = [
  {
    key: 1,
    name: "ООО Альфа",
    contact: "Иван Петров",
    email: "alpha@mail.com",
    phone: "+7 900 111 22 33",
    contracts: 3,
    status: "Активный",
  },
  {
    key: 2,
    name: "ООО Бета",
    contact: "Анна Соколова",
    email: "beta@mail.com",
    phone: "+7 900 444 55 66",
    contracts: 1,
    status: "Новый",
  },
  {
    key: 3,
    name: "ООО Гамма",
    contact: "Дмитрий Иванов",
    email: "gamma@mail.com",
    phone: "+7 900 777 88 99",
    contracts: 5,
    status: "Активный",
  },
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);

  const columns = [
    {
      title: "Компания",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Контактное лицо",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Договоры",
      dataIndex: "contracts",
      key: "contracts",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Активный" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: () => (
        <Space>
          <Button size="small">Открыть</Button>
          <Button size="small">Редактировать</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    const filtered = initialClients.filter((client) =>
      client.name.toLowerCase().includes(value.toLowerCase())
    );

    setClients(filtered);
  };

  return (
    <div className="flex">
      <SideMenu defaultSelectedKeys={"3"} />
      <div
        className="min-h-screen bg-neutral-950 text-white p-10"
        style={{ width: "100%" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Клиенты</h1>
              <p className="text-neutral-400 mt-2">
                Управление клиентской базой предприятия
              </p>
            </div>

            <Button type="primary" icon={<PlusOutlined />}>
              Добавить клиента
            </Button>
          </div>

          {/* Search */}
          <Card className="bg-neutral-900 border border-white/10 mb-6">
            <Search
              placeholder="Поиск клиента по названию компании..."
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Card>

          {/* Table */}
          <Card className="bg-neutral-900 border border-white/10">
            <Table
              columns={columns}
              dataSource={clients}
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clients;
