import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";

import { universitySubjectApi } from "../api/universitySubjectApi";
import { universityApi } from "../api/universityApi";
import { subjectApi } from "../api/subjectApi";

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Space
} from "antd";

export default function UniversitySubjectsPage() {

  const [data, setData] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

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
        await universitySubjectApi.getAll();

      setData(res);

      const u =
        await universityApi.getAll();

      const s =
        await subjectApi.getAll();

      setUniversities(u);

      setSubjects(s);

    } catch (error:any) {

  const msg =
    error?.response?.data?.message
    || "Request failed";

  message.error(msg);

}

    setLoading(false);

  };

  /*
  create
  */
  const openNew = () => {

    setEditing(null);

    form.resetFields();

    setModalOpen(true);

  };

  /*
  edit confirmation
  */
  const openEdit = (record: any) => {

    Modal.confirm({

      title: "Edit confirmation",

      content:
        "Changing rate will affect future sessions.",

      okText: "Continue",

      cancelText: "Cancel",

      onOk() {

        setEditing(record);

        form.setFieldsValue({

          universityId:
            record.university.id,

          subjectId:
            record.subject.id,

          ratePerSession:
            record.ratePerSession

        });

        setModalOpen(true);

      }

    });

  };

  /*
  save
  */
  const handleSave = async () => {

    try {

      const values =
        await form.validateFields();

      if (editing) {

        await universitySubjectApi.update(

          editing.id,

          values.ratePerSession

        );

        message.success(
          "Rate updated"
        );

      } else {

        await universitySubjectApi.create(
          values
        );

        message.success(
          "Link created"
        );

      }

      setModalOpen(false);

      loadData();

    } catch (error: any) {

      const msg =
        error?.response?.data?.message ||
        "Error saving";

      message.error(msg);

    }

  };

  /*
  delete confirmation
  */
  const handleDelete = (record: any) => {

    Modal.confirm({

      title: "Delete link",

      content:
        "Delete only allowed if no teaching sessions exist.",

      okText: "Delete",

      okButtonProps: { danger: true },

      cancelText: "Cancel",

      onOk: async () => {

        try {

          await universitySubjectApi.delete(

            record.id

          );

          message.success(
            "Link deleted"
          );

          loadData();

        } catch (error: any) {

          const msg =
            error?.response?.data?.message ||
            "Cannot delete link";

          message.error(msg);

        }

      }

    });

  };

  const columns = [

    {
      title: "University",

      dataIndex: ["university", "name"]

    },

    {
      title: "Subject",

      dataIndex: ["subject", "name"]

    },

    {
      title: "Rate / Session",

      dataIndex: "ratePerSession"

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

          University Subjects

        </h2>

        <Button
          type="primary"
          onClick={openNew}
        >

          New Link

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
            ? "Edit Rate"
            : "New Link"
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
            label="University"
            name="universityId"
            rules={[{ required: true }]}
          >

            <Select
              disabled={editing}
            >

              {universities.map(u => (

                <Select.Option
                  key={u.id}
                  value={u.id}
                >

                  {u.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>

          <Form.Item
            label="Subject"
            name="subjectId"
            rules={[{ required: true }]}
          >

            <Select
              disabled={editing}
            >

              {subjects.map(s => (

                <Select.Option
                  key={s.id}
                  value={s.id}
                >

                  {s.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>

          <Form.Item
            label="Rate per Session"
            name="ratePerSession"
            rules={[{ required: true }]}
          >

            <InputNumber
              style={{ width: "100%" }}
              min={0}
            />

          </Form.Item>

        </Form>

      </Modal>

    </AppLayout>

  );

}