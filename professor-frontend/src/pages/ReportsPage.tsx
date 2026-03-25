import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { reportApi } from "../api/reportApi";

import {
  Card,
  Row,
  Col
} from "antd";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { formatCurrency } from "../utils/format";

export default function ReportsPage() {

  const [summary, setSummary] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [byUniversity, setByUniversity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const s = await reportApi.getSummary();
    const m = await reportApi.getMonthly();
    const u = await reportApi.getByUniversity();

    setSummary(s);
    setMonthly(m);
    setByUniversity(u);

  };

  return (

    <AppLayout>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>

        <h2 style={{ marginBottom: 0 }}>
          Reports
        </h2>

        <div style={{ color: "#6b7280" }}>
          Financial insights and performance overview
        </div>

      </div>


      {/* KPI */}
      <Row gutter={16} style={{ marginBottom: 20 }}>

        <Col span={6}>
          <Card>

            <div style={{ color: "#6b7280" }}>
              Total Revenue
            </div>

            <h2>
              {summary
                ? formatCurrency(summary.totalRevenue, "USD")
                : "-"
              }
            </h2>

          </Card>
        </Col>


        <Col span={6}>
          <Card>

            <div style={{ color: "#6b7280" }}>
              Paid Revenue
            </div>

            <h2>
              {summary
                ? formatCurrency(summary.paidRevenue, "USD")
                : "-"
              }
            </h2>

          </Card>
        </Col>


        <Col span={6}>
          <Card>

            <div style={{ color: "#6b7280" }}>
              Outstanding
            </div>

            <h2>
              {summary
                ? formatCurrency(summary.unpaidRevenue, "USD")
                : "-"
              }
            </h2>

          </Card>
        </Col>


        <Col span={6}>
          <Card>

            <div style={{ color: "#6b7280" }}>
              Invoice Count
            </div>

            <h2>
              {summary?.invoiceCount || 0}
            </h2>

          </Card>
        </Col>

      </Row>


      {/* Charts */}
      <Row gutter={16}>

        <Col span={12}>

          <Card title="Revenue by University">

            {byUniversity.length === 0
              ? "No data"
              : byUniversity.map((u: any) => (

                <div
                  key={u.universityName}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid #f1f1f1"
                  }}
                >

                  <div>
                    {u.universityName}
                  </div>

                  <strong>
                    {formatCurrency(u.total, "USD")}
                  </strong>

                </div>

              ))
            }

          </Card>

        </Col>


        <Col span={12}>

          <Card title="Monthly Revenue">

            <ResponsiveContainer width="100%" height={260}>

              <LineChart data={monthly}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                />

              </LineChart>

            </ResponsiveContainer>

          </Card>

        </Col>

      </Row>

    </AppLayout>

  );

}