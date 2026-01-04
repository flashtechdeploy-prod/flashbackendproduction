"use client";

import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  message,
  notification,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Switch,
  Tag,
  Table,
  Typography,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  DownloadOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import NotificationDropdown from "@/components/NotificationDropdown";
import type {
  AttendanceBulkUpsert,
  AttendanceListResponse,
  AttendanceRow,
  AttendanceStatus,
  Employee2ListItem,
  Employee2ListResponse,
  LeavePeriodAlert,
  LeavePeriodCreate,
  LeavePeriodOut,
  LeaveType,
} from "@/lib/types";
import { API_BASE_URL } from "@/lib/config";

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

function toMinutesFromHours(hours?: number): number | null {
  if (hours === undefined || hours === null) return null;
  if (Number.isNaN(hours)) return null;
  const mins = Math.round(hours * 60);
  return mins > 0 ? mins : 0;
}

function hoursFromMinutes(mins?: number | null): number | undefined {
  if (mins === undefined || mins === null) return undefined;
  return Math.round((mins / 60) * 100) / 100;
}

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

function statusHighlightStyle(selected: AttendanceStatus, value: AttendanceStatus): CSSProperties {
  if (selected !== value) return { padding: "0 6px", display: "inline-block" };

  const base: CSSProperties = {
    padding: "0 6px",
    display: "inline-block",
    borderRadius: 6,
    border: "1px solid transparent",
    fontWeight: 600,
  };

  if (value === "present") return { ...base, backgroundColor: "#d9f7be", borderColor: "#b7eb8f", color: "#135200" };
  if (value === "late") return { ...base, backgroundColor: "#fff1b8", borderColor: "#ffe58f", color: "#614700" };
  if (value === "absent") return { ...base, backgroundColor: "#ffccc7", borderColor: "#ffa39e", color: "#820014" };
  if (value === "leave") return { ...base, backgroundColor: "#d6e4ff", borderColor: "#adc6ff", color: "#10239e" };
  return { ...base, backgroundColor: "#f5f5f5", borderColor: "#d9d9d9", color: "#595959" };
}

function otHighlightStyle(enabled: boolean): CSSProperties {
  if (!enabled) return { display: "inline-flex", alignItems: "center" };
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 6px",
    borderRadius: 6,
    backgroundColor: "#d9f7be",
    border: "1px solid #b7eb8f",
  };
}

