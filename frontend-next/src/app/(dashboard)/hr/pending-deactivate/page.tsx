"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Popconfirm,
  App,
  Avatar,
  Tooltip,
  Modal,
  Statistic,
  Descriptions,
  Divider,
  Alert,
} from "antd";
import {
  UserOutlined,
  UserDeleteOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/lib/api";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

function resolveAvatarUrl(v: string | null | undefined): string | undefined {
  if (!v) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return `${api.baseUrl}${s.startsWith("/") ? s : `/${s}`}`;
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(blob);
  });
}

function fmtDate(v: string | null | undefined): string {
  const d = dayjs(String(v || ""));
  return d.isValid() ? d.format("YYYY-MM-DD") : "-";
}

function fmtMoney(v: number | null | undefined): string {
  const n = typeof v === "number" && Number.isFinite(v) ? v : 0;
  return `Rs ${n.toLocaleString()}`;
}

function safeFileName(v: string): string {
  return v
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "")
    .slice(0, 80);
}

async function exportDeactivationPdf(record: PendingDeactivation) {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  const avatarUrl = resolveAvatarUrl(record.avatar_url);
  if (avatarUrl) {
    try {
      const dataUrl = await urlToDataUrl(avatarUrl);
      doc.addImage(dataUrl, "JPEG", 14, 10, 18, 18);
    } catch {
      // ignore
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Deactivation Details", pageWidth / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(String(record.name || ""), pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Employee Information", 14, y);

  const employeeRows: Array<[string, string]> = [
    ["Name", record.name || "-"],
    ["Employee ID", record.employee_id || "-"],
    ["Serial #", record.serial_no || "-"],
    ["FSS #", record.fss_no || "-"],
    ["Rank", record.rank || "-"],
    ["Category", record.category || "-"],
    ["Unit", record.unit || "-"],
    ["CNIC", record.cnic || "-"],
    ["Mobile", record.mobile_no || "-"],
    ["Bank", record.bank_name || "-"],
    ["Account #", record.bank_account_number || "-"],
    ["Base Salary", fmtMoney(record.base_salary)],
    ["Deactivation Date", fmtDate(record.deactivation_date)],
  ];

  autoTable(doc, {
    startY: y + 2,
    head: [["Field", "Value"]],
    body: employeeRows,
    styles: { fontSize: 10, cellPadding: 2.2 },
    headStyles: { fillColor: [24, 144, 255] },
    columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 140 } },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Attendance Summary", 14, y);

  autoTable(doc, {
    startY: y + 2,
    head: [["Period", "Present", "Absent", "Leave", "Late"]],
    body: [
      [
        `${fmtDate(record.attendance_summary.from_date)} to ${fmtDate(record.attendance_summary.to_date)}`,
        String(record.attendance_summary.present_days ?? 0),
        String(record.attendance_summary.absent_days ?? 0),
        String(record.attendance_summary.leave_days ?? 0),
        String(record.attendance_summary.late_days ?? 0),
      ],
    ],
    styles: { fontSize: 10, cellPadding: 2.2 },
    headStyles: { fillColor: [240, 242, 245], textColor: 20 },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Salary Calculation", 14, y);

  autoTable(doc, {
    startY: y + 2,
    head: [["Item", "Amount"]],
    body: [
      ["Gross Salary", fmtMoney(record.salary_calculation.gross_salary)],
      ["EOBI", `- ${fmtMoney(record.salary_calculation.deductions.eobi ?? 0)}`],
      ["Tax", `- ${fmtMoney(record.salary_calculation.deductions.tax ?? 0)}`],
      ["Advance", `- ${fmtMoney(record.salary_calculation.deductions.advance ?? 0)}`],
      ["Fine", `- ${fmtMoney(record.salary_calculation.deductions.fine ?? 0)}`],
      ["Net Payable", fmtMoney(record.salary_calculation.net_payable)],
    ],
    styles: { fontSize: 10, cellPadding: 2.2 },
    headStyles: { fillColor: [240, 242, 245], textColor: 20 },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Final Settlement", 14, y);

  autoTable(doc, {
    startY: y + 2,
    head: [["Item", "Amount"]],
    body: [
      ["Amount to Collect", fmtMoney(record.settlement.total_to_collect)],
      ["Amount to Pay", fmtMoney(record.settlement.total_to_pay)],
      ["Net Amount", fmtMoney(record.settlement.net_amount)],
    ],
    styles: { fontSize: 10, cellPadding: 2.2 },
    headStyles: { fillColor: [240, 242, 245], textColor: 20 },
    theme: "grid",
  });

  if (record.inventory_items && record.inventory_items.length > 0) {
    y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Inventory Assigned", 14, y);

    autoTable(doc, {
      startY: y + 2,
      head: [["Item", "Assigned Date", "Condition", "Value"]],
      body: record.inventory_items.map((it) => [
        it.item_name || "-",
        fmtDate(it.assigned_date),
        it.condition || "-",
        it.value ? fmtMoney(it.value) : "-",
      ]),
      styles: { fontSize: 10, cellPadding: 2.2 },
      headStyles: { fillColor: [240, 242, 245], textColor: 20 },
      theme: "grid",
    });
  }

  const fileName = `deactivation_${safeFileName(record.name || 'employee')}_${fmtDate(record.deactivation_date)}.pdf`;
  doc.save(fileName);
}

interface PendingDeactivation {
  id: number;
  employee_db_id: number;
  employee_id: string;
  name: string;
  serial_no?: string;
  fss_no?: string;
  rank?: string;
  category?: string;
  unit?: string;
  cnic?: string;
  mobile_no?: string;
  avatar_url?: string;
  bank_name?: string;
  bank_account_number?: string;
  base_salary?: number;
  deactivation_date: string;
  created_at: string;
  // Computed fields from backend
  inventory_items: InventoryItem[];
  attendance_summary: AttendanceSummary;
  salary_calculation: SalaryCalculation;
  settlement: Settlement;
}

interface InventoryItem {
  item_name: string;
  assigned_date: string;
  condition: string;
  value?: number;
}

interface AttendanceSummary {
  total_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  late_days: number;
  from_date: string;
  to_date: string;
}

interface SalaryCalculation {
  gross_salary: number;
  deductions: {
    eobi?: number;
    tax?: number;
    advance?: number;
    fine?: number;
  };
  net_payable: number;
}

interface Settlement {
  total_to_collect: number;
  total_to_pay: number;
  net_amount: number;
}

export default function PendingDeactivatePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [pending, setPending] = useState<PendingDeactivation[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PendingDeactivation | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PendingDeactivation[]>("/api/hr/pending-deactivate");
      setPending(res);
    } catch {
      message.error("Failed to fetch pending deactivations");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleMoveToInactive = async (id: number) => {
    try {
      await api.post(`/api/hr/pending-deactivate/${id}/move-to-inactive`, {});
      message.success("Employee moved to inactive list");
      fetchPending();
    } catch {
      message.error("Failed to move to inactive");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.del(`/api/hr/pending-deactivate/${id}`);
      message.success("Pending deactivation rejected");
      fetchPending();
    } catch {
      message.error("Failed to reject");
    }
  };

  const openDetailModal = (record: PendingDeactivation) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const columns: ColumnsType<PendingDeactivation> = [
    {
      title: "Employee",
      key: "employee",
      width: 200,
      render: (_, record) => (
        <Space size="small" style={{ cursor: "pointer" }} onClick={() => openDetailModal(record)}>
          <Avatar src={resolveAvatarUrl(record.avatar_url)} icon={<UserOutlined />} size={32} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 10 }}>{record.serial_no || "-"} • {record.rank || "-"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Deactivation Date",
      dataIndex: "deactivation_date",
      key: "deactivation_date",
      width: 130,
      render: (d) => <Text style={{ fontSize: 12 }}>{fmtDate(d)}</Text>,
    },
    {
      title: "Unit/Category",
      key: "unit_cat",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ fontSize: 12 }}>{record.unit || "-"}</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>{record.category || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Attendance (P/A/L)",
      key: "attendance",
      width: 100,
      render: (_, record) => (
        <Space size={2}>
          <Tag color="green" style={{ fontSize: 10 }}>{record.attendance_summary.present_days}</Tag>
          <Tag color="red" style={{ fontSize: 10 }}>{record.attendance_summary.absent_days}</Tag>
          <Tag color="orange" style={{ fontSize: 10 }}>{record.attendance_summary.leave_days}</Tag>
        </Space>
      ),
    },
    {
      title: "Net Payable",
      key: "net_payable",
      width: 100,
      align: "right",
      render: (_, record) => (
        <Text strong style={{ fontSize: 12, color: record.salary_calculation.net_payable >= 0 ? "#52c41a" : "#ff4d4f" }}>
          Rs {record.salary_calculation.net_payable.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Settlement",
      key: "settlement",
      width: 110,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", fontSize: 11 }}>
          <Text type="success">Collect: Rs {record.settlement.total_to_collect.toLocaleString()}</Text>
          <Text type="warning">Pay: Rs {record.settlement.total_to_pay.toLocaleString()}</Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size={2}>
          <Tooltip title="View Details">
            <Button size="small" type="text" onClick={() => openDetailModal(record)} style={{ color: "#1890ff" }}>
              View
            </Button>
          </Tooltip>
          <Tooltip title="Move to Inactive">
            <Popconfirm
              title="Move employee to inactive list?"
              onConfirm={() => handleMoveToInactive(record.id)}
              okText="Yes"
            >
              <Button size="small" type="text" icon={<CheckOutlined />} style={{ color: "#52c41a" }} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Reject">
            <Popconfirm
              title="Reject this deactivation request?"
              onConfirm={() => handleReject(record.id)}
              okText="Yes"
            >
              <Button size="small" type="text" icon={<CloseOutlined />} style={{ color: "#ff4d4f" }} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 24px", background: "transparent", minHeight: "100vh" }}>
      <Card bordered={false} bodyStyle={{ padding: "16px 20px" }} style={{ borderRadius: 12, marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Pending Deactivations</Title>
            <Text type="secondary">Review and process employee deactivation requests</Text>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchPending}>Refresh</Button>
          </Col>
        </Row>
      </Card>

      {pending.length === 0 && !loading && (
        <Alert
          message="No pending deactivations"
          description="There are no pending deactivation requests at the moment."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={pending}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `${total} requests`,
          }}
          size="small"
        />
      </Card>

      <Modal
        title={`Deactivation Details: ${selectedRecord?.name || ""}`}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedRecord && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Descriptions title="Employee Information" column={2} size="small">
              <Descriptions.Item label="Name">{selectedRecord.name}</Descriptions.Item>
              <Descriptions.Item label="Employee ID">{selectedRecord.employee_id}</Descriptions.Item>
              <Descriptions.Item label="Serial #">{selectedRecord.serial_no || "-"}</Descriptions.Item>
              <Descriptions.Item label="FSS #">{selectedRecord.fss_no || "-"}</Descriptions.Item>
              <Descriptions.Item label="Rank">{selectedRecord.rank || "-"}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedRecord.category || "-"}</Descriptions.Item>
              <Descriptions.Item label="Unit">{selectedRecord.unit || "-"}</Descriptions.Item>
              <Descriptions.Item label="CNIC">{selectedRecord.cnic || "-"}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{selectedRecord.mobile_no || "-"}</Descriptions.Item>
              <Descriptions.Item label="Bank">{selectedRecord.bank_name || "-"}</Descriptions.Item>
              <Descriptions.Item label="Account #">{selectedRecord.bank_account_number || "-"}</Descriptions.Item>
              <Descriptions.Item label="Base Salary">Rs {selectedRecord.base_salary?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="Deactivation Date">{fmtDate(selectedRecord.deactivation_date)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" title="Attendance Summary">
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text>Period: {dayjs(selectedRecord.attendance_summary.from_date).format("YYYY-MM-DD")} to {dayjs(selectedRecord.attendance_summary.to_date).format("YYYY-MM-DD")}</Text>
                    
                    <Text>Present: <Tag color="green">{selectedRecord.attendance_summary.present_days}</Tag></Text>
                    <Text>Absent: <Tag color="red">{selectedRecord.attendance_summary.absent_days}</Tag></Text>
                    <Text>Leave: <Tag color="orange">{selectedRecord.attendance_summary.leave_days}</Tag></Text>
                    <Text>Late: <Tag color="volcano">{selectedRecord.attendance_summary.late_days}</Tag></Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Salary Calculation">
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text>Gross Salary: <Text strong>Rs {selectedRecord.salary_calculation.gross_salary.toLocaleString()}</Text></Text>
                    <Text>EOBI: <Text type="danger">-Rs {selectedRecord.salary_calculation.deductions.eobi || 0}</Text></Text>
                    <Text>Tax: <Text type="danger">-Rs {selectedRecord.salary_calculation.deductions.tax || 0}</Text></Text>
                    <Text>Advance: <Text type="danger">-Rs {selectedRecord.salary_calculation.deductions.advance || 0}</Text></Text>
                    <Text>Fine: <Text type="danger">-Rs {selectedRecord.salary_calculation.deductions.fine || 0}</Text></Text>
                    <Divider style={{ margin: "8px 0" }} />
                    <Text strong>Net Payable: <Text type={selectedRecord.salary_calculation.net_payable >= 0 ? "success" : "danger"}>Rs {selectedRecord.salary_calculation.net_payable.toLocaleString()}</Text></Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Final Settlement">
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text>Amount to Collect: <Text type="success">Rs {selectedRecord.settlement.total_to_collect.toLocaleString()}</Text></Text>
                    <Text>Amount to Pay: <Text type="warning">Rs {selectedRecord.settlement.total_to_pay.toLocaleString()}</Text></Text>
                    <Divider style={{ margin: "8px 0" }} />
                    <Text strong>Net Amount: <Text type={selectedRecord.settlement.net_amount >= 0 ? "success" : "danger"}>Rs {selectedRecord.settlement.net_amount.toLocaleString()}</Text></Text>
                  </Space>
                </Card>
              </Col>
            </Row>

            {selectedRecord.inventory_items.length > 0 && (
              <>
                <Divider />
                <Card size="small" title="Inventory Assigned">
                  <Table
                    dataSource={selectedRecord.inventory_items}
                    rowKey="item_name"
                    size="small"
                    pagination={false}
                    columns={[
                      { title: "Item", dataIndex: "item_name", key: "item_name" },
                      { title: "Assigned Date", dataIndex: "assigned_date", render: (d) => fmtDate(d) },
                      { title: "Condition", dataIndex: "condition" },
                      { title: "Value", dataIndex: "value", render: (v) => v ? `Rs ${v.toLocaleString()}` : "-" },
                    ]}
                  />
                </Card>
              </>
            )}

            <Divider />

            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  if (selectedRecord) void exportDeactivationPdf(selectedRecord);
                }}
              >
                Export PDF
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  handleMoveToInactive(selectedRecord.id);
                  setDetailModalOpen(false);
                }}
              >
                Move to Inactive
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  handleReject(selectedRecord.id);
                  setDetailModalOpen(false);
                }}
              >
                Reject Request
              </Button>
            </Space>
          </Space>
        )}
      </Modal>
    </div>
  );
}
