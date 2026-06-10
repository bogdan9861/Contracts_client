import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Row,
  Col,
  Statistic,
  message,
  Tag,
  Tabs,
  Table,
  Space,
  Tooltip,
  Radio,
  Slider,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  LoginOutlined,
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import { getCurrent } from "../api/endpoints/auth";
import { getAuditLogs } from "../api/endpoints/auditLogs";
import { getMyContracts, getCompanyClients } from "../api/endpoints/contracts";
import EditProfileModal from "../components/ui/EditProfileModal";
import { useNavigate } from "react-router";
import { enums, roles } from "../constants";

const AUDIT_TYPES = {
  CONTRACT_REQUEST_RECEIVED: "Запрос на договор",
  CONTRACT_APPROVED: "Договор подтверждён",
  CONTRACT_REJECTED: "Договор отклонён",
  CREATE_CONTRACT: "Создание договора",
  APPROVE_CONTRACT: "Подтверждение договора",
  REJECT_CONTRACT: "Отклонение договора",
  USER_UPDATED: "Обновление профиля",
  COMPANY_UPDATED: "Обновление компании",
};

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    ownedCompany: null,
    createdAt: "",
  });
  const [logs, setLogs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");

  const isOwner = user.role === "COMPANY_OWNER";
  const isClient = user.role === "CLIENT";

  useEffect(() => {
    const theme = localStorage.getItem(enums.THEME);

    setTheme(theme);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.body.style.filter = "invert()";
    } else {
      document.body.style.filter = "";
    }
  }, [theme]);

  useEffect(() => {
    loadUserData();
    loadAuditLogs();
  }, []);

  useEffect(() => {
    if (user.id) {
      if (isOwner) {
        loadCompanyClients();
      }
      loadUserContracts();
    }
  }, [user.id, isOwner]);

  const loadUserData = async () => {
    try {
      const res = await getCurrent();
      setUser(res.data);
    } catch (error) {
      message.error("При получении данных профиля произошла ошибка");
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await getAuditLogs();
      setLogs(res.data);
    } catch (error) {
      message.error("Не удалось получить историю активности");
    }
  };

  const loadUserContracts = async () => {
    setLoading(true);
    try {
      const res = await getMyContracts();
      setContracts(res.data);
    } catch (error) {
      message.error("Не удалось загрузить договоры");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyClients = async () => {
    if (!isOwner) return;
    try {
      const res = await getCompanyClients();
      setClients(res.data);
    } catch (error) {
      message.error("Не удалось загрузить список клиентов");
    }
  };

  const logout = () => {
    navigate("/auth", { replace: true });
    localStorage.removeItem(enums.TOKEN);
    localStorage.removeItem("role");
  };

  // Колонки для таблицы договоров
  const contractColumns = [
    {
      title: "Номер договора",
      dataIndex: "number",
      key: "number",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: isOwner ? "Клиент" : "Компания",
      dataIndex: isOwner ? "client" : "company",
      key: "party",
      render: (party) => (
        <Space>
          <UserOutlined />
          <span className="text-white">{party?.fullName || party?.name}</span>
        </Space>
      ),
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "sum",
      render: (sum) => (
        <span className="text-green-400">{Number(sum).toLocaleString()} ₽</span>
      ),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("ru-RU"),
    },
    {
      title: "Статус запроса",
      dataIndex: "requestStatus",
      key: "requestStatus",
      render: (status) => {
        const statusConfig = {
          PENDING: {
            color: "orange",
            icon: <ClockCircleOutlined />,
            text: "На рассмотрении",
          },
          APPROVED: {
            color: "green",
            icon: <CheckCircleOutlined />,
            text: "Подтверждён",
          },
          REJECTED: {
            color: "red",
            icon: <CloseCircleOutlined />,
            text: "Отклонён",
          },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Статус договора",
      dataIndex: "contractStatus",
      key: "contractStatus",
      render: (status) => {
        const statusConfig = {
          ACTIVE: { color: "green", text: "Активен" },
          EXPIRED: { color: "red", text: "Просрочен" },
          TERMINATED: { color: "gray", text: "Расторгнут" },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // Колонки для таблицы клиентов (только для владельца)
  const clientColumns = [
    {
      title: "Клиент",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span className="text-white">{text}</span>
        </Space>
      ),
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
      render: (phone) => phone || "Не указан",
    },
    {
      title: "Договоров",
      dataIndex: "contractsCount",
      key: "contractsCount",
      render: (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: "Активных договоров",
      dataIndex: "activeContractsCount",
      key: "activeContractsCount",
      render: (count) => <Tag color="green">{count}</Tag>,
    },
  ];

  // Подсчёт статистики по договорам
  const getContractStats = () => {
    const stats = {
      total: contracts.length,
      active: contracts.filter(
        (c) => c.contractStatus === "ACTIVE" && c.requestStatus === "APPROVED",
      ).length,
      pending: contracts.filter((c) => c.requestStatus === "PENDING").length,
      approved: contracts.filter((c) => c.requestStatus === "APPROVED").length,
      rejected: contracts.filter((c) => c.requestStatus === "REJECTED").length,
      totalSum: contracts.reduce(
        (sum, c) => sum + (c.requestStatus === "APPROVED" ? Number(c.sum) : 0),
        0,
      ),
    };
    return stats;
  };

  const contractStats = getContractStats();

  const toggleTheme = () => {
    localStorage.setItem(enums.THEME, theme === "light" ? "dark" : "light");

    const toggleTheme = window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          key: enums.THEME,
          newValue: theme === "light" ? "dark" : "light",
          url: window.location.href,
        },
      }),
    );

    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <div className="flex" style={{ width: "100%", minHeight: "100vh" }}>
        <SideMenu defaultSelectedKeys={"2"} />
        <div
          className="min-h-screen bg-neutral-950 text-white p-10"
          style={{ width: "100%", overflow: "auto" }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div>
              <div
                className="flex"
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="mb-10">
                  <h1 className="text-4xl font-bold tracking-tight">
                    Профиль пользователя
                  </h1>
                  <p className="text-neutral-400 mt-2">
                    Информация о пользователе системы
                  </p>
                </div>
                <Tooltip title="Выйти">
                  <Button
                    type="text"
                    danger
                    icon={<LoginOutlined style={{ fontSize: 20 }} />}
                    onClick={logout}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Profile card */}
            <Card
              className="bg-neutral-900 border border-white/10 mb-8"
              loading={loading}
            >
              <div className="flex items-center gap-6 flex-wrap">
                <Avatar size={90} icon={<UserOutlined />} />

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                  <div className="flex gap-2 mt-1">
                    <Tag color={isOwner ? "blue" : "green"} className="mt-1">
                      {roles[user?.role]}
                    </Tag>
                    {user.ownedCompany && (
                      <Tag color="purple" icon={<ShopOutlined />}>
                        {user.ownedCompany.name}
                      </Tag>
                    )}
                  </div>
                  <p className="text-neutral-400 mt-2">
                    Зарегистрирован:{" "}
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>

                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => setEditProfileModalOpen(true)}
                >
                  Редактировать профиль
                </Button>
              </div>
            </Card>

            {/* Information */}
            <Row gutter={24} className="mt-7 mb-8">
              <Col span={14}>
                <Card
                  title={<span className="text-white">Личная информация</span>}
                  className="bg-neutral-900 border border-white/10"
                  style={{ height: "100%" }}
                  loading={loading}
                >
                  <Descriptions column={1} labelStyle={{ color: "#9ca3af" }}>
                    <Descriptions.Item label="Полное имя">
                      {user.fullName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                      <span className="flex items-center gap-2">
                        <MailOutlined /> {user.email}
                      </span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Телефон">
                      <span className="flex items-center gap-2">
                        <PhoneOutlined /> {user.phone || "Не указан"}
                      </span>
                    </Descriptions.Item>

                    {user.ownedCompany && (
                      <>
                        <Descriptions.Item label="Компания">
                          <span className="flex items-center gap-2">
                            <ShopOutlined /> {user.ownedCompany.name}
                          </span>
                        </Descriptions.Item>
                        {user.ownedCompany.inn && (
                          <Descriptions.Item label="ИНН">
                            {user.ownedCompany.inn}
                          </Descriptions.Item>
                        )}
                      </>
                    )}
                  </Descriptions>
                </Card>
              </Col>

              {/* Stats */}
              <Col span={10}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Card
                    className="bg-neutral-900 border border-white/10"
                    loading={loading}
                  >
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Всего договоров
                        </span>
                      }
                      value={contractStats.total}
                      prefix={<FileTextOutlined />}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>

                  {isOwner && (
                    <Card
                      className="bg-neutral-900 border border-white/10"
                      loading={loading}
                    >
                      <Statistic
                        title={
                          <span className="text-neutral-400">
                            Клиентов компании
                          </span>
                        }
                        value={clients.length}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: "#fff" }}
                      />
                    </Card>
                  )}

                  {isClient && (
                    <Card
                      className="bg-neutral-900 border border-white/10"
                      loading={loading}
                    >
                      <Statistic
                        title={
                          <span className="text-neutral-400">
                            Активных договоров
                          </span>
                        }
                        value={contractStats.active}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: "#22c55e" }}
                      />
                      <div className="mt-2 text-sm text-neutral-400">
                        На рассмотрении: {contractStats.pending}
                      </div>
                    </Card>
                  )}

                  {contractStats.total > 0 && (
                    <Card
                      className="bg-neutral-900 border border-white/10"
                      loading={loading}
                    >
                      <Statistic
                        title={
                          <span className="text-neutral-400">
                            Общая сумма договоров
                          </span>
                        }
                        value={contractStats.totalSum}
                        prefix="₽"
                        valueStyle={{ color: "#10b981" }}
                        precision={2}
                      />
                    </Card>
                  )}
                </Space>
              </Col>
            </Row>

            {/* Tabs for Contracts and Clients */}
            <Card
              loading={loading}
              className="bg-neutral-900 border border-white/10"
              style={{ marginBottom: 20 }}
            >
              <Tabs
                defaultActiveKey="contracts"
                items={[
                  {
                    key: "contracts",
                    label: (
                      <span className="flex items-center gap-2">
                        <FileTextOutlined />
                        Мои договоры
                      </span>
                    ),
                    children: (
                      <Table
                        dataSource={contracts}
                        columns={contractColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        className="custom-table"
                        locale={{ emptyText: "Нет договоров" }}
                      />
                    ),
                  },
                  ...(isOwner
                    ? [
                        {
                          key: "clients",
                          label: (
                            <span className="flex items-center gap-2">
                              <TeamOutlined />
                              Клиенты компании
                            </span>
                          ),
                          children: (
                            <Table
                              dataSource={clients}
                              columns={clientColumns}
                              rowKey="id"
                              loading={loading}
                              pagination={{ pageSize: 5 }}
                              className="custom-table"
                              locale={{ emptyText: "Нет клиентов" }}
                            />
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            </Card>

            {/* Activity log */}
            <Card
              loading={loading}
              title={<span className="text-white">История активности</span>}
              className="bg-neutral-900 border border-white/10 mt-8"
              style={{ marginBottom: 20 }}
            >
              {logs?.length === 0 ? (
                <p className="text-neutral-400">
                  Здесь будет отображаться история ваших действий: создание
                  договоров, подтверждение/отклонение запросов, изменения
                  данных.
                </p>
              ) : (
                <div
                  className="flex gap-5"
                  style={{
                    flexDirection: "column",
                    maxHeight: 340,
                    overflow: "auto",
                  }}
                >
                  {logs?.map((log) => (
                    <Card
                      loading={loading}
                      key={log.id}
                      size="small"
                      className="bg-neutral-800 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white mb-1">
                            {AUDIT_TYPES[log.action] || log.action}
                          </h4>
                          <p className="text-neutral-400 text-sm">
                            {log.message}
                          </p>
                        </div>
                        <span className="text-neutral-500 text-xs">
                          {new Date(log.createdAt).toLocaleString("ru-RU")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card
              loading={loading}
              title={<span className="text-white">Оформление</span>}
              className="bg-neutral-900 border border-white/10 mt-8"
              style={{ marginBottom: 20 }}
            >
              <div
                className="flex gap-5"
                style={{
                  maxHeight: 340,
                  overflow: "auto",
                }}
              >
                <Checkbox onChange={toggleTheme} checked={theme === "light"} />
                <label>Светлая тема</label>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <EditProfileModal
        data={user}
        setUser={setUser}
        open={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </>
  );
};

export default Profile;
