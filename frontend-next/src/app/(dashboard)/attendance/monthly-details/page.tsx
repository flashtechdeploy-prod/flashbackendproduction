"use client";

import { Button, Card, Col, DatePicker, Row, Select, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { ArrowLeftOutlined, DownloadOutlined, FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { AttendanceRecordOut, AttendanceStatus, Employee2ListItem, Employee2ListResponse } from "@/lib/types";

type ClientListItem = {
  id: number;
  client_name: string;
  client_code?: string;
};

type ClientDetail = {
  id: number;
  client_name: string;
  contracts: Array<{ id: number; status?: string | null }>;
};

type GuardAllocation = {
  id: number;
  contract_id: number;
  employee_db_id: number;
  employee_name?: string;
  employee_id?: string;
  status: string;
};

type GridRow = {
  key: string;
  employee_db_id: number;
  employee_id: string;
  name: string;
  client_name?: string;
  byDate: Record<string, AttendanceStatus>;
  byDateOvertime: Record<string, boolean>;
  sr_no?: number;
  fss_no?: string;
  designation?: string;
  p_sum_prev_month: number;
  p_sum_current_month: number;
  total_ots: number;
  total_leaves: number;
  row_type?: "group" | "employee";
};

type TableRow = GridRow;

type AttendanceRangeResponse = {
  from_date: string;
  to_date: string;
  records: AttendanceRecordOut[];
};

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

function normalizeStatus(v: unknown): AttendanceStatus {
  const st = String(v ?? "").toLowerCase();
  if (st === "present") return "present";
  if (st === "late") return "late";
  if (st === "absent") return "absent";
  if (st === "leave") return "leave";
  return "unmarked";
}

function isAbortError(e: unknown): boolean {
  if (!e || typeof e !== "object" || !("name" in e)) return false;
  return (e as { name?: unknown }).name === "AbortError";
}

function getDesignation(e: Employee2ListItem): string | undefined {
  const d = (e as unknown as { designation?: unknown }).designation;
  return typeof d === "string" ? d : undefined;
}

async function loadAllEmployees(): Promise<Employee2ListItem[]> {
  const all: Employee2ListItem[] = [];
  const seenIds = new Set<string>();
  let skip = 0;
  const limit = 200;
  while (true) {
    const res = await api.get<Employee2ListResponse>("/api/employees2/", {
      query: { skip, limit, with_total: false },
      timeoutMs: 60000,
    });
    const batch = res.employees ?? [];
    let newCount = 0;
    for (const e of batch) {
      const id = String(e.id ?? "");
      if (!id) continue;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      all.push(e);
      newCount++;
    }

    if (batch.length < limit) break;
    if (newCount === 0) break;
    skip += limit;
  }
  return all;
}

async function loadAttendanceRange(from: string, to: string, signal?: AbortSignal): Promise<AttendanceRecordOut[]> {
  const res = await api.get<AttendanceRangeResponse>("/api/attendance/range", {
    query: { from_date: from, to_date: to },
    signal,
    timeoutMs: 120000,
  });
  return Array.isArray(res?.records) ? res.records : [];
}

async function loadEmployeeClientNameMap(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  let list: ClientListItem[] = [];
  try {
    const res = await api.get<ClientListItem[]>("/api/client-management/clients", { timeoutMs: 120000 });
    list = Array.isArray(res) ? res : [];
  } catch {
    return map;
  }

  await runLimited(list, 4, async (c) => {
    try {
      const detail = await api.get<ClientDetail>(`/api/client-management/clients/${c.id}`, { timeoutMs: 120000 });
      const contracts = Array.isArray(detail?.contracts) ? detail.contracts : [];
      const activeContracts = contracts.filter((x) => String(x.status || "").toLowerCase() !== "ended");

      const allocs: GuardAllocation[] = [];
      await runLimited(activeContracts, 4, async (ct) => {
        try {
          const a = await api.get<GuardAllocation[]>(`/api/client-management/contracts/${ct.id}/allocations`, { timeoutMs: 120000 });
          if (Array.isArray(a)) allocs.push(...a);
        } catch {
          // ignore individual contract allocation failures
        }
      });

      const clientName = String(detail?.client_name || c.client_name || "").trim() || "-";
      for (const a of allocs) {
        const dbId = Number(a.employee_db_id);
        if (!Number.isFinite(dbId)) continue;
        if (!map.has(dbId)) map.set(dbId, clientName);
      }
    } catch {
      // ignore individual client failures
    }
  });

  return map;
}

async function runLimited<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  const queue = items.slice();
  const runners = new Array(Math.max(1, limit)).fill(0).map(async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function toEmployeeId(e: Employee2ListItem): string {
  return String(e.fss_no || e.serial_no || e.id);
}

function buildDates(from: Dayjs, to: Dayjs): string[] {
  const start = from.startOf("day");
  const end = to.startOf("day");
  const out: string[] = [];
  let cur = start;
  const maxDays = 62;
  while (cur.valueOf() <= end.valueOf() && out.length < maxDays) {
    out.push(cur.format("YYYY-MM-DD"));
    cur = cur.add(1, "day");
  }
  return out;
}

function defaultPayrollCycleRange(base: Dayjs): { from: Dayjs; to: Dayjs } {
  const d = base.startOf("day");
  // Cycle: 25th of previous month -> 26th of current month.
  // If we're past 26th, shift cycle forward: 25th of current month -> 26th of next month.
  const after26 = d.date() > 26;
  const to = (after26 ? d.add(1, "month") : d).date(26).startOf("day");
  const from = (after26 ? d : d.subtract(1, "month")).date(25).startOf("day");
  return { from, to };
}

function statusTag(status: AttendanceStatus, hasOvertime: boolean): React.ReactNode {
  if (status === "present" && hasOvertime) return <Tag color="green">P + OT</Tag>;
  if (status === "present") return <Tag color="green">P</Tag>;
  if (status === "late") return <Tag color="gold">Late</Tag>;
  if (status === "absent") return <Tag color="red">A</Tag>;
  if (status === "leave") return <Tag color="blue">L</Tag>;
  return <Tag>-</Tag>;
}

function statusLabel(status: AttendanceStatus, hasOvertime: boolean): string {
  if (status === "present" && hasOvertime) return "P+OT";
  if (status === "present") return "P";
  if (status === "late") return "Late";
  if (status === "absent") return "A";
  if (status === "leave") return "L";
  return "-";
}

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function downloadTextFile(filename: string, mime: string, content: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function displayClientName(cn: string | undefined): string {
  const v = String(cn || "-").trim() || "-";
  return v === "-" ? "Unallocated" : v;
}

export default function AttendanceMonthlyDetailsPage() {
  const [msg, msgCtx] = message.useMessage();
  const router = useRouter();
  useSearchParams();

  const attendanceAbortRef = useRef<AbortController | null>(null);

  const cycle = useMemo(() => defaultPayrollCycleRange(dayjs()), []);

  const [fromDate, setFromDate] = useState<Dayjs>(() => {
    return cycle.from;
  });

  const [toDate, setToDate] = useState<Dayjs>(() => {
    return cycle.to;
  });

  const [clientsLoading, setClientsLoading] = useState(false);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [clientId, setClientId] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<GridRow[]>([]);

  const [clientMapReady, setClientMapReady] = useState(false);

  const dates = useMemo(() => buildDates(fromDate, toDate), [fromDate, toDate]);

  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    try {
      const res = await api.get<ClientListItem[]>("/api/client-management/clients");
      const list = Array.isArray(res) ? res : [];
      setClients(list);
    } catch {
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  }, []);

  const loadForClient = useCallback(async (targetClientId: number) => {
    if (attendanceAbortRef.current) attendanceAbortRef.current.abort();
    const controller = new AbortController();
    attendanceAbortRef.current = controller;

    const detail = await api.get<ClientDetail>(`/api/client-management/clients/${targetClientId}`, { timeoutMs: 60000 });
    const contracts = Array.isArray(detail?.contracts) ? detail.contracts : [];
    const activeContracts = contracts.filter((c) => String(c.status || "").toLowerCase() !== "ended");

    const allAlloc: GuardAllocation[] = [];
    await runLimited(activeContracts, 6, async (c) => {
      const alloc = await api.get<GuardAllocation[]>(`/api/client-management/contracts/${c.id}/allocations`, { timeoutMs: 60000 });
      if (Array.isArray(alloc)) allAlloc.push(...alloc);
    });

    const allocatedDbIds = new Set(
      allAlloc
        .map((a) => Number(a.employee_db_id))
        .filter((x) => Number.isFinite(x))
    );

    const allEmployees = await loadAllEmployees();
    const filtered = allEmployees.filter((e) => allocatedDbIds.has(Number(e.id)));

    // Build ID map: attendance employee_id -> our generated employee_id
    const attendanceToEmployeeId = new Map<string, string>();
    for (const e of filtered) {
      attendanceToEmployeeId.set(String(e.id), toEmployeeId(e));
    }

    const byEmployeeDbId = new Map<number, Employee2ListItem>();
    for (const e of filtered) byEmployeeDbId.set(Number(e.id), e);

    const prevMonth = fromDate.month();
    const currentMonth = toDate.month();

    const clientName = String(detail?.client_name || "").trim() || "-";

    let out: GridRow[] = filtered
      .map((e): GridRow => {
        const eid = toEmployeeId(e);
        return {
          key: eid,
          employee_db_id: Number(e.id),
          employee_id: eid,
          name: e.name,
          client_name: clientName,
          byDate: {},
          byDateOvertime: {},
          sr_no: 0, // placeholder; will be assigned after sorting
          fss_no: e.fss_no ?? undefined,
          designation: getDesignation(e),
          p_sum_prev_month: 0,
          p_sum_current_month: 0,
          total_ots: 0,
          total_leaves: 0,
          row_type: "employee",
        };
      })
      .sort((a, b) => {
        const numA = parseInt(String(byEmployeeDbId.get(a.employee_db_id)?.serial_no || "999999"), 10);
        const numB = parseInt(String(byEmployeeDbId.get(b.employee_db_id)?.serial_no || "999999"), 10);
        return numA - numB;
      });

    // Reset Sr to start from 1 for the selected client
    out = out.map((r, idx) => ({ ...r, sr_no: idx + 1 }));

    setRows(out);
    setClientMapReady(true);

    void (async () => {
      try {
        const from = fromDate.format("YYYY-MM-DD");
        const to = toDate.format("YYYY-MM-DD");
        const rangeRecords = await loadAttendanceRange(from, to, controller.signal);
        if (controller.signal.aborted) return;

        // Build a fast lookup: dateStr -> (attendance employee_id -> record)
        const byDateByEmp = new Map<string, Map<string, AttendanceRecordOut>>();
        for (const rec of rangeRecords) {
          const dateStr = String(rec.date);
          const empId = String(rec.employee_id);
          if (!dateStr || !empId) continue;
          const m = byDateByEmp.get(dateStr) ?? new Map<string, AttendanceRecordOut>();
          m.set(empId, rec);
          byDateByEmp.set(dateStr, m);
        }

        setRows((prev) =>
          prev.map((r) => {
            if (r.row_type === "group") return r;

            let pPrev = 0;
            let pCurr = 0;
            let leaves = 0;
            let ots = 0;

            const nextByDate: Record<string, AttendanceStatus> = {};
            const nextByDateOvertime: Record<string, boolean> = {};

            for (const d of dates) {
              const byEmp = byDateByEmp.get(d);
              const attendanceEid = String(r.employee_db_id);
              const rec = byEmp?.get(attendanceEid);
              const status = normalizeStatus(rec?.status);
              const hasOt = rec?.overtime_rate !== null && rec?.overtime_rate !== undefined;

              nextByDate[d] = status;
              nextByDateOvertime[d] = hasOt;

              const mth = dayjs(d).month();
              if (status === "present") {
                if (mth === prevMonth) pPrev += 1;
                else if (mth === currentMonth) pCurr += 1;
              }
              if (status === "leave") leaves += 1;
              if (hasOt) ots += 1;
            }

            return {
              ...r,
              byDate: nextByDate,
              byDateOvertime: nextByDateOvertime,
              p_sum_prev_month: pPrev,
              p_sum_current_month: pCurr,
              total_leaves: leaves,
              total_ots: ots,
            };
          })
        );
      } catch {
        // ignore
      }
    })();
  }, [dates, fromDate, toDate]);

  const loadAll = useCallback(async () => {
    if (attendanceAbortRef.current) attendanceAbortRef.current.abort();
    const controller = new AbortController();
    attendanceAbortRef.current = controller;

    const allEmployees = await loadAllEmployees();

    setClientMapReady(false);
    let empClientMap: Map<number, string> | null = null;
    try {
      empClientMap = await loadEmployeeClientNameMap();
    } catch {
      empClientMap = null;
    }

    // Build ID map: attendance employee_id -> our generated employee_id
    const attendanceToEmployeeId = new Map<string, string>();
    for (const e of allEmployees) {
      attendanceToEmployeeId.set(String(e.id), toEmployeeId(e));
    }

    const prevMonth = fromDate.month();
    const currentMonth = toDate.month();

    let out: GridRow[] = allEmployees
      .map((e, idx): GridRow => {
        const eid = toEmployeeId(e);
        return {
          key: eid,
          employee_db_id: Number(e.id),
          employee_id: eid,
          name: e.name,
          client_name: empClientMap?.get(Number(e.id)) ?? "-",
          byDate: {},
          byDateOvertime: {},
          sr_no: idx + 1,
          fss_no: e.fss_no ?? undefined,
          designation: getDesignation(e),
          p_sum_prev_month: 0,
          p_sum_current_month: 0,
          total_ots: 0,
          total_leaves: 0,
          row_type: "employee",
        };
      })
      .sort((a, b) => {
        const numA = parseInt(a.employee_id || "999999", 10);
        const numB = parseInt(b.employee_id || "999999", 10);
        return numA - numB;
      });

    out = out.map((r, idx) => ({ ...r, sr_no: idx + 1 }));

    setRows(out);
    setClientMapReady(true);

    void (async () => {
      try {
        const from = fromDate.format("YYYY-MM-DD");
        const to = toDate.format("YYYY-MM-DD");
        const rangeRecords = await loadAttendanceRange(from, to, controller.signal);
        if (controller.signal.aborted) return;

        // Build a fast lookup: dateStr -> (attendance employee_id -> record)
        const byDateByEmp = new Map<string, Map<string, AttendanceRecordOut>>();
        for (const rec of rangeRecords) {
          const dateStr = String(rec.date);
          const empId = String(rec.employee_id);
          if (!dateStr || !empId) continue;
          const m = byDateByEmp.get(dateStr) ?? new Map<string, AttendanceRecordOut>();
          m.set(empId, rec);
          byDateByEmp.set(dateStr, m);
        }

        setRows((prev) =>
          prev.map((r) => {
            if (r.row_type === "group") return r;

            let pPrev = 0;
            let pCurr = 0;
            let leaves = 0;
            let ots = 0;

            const nextByDate: Record<string, AttendanceStatus> = {};
            const nextByDateOvertime: Record<string, boolean> = {};

            for (const d of dates) {
              const byEmp = byDateByEmp.get(d);
              const attendanceEid = String(r.employee_db_id);
              const rec = byEmp?.get(attendanceEid);
              const status = normalizeStatus(rec?.status);
              const hasOt = rec?.overtime_rate !== null && rec?.overtime_rate !== undefined;

              nextByDate[d] = status;
              nextByDateOvertime[d] = hasOt;

              const mth = dayjs(d).month();
              if (status === "present") {
                if (mth === prevMonth) pPrev += 1;
                else if (mth === currentMonth) pCurr += 1;
              }
              if (status === "leave") leaves += 1;
              if (hasOt) ots += 1;
            }

            return {
              ...r,
              byDate: nextByDate,
              byDateOvertime: nextByDateOvertime,
              p_sum_prev_month: pPrev,
              p_sum_current_month: pCurr,
              total_leaves: leaves,
              total_ots: ots,
            };
          })
        );
      } catch {
        // ignore
      }
    })();
  }, [dates, fromDate, toDate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (dates.length === 0) {
        setRows([]);
        return;
      }

      if (dates.length >= 62) {
        msg.warning("Please select a date range up to 62 days.");
      }

      if (clientId) {
        await loadForClient(clientId);
      } else {
        await loadAll();
      }
    } catch (e: unknown) {
      if (isAbortError(e)) return;
      try {
        const allEmployees = await loadAllEmployees();
        setRows(
          allEmployees.map((emp, idx) => ({
            key: toEmployeeId(emp),
            employee_db_id: Number(emp.id),
            employee_id: toEmployeeId(emp),
            name: emp.name,
            client_name: "-",
            byDate: {},
            byDateOvertime: {},
            sr_no: idx + 1,
            fss_no: emp.fss_no ?? undefined,
            designation: getDesignation(emp),
            p_sum_prev_month: 0,
            p_sum_current_month: 0,
            total_ots: 0,
            total_leaves: 0,
            row_type: "employee" as const,
          }))
        );
      } catch {
        // ignore
      }
      msg.error(errorMessage(e, "Failed to load monthly attendance"));
    } finally {
      setLoading(false);
    }
  }, [clientId, dates.length, loadAll, loadForClient, msg]);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = useMemo((): ColumnsType<TableRow> => {
    const left: ColumnsType<TableRow> = [
      {
        key: "sr_no",
        title: "Sr",
        dataIndex: "sr_no",
        width: 40,
        fixed: "left",
        render: (v, r) => {
          if (r.row_type === "group") {
            return {
              children: (
                <Typography.Text strong style={{ fontSize: 14, textAlign: "center", display: "block" }}>
                  {String(r.client_name || "-")}
                </Typography.Text>
              ),
              props: { colSpan: left.length + dates.length + right.length },
            } as unknown as { children: React.ReactNode; props: { colSpan: number } };
          }
          return v ?? "-";
        },
      },
      {
        key: "fss_no",
        title: "FSS",
        dataIndex: "fss_no",
        width: 70,
        fixed: "left",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v ?? "-";
        },
      },
      {
        key: "name",
        title: "Name",
        dataIndex: "name",
        width: 140,
        fixed: "left",
        ellipsis: true,
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v;
        },
      },
      {
        key: "designation",
        title: "Designation",
        dataIndex: "designation",
        width: 110,
        fixed: "left",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v ?? "-";
        },
        ellipsis: true,
      },
    ];

    const dayCols: ColumnsType<TableRow> = dates.map((d) => ({
      key: d,
      title: dayjs(d).format("DD"),
      width: 38,
      align: "center" as const,
      render: (_, r) => {
        if (r.row_type === "group") {
          return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
        }
        return statusTag(r.byDate[d] ?? "unmarked", r.byDateOvertime[d] ?? false);
      },
    }));

    const right: ColumnsType<TableRow> = [
      {
        key: "p_sum_prev_month",
        title: "P Prev",
        dataIndex: "p_sum_prev_month",
        width: 60,
        align: "center",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v;
        },
      },
      {
        key: "p_sum_current_month",
        title: "P Cur",
        dataIndex: "p_sum_current_month",
        width: 60,
        align: "center",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v;
        },
      },
      {
        key: "total_ots",
        title: "OT Days",
        dataIndex: "total_ots",
        width: 70,
        align: "center",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v;
        },
      },
      {
        key: "total_leaves",
        title: "Leaves",
        dataIndex: "total_leaves",
        width: 70,
        align: "center",
        render: (v, r) => {
          if (r.row_type === "group") {
            return { children: null, props: { colSpan: 0 } } as unknown as { children: null; props: { colSpan: 0 } };
          }
          return v;
        },
      },
    ];

    return [...left, ...dayCols, ...right];
  }, [dates]);

  const tableRows = useMemo((): TableRow[] => {
    // If a specific client is selected, add a client header row and reset Sr to start from 1
    if (clientId) {
      const clientName = rows[0]?.client_name ?? "-";
      const headerRow: TableRow = {
        key: `group-${clientName}`,
        employee_db_id: 0,
        employee_id: "",
        name: "",
        client_name: clientName,
        byDate: {},
        byDateOvertime: {},
        sr_no: undefined,
        fss_no: undefined,
        designation: undefined,
        p_sum_prev_month: 0,
        p_sum_current_month: 0,
        total_ots: 0,
        total_leaves: 0,
        row_type: "group",
      };
      const employeeRows = rows.map((r, idx) => ({ ...r, sr_no: idx + 1, row_type: "employee" as const }));
      return [headerRow, ...employeeRows];
    }

    // Default view: always group by client (including "Unallocated") and reset Sr per client
    // Only group after client map is ready to avoid duplicates
    if (!clientMapReady) return rows.map((r, idx) => ({ ...r, sr_no: idx + 1, row_type: "employee" as const }));

    const byClient = new Map<string, GridRow[]>();
    for (const r of rows) {
      const cn = String(r.client_name || "-").trim() || "-";
      const arr = byClient.get(cn) ?? [];
      arr.push(r);
      byClient.set(cn, arr);
    }

    const clientNames = Array.from(byClient.keys()).sort((a, b) => {
      // Put "Unallocated" at the end
      if (a === "-") return 1;
      if (b === "-") return -1;
      return a.localeCompare(b);
    });
    const out: TableRow[] = [];
    for (const cn of clientNames) {
      const displayName = cn === "-" ? "Unallocated" : cn;
      out.push({
        key: `group-${cn}`,
        employee_db_id: 0,
        employee_id: "",
        name: "",
        client_name: displayName,
        byDate: {},
        byDateOvertime: {},
        sr_no: undefined,
        fss_no: undefined,
        designation: undefined,
        p_sum_prev_month: 0,
        p_sum_current_month: 0,
        total_ots: 0,
        total_leaves: 0,
        row_type: "group",
      });

      const emps = byClient.get(cn) ?? [];
      emps.forEach((r, idx) => {
        out.push({ ...r, sr_no: idx + 1, row_type: "employee" });
      });
    }

    return out;
  }, [clientId, rows, clientMapReady]);

  const exportCsv = useCallback(() => {
    const employeeRows = tableRows.filter((r) => r.row_type !== "group");
    if (employeeRows.length === 0) {
      msg.warning("No employees to export.");
      return;
    }

    const headers = [
      "Client",
      "Sr",
      "FSS",
      "Name",
      "Designation",
      ...dates,
      "P Prev",
      "P Cur",
      "OT Days",
      "Leaves",
    ];

    const lines: string[] = [headers.map(csvCell).join(",")];
    for (const r of employeeRows) {
      const row: unknown[] = [
        displayClientName(r.client_name),
        r.sr_no ?? "",
        r.fss_no ?? "-",
        r.name ?? "",
        r.designation ?? "-",
        ...dates.map((d) => statusLabel(r.byDate[d] ?? "unmarked", r.byDateOvertime[d] ?? false)),
        r.p_sum_prev_month,
        r.p_sum_current_month,
        r.total_ots,
        r.total_leaves,
      ];
      lines.push(row.map(csvCell).join(","));
    }

    const from = fromDate.format("YYYYMMDD");
    const to = toDate.format("YYYYMMDD");
    downloadTextFile(`attendance_monthly_${from}_${to}.csv`, "text/csv;charset=utf-8", lines.join("\r\n"));
  }, [dates, fromDate, msg, tableRows, toDate]);

  const exportPdf = useCallback(async () => {
    if (tableRows.length === 0) {
      msg.warning("No employees to export.");
      return;
    }

    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);

    const title = `Attendance Monthly Details (${fromDate.format("YYYY-MM-DD")} → ${toDate.format("YYYY-MM-DD")})`;
    const from = fromDate.format("YYYYMMDD");
    const to = toDate.format("YYYYMMDD");
    const filename = `attendance_monthly_${from}_${to}.pdf`;

    const headRow = [
      "Sr",
      "FSS",
      "Name",
      "Designation",
      ...dates.map((d) => dayjs(d).format("DD")),
      "P Prev",
      "P Cur",
      "OT Days",
      "Leaves",
    ];
    const colCount = headRow.length;

    const body: Array<Array<string | number | { content: string; colSpan: number; styles?: Record<string, unknown> }>> = [];
    for (const r of tableRows) {
      if (r.row_type === "group") {
        body.push([
          {
            content: String(r.client_name || "-"),
            colSpan: colCount,
            styles: { halign: "center", fillColor: [230, 247, 255], fontStyle: "bold" },
          },
        ]);
        continue;
      }

      body.push([
        String(r.sr_no ?? ""),
        String(r.fss_no ?? "-"),
        String(r.name ?? ""),
        String(r.designation ?? "-"),
        ...dates.map((d) => statusLabel(r.byDate[d] ?? "unmarked", r.byDateOvertime[d] ?? false)),
        String(r.p_sum_prev_month),
        String(r.p_sum_current_month),
        String(r.total_ots),
        String(r.total_leaves),
      ]);
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(11);
    doc.text(title, 40, 30);

    autoTable(doc, {
      head: [headRow],
      body,
      startY: 40,
      theme: "grid",
      margin: { left: 20, right: 20, top: 40, bottom: 20 },
      styles: { fontSize: 6, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [250, 250, 250], textColor: 20, fontStyle: "bold" },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = doc.getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.text(`Page ${pageNumber} / ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
      },
    });

    doc.save(filename);
  }, [dates, fromDate, msg, tableRows, toDate]);

  return (
    <>
      {msgCtx}
      <Card
        variant="borderless"
        title={
          <Space size={10} align="center" wrap>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Attendance Monthly Details
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {fromDate.format("YYYY-MM-DD")} – {toDate.format("YYYY-MM-DD")}
            </Typography.Text>
          </Space>
        }
        extra={
          <Space size={8} wrap>
            <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => router.push("/attendance")}>
              Back
            </Button>
            <DatePicker.RangePicker
              size="small"
              value={[fromDate, toDate]}
              onChange={(r) => {
                const start = r?.[0] ?? dayjs().startOf("month");
                const end = r?.[1] ?? start;
                setFromDate(start);
                setToDate(end);
              }}
            />
            <Select
              size="small"
              allowClear
              loading={clientsLoading}
              style={{ width: 240 }}
              placeholder="Filter by client"
              value={clientId}
              onChange={(v) => setClientId(v)}
              options={clients.map((c) => ({ label: c.client_name, value: c.id }))}
              showSearch
              optionFilterProp="label"
            />
            <Button size="small" icon={<ReloadOutlined />} onClick={() => void load()}>
              Refresh
            </Button>
            <Button size="small" icon={<DownloadOutlined />} onClick={exportCsv}>
              Export CSV
            </Button>
            <Button size="small" icon={<FilePdfOutlined />} onClick={exportPdf}>
              Export PDF
            </Button>
          </Space>
        }
        style={{ borderRadius: 0, height: "calc(100vh - 24px)", overflow: "hidden" }}
        styles={{ header: { padding: "6px 8px" }, body: { padding: 4, height: "100%", overflowY: "hidden" } }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Table<TableRow>
              rowKey={(r) => r.key}
              size="small"
              loading={loading}
              columns={columns}
              dataSource={tableRows}
              locale={{ emptyText: loading ? "Loading…" : "No employees found" }}
              onRow={(r) => {
                if ((r as TableRow).row_type === "group") {
                  return { style: { background: "#e6f7ff", fontWeight: 600, textAlign: "center" } };
                }
                return {};
              }}
              pagination={{
                defaultPageSize: 50,
                showSizeChanger: true,
                pageSizeOptions: ["20", "50", "100", "200"],
                position: ["bottomRight"],
                size: "default",
              }}
              scroll={{ y: "calc(100vh - 220px)" }}
              sticky
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}
