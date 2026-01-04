"use client";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  Descriptions,
  Breadcrumb,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Types (mirrored from main page)
type Client = {
  id: number;
  client_code: string;
  client_name: string;
  client_type: string;
  industry_type?: string | null;
  status: string;
  location?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  created_at: string;
};

type FocalPerson = {
  id: number;
  client_id: number;
  name: string;
  designation?: string | null;
  phone_number?: string | null;
  email?: string | null;
  is_primary: boolean;
  reports_to_id?: number | null;
};

type Contract = {
  id: number;
  client_id: number;
  contract_number: string;
  start_date?: string | null;
  end_date?: string | null;
  contract_type?: string | null;
  monthly_cost: number;
  status: string;
  notes?: string | null;
  created_at: string;
};

type ClientDetail = Client & {
  contacts: FocalPerson[];
  contracts: Contract[];
};

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

function formatMoney(v: number): string {
  return `Rs ${v.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export default function ClientDetailPage() {
  const { client_id } = useParams();
  const router = useRouter();
  const [msg, msgCtx] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ClientDetail | null>(null);

  // Filters for contracts
  const [contractStatusFilter, setContractStatusFilter] = useState<string>("Active");
  const [dateRangeFilter, setDateRangeFilter] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Client Drawer
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false);
  const [clientForm] = Form.useForm();

  // Focal person drawer
  const [focalDrawerOpen, setFocalDrawerOpen] = useState(false);
  const [focalDrawerMode, setFocalDrawerMode] = useState<"create" | "edit">("create");
  const [activeFocal, setActiveFocal] = useState<FocalPerson | null>(null);
  const [focalForm] = Form.useForm();

  // Contract drawer
  const [contractDrawerOpen, setContractDrawerOpen] = useState(false);
  const [contractDrawerMode, setContractDrawerMode] = useState<"create" | "edit">("create");
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [contractForm] = Form.useForm();

  // Guard allocation logic (for new contract)
  const [requiredGuards, setRequiredGuards] = useState(0);
  const [selectedGuards, setSelectedGuards] = useState<number[]>([]);
  const [allGuards, setAllGuards] = useState<any[]>([]);
  const [guardSearch, setGuardSearch] = useState("");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get<ClientDetail>(`/api/client-management/clients/${client_id}`);
      setDetail(d);
    } catch (e) {
      msg.error(errorMessage(e, "Failed to load client details"));
    } finally {
      setLoading(false);
    }
  }, [client_id, msg]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  // Client actions
  const openEditClient = useCallback(() => {
    if (!detail) return;
    clientForm.setFieldsValue(detail);
    setClientDrawerOpen(true);
  }, [clientForm, detail]);

  const saveClient = useCallback(async () => {
    if (!detail) return;
    const values = await clientForm.validateFields();
    try {
      await api.put(`/api/client-management/clients/${detail.id}`, values);
      msg.success("Client updated");
      setClientDrawerOpen(false);
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Update failed"));
    }
  }, [clientForm, detail, loadDetail, msg]);

  const handleDeleteClient = useCallback(async () => {
    if (!detail) return;
    try {
      await api.del(`/api/client-management/clients/${detail.id}`);
      msg.success("Client deleted");
      router.push("/client-management");
    } catch (e) {
      msg.error(errorMessage(e, "Delete failed"));
    }
  }, [detail, msg, router]);

  // Focal person actions
  const openCreateFocal = useCallback(() => {
    setFocalDrawerMode("create");
    setActiveFocal(null);
    focalForm.resetFields();
    focalForm.setFieldsValue({ is_primary: false });
    setFocalDrawerOpen(true);
  }, [focalForm]);

  const openEditFocal = useCallback((f: FocalPerson) => {
    setFocalDrawerMode("edit");
    setActiveFocal(f);
    focalForm.setFieldsValue({
      name: f.name,
      designation: f.designation,
      phone_number: f.phone_number,
      email: f.email,
      is_primary: f.is_primary,
      reports_to_id: f.reports_to_id,
    });
    setFocalDrawerOpen(true);
  }, [focalForm]);

  const saveFocal = useCallback(async () => {
    if (!detail) return;
    const values = await focalForm.validateFields();
    try {
      if (focalDrawerMode === "create") {
        await api.post(`/api/client-management/clients/${detail.id}/contacts`, values);
        msg.success("Focal person added");
      } else if (activeFocal) {
        await api.put(`/api/client-management/clients/${detail.id}/contacts/${activeFocal.id}`, values);
        msg.success("Focal person updated");
      }
      setFocalDrawerOpen(false);
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Save failed"));
    }
  }, [focalDrawerMode, detail, focalForm, activeFocal, msg, loadDetail]);

  const deleteFocal = useCallback(async (f: FocalPerson) => {
    if (!detail) return;
    try {
      await api.del(`/api/client-management/clients/${detail.id}/contacts/${f.id}`);
      msg.success("Focal person deleted");
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Delete failed"));
    }
  }, [detail, msg, loadDetail]);

  // Contract actions
  const loadAvailableGuards = useCallback(async () => {
    try {
      const response = await api.get<{ employees: any[]; total: number }>("/api/employees2/?limit=500");
      const guards = response?.employees || [];
      const freeGuards = guards.filter((g: any) => !g.allocation_status || g.allocation_status === "Free");
      setAllGuards(freeGuards);
    } catch (e) {
      console.error("Failed to load guards", e);
    }
  }, []);

  const openCreateContract = useCallback(async () => {
    setContractDrawerMode("create");
    setActiveContract(null);
    contractForm.resetFields();
    contractForm.setFieldsValue({ status: "Active", monthly_cost: 0 });
    setRequiredGuards(1);
    setSelectedGuards([]);
    setGuardSearch("");
    await loadAvailableGuards();
    setContractDrawerOpen(true);
  }, [contractForm, loadAvailableGuards]);

  const openEditContract = useCallback((c: Contract) => {
    setContractDrawerMode("edit");
    setActiveContract(c);
    contractForm.setFieldsValue({
      ...c,
      start_date: c.start_date ? dayjs(c.start_date) : null,
      end_date: c.end_date ? dayjs(c.end_date) : null,
    });
    setContractDrawerOpen(true);
  }, [contractForm]);

  const saveContract = useCallback(async () => {
    if (!detail) return;
    const values = await contractForm.validateFields();
    const payload = {
      ...values,
      start_date: values.start_date?.format("YYYY-MM-DD") || null,
      end_date: values.end_date?.format("YYYY-MM-DD") || null,
    };

    try {
      if (contractDrawerMode === "create") {
        const created = await api.post<{ id: number }>(`/api/client-management/clients/${detail.id}/contracts`, payload);
        for (const guardId of selectedGuards) {
          await api.post(`/api/client-management/contracts/${created.id}/allocations`, {
            employee_db_id: guardId,
            start_date: dayjs().format("YYYY-MM-DD"),
            status: "Active",
          });
        }
        msg.success(`Contract created with ${selectedGuards.length} guards allocated`);
      } else if (activeContract) {
        await api.put(`/api/client-management/clients/${detail.id}/contracts/${activeContract.id}`, payload);
        msg.success("Contract updated");
      }
      setContractDrawerOpen(false);
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Save failed"));
    }
  }, [detail, contractForm, contractDrawerMode, activeContract, msg, loadDetail, selectedGuards]);

  const deleteContract = useCallback(async (c: Contract) => {
    if (!detail) return;
    try {
      await api.del(`/api/client-management/clients/${detail.id}/contracts/${c.id}`);
      msg.success("Contract deleted");
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Delete failed"));
    }
  }, [detail, msg, loadDetail]);

  const endContract = useCallback(async (c: Contract) => {
    if (!detail) return;
    try {
      await api.put(`/api/client-management/clients/${detail.id}/contracts/${c.id}`, {
        status: "Ended",
        end_date: dayjs().format("YYYY-MM-DD"),
      });
      msg.success("Contract ended");
      void loadDetail();
    } catch (e) {
      msg.error(errorMessage(e, "Failed to end contract"));
    }
  }, [detail, msg, loadDetail]);

  const openAllocations = useCallback((c: Contract) => {
    router.push(`/client-management/contracts/${c.id}/allocations`);
  }, [router]);

  const downloadInvoice = useCallback(async (contractId: number, contractNumber: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${API_BASE_URL}/api/client-management/contracts/${contractId}/invoice-pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to generate invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${contractNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      msg.error(errorMessage(e, "Download failed"));
    }
  }, [msg]);

  // Table Columns
  const focalColumns: ColumnsType<FocalPerson> = [
    { title: "Name", dataIndex: "name", render: (v) => <Text strong>{v}</Text> },
    { title: "Designation", dataIndex: "designation" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Primary",
      dataIndex: "is_primary",
      width: 100,
      render: (v) => v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: "Actions",
      width: 100,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditFocal(r)} />
          <Popconfirm title="Delete focal person?" onConfirm={() => void deleteFocal(r)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const contractColumns: ColumnsType<Contract> = [
    {
      title: "Number",
      dataIndex: "contract_number",
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    { title: "Type", dataIndex: "contract_type" },
    {
      title: "Period",
      key: "period",
      render: (_, r) => (
        <Text style={{ fontSize: "12px" }}>
          <CalendarOutlined /> {dayjs(r.start_date).format("MMM D, YYYY")} - {r.end_date ? dayjs(r.end_date).format("MMM D, YYYY") : "Present"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) => <Tag color={v === "Active" ? "green" : "orange"}>{v}</Tag>,
    },
    {
      title: "Monthly",
      dataIndex: "monthly_cost",
      align: "right",
      render: (v) => formatMoney(v),
    },
    {
      title: "Actions",
      width: 250,
      render: (_, r) => (
        <Space separator={<Divider type="vertical" />}>
          <Button size="small" type="link" onClick={() => openAllocations(r)}>Guards</Button>
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEditContract(r)} />
            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadInvoice(r.id, r.contract_number)} />
            {r.status === "Active" && (
              <Popconfirm title="End this contract?" onConfirm={() => void endContract(r)}>
                <Button size="small" danger icon={<CloseCircleOutlined />} />
              </Popconfirm>
            )}
            <Popconfirm title="Delete contract?" onConfirm={() => void deleteContract(r)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  const filteredContracts = useMemo(() => {
    let list = detail?.contracts || [];
    if (contractStatusFilter !== "All") {
      list = list.filter(c => c.status === contractStatusFilter);
    }
    if (dateRangeFilter[0] && dateRangeFilter[1]) {
      list = list.filter(c => {
        const start = dayjs(c.start_date);
        return start.isSameOrAfter(dateRangeFilter[0]!) && start.isSameOrBefore(dateRangeFilter[1]!);
      });
    }
    return list;
  }, [detail, contractStatusFilter, dateRangeFilter]);

  const totalFilteredCost = useMemo(() => {
    return filteredContracts.reduce((sum, c) => sum + Number(c.monthly_cost), 0);
  }, [filteredContracts]);

  return (
    <div style={{ padding: "24px" }}>
      {msgCtx}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Breadcrumb
            items={[
              { title: "Client Management", onClick: () => router.push("/client-management"), className: "cursor-pointer" },
              { title: "Client Detail" },
            ]}
          />
          <Title level={2} style={{ margin: "8px 0 0 0" }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/client-management")} type="text" />
              {detail?.client_name || "Loading..."}
            </Space>
          </Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<EditOutlined />} onClick={openEditClient}>Edit Client</Button>
            <Popconfirm title="Delete this client and all data?" onConfirm={handleDeleteClient} okText="Yes" cancelText="No">
              <Button danger icon={<DeleteOutlined />}>Delete Client</Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {detail && (
          <Tabs
            defaultActiveKey="info"
            type="card"
            items={[
              {
                key: "info",
                label: <><EnvironmentOutlined /> Info</>,
                children: (
                  <Card bordered={false}>
                    <Descriptions bordered column={2} size="middle">
                      <Descriptions.Item label="Code"><Tag color="blue">{detail.client_code}</Tag></Descriptions.Item>
                      <Descriptions.Item label="Type">{detail.client_type}</Descriptions.Item>
                      <Descriptions.Item label="Industry">{detail.industry_type || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag color={detail.status === "Active" ? "green" : "red"}>{detail.status}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Monthly Cost">
                        <Title level={4} style={{ margin: 0 }}>{formatMoney(detail.contracts.reduce((s, c) => s + Number(c.monthly_cost), 0))}</Title>
                      </Descriptions.Item>
                      <Descriptions.Item label="Location">{detail.location || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Phone">{detail.phone || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Email">{detail.email || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Address" span={2}>{detail.address || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Notes" span={2}>{detail.notes || "-"}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                ),
              },
              {
                key: "focal",
                label: <><UserOutlined /> Focal Persons ({detail.contacts.length})</>,
                children: (
                  <Card bordered={false}>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                      <Col><Title level={4}>Focal Persons</Title></Col>
                      <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateFocal}>Add Person</Button>
                      </Col>
                    </Row>
                    <Table dataSource={detail.contacts} columns={focalColumns} rowKey="id" pagination={false} />
                  </Card>
                ),
              },
              {
                key: "contracts",
                label: <><FileTextOutlined /> Contracts ({detail.contracts.length})</>,
                children: (
                  <Card bordered={false}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                      <Col>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">Total monthly for filters:</Text>
                          <Title level={4} style={{ margin: 0 }}>{formatMoney(totalFilteredCost)}</Title>
                        </Space>
                      </Col>
                      <Col>
                        <Space>
                          <Select
                            value={contractStatusFilter}
                            onChange={setContractStatusFilter}
                            style={{ width: 150 }}
                            options={[
                              { label: "All Status", value: "All" },
                              { label: "Active", value: "Active" },
                              { label: "Ended", value: "Ended" },
                            ]}
                          />
                          <RangePicker
                            value={dateRangeFilter}
                            onChange={(dates) => setDateRangeFilter(dates as any)}
                          />
                          <Button icon={<BarChartOutlined />} onClick={() => router.push(`/client-management/clients/${client_id}/compare`)}>Comparison</Button>
                          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateContract}>New Contract</Button>
                        </Space>
                      </Col>
                    </Row>
                    <Table dataSource={filteredContracts} columns={contractColumns} rowKey="id" pagination={false} />
                  </Card>
                ),
              },
            ]}
          />
        )}
      </Spin>

      {/* Drawers (replicated from main page for self-containment) */}
      <Drawer
        title="Edit Client"
        open={clientDrawerOpen}
        onClose={() => setClientDrawerOpen(false)}
        width={500}
        extra={<Button type="primary" onClick={saveClient}>Save</Button>}
      >
        <Form form={clientForm} layout="vertical">
          <Form.Item name="client_name" label="Client Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="client_type" label="Type"><Select options={[{ label: 'Corporate', value: 'Corporate' }, { label: 'Individual', value: 'Individual' }]} /></Form.Item>
          <Form.Item name="industry_type" label="Industry"><Input /></Form.Item>
          <Form.Item name="location" label="Location"><Input /></Form.Item>
          <Form.Item name="address" label="Address"><Input.TextArea /></Form.Item>
          <Form.Item name="status" label="Status"><Select options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} /></Form.Item>
          <Form.Item name="phone" label="Phone"><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="notes" label="Notes"><Input.TextArea /></Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={focalDrawerMode === "create" ? "Add Focal Person" : "Edit Focal Person"}
        open={focalDrawerOpen}
        onClose={() => setFocalDrawerOpen(false)}
        width={400}
        extra={<Button type="primary" onClick={saveFocal}>Save</Button>}
      >
        <Form form={focalForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="designation" label="Designation"><Input /></Form.Item>
          <Form.Item name="phone_number" label="Phone"><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="is_primary" label="Primary" valuePropName="checked"><Select options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} /></Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={contractDrawerMode === "create" ? "New Contract" : "Edit Contract"}
        open={contractDrawerOpen}
        onClose={() => setContractDrawerOpen(false)}
        width={500}
        extra={<Button type="primary" onClick={saveContract}>Save</Button>}
      >
        <Form form={contractForm} layout="vertical">
          <Form.Item name="contract_number" label="Contract #" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="contract_type" label="Type"><Input /></Form.Item>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="start_date" label="Start Date"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="end_date" label="End Date"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="monthly_cost" label="Monthly Cost"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="Status"><Select options={[{ label: 'Active', value: 'Active' }, { label: 'Pending', value: 'Pending' }]} /></Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
