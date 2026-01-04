"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    message,
    Popconfirm,
    Row,
    Space,
    Table,
    Tag,
    Typography,
    Breadcrumb,
    Input,
} from "antd";
import {
    DeleteOutlined,
    PlusOutlined,
    ArrowLeftOutlined,
    SearchOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

type GuardAllocation = {
    id: number;
    contract_id: number;
    employee_db_id: number;
    employee_name?: string;
    employee_id?: string;
    start_date?: string | null;
    end_date?: string | null;
    status: string;
};

type Contract = {
    id: number;
    client_id: number;
    contract_number: string;
    contract_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    monthly_cost: number;
    status: string;
};

export default function GuardAllocationPage() {
    const { contractId } = useParams();
    const router = useRouter();
    const [msg, msgCtx] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<Contract | null>(null);
    const [allocations, setAllocations] = useState<GuardAllocation[]>([]);
    const [availableGuards, setAvailableGuards] = useState<any[]>([]);
    const [allocLoading, setAllocLoading] = useState(false);
    const [availableLoading, setAvailableLoading] = useState(false);

    // Search
    const [guardSearch, setGuardSearch] = useState("");

    const loadContract = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<Contract>(`/api/client-management/contracts/${contractId}`);
            setContract(data);
        } catch (e) {
            msg.error("Failed to load contract details");
        } finally {
            setLoading(false);
        }
    }, [contractId, msg]);

    const loadAllocations = useCallback(async () => {
        setAllocLoading(true);
        try {
            const data = await api.get<GuardAllocation[]>(`/api/client-management/contracts/${contractId}/allocations`);
            setAllocations(Array.isArray(data) ? data : []);
        } catch (e) {
            msg.error("Failed to load allocations");
        } finally {
            setAllocLoading(false);
        }
    }, [contractId, msg]);

    const loadAvailableGuards = useCallback(async () => {
        setAvailableLoading(true);
        try {
            const response = await api.get<{ employees: any[]; total: number }>("/api/employees2/?limit=1000");
            const guards = response?.employees || [];

            // Filter out already allocated guards
            const allocatedIds = new Set(allocations.map(a => a.employee_db_id));
            setAvailableGuards(guards.filter((g: any) => !allocatedIds.has(g.id)));
        } catch (e) {
            msg.error("Failed to load available guards");
        } finally {
            setAvailableLoading(false);
        }
    }, [allocations, msg]);

    useEffect(() => {
        if (contractId) {
            void loadContract();
            void loadAllocations();
        }
    }, [contractId, loadContract, loadAllocations]);

    // Load available guards whenever allocations change
    useEffect(() => {
        void loadAvailableGuards();
    }, [allocations, loadAvailableGuards]);

    const handleAllocate = async (employeeId: number) => {
        try {
            await api.post(`/api/client-management/contracts/${contractId}/allocations`, {
                employee_db_id: employeeId,
                start_date: dayjs().format("YYYY-MM-DD"),
                status: "Active",
            });
            msg.success("Guard allocated successfully");
            await loadAllocations();
        } catch (e) {
            msg.error("Failed to allocate guard");
        }
    };

    const handleRemove = async (allocId: number) => {
        try {
            await api.del(`/api/client-management/contracts/${contractId}/allocations/${allocId}`);
            msg.success("Guard removed from allocation");
            await loadAllocations();
        } catch (e) {
            msg.error("Failed to remove guard");
        }
    };

    const filteredAvailable = useMemo(() => {
        if (!guardSearch) return availableGuards;
        const s = guardSearch.toLowerCase();
        return availableGuards.filter(g =>
            (g.name || "").toLowerCase().includes(s) ||
            (g.serial_no || "").toLowerCase().includes(s)
        );
    }, [availableGuards, guardSearch]);

    return (
        <div style={{ padding: "24px" }}>
            {msgCtx}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Breadcrumb
                        items={[
                            { title: "Client Management", onClick: () => router.push("/client-management"), className: "cursor-pointer" },
                            { title: "Guard Allocation" },
                        ]}
                    />
                    <Title level={2} style={{ margin: "8px 0 0 0" }}>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push("/client-management")}
                                type="text"
                            />
                            Guard Allocation
                            <Tag color="blue" style={{ fontSize: "16px", padding: "4px 12px" }}>
                                {contract?.contract_number || `Contract ID: ${contractId}`}
                            </Tag>
                        </Space>
                    </Title>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Allocated Guards Column */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <TeamOutlined />
                                <span>Allocated Guards ({allocations.length})</span>
                            </Space>
                        }
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table
                            dataSource={allocations}
                            loading={allocLoading}
                            rowKey="id"
                            pagination={false}
                            size="middle"
                            columns={[
                                {
                                    title: "Employee Name",
                                    dataIndex: "employee_name",
                                    render: (v) => <Text strong>{v}</Text>
                                },
                                {
                                    title: "ID",
                                    dataIndex: "employee_id",
                                    width: 100,
                                    render: (v) => <Tag>{v}</Tag>
                                },
                                {
                                    title: "Start Date",
                                    dataIndex: "start_date",
                                    width: 120,
                                    render: (v) => v ? dayjs(v).format("DD MMM YYYY") : "-"
                                },
                                {
                                    title: "Status",
                                    dataIndex: "status",
                                    width: 100,
                                    render: (v) => (
                                        <Tag color={v === "Active" ? "green" : "default"}>{v}</Tag>
                                    )
                                },
                                {
                                    title: "Action",
                                    width: 80,
                                    align: "center",
                                    render: (_, r) => (
                                        <Popconfirm
                                            title="Remove guard from this contract?"
                                            onConfirm={() => void handleRemove(r.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>

                {/* Available Guards Column */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                                <Col>
                                    <Space>
                                        <PlusOutlined />
                                        <span>Available Guards</span>
                                    </Space>
                                </Col>
                                <Col>
                                    <Input
                                        placeholder="Search guards..."
                                        prefix={<SearchOutlined />}
                                        value={guardSearch}
                                        onChange={e => setGuardSearch(e.target.value)}
                                        style={{ width: 200 }}
                                        size="small"
                                    />
                                </Col>
                            </Row>
                        }
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table
                            dataSource={filteredAvailable}
                            loading={availableLoading}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            size="middle"
                            columns={[
                                {
                                    title: "Name",
                                    dataIndex: "name",
                                    render: (v) => <Text>{v}</Text>
                                },
                                {
                                    title: "ID",
                                    dataIndex: "serial_no",
                                    width: 100,
                                },
                                {
                                    title: "Designation",
                                    dataIndex: "designation",
                                    width: 150,
                                },
                                {
                                    title: "Action",
                                    width: 120,
                                    align: "right",
                                    render: (_, r) => (
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={() => void handleAllocate(r.id)}
                                        >
                                            Allocate
                                        </Button>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
