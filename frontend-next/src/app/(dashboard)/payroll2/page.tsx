"use client";

import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  message,
  Pagination,
  Popover,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  SearchOutlined,
  SaveOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

const PAYROLL2_COLUMN_CHOICES: { key: string; label: string }[] = [
  { key: "fss_no", label: "FSS No." },
  { key: "client", label: "Client" },
  { key: "name", label: "Employee Name" },
  { key: "cnic", label: "CNIC" },
  { key: "mobile_no", label: "Mobile" },
  { key: "bank_name", label: "Bank Name" },
  { key: "bank_account_number", label: "Bank Account Number" },
  { key: "base_salary", label: "Salary Per Month" },
  { key: "presents_total", label: "Presents Total" },
  { key: "paid_leave_days", label: "Paid Leave" },
  { key: "pre_days", label: "Pre. Days" },
  { key: "cur_days", label: "Cur. Days" },
  { key: "leave_encashment", label: "Leave Enc." },
  { key: "total_days", label: "Total Days" },
  { key: "total_salary", label: "Total Salary" },
  { key: "ot_days", label: "OT Days" },
  { key: "ot_rate", label: "OT Rate" },
  { key: "ot_amount", label: "OT Amount" },
  { key: "allow_other", label: "Allow./Other" },
  { key: "gross", label: "Gross Salary" },
  { key: "eobi_no", label: "EOBI #" },
  { key: "eobi", label: "EOBI" },
  { key: "tax", label: "Tax" },
  { key: "fine_att", label: "Fine (Att)" },
  { key: "fine_adv", label: "Fine/Adv" },
  { key: "net", label: "Net Payable" },
  { key: "remarks", label: "Remarks" },
  { key: "bank_cash", label: "Bank/Cash" },
];

const DEFAULT_PAYROLL2_VISIBLE_COLUMN_KEYS = PAYROLL2_COLUMN_CHOICES.map((c) => c.key);

const ALL_PAYROLL2_COLUMN_KEYS = DEFAULT_PAYROLL2_VISIBLE_COLUMN_KEYS;

type Payroll2Row = {
  employee_db_id: number;
  employee_id: string;
  name: string;
  serial_no?: string;
  fss_no?: string;
  client_name?: string | null;
  client_code?: string | null;
  eobi_no?: string;
  cnic?: string;
  mobile_no?: string;
  bank_name?: string;
  bank_account_number?: string;
  base_salary: number;
  working_days: number;
  day_rate: number;
  // Attendance counts
  presents_total: number;
  present_dates_prev: string[];
  present_dates_cur: string[];
  present_days: number;
  late_days: number;
  absent_days: number;
  paid_leave_days: number;
  unpaid_leave_days: number;
  // Editable fields
  pre_days: number;
  cur_days: number;
  leave_encashment_days: number;
  // Calculated
  total_days: number;
  total_salary: number;
  // OT
  overtime_minutes: number;
  overtime_rate: number;
  overtime_pay: number;
  ot_days?: number;
  // Late
  late_minutes: number;
  late_deduction: number;
  // Other
  allow_other: number;
  gross_pay: number;
  // Deductions
  eobi: number;
  tax: number;
  fine_deduction: number;
  fine_adv_extra: number;
  fine_adv: number;
  advance_deduction: number;
  // Net
  net_pay: number;
  // Other
  remarks?: string | null;
  bank_cash?: string | null;
};

type Payroll2Response = {
  month: string;
  summary: {
    month: string;
    from_date: string;
    to_date: string;
    working_days: number;
    employees: number;
    total_gross: number;
    total_net: number;
    total_presents: number;
  };
  rows: Payroll2Row[];
};

type Payroll2DisplayRow = Payroll2Row & {
  __key: string;
  __rowType: "employee" | "group" | "subtotal" | "title";
  __displayNo?: number;
  __groupName?: string;
  __subtotalTotalSalary?: number;
  __subtotalNetPay?: number;
  __subtotalEmployees?: number;
  __subtotalBaseSalary?: number;
  __subtotalPresentsTotal?: number;
  __subtotalPaidLeaveDays?: number;
  __subtotalPreDays?: number;
  __subtotalCurDays?: number;
  __subtotalLeaveEncashmentDays?: number;
  __subtotalTotalDays?: number;
  __subtotalOvertimeMinutes?: number;
  __subtotalOtDays?: number;
  __subtotalOvertimePay?: number;
  __subtotalAllowOther?: number;
  __subtotalGrossPay?: number;
  __subtotalEobi?: number;
  __subtotalTax?: number;
  __subtotalFineDeduction?: number;
  __subtotalFineAdv?: number;
};

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

