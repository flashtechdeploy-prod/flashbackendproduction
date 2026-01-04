"use client";

import { Button, Card, Col, Collapse, DatePicker, Input, Pagination, Row, Space, Table, Tag, Typography, message, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, ReloadOutlined, SearchOutlined, UserOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { Employee2 } from "@/lib/types";

type RestrictedIssuedSerialRow = {
  serial_unit_id: number;
  item_code: string;
  item_name: string;
  category: string;
  serial_number: string;
  status: string;
  created_at: string;
};

type RestrictedIssuedQtyRow = {
  item_code: string;
  item_name: string;
  category: string;
  unit_name: string;
  quantity_issued: number;
};

type RestrictedIssuedInventory = {
  employee_id: string;
  serial_items: RestrictedIssuedSerialRow[];
  quantity_items: RestrictedIssuedQtyRow[];
};

type GeneralItem = {
  item_code: string;
  name: string;
  unit_name: string;
};

type GeneralTxRow = {
  id: number;
  item_code: string;
  employee_id?: string | null;
  action: string;
  quantity?: number | null;
  notes?: string | null;
  created_at: string;
};

type RestrictedTxRow = {
  id: number;
  item_code: string;
  employee_id?: string | null;
  serial_unit_id?: number | null;
  action: string;
  quantity?: number | null;
  notes?: string | null;
  created_at: string;
};

type GeneralAllocationRow = {
  id: string;
  employee_id: string;
  employee_name: string;
  item_code: string;
  item_name: string;
  unit_name: string;
  quantity: number;
  notes: string;
  created_at: string;
};

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export default function EmployeeInventoryPage() {
  const [msg, msgCtx] = message.useMessage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee2[]>([]);
  const [restrictedIssued, setRestrictedIssued] = useState<RestrictedIssuedInventory[]>([]);
  const [generalRows, setGeneralRows] = useState<GeneralAllocationRow[]>([]);
  const [search, setSearch] = useState("");
  const [exportingByEmployee, setExportingByEmployee] = useState<Record<string, boolean>>({});
  const [exportingAllPdf, setExportingAllPdf] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [restrictedTx, setRestrictedTx] = useState<RestrictedTxRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [employeesRes, oldEmployeesRes, restrictedRes, itemsRes, generalTxRes, restrictedTxRes] = await Promise.all([
        api.get<{ employees: Employee2[] }>("/api/employees2/", { query: { limit: 1000 } }),
        api.get<{ employees: any[] }>("/api/employees/", { query: { limit: 1000 } }),
        api.get<RestrictedIssuedInventory[]>("/api/restricted-inventory/issued"),
        api.get<GeneralItem[]>("/api/general-inventory/items"),
        api.get<GeneralTxRow[]>("/api/general-inventory/transactions", { query: { limit: 5000 } }),
        api.get<RestrictedTxRow[]>("/api/restricted-inventory/transactions", { query: { limit: 5000 } }),
      ]);

      const emps = Array.isArray(employeesRes?.employees) ? employeesRes.employees : [];
      const oldEmps = Array.isArray(oldEmployeesRes?.employees) ? oldEmployeesRes.employees : [];
      setEmployees(emps);

      // 1. Build Reference Maps
      const oldIdToName = new Map<string, string>();
      for (const e of oldEmps) {
        const id = String(e.employee_id || "").trim();
        if (id) {
          const gn = [e.first_name, e.last_name].filter(Boolean).join(" ");
          oldIdToName.set(id, gn);
        }
      }

      const empByModernId = new Map<string, Employee2>();
      for (const e of emps) empByModernId.set(String(e.fss_no || e.serial_no || e.id), e);

      const empByModernName = new Map<string, Employee2>();
      for (const e of emps) {
        const cn = String(e.name || "").trim().toLowerCase();
        if (cn && !empByModernName.has(cn)) empByModernName.set(cn, e);
      }

      // 2. Map Restricted Issued Inventory
      const rIssuedMapped = (Array.isArray(restrictedRes) ? restrictedRes : []).map((r) => {
        const rawId = String(r.employee_id || "").trim();
        let modernEmp = empByModernId.get(rawId);
        if (!modernEmp) {
          const oldName = oldIdToName.get(rawId);
          if (oldName) modernEmp = empByModernName.get(oldName.trim().toLowerCase());
        }
        const mid = modernEmp ? String(modernEmp.fss_no || modernEmp.serial_no || modernEmp.id) : rawId;
        return { ...r, employee_id: mid };
      });
      setRestrictedIssued(rIssuedMapped);
      setRestrictedTx(Array.isArray(restrictedTxRes) ? restrictedTxRes : []);

      // 3. Calculate General Issued Inventory from Transactions
      const itemByCode = new Map<string, GeneralItem>();
      for (const it of Array.isArray(itemsRes) ? itemsRes : []) itemByCode.set(String(it.item_code), it);

      const txs = Array.isArray(generalTxRes) ? generalTxRes : [];
      const balanceMap = new Map<string, { employee_id: string; item_code: string; qty: number; lastIssueAt: string; lastIssueNote: string }>();

      for (const t of txs) {
        const action = String(t.action || "").toUpperCase();
        if (action !== "ISSUE" && action !== "RETURN") continue;

        const rawId = String(t.employee_id || "").trim();
        const code = String(t.item_code || "").trim();
        if (!rawId || !code) continue;

        const qty = Number(t.quantity ?? 0);
        if (!Number.isFinite(qty) || qty <= 0) continue;

        const key = `${rawId}__${code}`;
        const prev = balanceMap.get(key) || { employee_id: rawId, item_code: code, qty: 0, lastIssueAt: "", lastIssueNote: "" };

        if (action === "ISSUE") {
          prev.qty += qty;
          const createdAt = String(t.created_at || "");
          if (!prev.lastIssueAt || String(createdAt).localeCompare(String(prev.lastIssueAt)) > 0) {
            prev.lastIssueAt = createdAt;
            prev.lastIssueNote = String(t.notes || "");
          }
        } else {
          prev.qty -= qty;
        }
        balanceMap.set(key, prev);
      }

      const rowsOut: GeneralAllocationRow[] = [];
      for (const v of Array.from(balanceMap.values())) {
        if (v.qty <= 0) continue;

        const rawId = v.employee_id;
        let modernEmp = empByModernId.get(rawId);
        if (!modernEmp) {
          const oldName = oldIdToName.get(rawId);
          if (oldName) modernEmp = empByModernName.get(oldName.trim().toLowerCase());
        }

        const eid = modernEmp ? String(modernEmp.fss_no || modernEmp.serial_no || modernEmp.id) : rawId;
        const employee_name = modernEmp ? modernEmp.name : (oldIdToName.get(rawId) || rawId);
        const item = itemByCode.get(v.item_code);

        rowsOut.push({
          id: `${eid}__${v.item_code}`,
          employee_id: eid,
          employee_name,
          item_code: v.item_code,
          item_name: item?.name || v.item_code,
          unit_name: item?.unit_name || "unit",
          quantity: v.qty,
          notes: v.lastIssueNote || "-",
          created_at: v.lastIssueAt || dayjs().toISOString(),
        });
      }

      rowsOut.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      setGeneralRows(rowsOut);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load employee inventory"));
      setEmployees([]);
      setRestrictedIssued([]);
      setGeneralRows([]);
    } finally {
      setLoading(false);
    }
  }, [msg]);

  useEffect(() => {
    void load();
  }, [load]);

  const empNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of employees) m.set(String(e.fss_no || e.serial_no || e.id), e.name);
    return m;
  }, [employees]);

  const empSerialNoById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of employees) m.set(String(e.fss_no || e.serial_no || e.id), String(e.serial_no || ""));
    return m;
  }, [employees]);

  const byEmployee = useMemo(() => {
    const modernByModernId = new Map<string, Employee2>();
    const modernByModernName = new Map<string, Employee2>();
    for (const e of employees) {
      modernByModernId.set(String(e.fss_no || e.serial_no || e.id), e);
      const cn = String(e.name || "").trim().toLowerCase();
      if (cn && !modernByModernName.has(cn)) modernByModernName.set(cn, e);
    }

    const restrictedMap = new Map<string, RestrictedIssuedInventory>();
    for (const r of restrictedIssued) {
      const rid = String(r.employee_id).trim();
      let emp = modernByModernId.get(rid);
      // Backend for restricted issued might return modern ID already, but let's be safe
      const mid = emp ? String(emp.fss_no || emp.serial_no || emp.id) : rid;
      restrictedMap.set(mid, { ...r, employee_id: mid });
    }

    const restrictedLastIssueBySerial = new Map<number, string>();
    const restrictedLastIssueByQtyKey = new Map<string, string>();
    // ... Transactions matching ...
    // (OMITTED for brevity in ReplacementContent but will be included in the final file)
    // Actually, I'll just write the whole block to be safe.

    for (const t of Array.isArray(restrictedTx) ? restrictedTx : []) {
      const action = String(t.action || "").toUpperCase();
      if (action !== "ISSUE") continue;
      const createdAt = String(t.created_at || "");
      const serialId = Number(t.serial_unit_id ?? 0);
      if (Number.isFinite(serialId) && serialId > 0) {
        if (!restrictedLastIssueBySerial.get(serialId) || String(createdAt).localeCompare(String(restrictedLastIssueBySerial.get(serialId))) > 0) {
          restrictedLastIssueBySerial.set(serialId, createdAt);
        }
      }
      const eid = String(t.employee_id || "").trim();
      const code = String(t.item_code || "").trim();
      if (eid && code && !serialId) {
        const key = `${eid}__${code}`;
        if (!restrictedLastIssueByQtyKey.get(key) || String(createdAt).localeCompare(String(restrictedLastIssueByQtyKey.get(key))) > 0) {
          restrictedLastIssueByQtyKey.set(key, createdAt);
        }
      }
    }

    const generalMap = new Map<string, GeneralAllocationRow[]>();
    for (const r of generalRows) {
      const eid = String(r.employee_id);
      const prev = generalMap.get(eid) || [];
      prev.push(r);
      generalMap.set(eid, prev);
    }

    const allEmployeeIds = new Set<string>();
    // Only show employees that actually have inventory allocated
    for (const rid of Array.from(restrictedMap.keys())) allEmployeeIds.add(rid);
    for (const gid of Array.from(generalMap.keys())) allEmployeeIds.add(gid);

    const q = String(search || "").trim().toLowerCase();

    const start = dateRange?.[0] ? dayjs(dateRange[0]).startOf("day") : null;
    const end = dateRange?.[1] ? dayjs(dateRange[1]).endOf("day") : null;
    const inRange = (ts: string | null | undefined): boolean => {
      if (!start && !end) return true;
      const d = dayjs(String(ts || ""));
      if (!d.isValid()) return true;
      if (start && d.isBefore(start)) return false;
      if (end && d.isAfter(end)) return false;
      return true;
    };

    const out = Array.from(allEmployeeIds)
      .map((eid) => {
        const employee_name = empNameById.get(eid) || eid;
        const serial_no = empSerialNoById.get(eid) || "";
        const restrictedBase = restrictedMap.get(eid) || { employee_id: eid, serial_items: [], quantity_items: [] };

        const serial_items = (restrictedBase.serial_items ?? [])
          .map((s) => {
            const mapped = restrictedLastIssueBySerial.get(Number((s as any).serial_unit_id ?? 0));
            return { ...s, created_at: mapped || (s as any).created_at };
          })
          .filter((s) => inRange((s as any)?.created_at));

        const qty_items = (restrictedBase.quantity_items ?? []).filter((it) => {
          if (!start && !end) return true;
          const key = `${eid}__${String((it as any).item_code || "")}`;
          const lastIssueAt = restrictedLastIssueByQtyKey.get(key);
          if (!lastIssueAt) return false;
          return inRange(lastIssueAt);
        });

        const restricted = {
          ...restrictedBase,
          serial_items,
          quantity_items: qty_items,
        };
        const general = (generalMap.get(eid) || []).filter((r) => inRange((r as any)?.created_at));
        const restrictedCount = Number((restricted.serial_items?.length ?? 0) + (restricted.quantity_items?.length ?? 0));
        const generalCount = Number(general?.length ?? 0);
        const totalCount = restrictedCount + generalCount;
        return { employee_id: eid, employee_name, serial_no, restricted, general, _totalCount: totalCount };
      })
      .filter((g) => {
        if (!start && !end) return true;
        return Number((g as any)._totalCount ?? 0) > 0;
      })
      .filter((g) => {
        if (!q) return true;
        const hay = `${g.employee_name} ${g.employee_id}`.toLowerCase();
        if (hay.includes(q)) return true;
        for (const s of g.restricted.serial_items ?? []) {
          if (`${s.item_code} ${s.item_name} ${s.serial_number} ${s.status}`.toLowerCase().includes(q)) return true;
        }
        for (const it of g.restricted.quantity_items ?? []) {
          if (`${it.item_code} ${it.item_name} ${it.unit_name}`.toLowerCase().includes(q)) return true;
        }
        for (const it of g.general ?? []) {
          if (`${it.item_code} ${it.item_name} ${it.notes} ${it.created_at}`.toLowerCase().includes(q)) return true;
        }
        return false;
      });

    out.sort((a, b) => {
      const aNum = parseInt(a.serial_no, 10);
      const bNum = parseInt(b.serial_no, 10);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      if (!isNaN(aNum)) return -1;
      if (!isNaN(bNum)) return 1;
      return a.employee_name.localeCompare(b.employee_name);
    });
    return out;
  }, [dateRange, empNameById, empSerialNoById, employees, generalRows, restrictedIssued, restrictedTx, search]);

  const exportAllProfessionalPdf = useCallback(async () => {
    setExportingAllPdf(true);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      let url = `${API_BASE_URL}/api/exports/inventory/employees/pdf?include_zero=false`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (dateRange && dateRange[0]) url += `&start_date=${dateRange[0].toISOString()}`;
      if (dateRange && dateRange[1]) url += `&end_date=${dateRange[1].toISOString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = href;
      a.download = `employee-inventory-${dayjs().format("YYYYMMDD-HHmm")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Export failed"));
    } finally {
      setExportingAllPdf(false);
    }
  }, [msg]);

  const generalColumns: ColumnsType<GeneralAllocationRow> = useMemo(
    () => [
      {
        title: "ITEM",
        key: "item",
        render: (_, r) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong style={{ fontSize: 13 }}>{r.item_code}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>{r.item_name}</Typography.Text>
          </div>
        ),
      },
      {
        title: "ISSUED",
        key: "issued",
        width: 120,
        render: (_, r) => <Tag color="gold" style={{ fontSize: 11 }}>{Number(r.quantity ?? 0)} {r.unit_name || "unit"}</Tag>,
      },
      {
        title: "NOTE",
        dataIndex: "notes",
        key: "notes",
        ellipsis: true,
        render: (t) => <Typography.Text style={{ fontSize: 12 }}>{t}</Typography.Text>
      },
      {
        title: "DATE",
        dataIndex: "created_at",
        key: "created_at",
        width: 140,
        render: (v) => {
          const d = dayjs(String(v));
          return <Typography.Text style={{ fontSize: 11, color: '#8c8c8c' }}>{d.isValid() ? d.format("YYYY-MM-DD") : "-"}</Typography.Text>;
        },
      },
      {
        title: "",
        key: "open",
        width: 50,
        render: (_, r) => (
          <Tooltip title="View Details">
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => router.push(`/general-inventory/employee-allocations/${encodeURIComponent(r.employee_id)}`)} />
          </Tooltip>
        ),
      },
    ],
    [router]
  );

  const restrictedSerialColumns: ColumnsType<RestrictedIssuedSerialRow> = useMemo(
    () => [
      {
        title: "WEAPON / SERIAL",
        key: "weapon",
        render: (_, r) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Space size="small">
              <Typography.Text strong style={{ fontSize: 13 }}>{r.item_code}</Typography.Text>
              <Tag color="blue" bordered={false} style={{ fontSize: 10 }}>{r.serial_number}</Tag>
            </Space>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>{r.item_name}</Typography.Text>
          </div>
        ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        width: 100,
        render: (v) => {
          const s = String(v ?? "");
          const c = s === "in_stock" ? "green" : s === "issued" ? "gold" : s === "maintenance" ? "purple" : "red";
          return <Tag color={c} style={{ fontSize: 10, textTransform: 'uppercase' }}>{s}</Tag>;
        },
      },
      {
        title: "DATE",
        dataIndex: "created_at",
        width: 120,
        render: (v) => {
          const d = dayjs(String(v));
          return <Typography.Text style={{ fontSize: 11, color: '#8c8c8c' }}>{d.isValid() ? d.format("YYYY-MM-DD") : "-"}</Typography.Text>;
        },
      },
      {
        title: "",
        key: "open",
        width: 50,
        render: (_, r) => (
          <Tooltip title="View Transaction">
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => router.push(`/restricted-inventory/employee-allocations/${encodeURIComponent(String((r as any).employee_id || ""))}`)} />
          </Tooltip>
        ),
      },
    ],
    [router]
  );

  const restrictedQtyColumns: ColumnsType<RestrictedIssuedQtyRow> = useMemo(
    () => [
      {
        title: "ITEM",
        key: "item",
        render: (_, r) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong style={{ fontSize: 13 }}>{r.item_code}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>{r.item_name}</Typography.Text>
          </div>
        ),
      },
      {
        title: "ISSUED",
        key: "issued",
        width: 120,
        render: (_, r) => <Tag color="gold" style={{ fontSize: 11 }}>{Number(r.quantity_issued ?? 0)} {r.unit_name || "unit"}</Tag>,
      },
      {
        title: "",
        key: "open",
        width: 50,
        render: (_, r) => (
          <Tooltip title="View Transaction">
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => router.push(`/restricted-inventory/employee-allocations/${encodeURIComponent(String((r as any).employee_id || ""))}`)} />
          </Tooltip>
        ),
      },
    ],
    [router]
  );

  const exportEmployeePdf = useCallback(
    async (employeeId: string) => {
      const eid = String(employeeId || "").trim();
      if (!eid) return;
      setExportingByEmployee((p) => ({ ...p, [eid]: true }));
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
        const url = `${API_BASE_URL}/api/exports/inventory/employee/${encodeURIComponent(eid)}/pdf`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Export failed (${res.status})`);
        }

        const blob = await res.blob();
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = `inventory-${eid}-${dayjs().format("YYYYMMDD")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
      } catch (e: unknown) {
        msg.error(errorMessage(e, "Export failed"));
      } finally {
        setExportingByEmployee((p) => ({ ...p, [eid]: false }));
      }
    },
    [msg]
  );

  const collapseItems = useMemo(() => {
    return byEmployee.map((g) => {
      const restrictedCount = Number((g.restricted.serial_items?.length ?? 0) + (g.restricted.quantity_items?.length ?? 0));
      const generalCount = Number(g.general?.length ?? 0);
      const total = restrictedCount + generalCount;
      return {
        key: g.employee_id,
        label: (
          <Row align="middle" gutter={12} style={{ width: '100%' }}>
            <Col>
              <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: '#1890ff' }} />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size={0}>
                <Typography.Text strong style={{ fontSize: 14 }}>{g.employee_name}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  FSS: {g.serial_no || "-"} • ID: {g.employee_id}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Tag color={total > 0 ? "blue" : "default"}>{total} Items</Tag>
            </Col>
          </Row>
        ),
        extra: (
          <Space size={6}>
            <Tooltip title="Download PDF">
              <Button
                size="small"
                type="text"
                icon={<DownloadOutlined />}
                loading={Boolean(exportingByEmployee[g.employee_id])}
                disabled={total === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  void exportEmployeePdf(g.employee_id);
                }}
              />
            </Tooltip>
            <Tooltip title="View Allocations">
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/restricted-inventory/employee-allocations/${encodeURIComponent(g.employee_id)}`);
                }}
              />
            </Tooltip>
          </Space>
        ),
        children: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(g.restricted.serial_items?.length ?? 0) > 0 && (
              <Card size="small" title="Restricted Inventory - Serial Weapons" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: 8 }}>
                <Table<RestrictedIssuedSerialRow>
                  rowKey={(r) => r.serial_unit_id}
                  size="small"
                  loading={loading}
                  dataSource={(g.restricted.serial_items ?? []).map((r) => ({ ...(r as any), employee_id: g.employee_id })) as any}
                  columns={restrictedSerialColumns}
                  pagination={false}
                  rowClassName="premium-row"
                />
              </Card>
            )}

            {(g.restricted.quantity_items?.length ?? 0) > 0 && (
              <Card size="small" title="Restricted Inventory - Equipment / Ammo" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: 8 }}>
                <Table<RestrictedIssuedQtyRow>
                  rowKey={(r) => r.item_code}
                  size="small"
                  loading={loading}
                  dataSource={(g.restricted.quantity_items ?? []).map((r) => ({ ...(r as any), employee_id: g.employee_id })) as any}
                  columns={restrictedQtyColumns}
                  pagination={false}
                  rowClassName="premium-row"
                />
              </Card>
            )}

            {(g.general?.length ?? 0) > 0 && (
              <Card size="small" title="General Inventory" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: 8 }}>
                <Table<GeneralAllocationRow>
                  rowKey={(r) => r.id}
                  size="small"
                  loading={loading}
                  dataSource={g.general}
                  columns={generalColumns}
                  pagination={false}
                  rowClassName="premium-row"
                />
              </Card>
            )}
          </div>
        ),
      };
    });
  }, [byEmployee, exportEmployeePdf, exportingByEmployee, generalColumns, loading, restrictedQtyColumns, restrictedSerialColumns, router]);

  const paginatedCollapseItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return collapseItems.slice(start, end);
  }, [collapseItems, page, pageSize]);

  return (
    <div style={{ padding: "16px 24px", background: "transparent", minHeight: "100vh" }}>
      {msgCtx}

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
        <Space direction="vertical" size={2}>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>Employee Inventory</Typography.Title>
          <Typography.Text type="secondary">View and manage allocated assets per employee</Typography.Text>
        </Space>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/employees2")} style={{ borderRadius: 8 }}>Back</Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={exportingAllPdf}
            onClick={() => void exportAllProfessionalPdf()}
            style={{ borderRadius: 8 }}
          >
            Export All PDF
          </Button>
        </Space>
      </div>

      {/* Toolbar */}
      <Card bordered={false} bodyStyle={{ padding: '16px' }} style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Search employee, weapon, serial, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} md={10}>
            <DatePicker.RangePicker
              style={{ width: "100%", borderRadius: 8 }}
              value={dateRange}
              onChange={(v) => setDateRange(v)}
              allowClear
            />
          </Col>
          <Col xs={24} md={4} style={{ textAlign: 'right' }}>
            <Button type="default" icon={<ReloadOutlined />} onClick={() => void load()} block style={{ borderRadius: 8 }}>
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <Collapse
          ghost
          accordion
          items={paginatedCollapseItems}
          expandIconPosition="end"
        />
      </div>

      {/* Footer / Pagination */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={byEmployee.length}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          showTotal={(total, range) => <Typography.Text type="secondary">{range[0]}-{range[1]} of {total} employees</Typography.Text>}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>

      <style jsx global>{`
        .ant-collapse-item {
             border-bottom: 1px solid #f0f0f0 !important;
        }
        .ant-collapse-header {
             align-items: center !important;
             padding: 16px 24px !important;
             background: #fff;
             transition: background 0.3s;
        }
        .ant-collapse-header:hover {
             background: #fafafa !important;
        }
        .ant-collapse-content-box {
             padding: 24px !important;
             background: #fafafa;
        }
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
        }
      `}</style>
    </div>
  );
}
