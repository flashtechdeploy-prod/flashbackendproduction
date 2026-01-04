"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table,
    Button,
    Input,
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
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    UserAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

interface EmployeeInactive {
    id: number;
    fss_no: string | null;
    name: string;
    father_name: string | null;
    status: string | null;
    cnic: string | null;
    eobi_no: string | null;
    mobile_no: string | null;
    district: string | null;
    doe: string | null;
    dod: string | null;
    cause_of_discharge: string | null;
    police_verification: string | null;
    notice_fine: string | null;
    uniform_fine: string | null;
    police_trg: string | null;
    clo_fine: string | null;
    vol_no: string | null;
    created_at: string;
}

export default function EmployeesInactivePage() {
    const { message } = App.useApp();
    const [employees, setEmployees] = useState<EmployeeInactive[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [search, setSearch] = useState("");

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                skip: String((page - 1) * pageSize),
                limit: String(pageSize),
            });
            if (search) params.append("search", search);

            const res = await api.get<{ employees: EmployeeInactive[]; total: number }>(
                `/api/employees-inactive/?${params.toString()}`
            );
            setEmployees(res.employees);
            setTotal(res.total);
        } catch {
            message.error("Failed to fetch inactive employees");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search, message]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleActivate = async (id: number) => {
        try {
            await api.post(`/api/employees-inactive/${id}/activate`, {});
            message.success("Employee activated and moved to Master Profiles");
            fetchEmployees();
        } catch {
            message.error("Failed to activate employee");
        }
    };

    const columns: ColumnsType<EmployeeInactive> = [
        {
            title: "IDENTITY",
            key: "identity",
            width: 250,
            fixed: "left",
            render: (_, record) => (
                <Space size="small">
                    <Avatar icon={<UserOutlined />} size={32} style={{ border: '1px solid #e6f7ff' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: 13, lineHeight: '1.2' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                            {record.fss_no || '-'} • S/O {record.father_name || '-'}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "STATUS",
            key: "status_info",
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {record.status && <Tag color="default" style={{ width: 'fit-content', fontSize: 10 }}>{record.status}</Tag>}
                    {record.cause_of_discharge && <Tag color="volcano" style={{ width: 'fit-content', fontSize: 10 }}>{record.cause_of_discharge}</Tag>}
                </div>
            )
        },
        { title: "CNIC", dataIndex: "cnic", key: "cnic", width: 130, render: (t) => <span style={{ fontSize: 12 }}>{t}</span> },
        { title: "MOBILE", dataIndex: "mobile_no", key: "mobile_no", width: 120, render: (t) => <span style={{ fontSize: 12 }}>{t}</span> },
        { title: "DISTRICT", dataIndex: "district", key: "district", width: 120, render: (t) => <span style={{ fontSize: 12 }}>{t}</span> },
        { title: "EOBI", dataIndex: "eobi_no", key: "eobi_no", width: 100, render: (t) => <span style={{ fontSize: 12 }}>{t || '-'}</span> },
        { title: "VOL #", dataIndex: "vol_no", key: "vol_no", width: 80, render: (t) => <span style={{ fontSize: 12 }}>{t || '-'}</span> },
        {
            title: "DATES (DOE/DOD)",
            key: "dates",
            width: 140,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 11 }}>In: {record.doe || '-'}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Out: {record.dod || '-'}</Text>
                </div>
            )
        },
        { title: "POLICE TRG", dataIndex: "police_trg", key: "police_trg", width: 120, render: (t) => <span style={{ fontSize: 12 }}>{t || '-'}</span> },
        { title: "POLICE VERIF", dataIndex: "police_verification", key: "police_verification", width: 150, render: (t) => <span style={{ fontSize: 12 }}>{t}</span> },
        {
            title: "FINES",
            key: "fines",
            width: 180,
            render: (_, record) => {
                const fines = [];
                if (record.notice_fine) fines.push(`Notice: ${record.notice_fine}`);
                if (record.uniform_fine) fines.push(`Uniform: ${record.uniform_fine}`);
                if (record.clo_fine) fines.push(`CLO: ${record.clo_fine}`);
                return <Text style={{ fontSize: 11 }}>{fines.join(', ') || '-'}</Text>
            }
        },
        {
            title: "ACT",
            key: "actions",
            width: 80,
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="Activate">
                    <Popconfirm title="Activate and move to Master Profiles?" onConfirm={() => handleActivate(record.id)}>
                        <Button
                            size="small"
                            type="text"
                            icon={<UserAddOutlined style={{ fontSize: 16 }} />}
                            style={{ color: '#52c41a' }}
                        />
                    </Popconfirm>
                </Tooltip>
            ),
        },
    ];

    return (
        <div style={{ padding: "16px 24px", background: "transparent", minHeight: "100vh" }}>
            {/* Header Section */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Card bordered={false} bodyStyle={{ padding: '12px 16px' }} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', minWidth: 200 }}>
                    <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Inactive</Text>
                        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{total}</Title>
                    </Space>
                </Card>
                <Space size="middle">
                    <Button icon={<ReloadOutlined />} onClick={fetchEmployees} style={{ borderRadius: 8 }}>
                        Refresh
                    </Button>
                </Space>
            </div>

            {/* Toolbar / Filters */}
            <Card bordered={false} bodyStyle={{ padding: '12px 16px' }} style={{ borderRadius: 12, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Search by name, FSS#, CNIC..."
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onPressEnter={() => { setPage(1); fetchEmployees(); }}
                            allowClear
                            style={{ borderRadius: 8 }}
                        />
                    </Col>
                    <Col xs={24} md={4}>
                        <Button
                            block
                            type="primary"
                            onClick={() => { setPage(1); fetchEmployees(); }}
                            style={{ borderRadius: 8 }}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Main Table */}
            <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
                style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    background: '#fff'
                }}
            >
                <Table
                    columns={columns}
                    dataSource={employees}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1800 }}
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
        </div>
    );
}
