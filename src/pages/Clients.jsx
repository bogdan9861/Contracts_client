import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import CreateClient from "../components/ui/CreateClientModal";
import { deleteClient, getClients } from "../api/endpoints/clients";

const { Search } = Input;

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const columns = [
    {
      title: "Компания",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Контактное лицо",
      dataIndex: "contactPerson",
      key: "contactPerson",
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
        <Tag
          color={
            status === "ACTIVE" ? "green" : status === "NEW" ? "blue" : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (client) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              console.log(client);

              setSelectedClient(client);
              setEditClientModalOpen(true);
            }}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить клиента?"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => handleRemoveClient(client)}
            disabled={loading}
          >
            <Button size="small">Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchClients = (search) => {
    setLoading(true);

    getClients(search)
      .then((res) => {
        setClients(
          res.data.map((el) => ({ ...el, contracts: el.contracts.length }))
        );
      })
      .catch((e) => {
        message.error("Не удалось получить клиентов");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (value) => {
    fetchClients(value);
  };

  const handleRemoveClient = (client) => {
    setRemoveLoading(true);

    setClients((prev) => prev.filter((c) => c.id !== client.id));

    deleteClient(client?.id)
      .then((res) => {
        message.success("Клиент успешно удален");
      })
      .catch((e) => {
        message.error("Не удалось удалить клиента");
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  };

  return (
    <>
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

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateClientModalOpen(true)}
              >
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
                loading={loading}
                columns={columns}
                dataSource={clients}
                pagination={{ pageSize: 6 }}
              />
            </Card>
          </div>
        </div>
      </div>
      <CreateClient
        open={createClientModalOpen}
        onClose={() => setCreateClientModalOpen(false)}
        setClients={setClients}
      />

      {editClientModalOpen && (
        <CreateClient
          data={selectedClient}
          open={editClientModalOpen}
          onClose={() => setEditClientModalOpen(false)}
          setClients={setClients}
          setData={setSelectedClient}
        />
      )}
    </>
  );
};

export default Clients;
