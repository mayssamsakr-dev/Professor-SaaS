import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { subjectApi } from "../api/subjectApi";

import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  Space
} from "antd";

export default function SubjectsPage() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {

    loadData();

  }, []);

  /*
  تحميل البيانات
  */
  const loadData = async () => {

    setLoading(true);

    try {

      const res =
        await subjectApi.getAll();

      setData(res);

    } catch (error:any) {

  const msg =
    error?.response?.data?.message
    || "Request failed";

  message.error(msg);

}

    setLoading(false);

  };

  /*
  فتح create
  */
  const openNew = () => {

    setEditing(null);

    form.resetFields();

    setModalOpen(true);

  };

  /*
  فتح edit
  نفس فكرة UniversitiesPage
  */
  const openEdit = (record: any) => {

    Modal.confirm({

      title: "Edit confirmation",

      content:
        "Editing subject name will update it in related lists.",

      okText: "Continue",

      cancelText: "Cancel",

      onOk() {

        setEditing(record);

        form.setFieldsValue(record);

        setModalOpen(true);

      }

    });

  };

  /*
  حفظ
  */
  const handleSave = async () => {

    try {

      const values =
        await form.validateFields();

      if (editing) {

        await subjectApi.update(

          editing.id,

          values

        );

        message.success(
          "Subject updated"
        );

      } else {

        await subjectApi.create(
          values
        );

        message.success(
          "Subject created"
        );

      }

      setModalOpen(false);

      loadData();

    } catch (error: any) {

      const msg =
        error?.response?.data?.message ||
        "Error saving subject";

      message.error(msg);

    }

  };

  /*
  حذف
  نفس فكرة UniversitiesPage
  */
  const handleDelete = (record: any) => {

    Modal.confirm({

      title: "Delete subject",

      content:
        "Delete only allowed if subject has no teaching sessions.",

      okText: "Delete",

      okButtonProps: { danger: true },

      onOk: async () => {

        try {

          await subjectApi.delete(

            record.id

          );

          message.success(
            "Subject deleted"
          );

          loadData();

        } catch (error: any) {

          const msg =
            error?.response?.data?.message ||
            "Cannot delete subject";

          message.error(msg);

        }

      }

    });

  };

  const columns = [

    {
      title: "Name",
      dataIndex: "name"
    },

    {
      title: "Description",
      dataIndex: "description"
    },

    {
      title: "Actions",

      render: (_: any, record: any) => (

        <Space>

          <Button
            size="small"
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>

          <Button
            danger
            size="small"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>

        </Space>

      )

    }

  ];

  return (

    <AppLayout>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20
        }}
      >

        <h2>

          Subjects

        </h2>

        <Button
          type="primary"
          onClick={openNew}
        >

          New Subject

        </Button>

      </div>

      <Card>

        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={loading}
        />

      </Card>

      <Modal

        title={
          editing
            ? "Edit Subject"
            : "New Subject"
        }

        open={modalOpen}

        onOk={handleSave}

        onCancel={() => setModalOpen(false)}

        okText="Save"

      >

        <Form
          form={form}
          layout="vertical"
        >

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >

            <Input />

          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >

            <Input />

          </Form.Item>

        </Form>

      </Modal>

    </AppLayout>

  );

}