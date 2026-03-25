import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { apiClient } from "../api/client";
import { currencyApi } from "../api/currencyApi";

import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  Modal,
  message,
  Space,
  Select
} from "antd";

export default function UniversitiesPage(){

  const [data,setData] =
    useState<any[]>([]);

  const [currencies,setCurrencies] =
    useState<any[]>([]);

  const [loading,setLoading] =
    useState(false);

  const [modalOpen,setModalOpen] =
    useState(false);

  const [editing,setEditing] =
    useState<any>(null);

  const [form] = Form.useForm();


  useEffect(()=>{

    loadData();

    loadCurrencies();

  },[]);


  /*
  load universities
  */

  const loadData = async()=>{

    setLoading(true);

    try{

      const res =
        await apiClient.get(
          "/universities"
        );

      setData(res.data);

    }
    catch(error:any){

      message.error(

        error?.response?.data?.message
        ||
        "Cannot load universities"

      );

    }

    setLoading(false);

  };


  /*
  load currencies
  */

  const loadCurrencies = async()=>{

    try{

      const res =
        await currencyApi.getAll();

      setCurrencies(res);

    }
    catch{

      message.error(
        "Cannot load currencies"
      );

    }

  };


  /*
  new
  */

  const openNew = ()=>{

    setEditing(null);

    form.resetFields();

    setModalOpen(true);

  };


  /*
  edit
  */

  const openEdit = (record:any)=>{

    setEditing(record);

    form.setFieldsValue({

      ...record,

      defaultCurrencyId:
        record.defaultCurrencyId

    });

    setModalOpen(true);

  };


  /*
  save
  */

  const handleSave = async()=>{

    try{

      const values =
        await form.validateFields();

      if(editing){

        await apiClient.put(

          `/universities/${editing.id}`,

          values

        );

        message.success(
          "University updated"
        );

      }
      else{

        await apiClient.post(

          "/universities",

          values

        );

        message.success(
          "University created"
        );

      }

      setModalOpen(false);

      loadData();

    }
    catch(error:any){

      message.error(

        error?.response?.data?.message
        ||
        "Save failed"

      );

    }

  };


  /*
  delete
  */

  const handleDelete = (record:any)=>{

    Modal.confirm({

      title:"Delete university",

      content:
        "Allowed only if no invoices exist.",

      okButtonProps:{
        danger:true
      },

      onOk: async()=>{

        try{

          await apiClient.delete(

            `/universities/${record.id}`

          );

          message.success(
            "Deleted"
          );

          loadData();

        }
        catch(error:any){

          message.error(

            error?.response?.data?.message
            ||
            "Cannot delete"

          );

        }

      }

    });

  };


  /*
  table
  */

  const columns = [

    {
      title:"Name",

      dataIndex:"name"
    },

    {
      title:"Currency",

      render:(_:any,record:any)=>

        record.defaultCurrency?.code
    },

    {
      title:"City",

      dataIndex:"city"
    },

    {
      title:"Country",

      dataIndex:"country"
    },

    {
      title:"Tax #",

      dataIndex:"taxNumber"
    },

    {

      title:"Actions",

      render:(_:any,record:any)=>(

        <Space>

          <Button
            size="small"
            onClick={()=>openEdit(record)}
          >
            Edit
          </Button>

          <Button
            danger
            size="small"
            onClick={()=>handleDelete(record)}
          >
            Delete
          </Button>

        </Space>

      )

    }

  ];


  return(

    <AppLayout>

      <div

        style={{

          display:"flex",

          justifyContent:"space-between",

          marginBottom:20

        }}

      >

        <h2>

          Universities

        </h2>

        <Button
          type="primary"
          onClick={openNew}
        >

          New University

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
            ? "Edit University"
            : "New University"
        }

        open={modalOpen}

        onOk={handleSave}

        onCancel={()=>
          setModalOpen(false)
        }

      >

        <Form
          form={form}
          layout="vertical"
        >

          <Row gutter={16}>

            <Col span={12}>

              <Form.Item
                label="Name"
                name="name"
                rules={[{required:true}]}
              >

                <Input/>

              </Form.Item>

            </Col>


            <Col span={12}>

              <Form.Item
                label="Currency"
                name="defaultCurrencyId"
                rules={[{required:true}]}
              >

                <Select>

                  {currencies.map(c=>(

                    <Select.Option
                      key={c.id}
                      value={c.id}
                    >

                      {c.code}

                    </Select.Option>

                  ))}

                </Select>

              </Form.Item>

            </Col>

          </Row>


          <Form.Item
            label="Address"
            name="addressLine"
          >

            <Input/>

          </Form.Item>


          <Row gutter={16}>

            <Col span={12}>

              <Form.Item
                label="City"
                name="city"
              >

                <Input/>

              </Form.Item>

            </Col>


            <Col span={12}>

              <Form.Item
                label="Country"
                name="country"
              >

                <Input/>

              </Form.Item>

            </Col>

          </Row>


          <Row gutter={16}>

            <Col span={12}>

              <Form.Item
                label="Registration #"
                name="registrationNumber"
              >

                <Input/>

              </Form.Item>

            </Col>


            <Col span={12}>

              <Form.Item
                label="Tax #"
                name="taxNumber"
              >

                <Input/>

              </Form.Item>

            </Col>

          </Row>


          <Row gutter={16}>

            <Col span={12}>

              <Form.Item
                label="Email"
                name="contactEmail"
              >

                <Input/>

              </Form.Item>

            </Col>


            <Col span={12}>

              <Form.Item
                label="Phone"
                name="contactPhone"
              >

                <Input/>

              </Form.Item>

            </Col>

          </Row>

        </Form>

      </Modal>

    </AppLayout>

  );

}