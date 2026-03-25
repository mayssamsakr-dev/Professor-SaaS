import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import { invoiceApi } from "../api/invoiceApi";
import { universityApi } from "../api/universityApi";

import {

  Table,
  Button,
  Card,
  Space,
  Tag,
  Select,
  Modal,
  message,
  Row

} from "antd";

import {

  formatDate,
  formatCurrency

} from "../utils/format";

export default function InvoicesPage() {

  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({

    universityId: undefined as number | undefined,

    status: undefined as string | undefined

  });

  useEffect(() => {

    loadData();
    loadUniversities();

  }, [filters]);

  /*
  load invoices
  */
  const loadData = async () => {

    setLoading(true);

    try {

      const res =
        await invoiceApi.getInvoices(filters);

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
  load universities
  */
  const loadUniversities = async () => {

    const res =
      await universityApi.getAll();

    setUniversities(res);

  };

  /*
  delete invoice
  */
  const handleDelete = (invoice:any) => {

const hasPayments =
invoice.paymentStatus !== "UNPAID";

Modal.confirm({

title:"Delete invoice",

content:
hasPayments
? "This invoice has payments. Deleting it will NOT delete the payments records but will detach them."
: "Are you sure you want to delete this draft invoice?",

okText:"Delete",

okButtonProps:{danger:true},

onOk: async()=>{

await invoiceApi.deleteInvoice(invoice.id);

loadData();

}

})

}

  /*
  UI helpers
  */

  const renderStatus = (status: string) => {

    if (status === "FINALIZED")

      return (
        <Tag color="green">
          FINALIZED
        </Tag>
      );

    return (
      <Tag color="orange">
        DRAFT
      </Tag>
    );

  };

  const renderPaymentStatus = (status: string) => {

    if (status === "PAID")

      return (
        <Tag color="green">
          PAID
        </Tag>
      );

    if (status === "PARTIALLY_PAID")

      return (
        <Tag color="blue">
          PARTIAL
        </Tag>
      );

    return (
      <Tag color="red">
        UNPAID
      </Tag>
    );

  };

  /*
  table columns
  */

  const columns = [

    {

      title: "Invoice #",

      dataIndex: "invoiceNumber"

    },

    {

      title: "University",

      dataIndex: [

        "university",
        "name"

      ]

    },

    {

      title: "Issue Date",

      dataIndex: "issueDate",

      render: (v: string) =>

        formatDate(v)

    },

    {

      title: "Period",

      render: (_: any, r: any) =>

        `${

          formatDate(
            r.periodStart
          )

        } - ${

          formatDate(
            r.periodEnd
          )

        }`

    },

    {

      title: "Total",

      render: (_: any, r: any) =>

        formatCurrency(

          r.totalAmount,

          r.currency

        )

    },

    {

      title: "Status",

      dataIndex: "status",

      render: renderStatus

    },

    {

      title: "Payment",

      dataIndex: "paymentStatus",

      render: renderPaymentStatus

    },

    {

      title: "",

      render: (_: any, record: any) => (

<Space>

<Button
size="small"
onClick={()=>
navigate(`/invoices/${record.id}`)
}
>
View
</Button>

{record.status==="DRAFT" && (

<Button
size="small"
onClick={()=>
navigate(`/create-invoice?id=${record.id}`)
}
>
Edit
</Button>

)}

{record.status==="DRAFT" && (

<Button
size="small"
danger
onClick={()=>
handleDelete(record)
}
>
Delete
</Button>

)}

</Space>

)

    }

  ];

  return (

    <AppLayout>

      {/* header */}

      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20 }}
      >

        <h2>

          Invoices

        </h2>

        <Button

          type="primary"

          onClick={() =>

            navigate(

              "/create-invoice"

            )

          }

        >

          Create Invoice

        </Button>

      </Row>

      {/* filters */}

      <Card style={{ marginBottom: 20 }}>

        <Space size="large">

          <Select

            placeholder="University"

            allowClear

            style={{ width: 220 }}

            onChange={(value) =>

              setFilters({

                ...filters,

                universityId:

                  value

              })

            }

          >

            {

              universities.map(u => (

                <Select.Option

                  key={u.id}

                  value={u.id}

                >

                  {u.name}

                </Select.Option>

              ))

            }

          </Select>

          <Select

            placeholder="Status"

            allowClear

            style={{ width: 160 }}

            onChange={(value) =>

              setFilters({

                ...filters,

                status: value

              })

            }

          >

            <Select.Option value="DRAFT">

              DRAFT

            </Select.Option>

            <Select.Option value="FINALIZED">

              FINALIZED

            </Select.Option>

          </Select>

        </Space>

      </Card>

      {/* table */}

      <Card>

        <Table

          dataSource={data}

          columns={columns}

          rowKey="id"

          loading={loading}

          pagination={{

            pageSize: 10

          }}

        />

      </Card>

    </AppLayout>

  );

}