export default function AttendancePage() {
  const [msg, msgCtx] = message.useMessage();
  const router = useRouter();

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const singleDayMode = useMemo(
    () => dayjs(fromDate).format("YYYY-MM-DD") === dayjs(toDate).format("YYYY-MM-DD"),
    [fromDate, toDate]
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<{
    from_date: string;
    to_date: string;
    total: number;
    unmarked: number;
    present: number;
    late: number;
    absent: number;
    leave: number;
    fine_total: number;
  } | null>(null);

  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [initialStatusByEmployeeId, setInitialStatusByEmployeeId] = useState<Record<string, AttendanceStatus>>({});
  const [search, setSearch] = useState<string>("");

  const [leaveAlertsLoading, setLeaveAlertsLoading] = useState(false);
  const [leaveAlerts, setLeaveAlerts] = useState<LeavePeriodAlert[]>([]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveEmployeeId, setLeaveEmployeeId] = useState<string | null>(null);
  const [leaveRange, setLeaveRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => [fromDate, toDate]);
  const [leaveType, setLeaveType] = useState<LeaveType>("paid");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [leaveSaving, setLeaveSaving] = useState(false);

  const [leaveInfoOpen, setLeaveInfoOpen] = useState(false);
  const [leaveInfoLoading, setLeaveInfoLoading] = useState(false);
  const [leaveInfo, setLeaveInfo] = useState<LeavePeriodOut | null>(null);
  const [editingLeave, setEditingLeave] = useState(false);

  const [departments, setDepartments] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [department, setDepartment] = useState<string | undefined>(undefined);
  const [designation, setDesignation] = useState<string | undefined>(undefined);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (department && (r.department ?? "") !== department) return false;
      if (designation && !r.name) {
        // no-op
      }
      if (q) {
        const hay = `${r.employee_id} ${r.name} ${r.department ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [department, designation, rows, search]);

  const kpiRows = useMemo(() => {
    return rows.filter((r) => {
      if (department && (r.department ?? "") !== department) return false;
      return true;
    });
  }, [department, rows]);

  const statusCounts = useMemo(() => {
    const c: Record<AttendanceStatus, number> = {
      unmarked: 0,
      present: 0,
      late: 0,
      absent: 0,
      leave: 0,
    };
    for (const r of kpiRows) c[r.status] += 1;
    return c;
  }, [kpiRows]);

  const fineTotal = useMemo(() => {
    return kpiRows.reduce((sum, r) => sum + Number(r.fine_amount ?? 0), 0);
  }, [kpiRows]);

  const effectiveRange = useMemo(() => {
    return [fromDate, toDate];
  }, [fromDate, toDate]);

  const setRow = useCallback((employee_id: string, patch: Partial<AttendanceRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.employee_id === employee_id ? { ...r, ...patch } : r))
    );
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

  const loadMeta = useCallback(async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        api.get<{ departments: string[] }>("/api/employees/departments/list"),
        api.get<{ designations: string[] }>("/api/employees/designations/list"),
      ]);
      setDepartments(deptRes.departments ?? []);
      setDesignations(desigRes.designations ?? []);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load lists"));
    }
  }, [msg]);

  const loadLeaveAlerts = useCallback(async () => {
    setLeaveAlertsLoading(true);
    try {
      const asOf = dayjs(toDate).format("YYYY-MM-DD");
      const res = await api.get<LeavePeriodAlert[]>("/api/leave-periods/alerts", {
        query: { as_of: asOf },
      });
      const alerts = Array.isArray(res) ? res : [];
      setLeaveAlerts(alerts);
    } catch (e: unknown) {
      setLeaveAlerts([]);
    } finally {
      setLeaveAlertsLoading(false);
    }
  }, [toDate]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const from = dayjs(fromDate).format("YYYY-MM-DD");
      const to = dayjs(toDate).format("YYYY-MM-DD");
      const res = await api.get<any>("/api/attendance/summary", {
        query: {
          from_date: from,
          to_date: to,
          department,
          designation,
        },
      });
      setSummary({
        from_date: String(res?.from_date || from),
        to_date: String(res?.to_date || to),
        total: Number(res?.total ?? 0),
        unmarked: Number(res?.unmarked ?? 0),
        present: Number(res?.present ?? 0),
        late: Number(res?.late ?? 0),
        absent: Number(res?.absent ?? 0),
        leave: Number(res?.leave ?? 0),
        fine_total: Number(res?.fine_total ?? 0),
      });
    } catch (e: unknown) {
      setSummary(null);
      msg.error(errorMessage(e, "Failed to load attendance summary"));
    } finally {
      setSummaryLoading(false);
    }
  }, [department, designation, fromDate, msg, toDate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = fromDate.format("YYYY-MM-DD");

      // Load employees (we want everyone existing up to the selected date)
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
                ? ((rec?.leave_type ?? "paid").toString().toLowerCase() === "unpaid"
                  ? "unpaid"
                  : "paid")
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
      msg.success(`Loaded ${nextRows.length} employees for ${dateStr}`);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load attendance"));
    } finally {
      setLoading(false);
    }
  }, [fromDate, msg]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadLeaveAlerts();
  }, [loadLeaveAlerts]);

  useEffect(() => {
    if (singleDayMode) {
      void load();
    }
  }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      if (!singleDayMode) {
        msg.warning("Select a single day (From = To) to edit and save attendance.");
        return;
      }

      const dateStr = fromDate.format("YYYY-MM-DD");

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
      void loadSummary();
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Save failed"));
    } finally {
      setSaving(false);
    }
  }, [fromDate, initialStatusByEmployeeId, load, loadSummary, msg, rows, singleDayMode]);

  const exportPdf = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const dateStr = fromDate.format("YYYY-MM-DD");
      const baseUrl = `${API_BASE_URL}/api/attendance/export/pdf`;
      const params = new URLSearchParams();
      if (singleDayMode) {
        params.set("date", dateStr);
      } else {
        params.set("from_date", fromDate.format("YYYY-MM-DD"));
        params.set("to_date", toDate.format("YYYY-MM-DD"));
      }
      if (department) params.set("department", department);
      if (designation) params.set("designation", designation);
      const q = search.trim();
      if (q) params.set("search", q);
      const url = `${baseUrl}?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`PDF export failed (${res.status})`);
      const blob = await res.blob();
      downloadBlob(blob, singleDayMode ? `attendance_${dateStr}.pdf` : `attendance_${fromDate.format("YYYY-MM")}.pdf`);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "PDF export failed"));
    }
  }, [department, designation, fromDate, msg, search, singleDayMode, toDate]);

  const exportCsv = useCallback(() => {
    const dateStr = fromDate.format("YYYY-MM-DD");
    const headers = [
      "employee_id",
      "name",
      "department",
      "shift_type",
      "status",
      "leave_type",
      "ot_days",
      "late_deduction",
      "note",
    ];

    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.employee_id,
          r.name,
          r.department ?? "",
          r.shift_type ?? "",
          r.status,
          r.leave_type ?? "",
          r.overtime_rate ?? "",
          r.late_deduction ?? "",
          r.note ?? "",
        ]
          .map(csvEscape)
          .join(",")
      );
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `attendance_${dateStr}.csv`);
  }, [fromDate, rows]);

  const openLeaveModal = useCallback(
    (employee_id: string) => {
      setLeaveEmployeeId(employee_id);
      setLeaveRange([fromDate, toDate]);
      setLeaveType("paid");
      setLeaveReason("");
      setLeaveModalOpen(true);
    },
    [fromDate, toDate]
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
        // Update existing leave period
        await api.put<any>(`/api/leave-periods/${leaveInfo.id}`, payload);
        msg.success("Long leave updated");
      } else {
        // Create new leave period
        await api.post<any>("/api/leave-periods/", payload);
        msg.success("Long leave saved");
      }

      setLeaveModalOpen(false);
      setEditingLeave(false);
      await load();
      void loadSummary();
      void loadLeaveAlerts();
    } catch (e: unknown) {
      msg.error(errorMessage(e, `Failed to ${editingLeave ? 'update' : 'save'} long leave`));
    } finally {
      setLeaveSaving(false);
    }
  }, [leaveEmployeeId, leaveRange, leaveReason, leaveType, editingLeave, leaveInfo, load, loadLeaveAlerts, loadSummary, msg]);

  const editLeavePeriod = useCallback(async () => {
    if (!leaveInfo) return;

    // Open the leave modal with current data for editing
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
      void loadSummary();
      void loadLeaveAlerts();
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to delete leave period"));
    }
  }, [leaveInfo, load, loadLeaveAlerts, loadSummary, msg]);

  const openLeaveInfo = useCallback(
    async (employee_id: string) => {
      setLeaveInfoOpen(true);
      setLeaveInfoLoading(true);
      setLeaveInfo(null);
      try {
        const activeOn = fromDate.format("YYYY-MM-DD");
        const res = await api.get<LeavePeriodOut[]>("/api/leave-periods/", {
          query: { employee_id, active_on: activeOn },
        });
        const first = Array.isArray(res) && res.length > 0 ? res[0] : null;
        setLeaveInfo(first);
      } catch (e: unknown) {
        setLeaveInfo(null);
      } finally {
        setLeaveInfoLoading(false);
      }
    },
    [fromDate]
  );

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
        width: 160,
        ellipsis: true,
        render: (v: string, r) => (
          <Space size={6}>
            <Typography.Link
              onClick={() => router.push(`/attendance/${encodeURIComponent(r.employee_id)}`)}
              style={{ cursor: "pointer" }}
            >
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
        width: 100,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "emp_status",
        title: "Status",
        dataIndex: "emp_status",
        width: 80,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "unit",
        title: "Unit",
        dataIndex: "unit",
        width: 100,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "department",
        title: "Category",
        dataIndex: "department",
        width: 130,
        ellipsis: true,
        render: (v: string) => v || "-",
      },
      {
        key: "attendance_status",
        title: "Attendance",
        width: 170,
        render: (_, r) => (
          <Segmented
            value={r.status}
            disabled={!singleDayMode}
            options={[
              {
                label: <span style={statusHighlightStyle(r.status, "unmarked")}>-</span>,
                value: "unmarked",
              },
              {
                label: <span style={statusHighlightStyle(r.status, "present")}>P</span>,
                value: "present",
              },
              {
                label: <span style={statusHighlightStyle(r.status, "late")}>Late</span>,
                value: "late",
              },
              {
                label: <span style={statusHighlightStyle(r.status, "absent")}>A</span>,
                value: "absent",
              },
              {
                label: <span style={statusHighlightStyle(r.status, "leave")}>L</span>,
                value: "leave",
              },
            ]}
            onChange={(v) => normalizeRowForStatus(r.employee_id, v as AttendanceStatus)}
            size="small"
            style={{ minWidth: 150 }}
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
            <Tooltip
              title={
                isOnLeave
                  ? "Edit Leave Button - Opens modal with current leave data for editing\nDelete Leave Button - Removes leave period completely\nDynamic Modal Title - Shows 'Edit Long Leave' when editing\nSmart Save/Update - Uses PUT for edits, POST for new leaves"
                  : "Mark long leave for this employee"
              }
            >
              <Button
                size="small"
                onClick={() => isOnLeave ? void openLeaveInfo(r.employee_id) : openLeaveModal(r.employee_id)}
                disabled={!singleDayMode}
                style={{
                  backgroundColor: isOnLeave ? '#ffccc7' : undefined,
                  borderColor: isOnLeave ? '#ff7875' : undefined,
                  color: isOnLeave ? '#cf1322' : undefined
                }}
              >
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
            disabled={!singleDayMode || r.status !== "leave"}
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
        title: "OT Days",
        width: 150,
        render: (_, r) => {
          const otEnabled = r.status === "present" && r.overtime_rate !== undefined;
          return (
            <Space size={6} style={{ width: "100%" }}>
              <span style={otHighlightStyle(otEnabled)}>
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
              </span>
              {otEnabled ? (
                <InputNumber
                  size="small"
                  min={0}
                  step={10}
                  value={r.overtime_rate ? 1 : undefined}
                  style={{ width: 92 }}
                  placeholder="days"
                  onChange={(v) => setRow(r.employee_id, { overtime_rate: v && v > 0 ? 1000 : undefined })}
                />
              ) : (
                <span style={{ fontSize: 12, color: "#999" }}>Days</span>
              )}
            </Space>
          );
        },
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
        width: 100,
        render: (_, r) => (
          <InputNumber
            size="small"
            min={0}
            step={50}
            value={r.fine_amount}
            disabled={!singleDayMode}
            style={{ width: "100%" }}
            placeholder="0"
            onChange={(v) => setRow(r.employee_id, { fine_amount: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "note",
        title: "Note",
        width: 160,
        ellipsis: true,
        render: (_, r) => (
          <Input
            size="small"
            value={r.note}
            disabled={!singleDayMode}
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
              Attendance
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {singleDayMode
                ? `Editing: ${fromDate.format("YYYY-MM-DD")}`
                : `${fromDate.format("YYYY-MM-DD")} → ${toDate.format("YYYY-MM-DD")} (view only)`}
            </Typography.Text>
          </Space>
        }
        extra={
          <Space size={8} wrap>
            <NotificationDropdown
              alerts={leaveAlerts}
              onClear={() => {
                setLeaveAlerts([]);
                notification.destroy();
              }}
            />
            <Button
              size="small"
              onClick={() => {
                router.push("/attendance/monthly-details");
              }}
            >
              Full Details
            </Button>
            <Button
              size="small"
              onClick={() => {
                const q = new URLSearchParams();
                if (singleDayMode) q.set("date", fromDate.format("YYYY-MM-DD"));
                router.push(`/attendance/detailed${q.toString() ? `?${q.toString()}` : ""}`);
              }}
            >
              Detailed View
            </Button>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => {
                if (singleDayMode) void load();
                void loadSummary();
              }}
            >
              Refresh
            </Button>
            <Button size="small" onClick={() => notification.destroy()}>
              Clear
            </Button>
            <Button size="small" icon={<DownloadOutlined />} onClick={() => void exportPdf()}>
              PDF
            </Button>
            <Button size="small" icon={<DownloadOutlined />} onClick={exportCsv}>
              CSV
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              disabled={!singleDayMode}
              onClick={() => void save()}
            >
              Save
            </Button>
          </Space>
        }
        style={{ borderRadius: 0, height: "calc(100vh - 24px)", overflow: "hidden" }}
        styles={{ header: { padding: "10px 12px" }, body: { padding: 12, height: "100%", overflowY: "auto" } }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Modal
            title={editingLeave ? "Edit Long Leave" : "Mark Long Leave"}
            open={leaveModalOpen}
            onCancel={() => {
              setLeaveModalOpen(false);
              setEditingLeave(false);
            }}
            footer={
              <Space>
                {editingLeave && (
                  <Button danger onClick={() => void deleteLeavePeriod()}>
                    Delete Leave
                  </Button>
                )}
                <Button onClick={() => {
                  setLeaveModalOpen(false);
                  setEditingLeave(false);
                }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => void submitLeavePeriod()}
                  loading={leaveSaving}
                >
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
                  value={leaveRange as any}
                  onChange={(r) => {
                    const start = r?.[0] ?? fromDate;
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
                  <Button onClick={() => void editLeavePeriod()}>
                    Edit Leave
                  </Button>
                  <Button danger onClick={() => void deleteLeavePeriod()}>
                    Delete Leave
                  </Button>
                  <Button onClick={() => setLeaveInfoOpen(false)}>
                    Close
                  </Button>
                </Space>
              ) : (
                <Button onClick={() => setLeaveInfoOpen(false)}>
                  Close
                </Button>
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
          <Row gutter={[12, 12]} align="stretch">
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic title="Total" value={kpiRows.length} loading={loading} />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic title="Unmarked" value={statusCounts.unmarked} loading={loading} />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Present"
                  value={statusCounts.present}
                  styles={{ content: { color: "#1677ff" } }}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Absent"
                  value={statusCounts.absent}
                  styles={{ content: { color: "#cf1322" } }}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic title="Leave" value={statusCounts.leave} loading={loading} />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ borderRadius: 0, height: "100%" }} styles={{ body: { padding: 10 } }}>
                <Statistic title="Fine Total" value={fineTotal} loading={loading} />
              </Card>
            </Col>
          </Row>

          <Card size="small" style={{ borderRadius: 0 }} styles={{ body: { padding: 10 } }}>
            <Row gutter={[10, 10]} align="middle">
              <Col xs={24} md={6}>
                <DatePicker.RangePicker
                  value={effectiveRange as any}
                  onChange={(r) => {
                    const start = r?.[0] ?? dayjs();
                    const end = r?.[1] ?? start;
                    setFromDate(start);
                    setToDate(end);
                  }}
                  style={{ width: "100%" }}
                  size="small"
                />
              </Col>
              <Col xs={24} md={8}>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search: ID / name / category"
                  allowClear
                  style={{ width: "100%" }}
                  size="small"
                />
              </Col>
              <Col xs={24} md={5}>
                <Select
                  value={department}
                  onChange={(v) => setDepartment(v || undefined)}
                  placeholder="Category"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={departments.map((d) => ({ label: d, value: d }))}
                  style={{ width: "100%" }}
                  size="small"
                />
              </Col>
              <Col xs={24} md={5}>
                <Select
                  value={designation}
                  onChange={(v) => setDesignation(v || undefined)}
                  placeholder="Designation"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={designations.map((d) => ({ label: d, value: d }))}
                  style={{ width: "100%" }}
                  size="small"
                />
              </Col>
            </Row>

            {!singleDayMode ? (
              <div style={{ marginTop: 8 }}>
                <Alert
                  type="info"
                  showIcon
                  message="Range mode is view-only"
                  description="Set From = To to edit attendance and save."
                />
              </div>
            ) : null}
          </Card>

          <Table<AttendanceRow>
            rowKey={(r) => r.employee_id}
            columns={columns}
            dataSource={filteredRows}
            loading={loading}
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            }}
            scroll={{ x: 1400 }}
            tableLayout="fixed"
            size="small"
            sticky
          />
        </Space>
      </Card>
    </>
  );
}
