import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  List,
  Button,
  Tag,
  message,
  Spin,
  Typography,
  Modal,
  Descriptions,
  Space,
  Badge,
  Tabs,
  Empty,
  Tooltip,
  Avatar,
  Statistic,
  Row,
  Col,
  Alert,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";

import {
  getPendingRequests,
  approveContract,
  rejectContract,
  getNotifications,
  markAsRead,
} from "../api/endpoints/contracts";
import { enums } from "../constants";
import { getCurrent } from "../api/endpoints/auth";

const { Content } = Layout;
const { Title, Text } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [user, setUser] = useState({});

  useEffect(() => {
    if (!user) return;

    loadData();
  }, [user]);

  useEffect(() => {
    getCurrent()
      .then((res) => {
        setUser(res.data);
        setUserRole(res.data.role);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const notificationsRes = await getNotifications();
      setNotifications(notificationsRes.data);

      if (user.role === "COMPANY_OWNER") {
        const pendingRes = await getPendingRequests();
        setPendingRequests(pendingRes.data.pendingRequests || []);
      }
    } catch (error) {
      message.error("Ошибка при загрузке данных");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
    } catch (error) {
      message.error("Ошибка при отметке уведомления");
    }
  };

  const handleViewContract = (contract) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const handleApproveContract = async (contractId) => {
    setProcessingId(contractId);
    try {
      await approveContract(contractId);
      message.success("Договор успешно подтверждён");
      // Обновляем список запросов
      const pendingRes = await getPendingRequests();
      setPendingRequests(pendingRes.data.pendingRequests || []);
      // Обновляем уведомления
      const notificationsRes = await getNotifications();
      setNotifications(notificationsRes.data);
    } catch (error) {
      message.error("Ошибка при подтверждении договора");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectContract = async (contractId) => {
    if (!rejectReason.trim()) {
      message.warning("Укажите причину отклонения");
      return;
    }
    setProcessingId(contractId);
    try {
      await rejectContract(contractId, { reason: rejectReason });
      message.success("Договор отклонён");
      setRejectModalVisible(false);
      setRejectReason("");
      // Обновляем список запросов
      const pendingRes = await getPendingRequests();
      setPendingRequests(pendingRes.data.pendingRequests || []);
      // Обновляем уведомления
      const notificationsRes = await getNotifications();
      setNotifications(notificationsRes.data);
    } catch (error) {
      message.error("Ошибка при отклонении договора");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CONTRACT_REQUEST_RECEIVED":
        return <BellOutlined style={{ color: "#f59e0b" }} />;
      case "CONTRACT_APPROVED":
        return <CheckCircleOutlined style={{ color: "#22c55e" }} />;
      case "CONTRACT_REJECTED":
        return <CloseCircleOutlined style={{ color: "#ef4444" }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "CONTRACT_REQUEST_RECEIVED":
        return "orange";
      case "CONTRACT_APPROVED":
        return "green";
      case "CONTRACT_REJECTED":
        return "red";
      default:
        return "blue";
    }
  };

  const isOwner = userRole === "COMPANY_OWNER";
  const isClient = userRole === "CLIENT";

  // Вкладки для владельца компании
  const ownerTabItems = [
    {
      key: "requests",
      label: (
        <span>
          <ClockCircleOutlined /> Запросы на договоры
          {pendingRequests.length > 0 && (
            <Badge count={pendingRequests.length} className="ml-2" />
          )}
        </span>
      ),
      children: (
        <List
          dataSource={pendingRequests}
          renderItem={(request) => (
            <List.Item
              className="border-b border-white/10 p-4 hover:bg-neutral-800 transition-colors"
              actions={[
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApproveContract(request.id)}
                  loading={processingId === request.id}
                >
                  Подтвердить
                </Button>,
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    setSelectedContract(request);
                    setRejectModalVisible(true);
                  }}
                  loading={processingId === request.id}
                >
                  Отклонить
                </Button>,
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => handleViewContract(request)}
                >
                  Просмотреть
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<FileTextOutlined />} />}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      Запрос на заключение договора
                    </span>
                    <Tag color="orange">Ожидает</Tag>
                  </div>
                }
                description={
                  <div>
                    <p>
                      <strong>Клиент:</strong> {request.client?.fullName}
                    </p>
                    <p>
                      <strong>Номер договора:</strong> {request.number}
                    </p>
                    <p>
                      <strong>Сумма:</strong>{" "}
                      {Number(request.sum).toLocaleString()} ₽
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="Нет ожидающих запросов" />,
          }}
        />
      ),
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined /> Уведомления
        </span>
      ),
      children: (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              className={`border-b border-white/10 p-4 hover:bg-neutral-800 transition-colors ${
                !notification.isRead ? "bg-neutral-800/50" : ""
              }`}
              actions={[
                !notification.isRead && (
                  <Button
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Прочитано
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type)}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{notification.title}</span>
                    {!notification.isRead && (
                      <Badge status="processing" color="blue" />
                    )}
                  </div>
                }
                description={
                  <div>
                    <p>{notification.message}</p>
                    <Text type="secondary" className="text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="Нет уведомлений" />,
          }}
        />
      ),
    },
  ];

  // Вкладки для клиента
  const clientTabItems = [
    {
      key: "contracts",
      label: (
        <span>
          <FileTextOutlined /> Мои договоры
        </span>
      ),
      children: (
        <List
          dataSource={notifications}
          renderItem={(contract) => (
            <List.Item
              className="border-b border-white/10 p-4 hover:bg-neutral-800 transition-colors"
              actions={[
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => handleViewContract(contract.contract)}
                >
                  Детали
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<FileTextOutlined />} />}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      Договор №{contract.contract?.number}
                    </span>
                    <Tag
                      color={
                        contract.contract?.requestStatus === "APPROVED"
                          ? "green"
                          : contract.contract?.requestStatus === "PENDING"
                            ? "orange"
                            : "red"
                      }
                    >
                      {contract.contract?.requestStatus === "APPROVED"
                        ? "Подтверждён"
                        : contract.contract?.requestStatus === "PENDING"
                          ? "На рассмотрении"
                          : "Отклонён"}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <p>
                      <strong>Компания:</strong>{" "}
                      {contract.contract?.company?.name}
                    </p>
                    <p>
                      <strong>Сумма:</strong>{" "}
                      {Number(contract.contract?.sum).toLocaleString()} ₽
                    </p>
                    {contract.contract?.rejectedReason && (
                      <p className="text-red-400">
                        <strong>Причина отклонения:</strong>{" "}
                        {contract.contract.rejectedReason}
                      </p>
                    )}
                    <Text type="secondary" className="text-xs">
                      Дата создания:{" "}
                      {new Date(contract.contract?.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="Нет договоров" />,
          }}
        />
      ),
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined /> Уведомления
        </span>
      ),
      children: (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              className={`border-b border-white/10 p-4 hover:bg-neutral-800 transition-colors ${
                !notification.isRead ? "bg-neutral-800/50" : ""
              }`}
              actions={[
                !notification.isRead && (
                  <Button
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Прочитано
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type)}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{notification.title}</span>
                    {!notification.isRead && (
                      <Badge status="processing" color="blue" />
                    )}
                  </div>
                }
                description={
                  <div>
                    <p>{notification.message}</p>
                    <Text type="secondary" className="text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="Нет уведомлений" />,
          }}
        />
      ),
    },
  ];

  // Модальное окно с деталями договора
  const ContractModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Детали договора</span>
        </div>
      }
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setModalVisible(false)}>
          Закрыть
        </Button>,
        isOwner &&
          selectedContract?.requestStatus === "PENDING" && [
            <Button
              key="reject"
              danger
              onClick={() => {
                setModalVisible(false);
                setRejectModalVisible(true);
              }}
            >
              Отклонить
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => {
                handleApproveContract(selectedContract.id);
                setModalVisible(false);
              }}
            >
              Подтвердить
            </Button>,
          ],
      ]}
      width={700}
    >
      {selectedContract && (
        <div className="space-y-4">
          <Card className="bg-neutral-800 border border-white/10">
            <Descriptions column={2} labelStyle={{ color: "#9ca3af" }}>
              <Descriptions.Item label="Номер договора">
                {selectedContract.number}
              </Descriptions.Item>
              <Descriptions.Item label="Дата создания">
                {new Date(selectedContract.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Сумма">
                <span className="text-green-400">
                  {Number(selectedContract.sum).toLocaleString()} ₽
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                <Tag
                  color={
                    selectedContract.requestStatus === "APPROVED"
                      ? "green"
                      : selectedContract.requestStatus === "PENDING"
                        ? "orange"
                        : "red"
                  }
                >
                  {selectedContract.requestStatus === "APPROVED"
                    ? "Подтверждён"
                    : selectedContract.requestStatus === "PENDING"
                      ? "На рассмотрении"
                      : "Отклонён"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {selectedContract.client && (
            <Card
              title={<span className="text-white">Информация о клиенте</span>}
              className="bg-neutral-800 border border-white/10"
            >
              <Space direction="vertical" size="small">
                <div>
                  <UserOutlined className="mr-2" />
                  <strong>{selectedContract.client.fullName}</strong>
                </div>
                <div>
                  <MailOutlined className="mr-2" />
                  {selectedContract.client.email}
                </div>
                {selectedContract.client.phone && (
                  <div>
                    <PhoneOutlined className="mr-2" />
                    {selectedContract.client.phone}
                  </div>
                )}
              </Space>
            </Card>
          )}

          {selectedContract.company && (
            <Card
              title={<span className="text-white">Информация о компании</span>}
              className="bg-neutral-800 border border-white/10"
            >
              <Space direction="vertical" size="small">
                <div>
                  <TeamOutlined className="mr-2" />
                  <strong>{selectedContract.company.name}</strong>
                </div>
                {selectedContract.company.inn && (
                  <div>ИНН: {selectedContract.company.inn}</div>
                )}
              </Space>
            </Card>
          )}

          {selectedContract.rejectedReason && (
            <Alert
              message="Причина отклонения"
              description={selectedContract.rejectedReason}
              type="error"
              showIcon
            />
          )}

          {selectedContract.fileUrl && (
            <Button
              icon={<FileTextOutlined />}
              onClick={() => window.open(selectedContract.fileUrl, "_blank")}
            >
              Скачать договор
            </Button>
          )}
        </div>
      )}
    </Modal>
  );

  // Модальное окно для отклонения договора
  const RejectModal = () => (
    <Modal
      title="Отклонение договора"
      open={rejectModalVisible}
      onCancel={() => {
        setRejectModalVisible(false);
        setRejectReason("");
      }}
      onOk={() => handleRejectContract(selectedContract?.id)}
      okText="Отклонить"
      cancelText="Отмена"
      okButtonProps={{
        danger: true,
        loading: processingId === selectedContract?.id,
      }}
    >
      <div className="space-y-4">
        <p>Укажите причину отклонения договора №{selectedContract?.number}</p>
        <textarea
          className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Причина отклонения..."
        />
      </div>
    </Modal>
  );

  if (!userRole) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-neutral-950" style={{height: '100vh'}}>
      <SideMenu defaultSelectedKeys="4" />
      <Layout className="bg-neutral-950">
        <Content className="p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Title level={1} className="text-white !mb-2">
                Уведомления
              </Title>
              <Text className="text-neutral-400">
                {isOwner
                  ? "Управление запросами на заключение договоров"
                  : "Отслеживание статуса договоров"}
              </Text>
            </div>

            {/* Статистика */}
            {isOwner && (
              <Row gutter={16} className="mb-6">
                <Col span={8}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Ожидающих запросов
                        </span>
                      }
                      value={pendingRequests.length}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#f59e0b" }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Всего договоров
                        </span>
                      }
                      value={
                        notifications.filter((n) => n.type.includes("CONTRACT"))
                          .length
                      }
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
                          Непрочитанных уведомлений
                        </span>
                      }
                      value={notifications.filter((n) => !n.isRead).length}
                      prefix={<BellOutlined />}
                      valueStyle={{ color: "#3b82f6" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            {isClient && (
              <Row gutter={16} className="mb-6">
                <Col span={12}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          Активных договоров
                        </span>
                      }
                      value={
                        notifications.filter(
                          (n) =>
                            n.contract?.requestStatus === "APPROVED" &&
                            n.contract?.contractStatus === "ACTIVE",
                        ).length
                      }
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#22c55e" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="bg-neutral-900 border border-white/10">
                    <Statistic
                      title={
                        <span className="text-neutral-400">
                          На рассмотрении
                        </span>
                      }
                      value={
                        notifications.filter(
                          (n) => n.contract?.requestStatus === "PENDING",
                        ).length
                      }
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#f59e0b" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            {/* Основной контент */}
            <Card className="bg-neutral-900 border border-white/10">
              <Tabs
                defaultActiveKey={isOwner ? "requests" : "contracts"}
                items={isOwner ? ownerTabItems : clientTabItems}
                className="custom-tabs"
              />
            </Card>
          </div>
        </Content>
      </Layout>

      <ContractModal />
      <RejectModal />
    </Layout>
  );
};

export default Notifications;