function compactMoney(n: number): string {
  if (n === 0) return "Rs 0";
  return `Rs ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
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


export default function Payroll2Page() {
  const [msg, msgCtx] = message.useMessage();

  const defaultRange = useMemo(() => {
    const today = dayjs();
    if (today.date() >= 26) {
      const from = today.date(26);
      const to = from.add(1, "month").date(25);
      return [from, to] as const;
    }
    const to = today.date(25);
    const from = to.subtract(1, "month").date(26);
    return [from, to] as const;
  }, []);

  const [fromDate, setFromDate] = useState(defaultRange[0]);
  const [toDate, setToDate] = useState(defaultRange[1]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<Payroll2Row[]>([]);
  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState<string | undefined>();
  const [clientFilter, setClientFilter] = useState<string | undefined>();
  const [summaryData, setSummaryData] = useState<Payroll2Response["summary"] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(DEFAULT_PAYROLL2_VISIBLE_COLUMN_KEYS);

  const columnsFilterContent = useMemo(() => {
    return (
      <div style={{ width: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <Button size="small" onClick={() => setVisibleColumnKeys(ALL_PAYROLL2_COLUMN_KEYS)}>
            Select all
          </Button>
          <Button size="small" onClick={() => setVisibleColumnKeys([])}>
            Clear
          </Button>
        </div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ maxHeight: 260, overflow: "auto", paddingRight: 6 }}>
          <Checkbox.Group
            options={PAYROLL2_COLUMN_CHOICES.map((c) => ({ label: c.label, value: c.key }))}
            value={visibleColumnKeys}
            onChange={(vals) => setVisibleColumnKeys(vals as string[])}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          />
        </div>
      </div>
    );
  }, [visibleColumnKeys]);

  const monthLabel = useMemo(() => toDate.format("YYYY-MM"), [toDate]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bank = bankFilter?.trim().toLowerCase();
    const client = clientFilter?.trim().toLowerCase();

    return rows.filter((r) => {
      // Search filter
      if (q) {
        const hay = `${r.employee_id} ${r.name} ${r.serial_no || ""} ${r.fss_no || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Bank filter
      if (bank) {
        const bankName = (r.bank_name || "").toLowerCase();
        if (!bankName.includes(bank)) return false;
      }

      // Client filter
      if (client) {
        const clientName = (r.client_name || "Unallocated").toLowerCase();
        if (!clientName.includes(client)) return false;
      }

      return true;
    });
  }, [rows, search, bankFilter, clientFilter]);

  // Reset pagination when filters/date change
  useEffect(() => {
    setPage(1);
  }, [search, bankFilter, clientFilter, fromDate, toDate]);

  // Reset pagination when data loads
  useEffect(() => {
    setPage(1);
  }, [rows]);

  // Get unique bank names for filter dropdown
  const uniqueBanks = useMemo(() => {
    const banks = new Set<string>();
    rows.forEach(r => {
      if (r.bank_name) banks.add(r.bank_name);
    });
    return Array.from(banks).sort();
  }, [rows]);

  const uniqueClients = useMemo(() => {
    const clients = new Set<string>();
    rows.forEach((r) => {
      const n = (r.client_name || "Unallocated").trim();
      if (n) clients.add(n);
    });
    return Array.from(clients).sort((a, b) => {
      if (a === "Unallocated" && b !== "Unallocated") return -1;
      if (b === "Unallocated" && a !== "Unallocated") return 1;
      return a.localeCompare(b);
    });
  }, [rows]);

  const summary = useMemo(() => {
    const totalGross = rows.reduce((a, r) => a + r.gross_pay, 0);
    const totalNet = rows.reduce((a, r) => a + r.net_pay, 0);
    const totalPresents = rows.reduce((a, r) => a + r.presents_total, 0);
    const totalOtPay = rows.reduce((a, r) => a + r.overtime_pay, 0);
    const totalOtDays = rows.reduce((a, r) => a + Number(r.ot_days || 0), 0);
    const employees = rows.length;
    return { totalGross, totalNet, totalPresents, totalOtPay, totalOtDays, employees };
  }, [rows]);

  // Show limited employees initially, load more on scroll
  const pagedRowsWithGroups = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const employeeSlice = filteredRows.slice(start, end);
    
    // Build groups only for the current page's employees
    const groups = new Map<string, Payroll2Row[]>();
    for (const r of employeeSlice) {
      const k = (r.client_name || "Unallocated").trim() || "Unallocated";
      const arr = groups.get(k) || [];
      arr.push(r);
      groups.set(k, arr);
    }
    
    const out: Payroll2DisplayRow[] = [];
    const sortedClients = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));
    
    for (const client of sortedClients) {
      const empRows = groups.get(client) || [];
      
      // Client title row that spans all columns
      out.push({
        __key: `title-${client}`,
        __rowType: "title",
        __groupName: client,
        client_name: client,
        employee_db_id: -1,
        employee_id: "",
        name: "",
        department: "",
        shift_type: "",
        base_salary: 0,
        day_rate: 0,
        presents_total: 0,
        paid_leave_days: 0,
        total_days: 0,
        total_salary: 0,
        pre_days: 0,
        cur_days: 0,
        leave_encashment_days: 0,
        overtime_minutes: 0,
        overtime_rate: 0,
        overtime_pay: 0,
        ot_days: 0,
        allow_other: 0,
        gross_pay: 0,
        eobi_no: "",
        eobi: 0,
        tax: 0,
        fine_deduction: 0,
        fine_adv: 0,
        net_pay: 0,
        remarks: null,
        bank_cash: null,
        fss_no: null,
        serial_no: null,
        mobile_no: null,
        bank_name: null,
        bank_account_number: null,
        __subtotalBaseSalary: 0,
        __subtotalPresentsTotal: 0,
        __subtotalPaidLeaveDays: 0,
        __subtotalPreDays: 0,
        __subtotalCurDays: 0,
        __subtotalLeaveEncashmentDays: 0,
        __subtotalTotalDays: 0,
        __subtotalTotalSalary: 0,
        __subtotalOvertimeMinutes: 0,
        __subtotalOtDays: 0,
        __subtotalOvertimePay: 0,
        __subtotalAllowOther: 0,
        __subtotalGrossPay: 0,
        __subtotalEobi: 0,
        __subtotalTax: 0,
        __subtotalFineDeduction: 0,
        __subtotalFineAdv: 0,
        __subtotalNetPay: 0,
        __subtotalEmployees: empRows.length,
        // Additional required fields from Payroll2Row (avoid duplicates)
        employee_code: "",
        client_code: "",
        cnic: "",
        eobi_no: "",
        working_days: 0,
        payable_days: 0,
        basic_earned: 0,
        present_days: 0,
        late_days: 0,
        absent_days: 0,
        unpaid_leave_days: 0,
        unmarked_days: 0,
        late_minutes: 0,
        late_deduction: 0,
        allowances: 0,
        late_rate: 0,
        ot_rate_override: 0,
        ot_bonus_amount: 0,
      });
      
      // Employee rows with client-specific serial numbers
      for (let i = 0; i < empRows.length; i++) {
        const r = empRows[i];
        out.push({
          ...r,
          __key: `emp-${r.employee_db_id}`,
          __rowType: "employee",
          __displayNo: i + 1, // Restart serial from 1 for each client
        });
      }
      
      // Subtotal calculations for this client
      let sumBaseSalary = 0;
      let sumPresentsTotal = 0;
      let sumPaidLeaveDays = 0;
      let sumPreDays = 0;
      let sumCurDays = 0;
      let sumLeaveEncashmentDays = 0;
      let sumTotalDays = 0;
      let sumTotalSalary = 0;
      let sumOvertimeMinutes = 0;
      let sumOtDays = 0;
      let sumOvertimePay = 0;
      let sumAllowOther = 0;
      let sumGrossPay = 0;
      let sumEobi = 0;
      let sumTax = 0;
      let sumFineDeduction = 0;
      let sumFineAdv = 0;
      let sumNetPay = 0;
      
      for (const r of empRows) {
        sumBaseSalary += Number(r.base_salary || 0);
        sumPresentsTotal += Number(r.presents_total || 0);
        sumPaidLeaveDays += Number(r.paid_leave_days || 0);
        sumPreDays += Number(r.pre_days || 0);
        sumCurDays += Number(r.cur_days || 0);
        sumLeaveEncashmentDays += Number(r.leave_encashment_days || 0);
        sumTotalDays += Number(r.total_days || 0);
        sumTotalSalary += Number(r.total_salary || 0);
        sumOvertimeMinutes += Number(r.overtime_minutes || 0);
        sumOtDays += Number(r.ot_days || 0);
        sumOvertimePay += Number(r.overtime_pay || 0);
        sumAllowOther += Number(r.allow_other || 0);
        sumGrossPay += Number(r.gross_pay || 0);
        sumEobi += Number(r.eobi || 0);
        sumTax += Number(r.tax || 0);
        sumFineDeduction += Number(r.fine_deduction || 0);
        sumFineAdv += Number(r.fine_adv || 0);
        sumNetPay += Number(r.net_pay || 0);
      }
      
      // Enhanced subtotal row at the bottom with all details
      out.push({
        __key: `subtotal-${client}`,
        __rowType: "subtotal",
        __groupName: client,
        client_name: client,
        employee_db_id: -1,
        employee_id: "",
        name: "",
        department: "",
        shift_type: "",
        base_salary: sumBaseSalary,
        day_rate: 0,
        presents_total: sumPresentsTotal,
        paid_leave_days: sumPaidLeaveDays,
        total_days: sumTotalDays,
        total_salary: sumTotalSalary,
        pre_days: sumPreDays,
        cur_days: sumCurDays,
        leave_encashment_days: sumLeaveEncashmentDays,
        overtime_minutes: sumOvertimeMinutes,
        overtime_rate: 0,
        overtime_pay: sumOvertimePay,
        ot_days: sumOtDays,
        allow_other: sumAllowOther,
        gross_pay: sumGrossPay,
        eobi_no: "",
        eobi: sumEobi,
        tax: sumTax,
        fine_deduction: sumFineDeduction,
        fine_adv: sumFineAdv,
        net_pay: sumNetPay,
        remarks: null,
        bank_cash: null,
        fss_no: null,
        serial_no: null,
        mobile_no: null,
        bank_name: null,
        bank_account_number: null,
        __subtotalBaseSalary: sumBaseSalary,
        __subtotalPresentsTotal: sumPresentsTotal,
        __subtotalPaidLeaveDays: sumPaidLeaveDays,
        __subtotalPreDays: sumPreDays,
        __subtotalCurDays: sumCurDays,
        __subtotalLeaveEncashmentDays: sumLeaveEncashmentDays,
        __subtotalTotalDays: sumTotalDays,
        __subtotalTotalSalary: sumTotalSalary,
        __subtotalOvertimeMinutes: sumOvertimeMinutes,
        __subtotalOtDays: sumOtDays,
        __subtotalOvertimePay: sumOvertimePay,
        __subtotalAllowOther: sumAllowOther,
        __subtotalGrossPay: sumGrossPay,
        __subtotalEobi: sumEobi,
        __subtotalTax: sumTax,
        __subtotalFineDeduction: sumFineDeduction,
        __subtotalFineAdv: sumFineAdv,
        __subtotalNetPay: sumNetPay,
        __subtotalEmployees: empRows.length,
        // Additional required fields from Payroll2Row (avoid duplicates)
        employee_code: "",
        client_code: "",
        cnic: "",
        eobi_no: "",
        working_days: 0,
        payable_days: 0,
        basic_earned: 0,
        present_days: 0,
        late_days: 0,
        absent_days: 0,
        unpaid_leave_days: 0,
        unmarked_days: 0,
        late_minutes: 0,
        late_deduction: 0,
        allowances: 0,
        late_rate: 0,
        ot_rate_override: 0,
        ot_bonus_amount: 0,
      });
    }
    
    return out;
  }, [filteredRows, page, pageSize]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rep = await api.get<Payroll2Response>("/api/payroll2/range-report", {
        query: {
          from_date: fromDate.format("YYYY-MM-DD"),
          to_date: toDate.format("YYYY-MM-DD"),
          month: monthLabel,
        },
      });

      const sorted = (rep.rows ?? []).sort((a, b) => {
        const aNum = parseInt(a.serial_no || "0", 10);
        const bNum = parseInt(b.serial_no || "0", 10);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.employee_id.localeCompare(b.employee_id);
      });
      setRows(sorted);
      setSummaryData(rep.summary);

      msg.success(`Loaded (${fromDate.format("YYYY-MM-DD")} to ${toDate.format("YYYY-MM-DD")})`);
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load payroll"));
    } finally {
      setLoading(false);
    }
  }, [fromDate, monthLabel, msg, toDate]);

  useEffect(() => {
    void load();
  }, [load]);

  // Recalculate row when editable fields change
  const updateRow = useCallback((employee_db_id: number, patch: Partial<Payroll2Row>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.employee_db_id !== employee_db_id) return r;
        const updated = { ...r, ...patch };

        // OT Amount = OT Days * OT Rate (manual)
        const ot_days = Number(updated.ot_days ?? 0);
        const overtime_rate = Number(updated.overtime_rate ?? 0);
        const overtime_pay = ot_days * overtime_rate;

        // Recalculate total_days = presents_total + leave_encashment_days
        const total_days = (updated.presents_total || 0) + (updated.leave_encashment_days || 0);
        const total_salary = total_days * r.day_rate;
        const gross_pay = total_salary + overtime_pay + (updated.allow_other || 0);
        const fine_adv = r.fine_deduction + r.advance_deduction + (updated.fine_adv_extra || 0);
        const net_pay = gross_pay - (updated.eobi || 0) - (updated.tax || 0) - fine_adv - r.late_deduction;

        return {
          ...updated,
          overtime_pay,
          total_days,
          total_salary,
          gross_pay,
          fine_adv,
          net_pay,
        };
      })
    );
  }, []);

  const saveSheet = useCallback(async () => {
    setSaving(true);
    try {
      const payload = {
        from_date: fromDate.format("YYYY-MM-DD"),
        to_date: toDate.format("YYYY-MM-DD"),
        entries: rows.map((r) => ({
          employee_db_id: r.employee_db_id,
          from_date: fromDate.format("YYYY-MM-DD"),
          to_date: toDate.format("YYYY-MM-DD"),
          pre_days_override: r.pre_days,
          cur_days_override: r.cur_days,
          leave_encashment_days: r.leave_encashment_days,
          allow_other: r.allow_other,
          eobi: r.eobi,
          tax: r.tax,
          fine_adv_extra: r.fine_adv_extra,
          ot_rate_override: r.overtime_rate,
          remarks: r.remarks ?? null,
          bank_cash: r.bank_cash ?? null,
          // Sync with master profile
          mobile_no: r.mobile_no,
          bank_name: r.bank_name,
          bank_account_number: r.bank_account_number,
        })),
      };
      await api.put("/api/payroll/sheet-entries", payload);
      msg.success("Saved");
      void load();
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to save"));
    } finally {
      setSaving(false);
    }
  }, [fromDate, load, msg, rows, toDate]);

  const exportCsv = useCallback(() => {
    const workingDays = Number(
      summaryData?.working_days ?? Math.max(0, toDate.startOf("day").diff(fromDate.startOf("day"), "day"))
    );

    const totalGross = rows.reduce((a, r) => a + Number(r.gross_pay || 0), 0);
    const totalNet = rows.reduce((a, r) => a + Number(r.net_pay || 0), 0);
    const totalPresents = rows.reduce((a, r) => a + Number(r.presents_total || 0), 0);
    const totalOtPay = rows.reduce((a, r) => a + Number(r.overtime_pay || 0), 0);
    const totalOtDays = rows.reduce((a, r) => a + Number(r.ot_days || 0), 0);
    const employees = rows.length;

    const headers = [
      "#", "FSS No.", "Employee Name", "CNIC", "Mobile", "Bank Name", "Bank Account Number", "Salary/Month", "Presents", "Paid Leave", "Total", "Pre Days", "Cur Days", "Leave Enc.", "Total Days", "Total Salary", "OT Days", "OT Rate", "OT Amount", "Allow./Other", "Gross Salary", "EOBI", "#", "EOBI", "Tax", "Fine (Att)", "Fine/Adv.", "Net Payable", "Remarks", "Bank/Cash"
    ];
    const lines: string[] = [];

    lines.push(["SUMMARY"].map(csvEscape).join(","));
    lines.push(["Month", monthLabel].map(csvEscape).join(","));
    lines.push(["From Date", fromDate.format("YYYY-MM-DD")].map(csvEscape).join(","));
    lines.push(["To Date", toDate.format("YYYY-MM-DD")].map(csvEscape).join(","));
    lines.push(["Working Days", workingDays].map(csvEscape).join(","));
    lines.push(["Employees", employees].map(csvEscape).join(","));
    lines.push(["Total Presents", totalPresents].map(csvEscape).join(","));
    lines.push(["Total OT Days", totalOtDays].map(csvEscape).join(","));
    lines.push(["OT Pay", totalOtPay].map(csvEscape).join(","));
    lines.push(["Total Gross", totalGross].map(csvEscape).join(","));
    lines.push(["Total Net", totalNet].map(csvEscape).join(","));
    lines.push("");

    lines.push(headers.join(","));

    // Group by client, export title + employees (sr resets) + subtotal
    const groups = new Map<string, Payroll2Row[]>();
    for (const r of rows) {
      const k = (r.client_name || "Unallocated").trim() || "Unallocated";
      const arr = groups.get(k) || [];
      arr.push(r);
      groups.set(k, arr);
    }
    const sortedClients = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

    const emptyRow = () => Array(headers.length).fill("");

    for (const client of sortedClients) {
      const empRows = groups.get(client) || [];

      // Title row (client name in first column)
      const title = emptyRow();
      title[0] = client;
      lines.push(title.map(csvEscape).join(","));

      // Employee rows (serial per client)
      for (let i = 0; i < empRows.length; i++) {
        const r = empRows[i];
        lines.push([
          String(i + 1),
          r.fss_no || "",
          r.name,
          r.cnic || "",
          r.mobile_no || "",
          r.bank_name || "",
          r.bank_account_number || "",
          r.base_salary,
          r.presents_total,
          r.paid_leave_days,
          r.total_days,
          r.pre_days,
          r.cur_days,
          r.leave_encashment_days,
          r.total_days,
          r.total_salary,
          r.ot_days ?? 0,
          r.overtime_rate,
          r.overtime_pay,
          r.allow_other,
          r.gross_pay,
          r.eobi_no || "",
          "#",
          r.eobi,
          r.tax,
          r.fine_deduction,
          r.fine_adv,
          r.net_pay,
          r.remarks || "",
          r.bank_cash || "",
        ].map(csvEscape).join(","));
      }

      // Subtotal row
      const sum = {
        base_salary: 0,
        presents_total: 0,
        paid_leave_days: 0,
        pre_days: 0,
        cur_days: 0,
        leave_encashment_days: 0,
        total_days: 0,
        total_salary: 0,
        ot_days: 0,
        overtime_pay: 0,
        allow_other: 0,
        gross_pay: 0,
        eobi: 0,
        tax: 0,
        fine_deduction: 0,
        fine_adv: 0,
        net_pay: 0,
      };
      for (const r of empRows) {
        sum.base_salary += Number(r.base_salary || 0);
        sum.presents_total += Number(r.presents_total || 0);
        sum.paid_leave_days += Number(r.paid_leave_days || 0);
        sum.pre_days += Number(r.pre_days || 0);
        sum.cur_days += Number(r.cur_days || 0);
        sum.leave_encashment_days += Number(r.leave_encashment_days || 0);
        sum.total_days += Number(r.total_days || 0);
        sum.total_salary += Number(r.total_salary || 0);
        sum.ot_days += Number(r.ot_days || 0);
        sum.overtime_pay += Number(r.overtime_pay || 0);
        sum.allow_other += Number(r.allow_other || 0);
        sum.gross_pay += Number(r.gross_pay || 0);
        sum.eobi += Number(r.eobi || 0);
        sum.tax += Number(r.tax || 0);
        sum.fine_deduction += Number(r.fine_deduction || 0);
        sum.fine_adv += Number(r.fine_adv || 0);
        sum.net_pay += Number(r.net_pay || 0);
      }

      lines.push([
        `Subtotal (${empRows.length})`,
        "",
        "",
        "",
        "",
        "",
        "",
        sum.base_salary,
        sum.presents_total,
        sum.paid_leave_days,
        sum.total_days,
        sum.pre_days,
        sum.cur_days,
        sum.leave_encashment_days,
        sum.total_days,
        sum.total_salary,
        sum.ot_days,
        0,
        sum.overtime_pay,
        sum.allow_other,
        sum.gross_pay,
        "",
        "#",
        sum.eobi,
        sum.tax,
        sum.fine_deduction,
        sum.fine_adv,
        sum.net_pay,
        "",
        "",
      ].map(csvEscape).join(","));

      // spacer
      lines.push(emptyRow().map(csvEscape).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `payroll2_${monthLabel}.csv`);
  }, [monthLabel, rows]);

  const exportPdf = useCallback(async () => {
    try {
      msg.loading({ content: "Generating PDF...", key: "pdf" });
      const token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;

      // Build grouped rows for backend PDF (title + employees + subtotal)
      const groups = new Map<string, Payroll2Row[]>();
      for (const r of rows) {
        const k = (r.client_name || "Unallocated").trim() || "Unallocated";
        const arr = groups.get(k) || [];
        arr.push(r);
        groups.set(k, arr);
      }
      const sortedClients = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

      const mappedRows: any[] = [];
      for (const client of sortedClients) {
        const empRows = groups.get(client) || [];

        mappedRows.push({
          row_type: "title",
          client_name: client,
          subtotal_employees: empRows.length,
          serial_no: "",
          fss_no: "",
          name: client,
          base_salary: 0,
          mobile_no: "",
          presents_total: 0,
          paid_leave_days: 0,
          pre_days: 0,
          cur_days: 0,
          leave_encashment_days: 0,
          total_days: 0,
          total_salary: 0,
          ot_days: 0,
          overtime_rate: 0,
          overtime_minutes: 0,
          overtime_pay: 0,
          allow_other: 0,
          gross_pay: 0,
          eobi_no: "",
          eobi: 0,
          tax: 0,
          fine_deduction: 0,
          fine_adv: 0,
          net_pay: 0,
          remarks: "",
          bank_cash: "",
          cnic: "",
          bank_name: "",
          bank_account_number: "",
        });

        for (let i = 0; i < empRows.length; i++) {
          const r = empRows[i];
          mappedRows.push({
            row_type: "employee",
            client_name: client,
            subtotal_employees: empRows.length,
            serial_no: String(i + 1),
            fss_no: r.fss_no,
            name: r.name,
            base_salary: r.base_salary,
            mobile_no: r.mobile_no || "",
            presents_total: r.presents_total,
            paid_leave_days: r.paid_leave_days,
            pre_days: r.pre_days,
            cur_days: r.cur_days,
            leave_encashment_days: r.leave_encashment_days,
            total_days: r.total_days,
            total_salary: r.total_salary,
            ot_days: r.ot_days ?? 0,
            overtime_rate: r.overtime_rate,
            overtime_minutes: r.overtime_minutes || 0,
            overtime_pay: r.overtime_pay,
            allow_other: r.allow_other,
            gross_pay: r.gross_pay,
            eobi_no: r.eobi_no,
            eobi: r.eobi,
            tax: r.tax,
            fine_deduction: r.fine_deduction,
            fine_adv: r.fine_adv,
            net_pay: r.net_pay,
            remarks: r.remarks,
            bank_cash: r.bank_cash,
            cnic: r.cnic || "",
            bank_name: r.bank_name || "",
            bank_account_number: r.bank_account_number || "",
          });
        }

        const sum = {
          base_salary: 0,
          presents_total: 0,
          paid_leave_days: 0,
          pre_days: 0,
          cur_days: 0,
          leave_encashment_days: 0,
          total_days: 0,
          total_salary: 0,
          ot_days: 0,
          overtime_pay: 0,
          allow_other: 0,
          gross_pay: 0,
          eobi: 0,
          tax: 0,
          fine_deduction: 0,
          fine_adv: 0,
          net_pay: 0,
        };
        for (const r of empRows) {
          sum.base_salary += Number(r.base_salary || 0);
          sum.presents_total += Number(r.presents_total || 0);
          sum.paid_leave_days += Number(r.paid_leave_days || 0);
          sum.pre_days += Number(r.pre_days || 0);
          sum.cur_days += Number(r.cur_days || 0);
          sum.leave_encashment_days += Number(r.leave_encashment_days || 0);
          sum.total_days += Number(r.total_days || 0);
          sum.total_salary += Number(r.total_salary || 0);
          sum.ot_days += Number(r.ot_days || 0);
          sum.overtime_pay += Number(r.overtime_pay || 0);
          sum.allow_other += Number(r.allow_other || 0);
          sum.gross_pay += Number(r.gross_pay || 0);
          sum.eobi += Number(r.eobi || 0);
          sum.tax += Number(r.tax || 0);
          sum.fine_deduction += Number(r.fine_deduction || 0);
          sum.fine_adv += Number(r.fine_adv || 0);
          sum.net_pay += Number(r.net_pay || 0);
        }

        mappedRows.push({
          row_type: "subtotal",
          client_name: client,
          subtotal_employees: empRows.length,
          serial_no: "",
          fss_no: "",
          name: "",
          base_salary: sum.base_salary,
          mobile_no: "",
          presents_total: sum.presents_total,
          paid_leave_days: sum.paid_leave_days,
          pre_days: sum.pre_days,
          cur_days: sum.cur_days,
          leave_encashment_days: sum.leave_encashment_days,
          total_days: sum.total_days,
          total_salary: sum.total_salary,
          ot_days: sum.ot_days,
          overtime_rate: 0,
          overtime_minutes: 0,
          overtime_pay: sum.overtime_pay,
          allow_other: sum.allow_other,
          gross_pay: sum.gross_pay,
          eobi_no: "",
          eobi: sum.eobi,
          tax: sum.tax,
          fine_deduction: sum.fine_deduction,
          fine_adv: sum.fine_adv,
          net_pay: sum.net_pay,
          remarks: "",
          bank_cash: "",
          cnic: "",
          bank_name: "",
          bank_account_number: "",
        });
      }

      const url = `${API_BASE_URL}/api/payroll2/export-pdf?from_date=${fromDate.format("YYYY-MM-DD")}&to_date=${toDate.format("YYYY-MM-DD")}&month=${monthLabel}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rows: mappedRows }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      downloadBlob(blob, `payroll2_${monthLabel}.pdf`);
      msg.success({ content: "PDF downloaded", key: "pdf" });
    } catch (e) {
      msg.error({ content: errorMessage(e, "Failed to export PDF"), key: "pdf" });
    }
  }, [fromDate, monthLabel, msg, rows, toDate]);


  const columns = useMemo((): ColumnsType<Payroll2DisplayRow> => {
    const otherCols: ColumnsType<Payroll2DisplayRow> = [
      {
        key: "fss_no",
        title: <div style={{ fontSize: 10, lineHeight: 1.05 }}>FSS<br />No.</div>,
        width: 65,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Typography.Text style={{ fontSize: 11 }}>{r.fss_no || ""}</Typography.Text>
        ),
      },
      {
        key: "client",
        title: "Client",
        width: 140,
        ellipsis: true,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Typography.Text style={{ fontSize: 11 }} ellipsis={{ tooltip: r.client_name || "Unallocated" }}>
            {r.client_name || "Unallocated"}
          </Typography.Text>
        ),
      },
      {
        key: "name",
        title: "Employee Name",
        dataIndex: "name",
        width: 140,
        ellipsis: true,
        render: (v: string) => (
          <Typography.Text style={{ fontSize: 11 }} ellipsis={{ tooltip: v }}>{v}</Typography.Text>
        ),
      },
      {
        key: "cnic",
        title: "CNIC",
        width: 120,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Typography.Text style={{ fontSize: 11 }}>{r.cnic || ""}</Typography.Text>
        ),
      },
      {
        key: "mobile_no",
        title: "Mobile",
        width: 110,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Input
            size="small"
            value={r.mobile_no ?? ""}
            style={{ fontSize: 11 }}
            onChange={(e) => updateRow(r.employee_db_id, { mobile_no: e.target.value })}
          />
        ),
      },
      {
        key: "bank_name",
        title: "Bank Name",
        width: 120,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Input
            size="small"
            value={r.bank_name ?? ""}
            style={{ fontSize: 11 }}
            onChange={(e) => updateRow(r.employee_db_id, { bank_name: e.target.value })}
          />
        ),
      },
      {
        key: "bank_account_number",
        title: "Bank Account Number",
        width: 140,
        render: (_: unknown, r: Payroll2DisplayRow) => (
          <Input
            size="small"
            value={r.bank_account_number ?? ""}
            style={{ fontSize: 11 }}
            onChange={(e) => updateRow(r.employee_db_id, { bank_account_number: e.target.value })}
          />
        ),
      },
      {
        key: "base_salary",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Salary<br />Per Month</div>,
        width: 85,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{compactMoney(r.base_salary)}</Typography.Text>
        ),
      },
      {
        key: "presents_total",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "center" }}>Presents<br />Total</div>,
        width: 65,
        align: "center",
        render: (_: unknown, r: Payroll2Row) => {
          const prevDates = r.present_dates_prev || [];
          const curDates = r.present_dates_cur || [];
          const hasDates = prevDates.length > 0 || curDates.length > 0;

          const tooltipContent = hasDates ? (
            <div style={{ maxHeight: 250, overflowY: "auto", fontSize: 11, minWidth: 100 }}>
              {prevDates.length > 0 && (
                <>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: "#faad14" }}>Previous Month ({prevDates.length})</div>
                  {prevDates.map((d, i) => (
                    <div key={`prev-${i}`} style={{ paddingLeft: 4 }}>{d}</div>
                  ))}
                </>
              )}
              {prevDates.length > 0 && curDates.length > 0 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", margin: "8px 0" }} />
              )}
              {curDates.length > 0 && (
                <>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: "#52c41a" }}>Current Month ({curDates.length})</div>
                  {curDates.map((d, i) => (
                    <div key={`cur-${i}`} style={{ paddingLeft: 4 }}>{d}</div>
                  ))}
                </>
              )}
            </div>
          ) : "No attendance";

          return (
            <Tooltip title={tooltipContent} placement="right">
              <Tag color={r.presents_total > 0 ? "green" : "default"} style={{ fontSize: 11, cursor: "pointer" }}>
                {r.presents_total}
              </Tag>
            </Tooltip>
          );
        },
      },
      {
        key: "paid_leave_days",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "center" }}>Paid<br />Leave</div>,
        width: 55,
        align: "center",
        render: (_: unknown, r: Payroll2Row) => (
          <Tag color={r.paid_leave_days > 0 ? "blue" : "default"} style={{ fontSize: 11 }}>
            {r.paid_leave_days ?? 0}
          </Tag>
        ),
      },
      {
        key: "pre_days",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Pre.<br />Days</div>,
        width: 55,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.pre_days}
            style={{ width: 48 }}
            onChange={(v) => updateRow(r.employee_db_id, { pre_days: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "cur_days",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Cur.<br />Days</div>,
        width: 55,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.cur_days}
            style={{ width: 48 }}
            onChange={(v) => updateRow(r.employee_db_id, { cur_days: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "leave_encashment",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Leave<br />Enc.</div>,
        width: 55,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.leave_encashment_days}
            style={{ width: 48 }}
            onChange={(v) => updateRow(r.employee_db_id, { leave_encashment_days: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "total_days",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Total<br />Days</div>,
        width: 55,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{r.total_days}</Typography.Text>
        ),
      },
      {
        key: "total_salary",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Total<br />Salary</div>,
        width: 80,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{compactMoney(r.total_salary)}</Typography.Text>
        ),
      },
      {
        key: "ot_days",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>O.T<br />Days</div>,
        width: 55,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{r.ot_days ?? 0}</Typography.Text>
        ),
      },
      {
        key: "ot_rate",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>O.T<br />Rate</div>,
        width: 65,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.overtime_rate}
            style={{ width: 60 }}
            onChange={(v) => updateRow(r.employee_db_id, { overtime_rate: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "ot_amount",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>O.T<br />Amount</div>,
        width: 75,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{compactMoney(r.overtime_pay)}</Typography.Text>
        ),
      },
      {
        key: "allow_other",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Allow./<br />Other</div>,
        width: 75,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.allow_other}
            style={{ width: 65 }}
            onChange={(v) => updateRow(r.employee_db_id, { allow_other: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "gross",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Gross<br />Salary</div>,
        width: 85,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{compactMoney(r.gross_pay)}</Typography.Text>
        ),
      },
      {
        key: "eobi_no",
        title: <div style={{ fontSize: 10, lineHeight: 1.05 }}>EOBI<br />#</div>,
        width: 75,
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{r.eobi_no || ""}</Typography.Text>
        ),
      },
      {
        key: "eobi",
        title: "EOBI",
        width: 65,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.eobi}
            style={{ width: 60 }}
            onChange={(v) => updateRow(r.employee_db_id, { eobi: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "tax",
        title: "Tax",
        width: 65,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.tax}
            style={{ width: 60 }}
            onChange={(v) => updateRow(r.employee_db_id, { tax: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "fine_att",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Fine<br />(Att)</div>,
        width: 65,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text style={{ fontSize: 11 }}>{compactMoney(r.fine_deduction)}</Typography.Text>
        ),
      },
      {
        key: "fine_adv",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Fine/<br />Adv.</div>,
        width: 70,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <InputNumber
            size="small"
            min={0}
            controls={false}
            value={r.fine_adv_extra}
            style={{ width: 60 }}
            onChange={(v) => updateRow(r.employee_db_id, { fine_adv_extra: Number(v ?? 0) })}
          />
        ),
      },
      {
        key: "net",
        title: <div style={{ fontSize: 10, lineHeight: 1.05, textAlign: "right" }}>Net<br />Payable</div>,
        width: 85,
        align: "right",
        render: (_: unknown, r: Payroll2Row) => (
          <Typography.Text strong style={{ fontSize: 11, color: r.net_pay >= 0 ? "#52c41a" : "#ff4d4f" }}>
            {compactMoney(r.net_pay)}
          </Typography.Text>
        ),
      },
      {
        key: "remarks",
        title: <div style={{ fontSize: 10, lineHeight: 1.05 }}>Remarks/<br />Signature</div>,
        width: 90,
        render: (_: unknown, r: Payroll2Row) => (
          <Input
            size="small"
            value={r.remarks ?? ""}
            style={{ fontSize: 11 }}
            onChange={(e) => updateRow(r.employee_db_id, { remarks: e.target.value })}
          />
        ),
      },
      {
        key: "bank_cash",
        title: <div style={{ fontSize: 10, lineHeight: 1.05 }}>Bank/<br />Cash</div>,
        width: 100,
        render: (_: unknown, r: Payroll2Row) => (
          <Input
            size="small"
            value={r.bank_cash ?? ""}
            style={{ fontSize: 11 }}
            onChange={(e) => updateRow(r.employee_db_id, { bank_cash: e.target.value })}
          />
        ),
      },
    ];

    const filteredOtherCols = otherCols.filter((c) => visibleColumnKeys.includes(String(c.key ?? "")));
    const totalCols = 1 + filteredOtherCols.length;

    const srCol: ColumnsType<Payroll2DisplayRow>[number] = {
      key: "sr",
      title: "#",
      width: 45,
      fixed: "left",
      render: (_: unknown, r: Payroll2DisplayRow) => {
        if (r.__rowType === "title") {
          return {
            children: (
              <Typography.Text strong style={{ fontSize: 13 }}>
                {r.__groupName || ""}
              </Typography.Text>
            ),
            props: { colSpan: totalCols },
          };
        }
        if (r.__rowType === "subtotal") {
          return (
            <Typography.Text strong style={{ fontSize: 11 }}>
              Subtotal ({r.__subtotalEmployees || 0})
            </Typography.Text>
          );
        }
        // Show serial number for employees (client name is now in title row above)
        return <Typography.Text style={{ fontSize: 11 }}>{r.__displayNo || ""}</Typography.Text>;
      },
    };

    const cols: ColumnsType<Payroll2DisplayRow> = [srCol, ...filteredOtherCols];

    return cols.map((c, idx) => {
      if (idx === 0) return c;

      const origRender = c.render;
      const key = String(c.key ?? "");

      return {
        ...c,
        onCell: (r: Payroll2DisplayRow) => {
          // Title rows span full width, subtotal rows use individual columns
          if (r.__rowType === "title") {
            return { colSpan: totalCols };
          }
          return {};
        },
        render: (value: unknown, r: Payroll2DisplayRow, renderIndex: number): ReactNode => {
          if (r.__rowType === "title" || r.__rowType === "group") return null;

          if (r.__rowType === "subtotal") {
            const num = (v: unknown) => Number(v || 0);
            const money = (v: unknown) => compactMoney(num(v));

            switch (key) {
              case "base_salary":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.base_salary)}</Typography.Text>;
              case "presents_total":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.presents_total)}</Typography.Text>;
              case "paid_leave_days":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.paid_leave_days)}</Typography.Text>;
              case "pre_days":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.pre_days)}</Typography.Text>;
              case "cur_days":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.cur_days)}</Typography.Text>;
              case "leave_encashment":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.leave_encashment_days)}</Typography.Text>;
              case "total_days":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.total_days)}</Typography.Text>;
              case "total_salary":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.total_salary)}</Typography.Text>;
              case "ot_days":
                return <Typography.Text style={{ fontSize: 11 }}>{num(r.ot_days)}</Typography.Text>;
              case "ot_rate":
                return <Typography.Text style={{ fontSize: 11 }}>-</Typography.Text>;
              case "ot_amount":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.overtime_pay)}</Typography.Text>;
              case "allow_other":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.allow_other)}</Typography.Text>;
              case "gross":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.gross_pay)}</Typography.Text>;
              case "eobi":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.eobi)}</Typography.Text>;
              case "tax":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.tax)}</Typography.Text>;
              case "fine_att":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.fine_deduction)}</Typography.Text>;
              case "fine_adv":
                return <Typography.Text style={{ fontSize: 11 }}>{money(r.fine_adv)}</Typography.Text>;
              case "net":
                return <Typography.Text strong style={{ fontSize: 11 }}>{money(r.net_pay)}</Typography.Text>;
              default:
                return <Typography.Text style={{ fontSize: 11 }} />;
            }
          }

          if (origRender) {
            return (origRender as unknown as (v: unknown, rr: Payroll2DisplayRow, i: number) => ReactNode)(
              value,
              r,
              renderIndex
            );
          }

          return value as ReactNode;
        },
      };
    });
  }, [updateRow, visibleColumnKeys]);


  return (
    <>
      {msgCtx}
      <Card variant="borderless" className="flash-card" style={{ overflowX: "hidden" }} styles={{ body: { padding: 12 } }}>
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          <Row gutter={[12, 12]} align="middle">
            <Col flex="auto">
              <Space size={10} wrap>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Payroll 2
                </Typography.Title>
                <Typography.Text type="secondary">
                  {fromDate.format("YYYY-MM-DD")} to {toDate.format("YYYY-MM-DD")}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Space wrap>
                <Button icon={<ReloadOutlined />} onClick={() => void load()}>
                  Refresh
                </Button>
                <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => void saveSheet()}>
                  Save
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={() => exportCsv()}>
                  Export CSV
                </Button>
                <Button icon={<FilePdfOutlined />} onClick={() => void exportPdf()}>
                  Export PDF
                </Button>
              </Space>
            </Col>
          </Row>

          <Card variant="outlined" className="flash-card" styles={{ body: { padding: 12 } }}>
            <Row gutter={[12, 12]} align="middle">
              <Col span={24}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
                  <DatePicker.RangePicker
                    value={[fromDate, toDate] as [Dayjs, Dayjs]}
                    onChange={(r) => {
                      const a = r?.[0] ?? defaultRange[0];
                      const b = r?.[1] ?? a;
                      setFromDate(a);
                      setToDate(b);
                    }}
                    style={{ width: 320 }}
                  />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee"
                    allowClear
                    prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
                    style={{ width: 320 }}
                  />
                  <Select
                    value={bankFilter}
                    onChange={setBankFilter}
                    placeholder="Filter by Bank"
                    allowClear
                    style={{ width: 200 }}
                    options={uniqueBanks.map(bank => ({ label: bank, value: bank }))}
                  />
                  <Select
                    value={clientFilter}
                    onChange={setClientFilter}
                    placeholder="Filter by Client"
                    allowClear
                    showSearch
                    style={{ width: 240 }}
                    options={uniqueClients.map((c) => ({ label: c, value: c }))}
                    filterOption={(input, option) =>
                      String(option?.label || "").toLowerCase().includes(input.toLowerCase())
                    }
                  />

                  <Popover
                    content={columnsFilterContent}
                    title="Columns"
                    trigger="click"
                    placement="bottomRight"
                  >
                    <Button icon={<SettingOutlined />}>
                      Columns
                    </Button>
                  </Popover>
                </div>
              </Col>
            </Row>
          </Card>

          <Row gutter={[12, 12]}>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Total Gross"
                  value={summary.totalGross}
                  precision={0}
                  prefix="Rs"
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Total Net"
                  value={summary.totalNet}
                  precision={0}
                  prefix="Rs"
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Employees"
                  value={summary.employees}
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Total Presents"
                  value={summary.totalPresents}
                  styles={{
                    content: { color: "#52c41a", fontSize: 16, lineHeight: "20px" }
                  }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Working Days"
                  value={summaryData?.working_days ?? 0}
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="OT Pay"
                  value={summary.totalOtPay}
                  precision={0}
                  prefix="Rs"
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card size="small" variant="outlined" className="flash-card" styles={{ body: { padding: 10 } }}>
                <Statistic
                  title="Total OT Days"
                  value={summary.totalOtDays}
                  styles={{ content: { fontSize: 16, lineHeight: "20px" } }}
                />
              </Card>
            </Col>
          </Row>

          <Table<Payroll2DisplayRow>
            rowKey={(r) => r.__key}
            columns={columns}
            dataSource={pagedRowsWithGroups}
            loading={loading}
            tableLayout="fixed"
            style={{ width: "100%" }}
            scroll={{ x: 2050, y: 600 }}
            pagination={false}
            size="small"
            bordered
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredRows.length}
              showSizeChanger
              pageSizeOptions={[10, 20, 50, 100, 200]}
              showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} employees`}
              onChange={(nextPage, nextPageSize) => {
                setPage(nextPage);
                if (typeof nextPageSize === "number" && nextPageSize !== pageSize) {
                  setPageSize(nextPageSize);
                  setPage(1);
                }
              }}
            />
          </div>
        </Space>
      </Card>
    </>
  );
}
