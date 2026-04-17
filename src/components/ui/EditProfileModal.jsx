import { Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { editUser } from "../../api/endpoints/auth";

const EditProfileModal = ({ open, onClose, data, setUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);

    editUser(form.getFieldsValue())
      .then((res) => {
        setUser(res.data);
        onClose();
        message.success("Данные пользователя успешно обновлены");
      })
      .catch((e) => {
        console.log(e);

        message.error("Ошибка при изменении данных пользователя");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Изменение данных профиля"
      okButtonProps={{ title: "Сохранить" }}
      onOk={onSubmit}
      loading={loading}
    >
      <Form style={{ paddingTop: 25 }} form={form}>
        <Form.Item
          name="fullName"
          label="Полное имя"
          initialValue={data?.fullName}
        >
          <Input placeholder="Введите ФИО" />
        </Form.Item>
        <Form.Item
          name="companyName"
          label="Название компании"
          initialValue={data?.companyName}
        >
          <Input placeholder="Введите название компании" />
        </Form.Item>
        <Form.Item name="email" label="Ваш E-mail" initialValue={data?.email}>
          <Input placeholder="Введите E-mail" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
