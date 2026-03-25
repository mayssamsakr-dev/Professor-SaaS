import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";

import { serviceActivityApi } from "../api/serviceActivityApi";
import { universityApi } from "../api/universityApi";
import { serviceTypeApi } from "../api/serviceTypeApi";

import { formatDate } from "../utils/format";

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

import dayjs from "dayjs";

export default function ServiceActivitiesPage() {

  const [data, setData] = useState<any[]>([]);

  const [universities, setUniversities] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

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
        await serviceActivityApi.getAll();

      setData(res);

      const u =
        await universityApi.getAll();

      const t =
        await serviceTypeApi.getAll();

      setUniversities(u);
      setTypes(t);

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

    if (record.invoiceId) {

      message.warning(
        "Activity already invoiced"
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

form.setFieldsValue({

  universityId:
    Number(record.universityId),

  serviceTypeId:
    Number(record.serviceTypeId),

  quantity:
    record.quantity
      ? Number(record.quantity)
      : undefined,

  unitRate:
    Number(record.unitRate),

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

        ...values,

        date:
          values.date.format(
            "YYYY-MM-DD"
          )

      };

      if (editing) {

        await serviceActivityApi.update(

          editing.id,

          payload

        );

        message.success(
          "Activity updated"
        );

      } else {

        await serviceActivityApi.create(
          payload
        );

        message.success(
          "Activity created"
        );

      }

      setModalOpen(false);

      loadData();

    } catch (error: any) {

      const msg =
        error?.response?.data?.message ||
        "Error saving activity";

      message.error(msg);

    }

  };

  /*
  delete confirmation
  */
  const handleDelete = (record: any) => {

    if (record.invoiceId) {

      message.warning(
        "Activity already invoiced"
      );

      return;

    }

    Modal.confirm({

      title: "Delete activity",

      content:
        "Delete only allowed if not invoiced.",

      okText: "Delete",

      okButtonProps: { danger: true },

      cancelText: "Cancel",

      onOk: async () => {

        try {

          await serviceActivityApi.delete(
            record.id
          );

          message.success(
            "Activity deleted"
          );

          loadData();

        } catch (error: any) {

          const msg =
            error?.response?.data?.message ||
            "Cannot delete activity";

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
        r.university?.name

    },

    {
      title: "Type",

      render: (_: any, r: any) =>
        r.serviceType?.name

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

          Service Activities

        </h2>

        <Button
          type="primary"
          onClick={openNew}
        >

          New Activity

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
            ? "Edit Activity"
            : "New Activity"
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

            <Select>

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
            label="Activity Type"
            name="serviceTypeId"
            rules={[{ required: true }]}
          >

            <Select>

              {types.map(t => (

                <Select.Option
                  key={t.id}
                  value={t.id}
                >

                  {t.name}

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
          >

            <InputNumber
              style={{ width: "100%" }}
              min={0.01}
            />

          </Form.Item>

          <Form.Item
            label="Unit Rate"
            name="unitRate"
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