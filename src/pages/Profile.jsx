import React from "react";
import { Card, Avatar, Descriptions, Button, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";

const Profile = () => {
  const user = {
    name: "Иван Петров",
    email: "ivan.petrov@mail.com",
    phone: "+7 900 123 45 67",
    role: "Менеджер",
    clients: 34,
    contracts: 18,
  };

  return (
    <div className="flex" style={{ width: "100%", height: "100vh" }}>
      <SideMenu defaultSelectedKeys={"2"} />
      <div
        className="min-h-screen bg-neutral-950 text-white p-10"
        style={{ width: "100%" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Профиль пользователя
            </h1>
            <p className="text-neutral-400 mt-2">
              Информация о пользователе системы
            </p>
          </div>

          {/* Profile card */}
          <Card className="bg-neutral-900 border border-white/10 mb-8">
            <div className="flex items-center gap-6">
              <Avatar size={90} icon={<UserOutlined />} />

              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-neutral-400">{user.role}</p>
              </div>

              <Button icon={<EditOutlined />} type="primary">
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
              >
                <Descriptions column={1} labelStyle={{ color: "#9ca3af" }}>
                  <Descriptions.Item label="Имя">{user.name}</Descriptions.Item>

                  <Descriptions.Item label="Email">
                    <span className="flex items-center gap-2">
                      <MailOutlined /> {user.email}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Телефон">
                    <span className="flex items-center gap-2">
                      <PhoneOutlined /> {user.phone}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Должность">
                    {user.role}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Stats */}
            <Col span={10}>
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Клиентов добавлено
                        </span>
                      }
                      value={user.clients}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>
                </Col>

                <Col span={24}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Договоров оформлено
                        </span>
                      }
                      value={user.contracts}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Activity placeholder */}
          <Card
            title={<span className="text-white">Последняя активность</span>}
            className="bg-neutral-900 border border-white/10"
          >
            <p className="text-neutral-400">
              Здесь может отображаться история действий пользователя: создание
              клиентов, оформление договоров и изменения данных.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
