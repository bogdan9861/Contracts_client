import React, { useEffect, useState } from "react";
import { Table, Card, Button, Tag, Space, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import { getContracts } from "../api/endpoints/contracts";
import CreateContractModal from "../components/ui/CreateContractModal";
import { getClients } from "../api/endpoints/clients";

const { Search } = Input;
const { Option } = Select;

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contractsModalOpen, setContractsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [editContractModalOpen, setEditContractModalOpen] = useState(false);

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
      render: (client) => {
        return (
          <span>
            {client?.companyName || client?.contactPerson || "Не указано"}
          </span>
        );
      },
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "sum",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "ACTIVE" ? "green" : status === "NEW" ? "blue" : "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (contract) => (
        <Space>
          {contract?.fileUrl && (
            <Button
              size="small"
              onClick={() => {
                window.open(contract?.fileUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Открыть
            </Button>
          )}

          <Button
            size="small"
            onClick={() => {
              setSelectedContract(contract);
              setEditContractModalOpen(true);
            }}
          >
            Редактировать
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getContracts()
      .then((res) => {
        console.log("res.data", res.data);

        setContracts(res.data);
      })
      .catch((e) => {
        message.error("Не удалось получить договоры");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (value) => {
    const filtered = contracts.filter((contract) =>
      contract.number.toLowerCase().includes(value.toLowerCase())
    );

    setContracts(filtered);
  };

  return (
    <>
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

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setContractsModalOpen(true)}
              >
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

                {/* <Select
                  placeholder="Фильтр по статусу"
                  allowClear
                  style={{ width: 220 }}
                  onChange={handleFilter}
                >
                  <Option value="ACTIVE">Активные</Option>
                  <Option value="CLOSED">Завершённые</Option>
                  <Option value="EXPIRED">Просроченные</Option>
                </Select> */}
              </div>
            </Card>

            {/* Table */}
            <Card className="bg-neutral-900 border border-white/10">
              <Table
                columns={columns}
                dataSource={contracts}
                pagination={{ pageSize: 6 }}
                loading={loading}
              />
            </Card>
          </div>
        </div>
      </div>
      <CreateContractModal
        open={contractsModalOpen}
        onClose={() => setContractsModalOpen(false)}
        setContracts={setContracts}
      />

      {editContractModalOpen && (
        <CreateContractModal
          open={editContractModalOpen}
          onClose={() => setEditContractModalOpen(false)}
          setContracts={setContracts}
          data={selectedContract}
          setData={setSelectedContract}
        />
      )}
    </>
  );
};

export default Contracts;
