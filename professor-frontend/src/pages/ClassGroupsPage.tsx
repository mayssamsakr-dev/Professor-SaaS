import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";

import { classGroupApi } from "../api/classGroupApi";
import { universitySubjectApi } from "../api/universitySubjectApi";
import { universityApi } from "../api/universityApi";

import { Grid } from "antd";

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Space
} from "antd";

export default function ClassGroupsPage() {

  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;

  const [data, setData] = useState<any[]>([]);

  const [universities, setUniversities] = useState<any[]>([]);


  const [universitySubjects, setUniversitySubjects] = useState<any[]>([]);

  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

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
        await classGroupApi.getAll();

      setData(res);

      const u =
        await universityApi.getAll();


      const us =
        await universitySubjectApi.getAll();

      setUniversities(u);

      setUniversitySubjects(us);

    } catch (error:any) {

      const msg =
        error?.response?.data?.message
        || "Request failed";

      message.error(msg);

    }

    setLoading(false);

  };

  /*
  عند اختيار جامعة
  */
  const handleUniversityChange = (universityId:number) => {

    const filtered =
      universitySubjects.filter(us =>
        us.university.id === universityId
      );

    setFilteredSubjects(filtered);

    form.setFieldValue("subjectId", undefined);

  };

  /*
  create
  */
  const openNew = () => {

    setEditing(null);

    form.resetFields();

    setFilteredSubjects([]);

    setModalOpen(true);

  };

  /*
  edit
  */
  const openEdit = (record:any) => {

    setEditing(record);

    const universityId =
      record.universitySubject.university.id;

    const filtered =
      universitySubjects.filter(us =>
        us.university.id === universityId
      );

    setFilteredSubjects(filtered);

    form.setFieldsValue({

      universityId,

      subjectId:
        record.universitySubject.subject.id,

      name:
        record.name

    });

    setModalOpen(true);

  };

  /*
  save
  */
  const handleSave = async () => {

    try {

      const values =
        await form.validateFields();

      const universitySubject =
        universitySubjects.find(us =>
          us.university.id === values.universityId
          &&
          us.subject.id === values.subjectId
        );

      if (!universitySubject) {

        message.error(
          "Invalid selection"
        );

        return;

      }

      if (editing) {

        await classGroupApi.update(

          editing.id,

          {

            name:
              values.name,

            universitySubjectId:
              universitySubject.id

          }

        );

        message.success(
          "Class updated"
        );

      } else {

        await classGroupApi.create({

          name:
            values.name,

          universitySubjectId:
            universitySubject.id

        });

        message.success(
          "Class created"
        );

      }

      setModalOpen(false);

      loadData();

    } catch (error:any) {

      const msg =
        error?.response?.data?.message
        || "Error saving";

      message.error(msg);

    }

  };

  /*
  delete
  */
  const handleDelete = (record:any) => {

    Modal.confirm({

      title:
        "Delete class",

      content:
        "Delete allowed only if no sessions exist.",

      okText:
        "Delete",

      okButtonProps: {
        danger:true
      },

      cancelText:
        "Cancel",

      onOk: async () => {

        try {

          await classGroupApi.delete(

            record.id

          );

          message.success(
            "Deleted"
          );

          loadData();

        } catch (error:any) {

          const msg =
            error?.response?.data?.message
            || "Cannot delete";

          message.error(msg);

        }

      }

    });

  };

  const columns = [

    {

      title:
        "University",

      dataIndex:
        ["universitySubject","university","name"]

    },

    {

      title:
        "Subject",

      dataIndex:
        ["universitySubject","subject","name"]

    },

    {

      title:
        "Class",

      dataIndex:
        "name"

    },

    {

      title:
        "Actions",

      render:
        (_:any,record:any)=>(

          <Space>

            <Button
              size="small"
              onClick={() =>
                openEdit(record)
              }
            >

              Edit

            </Button>

            <Button
              danger
              size="small"
              onClick={() =>
                handleDelete(record)
              }
            >

              Delete

            </Button>

          </Space>

        )

    }

  ];

  return (

    <AppLayout>

      <Space

        direction={
          isMobile
            ? "vertical"
            : "horizontal"
        }

        style={{

          width:"100%",

          justifyContent:
            "space-between",

          marginBottom:20

        }}

      >

        <h2>

          Class Groups

        </h2>

        <Button

          type="primary"

          block={isMobile}

          onClick={openNew}

        >

          New Class

        </Button>

      </Space>

      <Card>

        <Table

          dataSource={data}

          columns={columns}

          rowKey="id"

          loading={loading}

          scroll={{ x:true }}

        />

      </Card>

      <Modal

        title={
          editing
            ? "Edit Class"
            : "New Class"
        }

        open={modalOpen}

        onOk={handleSave}

        onCancel={() =>
          setModalOpen(false)
        }

        okText="Save"

      >

        <Form

          form={form}

          layout="vertical"

        >

          <Form.Item

            label="University"

            name="universityId"

            rules={[
              { required:true }
            ]}

          >

            <Select

              disabled={editing}

              onChange={
                handleUniversityChange
              }

            >

              {universities.map(u=>(

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

            rules={[
              { required:true }
            ]}

          >

            <Select

              disabled={editing}

            >

              {filteredSubjects.map(us=>(

                <Select.Option

                  key={us.subject.id}

                  value={us.subject.id}

                >

                  {us.subject.name}

                </Select.Option>

              ))}

            </Select>

          </Form.Item>

          <Form.Item

            label="Class name"

            name="name"

            rules={[
              { required:true }
            ]}

          >

            <Input />

          </Form.Item>

        </Form>

      </Modal>

    </AppLayout>

  );

}