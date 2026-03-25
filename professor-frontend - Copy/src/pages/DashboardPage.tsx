import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { reportApi } from "../api/reportApi";

import {
  Card,
  Row,
  Col,
  Typography,
  DatePicker,
  Button,
  Space,
  Alert
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

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function DashboardPage() {

  const [summary, setSummary] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [byUniversity, setByUniversity] = useState<any[]>([]);
  const [dates, setDates] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (customDates?: any) => {

    const d = customDates || dates;

    let query = "";

    if (d) {
      const from = d[0].format("YYYY-MM-DD");
      const to = d[1].format("YYYY-MM-DD");
      query = `?dateFrom=${from}&dateTo=${to}`;
    }

    const s = await reportApi.getSummary(query);
    const m = await reportApi.getMonthly(query);
    const u = await reportApi.getByUniversity(query);

    setSummary(s);
    setMonthly(m);
    setByUniversity(u);

  };

  const handleApply = () => loadData(dates);

  const paidPercent = summary
    ? (summary.paidRevenue / summary.totalRevenue) * 100
    : 0;

  const avgInvoice = summary
    ? summary.totalRevenue / (summary.invoiceCount || 1)
    : 0;

  const topUniversity = byUniversity.length
    ? [...byUniversity].sort((a, b) => b.total - a.total)[0]
    : null;

  const bestMonth = monthly.length
    ? [...monthly].sort((a, b) => b.total - a.total)[0]
    : null;

  return (
    <AppLayout>

      <Title level={4}>Dashboard</Title>

      <Card style={{ marginBottom: 20 }}>
        <Space>
          <RangePicker onChange={(val) => setDates(val)} />
          <Button type="primary" onClick={handleApply}>
            Apply
          </Button>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>

        <Col span={6}>
          <Card>
            <Text>Total Revenue</Text>
            <Title level={4}>
              {summary ? formatCurrency(summary.totalRevenue, "USD") : "-"}
            </Title>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Text>Paid %</Text>
            <Title level={4}>
              {paidPercent.toFixed(1)}%
            </Title>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Text>Outstanding</Text>
            <Title level={4}>
              {summary
                ? formatCurrency(summary.unpaidRevenue, "USD")
                : "-"}
            </Title>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Text>Avg Invoice</Text>
            <Title level={4}>
              {formatCurrency(avgInvoice, "USD")}
            </Title>
          </Card>
        </Col>

      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>

        <Col span={12}>
          <Card title="Top University">
            {topUniversity
              ? `${topUniversity.universityName} (${formatCurrency(topUniversity.total, "USD")})`
              : "No data"}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Best Month">
            {bestMonth
              ? `${bestMonth.month} (${formatCurrency(bestMonth.total, "USD")})`
              : "No data"}
          </Card>
        </Col>

      </Row>

      {summary && summary.unpaidRevenue > 0 && (
        <Alert
          type="warning"
          message="Unpaid invoices detected"
          description={`Outstanding: ${formatCurrency(summary.unpaidRevenue, "USD")}`}
          style={{ marginBottom: 20 }}
        />
      )}

      <Card title="Revenue Trend">

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>

      </Card>

    </AppLayout>
  );
}