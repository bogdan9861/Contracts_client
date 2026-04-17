import { Form, Input, message, Modal, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { createClient, editClient } from "../../api/endpoints/clients";
import { label } from "framer-motion/client";

// comapnyName, contactPerson, email, phone

const ClientStatuses = {
  ACTIVE: "Активный",
  NEW: "Новый",
  CLOSED: "Закрыт",
};

const CreateClient = ({ data, setData, open, onClose, setClients }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const client = useRef(data);

  useEffect(() => {
    client.current = data;
  }, [data]);

  const onCreate = () => {
    setLoading(true);

    if (data) {
      editClient({
        ...form.getFieldsValue(),
        clientID: client.current?.id,
      })
        .then((res) => {
          message.success("Клиент успешно обновлен");
          onClose();
          setClients((prev) => [
            res.data,
            ...prev.filter((client) => client.id !== res.data.id),
          ]);
        })
        .catch((e) => {
          message.error("Не удалось обновить клиента");
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else {
      createClient(form.getFieldsValue())
        .then((res) => {
          message.success("Клиент успешно добавлен");

          setClients((prev) => [...prev, res.data]);
          onClose();
        })
        .catch((e) => {
          message.error("Не удалось создать клиента");
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      title="Создание клиента"
      onOk={onCreate}
      loading={loading}
    >
      <Form form={form} initialValues={client.current}>
        <span className="mb-2 block">Название компании</span>
        <Form.Item name="companyName">
          <Input placeholder="ООО Альфа" />
        </Form.Item>

        <span className="mb-2 block">Контактное лицо</span>
        <Form.Item name="contactPerson">
          <Input placeholder="Иванов Иван" />
        </Form.Item>

        <span className="mb-2 block">E-mail клиента</span>
        <Form.Item name="email">
          <Input placeholder="Введите E-mail" />
        </Form.Item>

        <span className="mb-2 block">Номер телефона</span>
        <Form.Item name="phone">
          <Input placeholder="+7 (" />
        </Form.Item>

        {client.current && (
          <Form.Item name="status">
            <Select
              options={Object.keys(ClientStatuses).map((key) => ({
                value: key,
                label: ClientStatuses[key],
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateClient;
