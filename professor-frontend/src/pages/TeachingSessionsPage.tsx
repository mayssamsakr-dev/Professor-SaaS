import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";

import { teachingSessionApi } from "../api/teachingSessionApi";
import { universitySubjectApi } from "../api/universitySubjectApi";
import { universityApi } from "../api/universityApi";

import { formatDate } from "../utils/format";
import dayjs from "dayjs";

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  message,
  Space
} from "antd";

export default function TeachingSessionsPage() {

  const [data, setData] = useState<any[]>([]);

  const [universities, setUniversities] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

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
        await teachingSessionApi.getAll();

      setData(res);

      const u =
        await universityApi.getAll();

      setUniversities(u);

    } catch (error:any) {

  const msg =
    error?.response?.data?.message
    || "Request failed";

  message.error(msg);

}

    setLoading(false);

  };

  /*
  تحميل المواد حسب الجامعة
  */
  const loadLinks = async (

    universityId: number

  ) => {

    const res =
      await universitySubjectApi.getByUniversity(
        universityId
      );

    setLinks(res);

  };

  /*
  create
  */
  const openNew = () => {

    setEditing(null);

    form.resetFields();

    setLinks([]);

    setModalOpen(true);

  };

  /*
  edit confirmation
  */
  const openEdit = (record: any) => {

    if (record.invoiceId) {

      message.warning(

        "Session already invoiced"

      );

      return;

    }

    Modal.confirm({

      title: "Edit confirmation",

      content:
        "Changes will affect future invoices only.",

      okText: "Continue",

      cancelText: "Cancel",

      onOk() {

        setEditing(record);

        const universityId =
          record.universitySubject
            .university.id;

        loadLinks(universityId);

        form.setFieldsValue({

          universityId,

          universitySubjectId:
            record.universitySubjectId,

          quantity:
            record.quantity,

          date:
            dayjs(record.date)

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

      const payload = {

        universitySubjectId:
          values.universitySubjectId,

        quantity:
          values.quantity,

        date:
          values.date.format(
            "YYYY-MM-DD"
          )

      };

      if (editing) {

        await teachingSessionApi.update(

          editing.id,

          payload

        );

        message.success(
          "Session updated"
        );

      } else {

        await teachingSessionApi.create(
          payload
        );

        message.success(
          "Session created"
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

    if (record.invoiceId) {

      message.warning(

        "Session already invoiced"

      );

      return;

    }

    Modal.confirm({

      title: "Delete session",

      content:
        "Delete only allowed if not invoiced.",

      okText: "Delete",

      okButtonProps: { danger: true },

      cancelText: "Cancel",

      onOk: async () => {

        try {

          await teachingSessionApi.delete(
            record.id
          );

          message.success(
            "Session deleted"
          );

          loadData();

        } catch (error: any) {

          const msg =
            error?.response?.data?.message ||
            "Cannot delete session";

          message.error(msg);

        }

      }

    });

  };

  const columns = [

    {
      title: "Date",

      dataIndex: "date",

      render: (v: string) =>
        formatDate(v)

    },

    {
      title: "University",

      render: (_: any, r: any) =>
        r.universitySubject?.university?.name

    },

    {
      title: "Subject",

      render: (_: any, r: any) =>
        r.universitySubject?.subject?.name

    },

    {
      title: "Qty",

      dataIndex: "quantity"

    },

    {
      title: "Rate",

      dataIndex: "unitRate"

    },

    {
      title: "Total",

      dataIndex: "totalAmount"

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
            size="small"
            danger
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

          Teaching Sessions

        </h2>

        <Button
          type="primary"
          onClick={openNew}
        >

          New Session

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
            ? "Edit Session"
            : "New Session"
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
              onChange={loadLinks}
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
            name="universitySubjectId"
            rules={[{ required: true }]}
          >

            <Select>

              {links.map(l => (

                <Select.Option
                  key={l.id}
                  value={l.id}
                >

                  {l.subject.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true }]}
          >

            <DatePicker
              style={{ width: "100%" }}
            />

          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
          >

            <InputNumber
              style={{ width: "100%" }}
              min={0.01}
            />

          </Form.Item>

        </Form>

      </Modal>

    </AppLayout>

  );

}