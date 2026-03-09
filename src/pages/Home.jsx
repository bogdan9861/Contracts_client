import { Layout, Menu, Card, Statistic, Row, Col } from "antd";
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

const { Content } = Layout;

const clientsData = [
  { month: "Янв", clients: 40 },
  { month: "Фев", clients: 55 },
  { month: "Мар", clients: 80 },
  { month: "Апр", clients: 95 },
  { month: "Май", clients: 120 },
];

const contractsData = [
  { name: "Активные", value: 68 },
  { name: "Завершённые", value: 22 },
  { name: "Просроченные", value: 10 },
];

const COLORS = ["#6366f1", "#22c55e", "#ef4444"];

const Home = () => {
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

          {/* Stats */}
          <Row gutter={24} className="mb-10">
            <Col span={6}>
              <Card className="bg-neutral-900 border border-white/10">
                <Statistic
                  title={<span className="text-neutral-400">Клиенты</span>}
                  value={120}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>

            <Col span={6}>
              <Card className="bg-neutral-900 border border-white/10">
                <Statistic
                  title={<span className="text-neutral-400">Договоры</span>}
                  value={87}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>

            <Col span={6}>
              <Card className="bg-neutral-900 border border-white/10">
                <Statistic
                  title={<span className="text-neutral-400">Активные</span>}
                  value={68}
                  valueStyle={{ color: "#22c55e" }}
                />
              </Card>
            </Col>

            <Col span={6}>
              <Card className="bg-neutral-900 border border-white/10">
                <Statistic
                  title={<span className="text-neutral-400">Просроченные</span>}
                  value={10}
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
                      type="monotone"
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
                      innerRadius={70}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
