import { DatePicker, Form, Input, message, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getClients } from "../../api/endpoints/clients";
import { createContract, editContract } from "../../api/endpoints/contracts";
import { UploadOutlined } from "@ant-design/icons";

const ContractStatuses = {
  ACTIVE: "Активный",
  EXPIRED: "Просрочен",
  CLOSED: "Закрыт",
};

const CreateContractModal = ({ data, open, onClose, setContracts }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data))
      .catch(() => message.error("Не удалось получить клиентов"));
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        clientId: data.clientId || data.clientdId,
        date: data.date ? dayjs(data.date) : undefined,
        file: undefined, // файл всегда новый
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data) {
        const contract = await editContract({
          ...values,
          contractId: data.id,
        });

        setContracts((prev) => [contract.data, ...prev]);

        message.success("Контракт обновлен");
      } else {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key === "file" || key === "date") return;
          formData.append(key, values[key]);
        });

        if (values.date) {
          formData.append("date", values.date.toISOString());
        }

        const file = values.file?.file?.originFileObj;
        if (file) {
          formData.append("file", file);
        }

        const res = await createContract(formData);

        setContracts((prev) => [res.data, ...prev]);
        message.success("Контракт создан");
      }

      onClose();
      form.resetFields();
    } catch (e) {
      message.error("Проверь поля формы");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      title={data ? "Редактирование договора" : "Создание договора"}
      onOk={onSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="number"
          label="Номер договора"
          rules={[{ required: true }]}
        >
          <Input placeholder="DOC-001" />
        </Form.Item>

        <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="sum" label="Сумма" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="clientId" label="Клиент" rules={[{ required: true }]}>
          <Select
            options={clients.map((c) => ({
              value: c.id,
              label: c.companyName || c.contactPerson,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="file"
          label="Документ"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={!data ? [{ required: true }] : []}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <UploadOutlined />
          </Upload>
        </Form.Item>

        {data && (
          <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
            <Select
              options={Object.keys(ContractStatuses).map((key) => ({
                value: key,
                label: ContractStatuses[key],
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateContractModal;
