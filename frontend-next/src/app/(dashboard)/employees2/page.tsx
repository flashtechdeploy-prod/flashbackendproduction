"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Select,
  Tag,
  Popconfirm,
  App,
  Avatar,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Form,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  EyeOutlined,
  UserDeleteOutlined,
  UserOutlined,
  CloudUploadOutlined,
  FilterOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

interface Employee2 {
  id: number;
  serial_no: string | null;
  fss_no: string | null;
  rank: string | null;
  name: string;
  father_name: string | null;
  salary: string | null;
  status: string | null;
  unit: string | null;
  service_rank: string | null;
  blood_group: string | null;
  status2: string | null;
  unit2: string | null;
  rank2: string | null;
  cnic: string | null;
  dob: string | null;
  cnic_expiry: string | null;
  documents_held: string | null;
  documents_handed_over_to: string | null;
  photo_on_doc: string | null;
  eobi_no: string | null;
  insurance: string | null;
  social_security: string | null;
  mobile_no: string | null;
  home_contact: string | null;
  verified_by_sho: string | null;
  verified_by_khidmat_markaz: string | null;
  domicile: string | null;
  verified_by_ssp: string | null;
  enrolled: string | null;
  re_enrolled: string | null;
  village: string | null;
  post_office: string | null;
  thana: string | null;
  tehsil: string | null;
  district: string | null;
  duty_location: string | null;
  police_trg_ltr_date: string | null;
  vaccination_cert: string | null;
  vol_no: string | null;
  payments: string | null;
  category: string | null;
  allocation_status: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function Employees2Page() {
  const { message } = App.useApp();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee2[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivatingEmployee, setDeactivatingEmployee] = useState<Employee2 | null>(null);
  const [deactivateForm] = Form.useForm();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        skip: String((page - 1) * pageSize),
        limit: String(pageSize),
        with_total: "true",
      });
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedStatus) params.append("status", selectedStatus);

      const res = await api.get<{ employees: Employee2[]; total: number }>(
        `/api/employees2/?${params.toString()}`
      );

      const sorted = [...res.employees].sort((a, b) => {
        const an = parseInt(a.serial_no || "0", 10);
        const bn = parseInt(b.serial_no || "0", 10);
        return an - bn;
      });

      setEmployees(sorted);
      setTotal(res.total);
    } catch {
      message.error("Failed to fetch employee list");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, selectedCategory, selectedStatus, message]);

  const fetchFilters = useCallback(async () => {
    try {
      const [cats, stats] = await Promise.all([
        api.get<string[]>("/api/employees2/categories"),
        api.get<string[]>("/api/employees2/statuses"),
      ]);
      setCategories(cats);
      setStatuses(stats);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);


  const handleDelete = async (id: number) => {
    try {
      await api.del(`/api/employees2/${id}`);
      message.success("Record deleted");
      fetchEmployees();
    } catch {
      message.error("Failed to delete record");
    }
  };

  const handleDeactivate = async (id: number) => {
    // This function is kept for reference but not used directly anymore
  };

  const openDeactivateModal = (record: Employee2) => {
    setDeactivatingEmployee(record);
    setDeactivateModalOpen(true);
    deactivateForm.setFieldsValue({ deactivationDate: dayjs() });
  };

  const handleDeactivateSubmit = async () => {
    try {
      const values = await deactivateForm.validateFields();
      if (!deactivatingEmployee) return;
      await api.post(`/api/employees2/${deactivatingEmployee.id}/pending-deactivate`, {
        deactivation_date: values.deactivationDate.format("YYYY-MM-DD"),
      });
      message.success("Employee added to pending deactivation queue");
      setDeactivateModalOpen(false);
      setDeactivatingEmployee(null);
      fetchEmployees();
    } catch (err: unknown) {
      const errorMessage = err && typeof err === "object" && "message" in err ? (err as { message?: string }).message : "Failed to submit deactivation";
      message.error(errorMessage);
    }
  };

  const columns: ColumnsType<Employee2> = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (_t, record) => (
        <Space size="small" onClick={() => router.push(`/employees2/${record.id}`)} style={{ cursor: "pointer" }}>
          <Avatar
            src={record.avatar_url ? `${api.baseUrl}${record.avatar_url}` : null}
            icon={<UserOutlined />}
            size={32}
            style={{ border: "1px solid #e6f7ff" }}
          />
          <Text strong style={{ fontSize: 13, lineHeight: "1.2" }}>
            {record.name}
          </Text>
        </Space>
      ),
    },
    {
      title: "FSS NUMBER",
      dataIndex: "fss_no",
      key: "fss_no",
      width: 140,
      render: (t) => <span style={{ fontSize: 12 }}>{t || "-"}</span>,
    },
    {
      title: "RANK",
      dataIndex: "rank",
      key: "rank",
      width: 140,
      render: (t) => <span style={{ fontSize: 12 }}>{t || "-"}</span>,
    },
    {
      title: "MOBILE",
      dataIndex: "mobile_no",
      key: "mobile_no",
      width: 140,
      render: (t) => <span style={{ fontSize: 12 }}>{t || "-"}</span>,
    },
    {
      title: "ACT",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space size={2}>
          <Tooltip title="View">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined style={{ fontSize: 14 }} />}
              onClick={() => router.push(`/employees2/${record.id}`)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: 14 }} />}
              onClick={() => router.push(`/employees2/${record.id}/edit`)}
              style={{ color: '#722ed1' }}
            />
          </Tooltip>
          <Tooltip title="Deactivate">
            <Button
              size="small"
              type="text"
              icon={<UserDeleteOutlined style={{ fontSize: 14 }} />}
              style={{ color: '#faad14' }}
              onClick={() => openDeactivateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)} okText="Yes">
              <Button size="small" type="text" danger icon={<DeleteOutlined style={{ fontSize: 14 }} />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px 88px", background: "#ffffff", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            EMPLOYEES
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Total: {total}
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/employees2/create")}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(24, 144, 255, 0.25)",
            background: "linear-gradient(90deg, #1890ff 0%, #096dd9 100%)",
            border: "none",
          }}
        >
          Add New
        </Button>
      </div>

      {/* Toolbar / Filters */}
      <Card bordered bodyStyle={{ padding: '12px 16px' }} style={{ borderRadius: 10, marginBottom: 12 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => { setPage(1); fetchEmployees(); }}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Category"
              allowClear
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={(v) => { setSelectedCategory(v); setPage(1); }}
              options={categories.map((c) => ({ label: c, value: c }))}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(v) => { setSelectedStatus(v); setPage(1); }}
              options={statuses.map((s) => ({ label: s, value: s }))}
            />
          </Col>
          <Col xs={24} md={2}>
            <Button
              block
              type="primary"
              onClick={() => { setPage(1); fetchEmployees(); }}
              style={{ borderRadius: 8 }}
            >
              Go
            </Button>
          </Col>
        </Row>
      </Card>


      {/* Main Table */}
      <Card
        bordered
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: 'none',
          background: '#fff'
        }}
      >
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ['bottomRight'],
            size: "small",
            style: { padding: '8px 16px' },
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          size="small"
          rowClassName="premium-row"
        />
      </Card>

      <style jsx global>{`
        .premium-row:hover > td {
          background-color: #f0f7ff !important;
          transition: background-color 0.3s ease;
        }
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 700 !important;
          font-size: 10px !important;
          text-transform: uppercase !important;
          color: #8c8c8c !important;
          padding: 8px 8px !important; 
        }
        .ant-table-cell {
            padding: 8px 8px !important;
        }
        .ant-pagination-item-active {
            border-radius: 4px !important;
            font-weight: 600;
        }
      `}</style>

      <Modal
        title={`Pending Deactivation: ${deactivatingEmployee?.name || ""}`}
        open={deactivateModalOpen}
        onOk={handleDeactivateSubmit}
        onCancel={() => {
          setDeactivateModalOpen(false);
          setDeactivatingEmployee(null);
        }}
        okText="Submit to Pending"
        cancelText="Cancel"
        width={400}
      >
        <Form form={deactivateForm} layout="vertical">
          <Form.Item
            name="deactivationDate"
            label="Deactivation Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
