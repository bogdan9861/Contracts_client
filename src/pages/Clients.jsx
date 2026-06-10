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
  Avatar,
  Tooltip,
  Modal,
  Descriptions,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  EyeOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import { getCompanyClients } from "../api/endpoints/contracts";
import { getCurrent } from "../api/endpoints/auth";
import { useNavigate } from "react-router";

const { Search } = Input;

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [userCompany, setUserCompany] = useState(null);

  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getCurrent()
      .then((res) => {
        if (res.data.role !== "COMPANY_OWNER" && res.data.role !== "ADMIN") {
          navigate("/");
          message.info("У вас нет доступа к этому разделу");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Получаем информацию о компании пользователя
  useEffect(() => {
    const fetchUserCompany = async () => {
      try {
        const res = await getCurrent();
        if (res.data.ownedCompany) {
          setUserCompany(res.data.ownedCompany);
        }
      } catch (error) {
        console.error("Ошибка получения компании:", error);
      }
    };
    fetchUserCompany();
  }, []);

  // Загружаем клиентов компании
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getCompanyClients();
      setClients(res.data);
      setFilteredClients(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Поиск клиентов
  const handleSearch = (value) => {
    if (!value.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.fullName.toLowerCase().includes(value.toLowerCase()) ||
          client.email?.toLowerCase().includes(value.toLowerCase()) ||
          client.phone?.includes(value),
      );
      setFilteredClients(filtered);
    }
  };

  // Просмотр деталей клиента
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setClientModalVisible(true);
  };

  // Колонки для таблицы клиентов
  const columns = [
    {
      title: "Клиент",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-semibold text-white">{text}</div>
            <div className="text-xs text-neutral-400">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Контактные данные",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneOutlined className="text-neutral-400" />
              <span>{record.phone}</span>
            </div>
          )}
          {record.email && (
            <div className="flex items-center gap-2 text-sm">
              <MailOutlined className="text-neutral-400" />
              <span>{record.email}</span>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Договоры",
      key: "contracts",
      align: "center",
      render: (_, record) => (
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {record.contractsCount}
          </div>
          <div className="text-xs text-neutral-400">всего договоров</div>
          {record.activeContractsCount > 0 && (
            <Tag color="green" className="mt-1">
              {record.activeContractsCount} активных
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Общая сумма",
      dataIndex: "totalContractsSum",
      key: "totalContractsSum",
      align: "right",
      render: (sum) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-green-400">
            {Number(sum).toLocaleString()} ₽
          </div>
          <div className="text-xs text-neutral-400">по всем договорам</div>
        </div>
      ),
    },
    {
      title: "Дата регистрации",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("ru-RU"),
    },
    {
      title: "Действия",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Просмотреть детали">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewClient(record)}
            >
              Детали
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Детальный просмотр клиента
  const ClientDetailModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="text-xl font-semibold">
            {selectedClient?.fullName}
          </span>
        </div>
      }
      open={clientModalVisible}
      onCancel={() => setClientModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setClientModalVisible(false)}>
          Закрыть
        </Button>,
      ]}
      width={800}
    >
      {selectedClient && (
        <div className="space-y-6">
          {/* Основная информация */}
          <Card className="bg-neutral-800 border border-white/10">
            <Descriptions column={2} labelStyle={{ color: "#9ca3af" }}>
              <Descriptions.Item label="Полное имя">
                {selectedClient.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <MailOutlined className="mr-2" />
                {selectedClient.email}
              </Descriptions.Item>
              <Descriptions.Item label="Телефон">
                <PhoneOutlined className="mr-2" />
                {selectedClient.phone || "Не указан"}
              </Descriptions.Item>
              <Descriptions.Item label="Клиент с">
                {new Date(selectedClient.createdAt).toLocaleDateString("ru-RU")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Статистика */}
          <Row gutter={16}>
            <Col span={8}>
              <Card className="bg-neutral-800 border border-white/10">
                <Statistic
                  title={
                    <span className="text-neutral-400">Всего договоров</span>
                  }
                  value={selectedClient.contractsCount}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-neutral-800 border border-white/10">
                <Statistic
                  title={
                    <span className="text-neutral-400">Активных договоров</span>
                  }
                  value={selectedClient.activeContractsCount}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#22c55e" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-neutral-800 border border-white/10">
                <Statistic
                  title={<span className="text-neutral-400">Общая сумма</span>}
                  value={selectedClient.totalContractsSum}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#10b981" }}
                  precision={2}
                  suffix="₽"
                />
              </Card>
            </Col>
          </Row>

          {/* Список договоров клиента */}
          <Card
            title={<span className="text-white">Договоры клиента</span>}
            className="bg-neutral-800 border border-white/10"
          >
            <Table
              dataSource={selectedClient.contracts}
              columns={[
                {
                  title: "Номер договора",
                  dataIndex: "number",
                  key: "number",
                  render: (text) => <span className="font-mono">{text}</span>,
                },
                {
                  title: "Дата",
                  dataIndex: "date",
                  key: "date",
                  render: (date) => new Date(date).toLocaleDateString("ru-RU"),
                },
                {
                  title: "Сумма",
                  dataIndex: "sum",
                  key: "sum",
                  align: "right",
                  render: (sum) => (
                    <span className="text-green-400">
                      {Number(sum).toLocaleString()} ₽
                    </span>
                  ),
                },
                {
                  title: "Статус",
                  key: "status",
                  render: (_, record) => (
                    <Space>
                      <Tag
                        color={
                          record.requestStatus === "APPROVED"
                            ? "green"
                            : record.requestStatus === "PENDING"
                              ? "orange"
                              : "red"
                        }
                      >
                        {record.requestStatus === "APPROVED"
                          ? "Подтверждён"
                          : record.requestStatus === "PENDING"
                            ? "На рассмотрении"
                            : "Отклонён"}
                      </Tag>
                      {record.contractStatus === "ACTIVE" && (
                        <Tag color="green">Активен</Tag>
                      )}
                      {record.contractStatus === "EXPIRED" && (
                        <Tag color="red">Просрочен</Tag>
                      )}
                      {record.contractStatus === "TERMINATED" && (
                        <Tag color="gray">Расторгнут</Tag>
                      )}
                    </Space>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </div>
      )}
    </Modal>
  );

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
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Клиенты</h1>
                <p className="text-neutral-400 mt-2">
                  Управление клиентской базой компании {userCompany?.name}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-semibold text-blue-400">
                  {clients.length}
                </div>
                <div className="text-sm text-neutral-400">всего клиентов</div>
              </div>
            </div>

            {/* Search */}
            <Card className="bg-neutral-900 border border-white/10 mb-6">
              <Search
                placeholder="Поиск клиента по имени, email или телефону..."
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => !e.target.value && handleSearch("")}
                allowClear
              />
            </Card>

            {/* Table */}
            <Card className="bg-neutral-900 border border-white/10">
              <Table
                loading={loading}
                columns={columns}
                dataSource={filteredClients}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                locale={{
                  emptyText: loading ? "Загрузка..." : "Нет клиентов",
                }}
              />
            </Card>

            {/* Информация о компании */}
            {userCompany && (
              <Card className="bg-neutral-900 border border-white/10 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Информация о компании
                    </h3>
                    <p className="text-neutral-400">
                      {userCompany.name} • ИНН: {userCompany.inn || "Не указан"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-400">
                      Общее количество договоров
                    </div>
                    <div className="text-2xl font-bold">
                      {clients.reduce(
                        (sum, client) => sum + client.contractsCount,
                        0,
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями клиента */}
      <ClientDetailModal />
    </>
  );
};

export default Clients;
