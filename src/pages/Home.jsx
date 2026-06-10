import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  message,
  Spin,
  Typography,
  Tabs,
  Tag,
} from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  NotificationFilled,
  BellOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import SideMenu from "../components/SideMenu";
import { useEffect, useState } from "react";
import { getDashboard } from "../api/endpoints/dashboard";
import { enums, roles } from "../constants";
import { Link, useNavigate } from "react-router";
import { getCurrent } from "../api/endpoints/auth";

const { Content } = Layout;

const COLORS = [
  "rgba(34, 197, 94, 0.8)", // active - зеленый
  "rgba(239, 68, 68, 0.8)", // expired - красный
  "rgba(107, 114, 128, 0.8)", // terminated - серый
  "rgba(245, 158, 11, 0.8)", // pending - оранжевый (для клиента)
  "rgba(220, 38, 38, 0.8)", // rejected - темно-красный (для клиента)
];

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    statuses: {},
    contractsByMonth: [],
    clientsByMonth: [],
    totalContracts: 0,
    clientsCount: 0,
    companiesCount: 0,
    role: null,
  });
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    getCurrent()
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(enums.TOKEN);
    if (!token) {
      navigate("/auth");
    } else {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;

    setLoading(true);

    getDashboard()
      .then((res) => {
        setDashboardData({
          statuses: res.data.statuses,
          contractsByMonth: res.data.contractsByMonth || [],
          clientsByMonth: res.data.clientsByMonth || [],
          totalContracts: res.data.totalContracts || 0,
          clientsCount: res.data.clientsCount || 0,
          companiesCount: res.data.companiesCount || 0,
          role: res.data.role,
        });
      })
      .catch((e) => {
        console.error(e);
        message.error("Ошибка получения дашборда");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authorized]);

  const isOwner = dashboardData.role === "COMPANY_OWNER";
  const isClient = dashboardData.role === "CLIENT";

  // Подготовка данных для круговой диаграммы
  const getPieData = () => {
    const pieData = [];

    if (isOwner) {
      if (dashboardData.statuses.active > 0)
        pieData.push({
          name: "Активные",
          value: dashboardData.statuses.active,
        });
      if (dashboardData.statuses.expired > 0)
        pieData.push({
          name: "Просроченные",
          value: dashboardData.statuses.expired,
        });
      if (dashboardData.statuses.terminated > 0)
        pieData.push({
          name: "Расторгнутые",
          value: dashboardData.statuses.terminated,
        });
    } else if (isClient) {
      if (dashboardData.statuses.active > 0)
        pieData.push({
          name: "Активные",
          value: dashboardData.statuses.active,
        });
      if (dashboardData.statuses.expired > 0)
        pieData.push({
          name: "Просроченные",
          value: dashboardData.statuses.expired,
        });
      if (dashboardData.statuses.terminated > 0)
        pieData.push({
          name: "Расторгнутые",
          value: dashboardData.statuses.terminated,
        });
      if (dashboardData.statuses.pending > 0)
        pieData.push({
          name: "На рассмотрении",
          value: dashboardData.statuses.pending,
        });
      if (dashboardData.statuses.rejected > 0)
        pieData.push({
          name: "Отклонённые",
          value: dashboardData.statuses.rejected,
        });
    }

    return pieData;
  };

  const pieData = getPieData();

  return (
    <Layout className="min-h-screen bg-neutral-950" style={{ height: "100vh" }}>
      <SideMenu />

      <Layout className="bg-neutral-950">
        <Content className="p-10 text-white overflow-auto">
          <div className="flex align-center justify-between">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight">
                Панель управления
              </h1>
              <p className="text-neutral-400 mt-2 mb-2">
                {isOwner && "Управление клиентами и договорами вашей компании"}
                {isClient && "Управление договорами с компаниями"}
              </p>
              {dashboardData.role && (
                <Tag color={isOwner ? "blue" : "green"} className="mt-2">
                  {roles[user?.role]}
                </Tag>
              )}
            </div>
            <Link to="/notifications">
              <BellOutlined style={{ fontSize: 25 }} />
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                width: "100%",
                height: "50%",
                display: "flex",
                placeItems: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 15,
                }}
              >
                <Spin size="large" />
                <Typography.Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  Готовим данные
                </Typography.Text>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <Row gutter={24} className="mb-10">
                {isOwner && (
                  <>
                    <Col span={8}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">Клиенты</span>
                          }
                          value={dashboardData.clientsCount}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: "#fff" }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">Договоры</span>
                          }
                          value={dashboardData.totalContracts}
                          prefix={<FileTextOutlined />}
                          valueStyle={{ color: "#fff" }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">
                              Активные договоры
                            </span>
                          }
                          value={dashboardData.statuses.active || 0}
                          prefix={<CheckCircleOutlined />}
                          valueStyle={{ color: "#22c55e" }}
                        />
                      </Card>
                    </Col>
                  </>
                )}

                {isClient && (
                  <>
                    <Col span={6}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">Компании</span>
                          }
                          value={dashboardData.companiesCount}
                          prefix={<ShopOutlined />}
                          valueStyle={{ color: "#fff" }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">Договоры</span>
                          }
                          value={dashboardData.totalContracts}
                          prefix={<FileTextOutlined />}
                          valueStyle={{ color: "#fff" }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">Активные</span>
                          }
                          value={dashboardData.statuses.active || 0}
                          prefix={<CheckCircleOutlined />}
                          valueStyle={{ color: "#22c55e" }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card className="bg-neutral-900 border border-white/10">
                        <Statistic
                          title={
                            <span className="text-neutral-400">
                              На рассмотрении
                            </span>
                          }
                          value={dashboardData.statuses.pending || 0}
                          prefix={<ClockCircleOutlined />}
                          valueStyle={{ color: "#f59e0b" }}
                        />
                      </Card>
                    </Col>
                  </>
                )}
              </Row>

              {/* Charts */}
              <Row gutter={24}>
                <Col span={isOwner ? 16 : 14}>
                  <Card
                    title={
                      <span className="text-white">
                        {isOwner
                          ? "Динамика договоров"
                          : "Динамика договоров по месяцам"}
                      </span>
                    }
                    className="bg-neutral-900 border border-white/10"
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      {isOwner ? (
                        <LineChart data={dashboardData.contractsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="month" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f1f",
                              border: "none",
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Количество договоров"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: "#6366f1" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="totalSum"
                            name="Общая сумма (₽)"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: "#10b981" }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={dashboardData.contractsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="month" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f1f",
                              border: "none",
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Bar
                            dataKey="approved"
                            name="Подтверждённые"
                            fill="#22c55e"
                          />
                          <Bar
                            dataKey="pending"
                            name="На рассмотрении"
                            fill="#f59e0b"
                          />
                          <Bar
                            dataKey="rejected"
                            name="Отклонённые"
                            fill="#ef4444"
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col span={isOwner ? 8 : 10}>
                  <Card
                    title={<span className="text-white">Статус договоров</span>}
                    className="bg-neutral-900 border border-white/10"
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={120}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f1f1f",
                            border: "none",
                          }}
                          labelStyle={{ color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Дополнительный график для владельца - рост клиентов */}
              {isOwner && dashboardData.clientsByMonth.length > 0 && (
                <Row gutter={24} className="mt-6">
                  <Col span={24}>
                    <Card
                      title={
                        <span className="text-white">
                          Рост клиентов по месяцам
                        </span>
                      }
                      className="bg-neutral-900 border border-white/10"
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.clientsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="month" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f1f",
                              border: "none",
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Новые клиенты"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ fill: "#8b5cf6" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Дополнительный график для клиента - рост компаний */}
              {isClient && dashboardData.clientsByMonth.length > 0 && (
                <Row gutter={24} className="mt-6">
                  <Col span={24}>
                    <Card
                      title={
                        <span className="text-white">
                          Новые компании по месяцам
                        </span>
                      }
                      className="bg-neutral-900 border border-white/10"
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.clientsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="month" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f1f",
                              border: "none",
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Новые компании"
                            stroke="#ec4899"
                            strokeWidth={3}
                            dot={{ fill: "#ec4899" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
