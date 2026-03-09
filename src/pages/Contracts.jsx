import React, { useState } from "react";
import { Table, Card, Button, Tag, Space, Input, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SideMenu from "../components/SideMenu";

const { Search } = Input;
const { Option } = Select;

const initialContracts = [
  {
    key: 1,
    number: "DOC-001",
    client: "ООО Альфа",
    date: "12.02.2026",
    amount: "120 000 ₽",
    status: "Активный",
  },
  {
    key: 2,
    number: "DOC-002",
    client: "ООО Бета",
    date: "03.01.2026",
    amount: "75 000 ₽",
    status: "Завершён",
  },
  {
    key: 3,
    number: "DOC-003",
    client: "ООО Гамма",
    date: "22.02.2026",
    amount: "210 000 ₽",
    status: "Просрочен",
  },
];

const Contracts = () => {
  const [contracts, setContracts] = useState(initialContracts);

  const columns = [
    {
      title: "Номер договора",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Клиент",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Активный"
            ? "green"
            : status === "Завершён"
            ? "blue"
            : "red";

        return <Tag color={color}>{status}</Tag>;
      },
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
    const filtered = initialContracts.filter((contract) =>
      contract.number.toLowerCase().includes(value.toLowerCase())
    );

    setContracts(filtered);
  };

  const handleFilter = (value) => {
    if (!value) {
      setContracts(initialContracts);
      return;
    }

    const filtered = initialContracts.filter(
      (contract) => contract.status === value
    );

    setContracts(filtered);
  };

  return (
    <div className="flex">
      <SideMenu defaultSelectedKeys={"4"} />
      <div
        className="min-h-screen bg-neutral-950 text-white p-10"
        style={{ width: "100%" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Договоры</h1>
              <p className="text-neutral-400 mt-2">
                Управление договорами предприятия
              </p>
            </div>

            <Button type="primary" icon={<PlusOutlined />}>
              Создать договор
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-neutral-900 border border-white/10 mb-6">
            <div className="flex gap-4">
              <Search
                placeholder="Поиск по номеру договора..."
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ maxWidth: 300 }}
              />

              <Select
                placeholder="Фильтр по статусу"
                allowClear
                style={{ width: 220 }}
                onChange={handleFilter}
              >
                <Option value="Активный">Активные</Option>
                <Option value="Завершён">Завершённые</Option>
                <Option value="Просрочен">Просроченные</Option>
              </Select>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-neutral-900 border border-white/10">
            <Table
              columns={columns}
              dataSource={contracts}
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
