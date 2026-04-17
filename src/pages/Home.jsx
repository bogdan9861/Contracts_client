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
} from "antd";
import { FileTextOutlined, TeamOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import SideMenu from "../components/SideMenu";
import { useEffect, useState } from "react";
import { getDashboard } from "../api/endpoints/dashboard";
import { enums } from "../constants";
import { useNavigate } from "react-router";

const { Content } = Layout;

const COLORS = [
  "rgba(123, 97, 229, 0.67)",
  "rgba(223, 40, 40, 0.82)",
  "rgba(129, 196, 255, 0.64)",
];

const Home = () => {
  const [clientsCount, setClientsCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [clientsData, setClientsData] = useState([]);
  const [contractsData, setContractsData] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setContractsCount(res.data.contractsCount);
        setClientsCount(res.data.clinetsCount);

        setClientsData([
          ...res.data.clientsByMonth.map((el) => ({
            month: el.month,
            clients: el.count,
          })),
        ]);
        setContractsData(
          Object.keys(res.data.statuses).map((key) => ({
            name: key,
            value: res.data.statuses[key],
          }))
        );
      })
      .catch((e) => {
        message.error("Ошибка получения дашборда");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authorized]);

  return (
    <Layout className="min-h-screen bg-neutral-950" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <Layout className="bg-neutral-950">
        <Content className="p-10 text-white">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Панель управления
            </h1>
            <p className="text-neutral-400 mt-2">
              Общая статистика по клиентам и договорам
            </p>
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
                <Typography.Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Готовим данные
                </Typography.Text>
              </div>
            </div>
          ) : (
            <>
              {" "}
              {/* Stats */}
              <Row gutter={24} className="mb-10">
                <Col span={6}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={<span className="text-neutral-400">Клиенты</span>}
                      value={clientsCount}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={<span className="text-neutral-400">Договоры</span>}
                      value={contractsCount}
                      prefix={<FileTextOutlined />}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={<span className="text-neutral-400">Активные</span>}
                      value={
                        contractsData.find((el) => el.name === "active")?.value
                      }
                      valueStyle={{ color: "#22c55e" }}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">Просроченные</span>
                      }
                      value={
                        contractsData.find((el) => el.name === "expired")?.value
                      }
                      valueStyle={{ color: "#ef4444" }}
                    />
                  </Card>
                </Col>
              </Row>
              {/* Charts */}
              <Row gutter={24}>
                <Col span={16}>
                  <Card
                    title={<span className="text-white">Рост клиентов</span>}
                    className="bg-neutral-900 border border-white/10"
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={clientsData}>
                        <Line
                          type="natural"
                          dataKey="clients"
                          stroke="#6366f1"
                          strokeWidth={3}
                        />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card
                    title={<span className="text-white">Статус договоров</span>}
                    className="bg-neutral-900 border border-white/10"
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={contractsData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={0}
                          outerRadius={100}
                        >
                          {contractsData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
