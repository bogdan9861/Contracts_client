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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import { getCurrent } from "../api/endpoints/auth";
import { getAuditLogs } from "../api/endpoints/auditLogs";
import EditProfileModal from "../components/ui/EditProfileModal";

const AUDIT_TYPES = {
  CONTRACT_CREATED: "Новый договор",
  CLIENT_CREATED: "Новый клиент",
  STATUS_CHANGED: "Изменение статуса",
  CLIENT_UPDATED: "Изменение данных о клиенте",
  CONTRACT_UPDATED: "Изменение данных о договоре",
};

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    clients: 0,
    contracts: 0,
  });
  const [logs, setLogs] = useState([]);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  console.log(editProfileModalOpen);

  useEffect(() => {
    getCurrent()
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        message.error("При получении данных профиля произошла ошибка");
      });
  }, []);

  useEffect(() => {
    getAuditLogs()
      .then((res) => {
        setLogs(res.data);
        console.log(res);
      })
      .catch((e) => {
        message.error("Не удалось получить историю активности");
      });
  }, []);

  return (
    <>
      <div className="flex" style={{ width: "100%", minHeight: "100vh" }}>
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
                  <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                  <p className="text-neutral-400">Руководитель</p>
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
                >
                  <Descriptions column={1} labelStyle={{ color: "#9ca3af" }}>
                    <Descriptions.Item label="Имя">
                      {user.fullName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                      <span className="flex items-center gap-2">
                        <MailOutlined /> {user.email}
                      </span>
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
                        value={user.clients?.length}
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
                        value={user.contracts?.length}
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
              className="bg-neutral-900 border border-white/10 "
            >
              {logs?.length === 0 ? (
                <p className="text-neutral-400">
                  Здесь может отображаться история действий пользователя:
                  создание клиентов, оформление договоров и изменения данных.
                </p>
              ) : (
                <div
                  className="flex gap-5"
                  style={{
                    flexDirection: "column",
                    overflow: "scroll",
                    maxHeight: 340,
                  }}
                >
                  {logs?.map((log) => (
                    <Card
                      title={
                        <span className="text-white ">
                          {AUDIT_TYPES[log.type]}
                        </span>
                      }
                      className="bg-neutral-900 border border-white/10"
                    >
                      <span>{log.message}</span>
                    </Card>
                  ))}
                </div>
              )}
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
