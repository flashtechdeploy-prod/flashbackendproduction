"use client";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  message as antdMessage,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Tag,
  Table,
  Typography,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type {
  AttendanceBulkUpsert,
  AttendanceListResponse,
  AttendanceRow,
  AttendanceStatus,
  Employee2ListItem,
  Employee2ListResponse,
  LeavePeriodCreate,
  LeavePeriodOut,
  LeaveType,
} from "@/lib/types";

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export default function AttendanceDetailedPage() {
  const [msg, msgCtx] = antdMessage.useMessage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDateParam = searchParams?.get("date") || "";
  const [date, setDate] = useState<Dayjs>(() => {
    const parsed = dayjs(initialDateParam);
    return parsed.isValid() ? parsed : dayjs();
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [tableY, setTableY] = useState<number>(520);

  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [initialStatusByEmployeeId, setInitialStatusByEmployeeId] = useState<Record<string, AttendanceStatus>>({});

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveEmployeeId, setLeaveEmployeeId] = useState<string | null>(null);
  const [leaveRange, setLeaveRange] = useState<[Dayjs, Dayjs]>(() => [date, date]);
  const [leaveType, setLeaveType] = useState<LeaveType>("paid");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [leaveSaving, setLeaveSaving] = useState(false);

  const [leaveInfoOpen, setLeaveInfoOpen] = useState(false);
  const [leaveInfoLoading, setLeaveInfoLoading] = useState(false);
  const [leaveInfo, setLeaveInfo] = useState<LeavePeriodOut | null>(null);
  const [editingLeave, setEditingLeave] = useState(false);

  const setRow = useCallback((employee_id: string, patch: Partial<AttendanceRow>) => {
    setRows((prev) => prev.map((r) => (r.employee_id === employee_id ? { ...r, ...patch } : r)));
    setDirty(true);
  }, []);

  const normalizeRowForStatus = useCallback((employee_id: string, status: AttendanceStatus) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.employee_id !== employee_id) return r;

        const next: AttendanceRow = { ...r, status };

        if (status !== "present") {
          next.overtime_hours = undefined;
          next.overtime_rate = undefined;
        }
        if (status !== "present" && status !== "late") {
          next.late_hours = undefined;
          next.late_deduction = undefined;
        }
        if (status !== "leave") {
          next.leave_type = "";
        }

        return next;
      })
    );
    setDirty(true);
  }, []);

  const openLeaveModal = useCallback(
    (employee_id: string) => {
      setLeaveEmployeeId(employee_id);
      setLeaveRange([date, date]);
      setLeaveType("paid");
      setLeaveReason("");
      setEditingLeave(false);
      setLeaveModalOpen(true);
    },
    [date]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = date.format("YYYY-MM-DD");

      const allEmployees: Employee2ListItem[] = [];
      let skip = 0;
      const limit = 200;
      while (true) {
        const res = await api.get<Employee2ListResponse>("/api/employees2/", {
          query: { skip, limit, with_total: false },
        });
        const batch = res.employees ?? [];
        allEmployees.push(...batch);
        if (batch.length < limit) break;
        skip += limit;
      }

      const att = await api.get<AttendanceListResponse>("/api/attendance/", {
        query: { date: dateStr },
      });

      const byEmployeeId = new Map(att.records.map((r) => [r.employee_id, r]));
      const initial: Record<string, AttendanceStatus> = {};

      const nextRows: AttendanceRow[] = allEmployees
        .map((e) => {
          const empId = String(e.fss_no || e.serial_no || e.id);
          const rec = byEmployeeId.get(empId);
          const st = (rec?.status ?? "unmarked").toString().toLowerCase();
          const status: AttendanceStatus =
            st === "absent"
              ? "absent"
              : st === "leave"
                ? "leave"
                : st === "late"
                  ? "late"
                  : st === "present"
                    ? "present"
                    : "unmarked";

          initial[empId] = status;

          return {
            employee_id: empId,
            serial_no: e.serial_no,
            name: e.name,
            rank: e.rank,
            emp_status: e.status,
            unit: e.unit,
            department: e.category,
            shift_type: e.unit,
            status,
            leave_type:
              status === "leave"
                ? ((rec?.leave_type ?? "paid").toString().toLowerCase() === "unpaid" ? "unpaid" : "paid")
                : ("" as "paid" | "unpaid" | ""),
            overtime_hours: undefined,
            overtime_rate: status === "present" ? (rec?.overtime_rate ?? undefined) : undefined,
            late_hours: undefined,
            late_deduction: status === "present" || status === "late" ? (rec?.late_deduction ?? undefined) : undefined,
            fine_amount: Number(rec?.fine_amount ?? 0) || 0,
            note: rec?.note ?? "",
          };
        })
        .sort((a, b) => {
          const numA = parseInt(a.serial_no || "999999", 10);
          const numB = parseInt(b.serial_no || "999999", 10);
          return numA - numB;
        });

      setRows(nextRows);
      setInitialStatusByEmployeeId(initial);
      setDirty(false);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load attendance"));
    } finally {
      setLoading(false);
    }
  }, [date, msg]);

  const openLeaveInfo = useCallback(
    async (employee_id: string) => {
      setLeaveInfoOpen(true);
      setLeaveInfoLoading(true);
      setLeaveInfo(null);
      try {
        const activeOn = date.format("YYYY-MM-DD");
        const res = await api.get<LeavePeriodOut[]>("/api/leave-periods/", {
          query: { employee_id, active_on: activeOn },
        });
        const first = Array.isArray(res) && res.length > 0 ? res[0] : null;
        setLeaveInfo(first);
      } catch {
        setLeaveInfo(null);
      } finally {
        setLeaveInfoLoading(false);
      }
    },
    [date]
  );

  const submitLeavePeriod = useCallback(async () => {
    if (!leaveEmployeeId) return;
    setLeaveSaving(true);
    try {
      const payload: LeavePeriodCreate = {
        employee_id: leaveEmployeeId,
        from_date: leaveRange[0].format("YYYY-MM-DD"),
        to_date: leaveRange[1].format("YYYY-MM-DD"),
        leave_type: leaveType,
        reason: leaveReason.trim() ? leaveReason.trim() : null,
      };

      if (editingLeave && leaveInfo) {
        await api.put<unknown>(`/api/leave-periods/${leaveInfo.id}`, payload);
        msg.success("Long leave updated");
      } else {
        await api.post<unknown>("/api/leave-periods/", payload);
        msg.success("Long leave saved");
      }

      setLeaveModalOpen(false);
      setEditingLeave(false);
      await load();
    } catch (e: unknown) {
      msg.error(errorMessage(e, `Failed to ${editingLeave ? "update" : "save"} long leave`));
    } finally {
      setLeaveSaving(false);
    }
  }, [editingLeave, leaveEmployeeId, leaveInfo, leaveRange, leaveReason, leaveType, load, msg]);

  const editLeavePeriod = useCallback(async () => {
    if (!leaveInfo) return;

    setLeaveEmployeeId(leaveInfo.employee_id);
    setLeaveRange([dayjs(leaveInfo.from_date), dayjs(leaveInfo.to_date)]);
    setLeaveType(leaveInfo.leave_type as LeaveType);
    setLeaveReason(leaveInfo.reason || "");
    setEditingLeave(true);
    setLeaveInfoOpen(false);
    setLeaveModalOpen(true);
  }, [leaveInfo]);

  const deleteLeavePeriod = useCallback(async () => {
    if (!leaveInfo) return;

    try {
      await api.del(`/api/leave-periods/${leaveInfo.id}`);
      msg.success("Leave period deleted");
      setLeaveInfoOpen(false);
      await load();
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to delete leave period"));
    }
  }, [leaveInfo, load, msg]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const update = () => {
      const next = Math.max(260, window.innerHeight - 320);
      setTableY(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const dateStr = date.format("YYYY-MM-DD");

      const payload: AttendanceBulkUpsert = {
        date: dateStr,
        records: rows
          .filter((r) => {
            if (r.status !== "unmarked") return true;
            const initial = initialStatusByEmployeeId[r.employee_id] ?? "unmarked";
            return initial !== "unmarked";
          })
          .map((r) => {
            return {
              employee_id: r.employee_id,
              status: r.status,
              note: r.note || null,
              overtime_rate: r.status === "present" ? (r.overtime_rate ?? null) : null,
              late_deduction: r.status === "present" || r.status === "late" ? (r.late_deduction ?? null) : null,
              leave_type: r.status === "leave" ? (r.leave_type || "paid") : null,
              fine_amount: Number(r.fine_amount ?? 0) || 0,
            };
          }),
      };

      await api.put<AttendanceListResponse>("/api/attendance/", payload);
      msg.success("Attendance saved");
      await load();
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Save failed"));
    } finally {
      setSaving(false);
    }
  }, [date, initialStatusByEmployeeId, load, msg, rows]);

  const columns = useMemo((): ColumnsType<AttendanceRow> => {
    return [
      {
        key: "serial_no",
        title: "#",
        dataIndex: "serial_no",
        width: 60,
        render: (v: string) => v || "-",
      },
      {
        key: "name",
        title: "Name",
        dataIndex: "name",
        width: 180,
        ellipsis: true,
        render: (v: string, r) => (
          <Space size={6}>
            <Typography.Link onClick={() => router.push(`/attendance/${encodeURIComponent(r.employee_id)}`)}>
              {v}
            </Typography.Link>
            {r.status === "leave" || !!r.leave_type ? (
              <Tag
                color={r.leave_type === "unpaid" ? "volcano" : "blue"}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void openLeaveInfo(r.employee_id);
                }}
              >
                Long Leave ({(r.leave_type || "paid").toUpperCase()})
              </Tag>
            ) : null}
          </Space>
        ),
      },
      {
        key: "rank",
        title: "Rank",
        dataIndex: "rank",
        width: 120,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "emp_status",
        title: "Status",
        dataIndex: "emp_status",
        width: 90,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "unit",
        title: "Unit",
        dataIndex: "unit",
        width: 130,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "department",
        title: "Category",
        dataIndex: "department",
        width: 140,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "attendance_status",
        title: "Attendance",
        width: 180,
        render: (_, r) => (
          <Segmented
            value={r.status}
            options={[
              { label: <span style={{ padding: "0 2px", display: "inline-block" }}>-</span>, value: "unmarked" },
              { label: <span style={{ padding: "0 2px", display: "inline-block" }}>P</span>, value: "present" },
              { label: <span style={{ padding: "0 2px", display: "inline-block" }}>Late</span>, value: "late" },
              { label: <span style={{ padding: "0 2px", display: "inline-block" }}>A</span>, value: "absent" },
              { label: <span style={{ padding: "0 2px", display: "inline-block" }}>L</span>, value: "leave" },
            ]}
            onChange={(v) => normalizeRowForStatus(r.employee_id, v as AttendanceStatus)}
            size="small"
            style={{ minWidth: 160 }}
          />
        ),
      },
      {
        key: "long_leave",
        title: "Long Leave",
        width: 120,
        render: (_, r) => {
          const isOnLeave = !!r.leave_type;
          return (
            <Tooltip title={isOnLeave ? "View / edit long leave" : "Mark long leave"}>
              <Button size="small" onClick={() => (isOnLeave ? void openLeaveInfo(r.employee_id) : openLeaveModal(r.employee_id))}>
                Long Leave
              </Button>
            </Tooltip>
          );
        },
      },
      {
        key: "leave_type",
        title: "Leave type",
        width: 120,
        render: (_, r) => (
          <Select
            size="small"
            value={r.leave_type || undefined}
            disabled={r.status !== "leave"}
            placeholder="Paid"
            style={{ width: "100%" }}
            options={[
              { label: "Paid", value: "paid" },
              { label: "Unpaid", value: "unpaid" },
            ]}
            onChange={(v) => setRow(r.employee_id, { leave_type: v })}
          />
        ),
      },
      {
        key: "ot",
        title: "OT",
        width: 150,
        render: (_, r) => (
          <Space size={6} style={{ width: "100%" }}>
            <Switch
              checked={r.overtime_rate !== undefined}
              disabled={r.status !== "present"}
              onChange={(checked) =>
                setRow(r.employee_id, {
                  overtime_rate: checked ? (r.overtime_rate ?? 0) : undefined,
                  overtime_hours: undefined,
                })
              }
              size="small"
            />
            {r.status === "present" && r.overtime_rate !== undefined ? (
              <InputNumber
                size="small"
                min={0}
                step={10}
                value={r.overtime_rate}
                style={{ width: 92 }}
                placeholder="rate"
                onChange={(v) => setRow(r.employee_id, { overtime_rate: v ?? undefined })}
              />
            ) : (
              <span style={{ fontSize: 12, color: "#999" }}>Rate</span>
            )}
          </Space>
        ),
      },
      {
        key: "late",
        title: "Late",
        width: 170,
        render: (_, r) => (
          <Space size={6} style={{ width: "100%" }}>
            <InputNumber
              size="small"
              min={0}
              step={50}
              value={r.late_deduction}
              disabled={r.status !== "present" && r.status !== "late"}
              style={{ width: 110 }}
              placeholder="deduct"
              onChange={(v) => setRow(r.employee_id, { late_deduction: v ?? undefined })}
            />
          </Space>
        ),
      },
      {
        key: "fine",
        title: "Fine",
        width: 110,
        render: (_, r) => (
          <InputNumber
            size="small"
            min={0}
            step={50}
            value={r.fine_amount}
            style={{ width: "100%" }}
            placeholder="0"
            onChange={(v) => setRow(r.employee_id, { fine_amount: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "note",
        title: "Note",
        width: 180,
        ellipsis: true,
        render: (_, r) => (
          <Input
            size="small"
            value={r.note}
            placeholder="Optional"
            onChange={(e) => setRow(r.employee_id, { note: e.target.value })}
          />
        ),
      },
    ];
  }, [normalizeRowForStatus, openLeaveInfo, openLeaveModal, router, setRow]);

  return (
    <>
      {msgCtx}
      <Card
        variant="borderless"
        title={
          <Space size={10} align="center" wrap>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Attendance (Detailed)
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {dirty ? "Unsaved changes" : ""}
            </Typography.Text>
          </Space>
        }
        extra={
          <Space size={8} wrap>
            <DatePicker
              value={date}
              onChange={(d) => {
                const next = d ?? dayjs();
                setDate(next);
              }}
              allowClear={false}
              size="small"
            />
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => void save()}
            >
              Save
            </Button>
          </Space>
        }
        style={{ borderRadius: 0, height: "calc(100vh - 24px)", overflow: "hidden" }}
        styles={{ header: { padding: "10px 12px" }, body: { padding: 12, height: "100%", overflow: "hidden" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
          <Modal
            title={editingLeave ? "Edit Long Leave" : "Mark Long Leave"}
            open={leaveModalOpen}
            onCancel={() => {
              setLeaveModalOpen(false);
              setEditingLeave(false);
            }}
            footer={
              <Space>
                <Button
                  onClick={() => {
                    setLeaveModalOpen(false);
                    setEditingLeave(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={() => void submitLeavePeriod()} loading={leaveSaving}>
                  {editingLeave ? "Update" : "Save"}
                </Button>
              </Space>
            }
            destroyOnHidden
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div>
                <Typography.Text strong>Employee ID</Typography.Text>
                <div>
                  <Typography.Text>{leaveEmployeeId ?? "-"}</Typography.Text>
                </div>
              </div>
              <div>
                <Typography.Text strong>Leave Dates</Typography.Text>
                <DatePicker.RangePicker
                  value={leaveRange}
                  onChange={(r) => {
                    const start = r?.[0] ?? date;
                    const end = r?.[1] ?? start;
                    setLeaveRange([start, end]);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <Typography.Text strong>Leave Type</Typography.Text>
                <Select
                  value={leaveType}
                  onChange={(v) => setLeaveType(v)}
                  style={{ width: "100%" }}
                  options={[
                    { label: "Paid", value: "paid" },
                    { label: "Unpaid", value: "unpaid" },
                  ]}
                />
              </div>
              <div>
                <Typography.Text strong>Reason (optional)</Typography.Text>
                <Input value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="Optional" />
              </div>
            </Space>
          </Modal>

          <Modal
            title="Long Leave Details"
            open={leaveInfoOpen}
            onCancel={() => setLeaveInfoOpen(false)}
            footer={
              leaveInfo ? (
                <Space>
                  <Button onClick={() => void editLeavePeriod()}>Edit Leave</Button>
                  <Button danger onClick={() => void deleteLeavePeriod()}>
                    Delete Leave
                  </Button>
                  <Button onClick={() => setLeaveInfoOpen(false)}>Close</Button>
                </Space>
              ) : (
                <Button onClick={() => setLeaveInfoOpen(false)}>Close</Button>
              )
            }
            destroyOnHidden
          >
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {leaveInfoLoading ? (
                <Typography.Text>Loading...</Typography.Text>
              ) : leaveInfo ? (
                <>
                  <Typography.Text>
                    <strong>From:</strong> {leaveInfo.from_date}
                  </Typography.Text>
                  <Typography.Text>
                    <strong>To:</strong> {leaveInfo.to_date}
                  </Typography.Text>
                  <Typography.Text>
                    <strong>Type:</strong> {(leaveInfo.leave_type || "paid").toUpperCase()}
                  </Typography.Text>
                  <Typography.Text>
                    <strong>Reason:</strong> {leaveInfo.reason || "-"}
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text type="secondary">No long leave period found for this employee on the selected day.</Typography.Text>
              )}
            </Space>
          </Modal>

          <Row gutter={[12, 12]} align="middle">
            <Col flex="auto">
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {loading ? "Loading…" : `Date: ${date.format("YYYY-MM-DD")}`}
              </Typography.Text>
            </Col>
            <Col>
              <Button size="small" onClick={() => router.push("/attendance")}>Back</Button>
            </Col>
          </Row>

          <div style={{ flex: 1, minHeight: 0 }}>
            <Table<AttendanceRow>
            rowKey={(r) => r.employee_id}
            columns={columns}
            dataSource={rows}
            loading={loading}
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
              position: ["bottomRight"],
              hideOnSinglePage: false,
            }}
            scroll={{ x: 1400, y: tableY }}
            tableLayout="fixed"
            size="small"
            sticky
            />
          </div>
        </div>
      </Card>
    </>
  );
}
