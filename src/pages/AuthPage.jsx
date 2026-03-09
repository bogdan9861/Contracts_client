import React, { useState } from "react";
import { Form, Input, Button, Tabs } from "antd";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const onLogin = (values) => {
    console.log("Login:", values);
  };

  const onRegister = (values) => {
    console.log("Register:", values);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden relative">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 flex flex-col justify-center items-center p-12 bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-xl z-10"
      >
        <h1 className="text-5xl font-bold mb-6 tracking-tight">Регистрация</h1>
        <p className="text-xl text-neutral-300 max-w-md text-center leading-relaxed">
          Добро пожаловать в систему учета клиентов и договоров предприятия.
          Контролируйте бизнес-процессы в едином современном интерфейсе.
        </p>
      </motion.div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-neutral-900/90 p-10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <TabPane tab="Вход" key="login">
              <Form layout="vertical" onFinish={onLogin}>
                <Form.Item
                  label={<span className="text-gray-300">Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Введите email" }]}
                >
                  <Input size="large" placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-300">Пароль</span>}
                  name="password"
                  rules={[{ required: true, message: "Введите пароль" }]}
                >
                  <Input.Password size="large" placeholder="Введите пароль" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large">
                  Войти
                </Button>
              </Form>
            </TabPane>

            <TabPane tab="Регистрация" key="register">
              <Form layout="vertical" onFinish={onRegister}>
                <Form.Item
                  label={
                    <span className="text-gray-300">Название компании</span>
                  }
                  name="company_name"
                  rules={[
                    { required: true, message: "Введите название компании" },
                  ]}
                >
                  <Input size="large" placeholder="Введите название компании" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-300">Имя</span>}
                  name="name"
                  rules={[{ required: true, message: "Введите имя" }]}
                >
                  <Input size="large" placeholder="Ваше имя" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-300">Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Введите email" }]}
                >
                  <Input size="large" placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-300">Пароль</span>}
                  name="password"
                  rules={[{ required: true, message: "Введите пароль" }]}
                >
                  <Input.Password size="large" placeholder="Введите пароль" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large">
                  Зарегистрироваться
                </Button>
              </Form>
            </TabPane>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
