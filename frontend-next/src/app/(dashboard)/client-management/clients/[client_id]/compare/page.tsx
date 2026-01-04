"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    message,
    Row,
    Space,
    Table,
    Typography,
    Breadcrumb,
    Spin,
    Collapse,
} from "antd";
import {
    ArrowLeftOutlined,
    TeamOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

type MonthStat = {
    month: string;
    guard_count: number;
    total_salary: number;
    guards: {
        name: string;
        id: string;
        presents: number;
        salary: number;
    }[];
};

type ComparisonData = {
    month1: MonthStat;
    month2: MonthStat;
};

type ClientBrief = {
    client_name?: string;
};

function monthLabel(monthStr: string): string {
    // monthStr comes as YYYY-MM
    const d = dayjs(monthStr, "YYYY-MM", true);
    if (d.isValid()) return d.format("MMM YYYY");
    return monthStr;
}

export default function ClientComparisonPage() {
    const { client_id } = useParams();
    const router = useRouter();
    const [msg, msgCtx] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ComparisonData | null>(null);

    const [month1, setMonth1] = useState(dayjs().subtract(1, "month"));
    const [month2, setMonth2] = useState(dayjs());

    const [clientName, setClientName] = useState("");

    const loadClientDetails = useCallback(async () => {
        try {
            const client = await api.get<ClientBrief>(`/api/client-management/clients/${client_id}`);
            setClientName(String(client?.client_name || ""));
        } catch {
        }
    }, [client_id]);

    const loadComparison = useCallback(async () => {
        if (!month1 || !month2) return;
        setLoading(true);
        try {
            const m1 = month1.format("YYYY-MM");
            const m2 = month2.format("YYYY-MM");
            const result = await api.get<ComparisonData>(
                `/api/client-management/clients/${client_id}/compare-months?month1=${m1}&month2=${m2}`
            );
            setData(result);
        } catch {
            msg.error("Failed to load comparison data");
        } finally {
            setLoading(false);
        }
    }, [client_id, month1, month2, msg]);

    useEffect(() => {
        void loadClientDetails();
    }, [loadClientDetails]);

    useEffect(() => {
        void loadComparison();
    }, [loadComparison]);

    const formatMoney = (v: number) =>
        `Rs ${v.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

    const diffColor = (v1: number, v2: number) => {
        if (v2 > v1) return "#cf1322"; // red (increase in cost/guards)
        if (v2 < v1) return "#3f8600"; // green (decrease)
        return "inherit";
    };

    return (
        <div style={{ padding: "24px" }}>
            {msgCtx}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Breadcrumb
                        items={[
                            { title: "Client Management", onClick: () => router.push("/client-management"), className: "cursor-pointer" },
                            { title: "Comparison" },
                        ]}
                    />
                    <div style={{ marginTop: 8 }}>
                        <Space align="start" size={12}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push("/client-management")}
                                type="text"
                            />
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                                    Monthly Comparison
                                </Text>
                                <Title level={3} style={{ margin: "2px 0 0 0", fontWeight: 800 }}>
                                    {clientName}
                                </Title>
                            </div>
                        </Space>
                    </div>
                </Col>
                <Col>
                    <Space>
                        <DatePicker
                            picker="month"
                            value={month1}
                            onChange={(v) => v && setMonth1(v)}
                            allowClear={false}
                        />
                        <SwapOutlined style={{ color: "#8c8c8c" }} />
                        <DatePicker
                            picker="month"
                            value={month2}
                            onChange={(v) => v && setMonth2(v)}
                            allowClear={false}
                        />
                        <Button
                            type="primary"
                            onClick={() => void loadComparison()}
                            style={{ borderRadius: "8px" }}
                        >
                            Compare
                        </Button>
                    </Space>
                </Col>
            </Row>



            <Spin spinning={loading}>
                {data && (
                    <>
                        {/* Highlights Section */}
                        <Row align="middle" style={{ marginBottom: 48, padding: "0 12px" }}>
                            <Col xs={24} md={11}>
                                <Space direction="vertical" size={0}>
                                    <Text strong style={{ fontSize: "12px", color: "#8c8c8c", textTransform: "uppercase" }}>
                                        Baseline Period: {monthLabel(data.month1.month)}
                                    </Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary" style={{ fontSize: "14px" }}>
                                            <TeamOutlined /> {data.month1.guard_count} Guards Allocated
                                        </Text>
                                    </div>
                                    <Title level={1} style={{ margin: "4px 0 0 0", fontSize: "32px" }}>
                                        {formatMoney(data.month1.total_salary)}
                                    </Title>
                                </Space>
                            </Col>

                            <Col xs={0} md={2} style={{ display: "flex", justifyContent: "center" }}>
                                <Divider type="vertical" style={{ height: "100px", borderLeft: "2px solid #f0f0f0" }} />
                            </Col>

                            <Col xs={24} md={11}>
                                <Space direction="vertical" size={0}>
                                    <Text strong style={{ fontSize: "12px", color: "#8c8c8c", textTransform: "uppercase" }}>
                                        Comparison Period: {monthLabel(data.month2.month)}
                                    </Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary" style={{ fontSize: "14px" }}>
                                            <TeamOutlined /> {data.month2.guard_count} Guards Allocated
                                        </Text>
                                    </div>
                                    <Title level={1} style={{
                                        margin: "4px 0 0 0",
                                        fontSize: "32px",
                                        color: diffColor(data.month1.total_salary, data.month2.total_salary)
                                    }}>
                                        {formatMoney(data.month2.total_salary)}
                                    </Title>
                                </Space>
                            </Col>
                        </Row>

                        <style>{`
                            .custom-collapse .ant-collapse-header {
                                flex-direction: row-reverse !important;
                                justify-content: flex-end !important;
                                width: fit-content;
                                padding-left: 0 !important;
                            }
                            .custom-collapse .ant-collapse-expand-icon {
                                padding-inline-start: 12px !important;
                                padding-inline-end: 0 !important;
                            }
                        `}</style>
                        <Collapse
                            ghost
                            expandIconPosition="start"
                            className="custom-collapse"
                            style={{ background: "transparent" }}
                        >
                            <Collapse.Panel
                                header={
                                    <Space>
                                        <TeamOutlined style={{ color: "#1890ff" }} />
                                        <Text strong>Detailed Individual Comparison</Text>
                                    </Space>
                                }
                                key="1"
                            >
                                <Row gutter={48} style={{ padding: "16px 0" }}>
                                    <Col xs={24} lg={11}>
                                        <Title level={5} style={{ marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                                            {monthLabel(data.month1.month)}
                                        </Title>
                                        <Table
                                            size="small"
                                            dataSource={data.month1.guards}
                                            rowKey="id"
                                            pagination={{ pageSize: 8 }}
                                            columns={[
                                                { title: "Guards", dataIndex: "name", render: (v) => <Text strong>{v}</Text> },
                                                { title: "Salary", dataIndex: "salary", align: "right", render: (v) => formatMoney(v) },
                                            ]}
                                        />
                                    </Col>

                                    <Col xs={0} lg={2} style={{ display: "flex", justifyContent: "center" }}>
                                        <Divider type="vertical" style={{ height: "100%", minHeight: "300px", borderLeft: "1px solid #f0f0f0" }} />
                                    </Col>

                                    <Col xs={24} lg={11}>
                                        <Title level={5} style={{ marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                                            {monthLabel(data.month2.month)}
                                        </Title>
                                        <Table
                                            size="small"
                                            dataSource={data.month2.guards}
                                            rowKey="id"
                                            pagination={{ pageSize: 8 }}
                                            columns={[
                                                { title: "Guards", dataIndex: "name", render: (v) => <Text strong>{v}</Text> },
                                                { title: "Salary", dataIndex: "salary", align: "right", render: (v) => formatMoney(v) },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Collapse.Panel>
                        </Collapse>
                    </>
                )}
            </Spin>
        </div>
    );
}
