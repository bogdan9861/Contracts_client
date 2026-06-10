import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Space,
  Avatar,
  Descriptions,
  Tooltip,
  Spin,
  Row,
  Col,
  Statistic,
  Upload,
  Alert,
} from "antd";
import {
  ShopOutlined,
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SideMenu from "../components/SideMenu";
import { getCompanies } from "../api/endpoints/companies";
import {
  createContractRequest,
  getMyContracts,
} from "../api/endpoints/contracts";
import { enums } from "../constants";

const { Content } = Layout;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Search } = Input;

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Загружаем список компаний
      const companiesRes = await getCompanies();
      setCompanies(companiesRes.data);
      setFilteredCompanies(companiesRes.data);

      // Загружаем существующие договоры клиента
      const contractsRes = await getMyContracts();
      setContracts(contractsRes.data);
    } catch (error) {
      message.error("Ошибка при загрузке данных");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Поиск компаний
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(value.toLowerCase()) ||
          company.inn?.toLowerCase().includes(value.toLowerCase()) ||
          company.email?.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredCompanies(filtered);
    }
  };

  const handleCreateRequest = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmitRequest = async (values) => {
    const file = fileList?.[0]?.originFileObj;

    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("companyId", selectedCompany.id);
      formData.append("number", values.number);
      formData.append("sum", values.sum);
      formData.append("description", values.description);
      formData.append("file", file);

      await createContractRequest(formData);
      message.success("Запрос на договор успешно отправлен");
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error("Ошибка при отправке запроса");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Получение статуса договора с компанией
  const getContractStatus = (companyId) => {
    const companyContracts = contracts.filter((c) => c.companyId === companyId);
    if (companyContracts.length === 0) return null;

    const latestContract = companyContracts[0];
    return {
      status: latestContract.requestStatus,
      contract: latestContract,
    };
  };

  // Получение цвета и текста статуса
  const getStatusInfo = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          color: "green",
          text: "Подтверждён",
          icon: <CheckCircleOutlined />,
        };
      case "PENDING":
        return {
          color: "orange",
          text: "На рассмотрении",
          icon: <ClockCircleOutlined />,
        };
      case "REJECTED":
        return {
          color: "red",
          text: "Отклонён",
          icon: <CloseCircleOutlined />,
        };
      default:
        return { color: "default", text: "Нет договора", icon: null };
    }
  };

  const columns = [
    {
      title: "Компания",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <Avatar icon={<ShopOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-semibold text-white">{text}</div>
            <div className="text-xs text-neutral-400">
              ИНН: {record.inn || "Не указан"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Контактные данные",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.email && (
            <div className="flex items-center gap-2 text-sm">
              <MailOutlined className="text-neutral-400" />
              <span>{record.email}</span>
            </div>
          )}
          {record.phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneOutlined className="text-neutral-400" />
              <span>{record.phone}</span>
            </div>
          )}
          {record.address && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-400">📍</span>
              <span className="text-neutral-300">{record.address}</span>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Статус договора",
      key: "status",
      align: "center",
      sorter: (a, b) => {
        const statusA = getContractStatus(a.id)?.status || "";
        const statusB = getContractStatus(b.id)?.status || "";
        return statusA.localeCompare(statusB);
      },
      render: (_, record) => {
        const contractStatus = getContractStatus(record.id);
        if (!contractStatus) {
          return <Tag color="default">Нет договора</Tag>;
        }
        const statusInfo = getStatusInfo(contractStatus.status);
        return (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Действия",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const contractStatus = getContractStatus(record.id);
        const hasPendingContract = contractStatus?.status === "PENDING";
        const hasActiveContract = contractStatus?.status === "APPROVED";

        return (
          <Space>
            {!hasPendingContract && (
              <Tooltip
                title={
                  hasActiveContract
                    ? "У вас уже есть активный договор"
                    : "Отправить запрос"
                }
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleCreateRequest(record)}
                  disabled={hasActiveContract}
                >
                  Отправить запрос
                </Button>
              </Tooltip>
            )}
            {contractStatus && (
              <Tooltip title="Просмотреть договор">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    // Открыть модальное окно с деталями договора
                    Modal.info({
                      title: "Детали договора",
                      width: 600,
                      content: (
                        <div className="mt-4">
                          <Descriptions column={1}>
                            <Descriptions.Item label="Номер договора">
                              {contractStatus.contract.number}
                            </Descriptions.Item>
                            <Descriptions.Item label="Сумма">
                              {Number(
                                contractStatus.contract.sum,
                              ).toLocaleString()}{" "}
                              ₽
                            </Descriptions.Item>
                            <Descriptions.Item label="Дата создания">
                              {new Date(
                                contractStatus.contract.createdAt,
                              ).toLocaleDateString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Статус">
                              <Tag
                                color={
                                  getStatusInfo(contractStatus.status).color
                                }
                              >
                                {getStatusInfo(contractStatus.status).text}
                              </Tag>
                            </Descriptions.Item>
                            {contractStatus.contract.rejectedReason && (
                              <Descriptions.Item label="Причина отклонения">
                                <span className="text-red-400">
                                  {contractStatus.contract.rejectedReason}
                                </span>
                              </Descriptions.Item>
                            )}
                            {contractStatus.contract.fileUrl && (
                              <Descriptions.Item label="Файл договора">
                                <Button
                                  type="link"
                                  onClick={() =>
                                    window.open(
                                      contractStatus.contract.fileUrl,
                                      "_blank",
                                    )
                                  }
                                >
                                  Скачать
                                </Button>
                              </Descriptions.Item>
                            )}
                          </Descriptions>
                        </div>
                      ),
                    });
                  }}
                >
                  Детали
                </Button>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  // Статистика по договорам
  const getContractsStats = () => {
    const stats = {
      total: contracts.length,
      approved: contracts.filter((c) => c.requestStatus === "APPROVED").length,
      pending: contracts.filter((c) => c.requestStatus === "PENDING").length,
      rejected: contracts.filter((c) => c.requestStatus === "REJECTED").length,
    };
    return stats;
  };

  const stats = getContractsStats();

  if (loading) {
    return (
      <Layout
        className="min-h-screen bg-neutral-950"
        style={{ height: "100vh" }}
      >
        <SideMenu defaultSelectedKeys="5" />
        <Content className="flex justify-center items-center">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-neutral-950">
      <SideMenu defaultSelectedKeys="5" />
      <Layout className="bg-neutral-950">
        <Content className="p-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Компании
              </h1>
              <p className="text-neutral-400 mt-2">
                Просмотр доступных компаний и отправка запросов на заключение
                договоров
              </p>
            </div>

            {/* Статистика */}
            <Row gutter={16} className="mb-6">
              <Col span={6}>
                <Card className="bg-neutral-900 border border-white/10">
                  <Statistic
                    title={
                      <span className="text-neutral-400">Всего компаний</span>
                    }
                    value={filteredCompanies.length}
                    prefix={<ShopOutlined />}
                    valueStyle={{ color: "#fff" }}
                  />
                  {searchText && (
                    <div className="text-xs text-neutral-400 mt-1">
                      Найдено: {filteredCompanies.length} из {companies.length}
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-neutral-900 border border-white/10">
                  <Statistic
                    title={
                      <span className="text-neutral-400">
                        Активных договоров
                      </span>
                    }
                    value={stats.approved}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#22c55e" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-neutral-900 border border-white/10">
                  <Statistic
                    title={
                      <span className="text-neutral-400">На рассмотрении</span>
                    }
                    value={stats.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: "#f59e0b" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-neutral-900 border border-white/10">
                  <Statistic
                    title={
                      <span className="text-neutral-400">Отклонённых</span>
                    }
                    value={stats.rejected}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: "#ef4444" }}
                  />
                </Card>
              </Col>
            </Row>

            <Card className="bg-neutral-900 border border-white/10 mb-6">
              <Search
                placeholder="Поиск компании по названию, ИНН или email..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchText && (
                <div className="mt-2 text-neutral-400">
                  Результаты поиска: <strong>{filteredCompanies.length}</strong>{" "}
                  компаний
                </div>
              )}
            </Card>

            {/* Таблица компаний */}
            <Card className="bg-neutral-900 border border-white/10">
              <Table
                dataSource={filteredCompanies}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Всего ${total} компаний`,
                }}
                locale={{
                  emptyText: searchText
                    ? "Компании не найдены"
                    : "Нет доступных компаний",
                }}
              />
            </Card>

            {/* Информация о процессе */}
            <Card className="bg-neutral-900 border border-white/10 mt-6">
              <Alert
                message="Как заключить договор?"
                description={
                  <div className="mt-2">
                    <p>1. Найдите компанию через поиск или в списке</p>
                    <p>2. Нажмите "Отправить запрос" на нужную компанию</p>
                    <p>3. Заполните форму с номером и суммой договора</p>
                    <p>4. Прикрепите файл договора (при необходимости)</p>
                    <p>5. Дождитесь подтверждения от компании</p>
                    <p>6. После подтверждения договор вступит в силу</p>
                  </div>
                }
                type="info"
                showIcon
              />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* Модальное окно для создания запроса на договор */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Отправка запроса на договор</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar
              icon={<ShopOutlined />}
              size="large"
              className="bg-blue-500"
            />
            <div>
              <div className="font-semibold text-lg">
                {selectedCompany?.name}
              </div>
              <div className="text-sm text-neutral-400">
                ИНН: {selectedCompany?.inn || "Не указан"}
              </div>
              {selectedCompany?.email && (
                <div className="text-sm text-neutral-400">
                  Email: {selectedCompany.email}
                </div>
              )}
            </div>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmitRequest}>
          <Form.Item
            name="number"
            label="Номер договора"
            rules={[
              { required: true, message: "Введите номер договора" },
              { min: 3, message: "Номер должен содержать минимум 3 символа" },
            ]}
          >
            <Input placeholder="например: Д-001/2024" />
          </Form.Item>

          <Form.Item
            name="sum"
            label="Сумма договора"
            rules={[
              { required: true, message: "Введите сумму договора" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Введите корректную сумму",
              },
            ]}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="100000"
              addonAfter="₽"
              prefix="₽"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание договора"
            rules={[{ required: true, message: "Введите описание" }]}
          >
            <TextArea
              rows={4}
              placeholder="Укажите предмет договора, условия сотрудничества, сроки и т.д."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item label="Файл договора (опционально)">
            <Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx,.txt"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Нажмите или перетащите файл для загрузки
              </p>
              <p className="ant-upload-hint">
                Поддерживаются файлы PDF, DOC, DOCX до 10MB
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Отправить запрос
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Companies;
