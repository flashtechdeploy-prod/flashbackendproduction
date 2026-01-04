"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  message,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Breadcrumb,
  Spin,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  SwapOutlined,
  TeamOutlined,
  DollarOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

type MonthlyTotals = {
  month: string;
  guard_count: number;
  total_salary: number;
};

type ClientTotalsComparisonRow = {
  client_id: number;
  client_code: string;
  client_name: string;
  month1: MonthlyTotals;
  month2: MonthlyTotals;
  total_salary_diff: number;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function formatMoney(v: number): string {
  return `Rs ${Number(v || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

function monthLabel(d: dayjs.Dayjs): string {
  return d.format("MMM YYYY");
}

export default function AllClientsComparisonPage() {
  const router = useRouter();
  const [msg, msgCtx] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ClientTotalsComparisonRow[]>([]);

  const [month1, setMonth1] = useState(dayjs().subtract(1, "month"));
  const [month2, setMonth2] = useState(dayjs());

  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<ClientTotalsComparisonRow[]>(
        `/api/client-management/clients/compare-months/all?month1=${month1.format("YYYY-MM")}&month2=${month2.format("YYYY-MM")}`
      );
      setRows(Array.isArray(data) ? data : []);
    } catch {
      msg.error("Failed to load clients comparison");
    } finally {
      setLoading(false);
    }
  }, [month1, month2, msg]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        String(r.client_name || "").toLowerCase().includes(q) ||
        String(r.client_code || "").toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  const totals = useMemo(() => {
    let m1Salary = 0;
    let m2Salary = 0;
    let m1Guards = 0;
    let m2Guards = 0;
    for (const r of filteredRows) {
      m1Salary += Number(r.month1?.total_salary || 0);
      m2Salary += Number(r.month2?.total_salary || 0);
      m1Guards += Number(r.month1?.guard_count || 0);
      m2Guards += Number(r.month2?.guard_count || 0);
    }
    return { m1Salary, m2Salary, m1Guards, m2Guards };
  }, [filteredRows]);

  const totalsDiff = useMemo(() => {
    return Number(totals.m2Salary || 0) - Number(totals.m1Salary || 0);
  }, [totals.m1Salary, totals.m2Salary]);

  const exportCsv = useCallback(() => {
    const m1Label = monthLabel(month1);
    const m2Label = monthLabel(month2);

    const lines: string[] = [];

    // KPI section
    lines.push(["KPI", "Value"].map(csvEscape).join(","));
    lines.push([`Total Salary (${m1Label})`, formatMoney(totals.m1Salary)].map(csvEscape).join(","));
    lines.push([`Total Salary (${m2Label})`, formatMoney(totals.m2Salary)].map(csvEscape).join(","));
    lines.push([`Total Salary Difference (${m2Label} - ${m1Label})`, formatMoney(totalsDiff)].map(csvEscape).join(","));
    lines.push([`Guards (${m1Label})`, totals.m1Guards].map(csvEscape).join(","));
    lines.push([`Guards (${m2Label})`, totals.m2Guards].map(csvEscape).join(","));
    lines.push("");

    // Details table
    const headers = [
      "S#",
      "Strength",
      "Client Name",
      `Guards (${m1Label})`,
      `Salary (${m1Label})`,
      `Guards (${m2Label})`,
      `Salary (${m2Label})`,
      "Salary Diff",
    ];
    lines.push(headers.map(csvEscape).join(","));
    filteredRows.forEach((r, idx) => {
      lines.push(
        [
          idx + 1,
          r.month2?.guard_count || 0,
          r.client_name,
          r.month1?.guard_count || 0,
          r.month1?.total_salary || 0,
          r.month2?.guard_count || 0,
          r.month2?.total_salary || 0,
          r.total_salary_diff || 0,
        ]
          .map(csvEscape)
          .join(",")
      );
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `clients_compare_${month1.format("YYYY-MM")}_vs_${month2.format("YYYY-MM")}.csv`);
  }, [filteredRows, month1, month2, totals.m1Guards, totals.m1Salary, totals.m2Guards, totals.m2Salary, totalsDiff]);

  const exportPdf = useCallback(() => {
    const m1Label = monthLabel(month1);
    const m2Label = monthLabel(month2);

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(14);
    doc.text(`Client Management - Compare (${m1Label} vs ${m2Label})`, 40, 40);

    // KPI section
    doc.setFontSize(11);
    doc.text("KPIs", 40, 65);

    autoTable(doc, {
      startY: 75,
      head: [["KPI", "Value"]],
      body: [
        [`Total Salary (${m1Label})`, formatMoney(totals.m1Salary)],
        [`Total Salary (${m2Label})`, formatMoney(totals.m2Salary)],
        [`Total Salary Difference (${m2Label} - ${m1Label})`, formatMoney(totalsDiff)],
        [`Guards (${m1Label})`, String(totals.m1Guards)],
        [`Guards (${m2Label})`, String(totals.m2Guards)],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
      theme: "grid",
    });

    const afterKpiY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 18 : 160;

    autoTable(doc, {
      startY: afterKpiY,
      head: [[
        "S#",
        "Strength",
        "Client Name",
        `Guards (${m1Label})`,
        `Salary (${m1Label})`,
        `Guards (${m2Label})`,
        `Salary (${m2Label})`,
        "Salary Diff",
      ]],
      body: filteredRows.map((r, idx) => [
        String(idx + 1),
        String(r.month2?.guard_count || 0),
        r.client_name,
        String(r.month1?.guard_count || 0),
        formatMoney(r.month1?.total_salary || 0),
        String(r.month2?.guard_count || 0),
        formatMoney(r.month2?.total_salary || 0),
        formatMoney(r.total_salary_diff || 0),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
      theme: "grid",
      columnStyles: {
        1: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });

    doc.save(`clients_compare_${month1.format("YYYY-MM")}_vs_${month2.format("YYYY-MM")}.pdf`);
  }, [filteredRows, month1, month2, totals.m1Guards, totals.m1Salary, totals.m2Guards, totals.m2Salary, totalsDiff]);

  const diffColor = (v1: number, v2: number) => {
    if (v2 > v1) return "#cf1322";
    if (v2 < v1) return "#3f8600";
    return "inherit";
  };

  const columns = useMemo<ColumnsType<ClientTotalsComparisonRow>>(
    () => [
      {
        title: "S#",
        key: "serial",
        width: 60,
        render: (_: unknown, __: ClientTotalsComparisonRow, idx: number) => idx + 1,
      },
      {
        title: "Strength",
        key: "strength",
        width: 80,
        align: "center",
        render: (_, r) => r.month2?.guard_count || 0,
      },
      {
        title: "Client",
        key: "client",
        render: (_, r) => (
          <Space direction="vertical" size={0}>
            <Text strong>{r.client_name}</Text>
            <Space size={6}>
              <Tag color="blue">{r.client_code}</Tag>
              <Button size="small" type="link" onClick={() => router.push(`/client-management/clients/${r.client_id}`)}>
                Open
              </Button>
            </Space>
          </Space>
        ),
      },
      {
        title: `${monthLabel(month1)} (Guards / Salary)`,
        key: "m1",
        align: "right",
        render: (_, r) => (
          <Space direction="vertical" size={0} style={{ width: "100%", textAlign: "right" }}>
            <Text type="secondary">{r.month1?.guard_count || 0}</Text>
            <Text strong>{formatMoney(r.month1?.total_salary || 0)}</Text>
          </Space>
        ),
      },
      {
        title: `${monthLabel(month2)} (Guards / Salary)`,
        key: "m2",
        align: "right",
        render: (_, r) => (
          <Space direction="vertical" size={0} style={{ width: "100%", textAlign: "right" }}>
            <Text type="secondary">{r.month2?.guard_count || 0}</Text>
            <Text strong style={{ color: diffColor(r.month1?.total_salary || 0, r.month2?.total_salary || 0) }}>
              {formatMoney(r.month2?.total_salary || 0)}
            </Text>
          </Space>
        ),
      },
      {
        title: "Salary Diff",
        key: "diff",
        align: "right",
        render: (_, r) => (
          <Text strong style={{ color: diffColor(0, r.total_salary_diff || 0) }}>
            {formatMoney(r.total_salary_diff || 0)}
          </Text>
        ),
      },
    ],
    [month1, month2, router]
  );

  return (
    <div style={{ padding: "24px" }}>
      {msgCtx}

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Breadcrumb
            items={[
              { title: "Client Management", onClick: () => router.push("/client-management"), className: "cursor-pointer" },
              { title: "All Clients Comparison" },
            ]}
          />
          <div style={{ marginTop: 8 }}>
            <Space align="start" size={12}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/client-management")} type="text" />
              <div>
                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                  Month-wise salary comparison
                </Text>
                <Title level={3} style={{ margin: "2px 0 0 0", fontWeight: 800 }}>
                  All Clients
                </Title>
              </div>
            </Space>
          </div>
        </Col>

        <Col>
          <Space>
            <DatePicker picker="month" value={month1} onChange={(v) => v && setMonth1(v)} allowClear={false} />
            <SwapOutlined style={{ color: "#8c8c8c" }} />
            <DatePicker picker="month" value={month2} onChange={(v) => v && setMonth2(v)} allowClear={false} />
            <Button type="primary" onClick={() => void load()}>
              Compare
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={() => exportCsv()}>
              Export CSV
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={() => exportPdf()}>
              Export PDF
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title={`Total Salary (${monthLabel(month1)})`} value={formatMoney(totals.m1Salary)} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title={`Total Salary (${monthLabel(month2)})`} value={formatMoney(totals.m2Salary)} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title={`Total Salary Diff (${monthLabel(month2)} - ${monthLabel(month1)})`}
              value={formatMoney(totalsDiff)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title={`Guards (${monthLabel(month1)})`} value={totals.m1Guards} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title={`Guards (${monthLabel(month2)})`} value={totals.m2Guards} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card styles={{ body: { padding: 16 } }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <Space direction="vertical" size={0}>
              <Text strong>Clients</Text>
              <Text type="secondary">Showing {filteredRows.length} clients</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input placeholder="Search client..." value={search} onChange={(e) => setSearch(e.target.value)} allowClear style={{ width: 240 }} />
              <Divider type="vertical" />
              <Button onClick={() => setSearch("")}>Clear</Button>
            </Space>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table<ClientTotalsComparisonRow>
            rowKey={(r) => String(r.client_id)}
            size="small"
            dataSource={filteredRows}
            columns={columns}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        </Spin>
      </Card>
    </div>
  );
}
