import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { userApi } from "../api/userApi";

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message
} from "antd";

export default function UsersPage() {

  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  /*
  تحميل المستخدمين
  */
  const loadData = async () => {

    const res = await userApi.getAll();
    setData(res);

  };

  useEffect(() => {
    loadData();
  }, []);

  /*
  إنشاء مستخدم
  */
  const handleCreate = async () => {

    try {

      const values = await form.validateFields();

      await userApi.create(values);

      message.success("User created");

      setOpen(false);
      form.resetFields();
      loadData();

    } catch {
      message.error("Error creating user");
    }

  };

  /*
  الأعمدة
  */
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
  ];

  return (
    <AppLayout>

      <Card
        title="Users"
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            Add User
          </Button>
        }
      >

        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
        />

      </Card>

      {/* Modal */}
      <Modal
        title="Add User"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
      >

        <Form form={form} layout="vertical">

          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

        </Form>

      </Modal>

    </AppLayout>
  );
}