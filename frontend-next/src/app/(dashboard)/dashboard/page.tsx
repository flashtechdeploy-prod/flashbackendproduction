"use client";

import {
  AppstoreOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
  DollarOutlined,
  HomeOutlined,
  FileTextOutlined,
  ShopOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Row, Space, Statistic, Typography, message, Card } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

type EmployeeListResponse = {
  employees: unknown[];
  total: number;
};

export default function DashboardHomePage() {
  const [msg, msgCtx] = message.useMessage();
  const { has } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  const [counts, setCounts] = useState<{
    totalEmployees: number;
    totalClients: number;
    activeEmployees: number;
    employeesOnLeave: number;
    generalInventory: number;
    restrictedInventory: number;
    vehicles: number;
    advances: number;
    expenses: number;
    users: number;
  }>({ 
    totalEmployees: 0, 
    totalClients: 0, 
    activeEmployees: 0, 
    employeesOnLeave: 0,
    generalInventory: 0, 
    restrictedInventory: 0,
    vehicles: 0,
    advances: 0,
    expenses: 0,
    users: 0 
  });

  const [contractStats, setContractStats] = useState<{
    activeContracts: number;
    monthlyRevenue: number;
    growthRate: number;
    monthlyData: { month: string; contracts: number; revenue: number }[];
    contractClientMap: { [key: number]: string };
  }>({
    activeContracts: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    monthlyData: [],
    contractClientMap: {}
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const canClients = has("clients:view");
      const canFleet = has("fleet:view");
      const canInv = has("inventory:view");
      const canAccounts = has("accounts:full");
      const canAdmin = has("rbac:admin");

      // Only call existing API endpoints
      const [empList, clients, vehicles, generalItems, restrictedItems, expensesData] = await Promise.all([
        api.get<EmployeeListResponse>("/api/employees2", { query: { skip: 0, limit: 1, with_total: true } }),
        canClients ? api.get<unknown[]>("/api/client-management/clients") : Promise.resolve([]),
        canFleet ? api.get<unknown[]>("/api/vehicles/", { query: { limit: 5000 } }) : Promise.resolve([]),
        canInv ? api.get<unknown[]>("/api/general-inventory/items") : Promise.resolve([]),
        canInv ? api.get<unknown[]>("/api/restricted-inventory/items") : Promise.resolve([]),
        canAccounts ? api.get<any>("/api/expenses/summary/monthly", { query: { month } }) : Promise.resolve({ total_expenses: 0 }),
      ]);

      const employeesCount = Number(empList?.total ?? 0);
      const clientsCount = Array.isArray(clients) ? clients.length : 0;
      const vehiclesCount = Array.isArray(vehicles) ? vehicles.length : 0;
      const generalCount = Array.isArray(generalItems) ? generalItems.length : 0;
      const restrictedCount = Array.isArray(restrictedItems) ? restrictedItems.length : 0;
      const expensesTotal = Number(expensesData?.total_expenses ?? 0);

      // Process contract data by fetching contracts for each client
      let allContracts: any[] = [];
      let contractClientMap: { [key: number]: string } = {};
      
      if (canClients && Array.isArray(clients)) {
        try {
          // Fetch contracts for each client (this is the correct approach)
          const contractPromises = clients.map((client: any) => 
            api.get<any[]>(`/api/client-management/clients/${client.id}/contracts`)
              .then(contracts => {
                // Map contract IDs to client names
                contracts.forEach((contract: any) => {
                  contractClientMap[contract.id] = client.name || `Client ${client.id}`;
                  console.log('Contract:', contract); // Debug log
                });
                return contracts;
              })
              .catch(() => [])
          );
          const contractResults = await Promise.all(contractPromises);
          allContracts = contractResults.flat();
          
          // Debug: Log all contracts
          console.log('All contracts:', allContracts);
          console.log('Active contracts:', allContracts.filter(c => c.status === "Active"));
        } catch (e) {
          console.error("Failed to load contracts:", e);
        }
      }

      const activeContracts = allContracts.filter((c: any) => c.status === "Active").length;
      const activeContractsList = allContracts.filter((c: any) => c.status === "Active");
      const totalMonthlyRevenue = activeContractsList.reduce((sum: number, c: any) => sum + (c.monthly_cost || 0), 0);
      
      // Debug: Log revenue calculation
      console.log('Active contracts list:', activeContractsList);
      console.log('Revenue calculation:', activeContractsList.map(c => ({ id: c.id, monthly_cost: c.monthly_cost })));
      console.log('Total revenue:', totalMonthlyRevenue);

      // Calculate monthly data for the last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = dayjs().subtract(i, 'month');
        const monthName = monthDate.format('MMM');
        const monthContracts = allContracts.filter((c: any) => 
          dayjs(c.start_date).isSame(monthDate, 'month') && c.status === "Active"
        ).length;
        const monthRevenue = allContracts
          .filter((c: any) => dayjs(c.start_date).isSame(monthDate, 'month') && c.status === "Active")
          .reduce((sum: number, c: any) => sum + (c.monthly_cost || 0), 0);
        
        monthlyData.push({
          month: monthName,
          contracts: monthContracts,
          revenue: monthRevenue
        });
      }

      // Calculate growth rate (comparing current month with previous month)
      const currentMonthContracts = monthlyData[monthlyData.length - 1]?.contracts || 0;
      const previousMonthContracts = monthlyData[monthlyData.length - 2]?.contracts || 0;
      const growthRate = previousMonthContracts > 0 
        ? Math.round(((currentMonthContracts - previousMonthContracts) / previousMonthContracts) * 100)
        : 0;

      setContractStats({
        activeContracts,
        monthlyRevenue: totalMonthlyRevenue,
        growthRate,
        monthlyData,
        contractClientMap
      });

      setCounts({
        totalEmployees: employeesCount,
        totalClients: clientsCount,
        activeEmployees: 0, // Set to 0 as requested
        employeesOnLeave: 0, // Set to 0 as requested
        generalInventory: generalCount,
        restrictedInventory: restrictedCount,
        vehicles: vehiclesCount,
        advances: 0, // Set to 0 until API exists
        expenses: expensesTotal,
        users: 7, // Hardcoded value until users API exists
      });
    } catch (e: unknown) {
      msg.error(errorMessage(e, "Failed to load dashboard"));
      setCounts({ 
        totalEmployees: 0, 
        totalClients: 0, 
        activeEmployees: 0, 
        employeesOnLeave: 0,
        generalInventory: 0, 
        restrictedInventory: 0,
        vehicles: 0,
        advances: 0,
        expenses: 0,
        users: 0 
      });
    } finally {
      setLoading(false);
    }
  }, [has, msg, month]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      {msgCtx}
      <Space orientation="vertical" size={20} style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        {/* Header */}
        <Row gutter={[10, 10]} align="middle" style={{ width: "100%" }}>
          <Col xs={24} md={14} style={{ minWidth: 0 }}>
            <Space orientation="vertical" size={0} style={{ width: "100%" }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Dashboard
              </Typography.Title>
              <Typography.Text type="secondary">Key operational indicators</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
              <DatePicker
                picker="month"
                value={dayjs(month + "-01")}
                onChange={(d) => setMonth((d ?? dayjs()).format("YYYY-MM"))}
                style={{ width: "100%", maxWidth: 180 }}
              />
              <Button icon={<ReloadOutlined />} onClick={() => void load()} loading={loading} />
            </Space>
          </Col>
        </Row>

        {/* KPI Cards - Small with colored icons and light fonts - All in one row */}
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {/* Total Clients */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/client-management")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-4-4z"/>
                  <path d="M14 2v6l4-4"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>Total Clients</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>{counts.totalClients || 0}</Typography.Text>
            </Card>
          </Col>

          {/* Total Employees */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/employees2")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>Total Employees</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>{counts.totalEmployees || 0}</Typography.Text>
            </Card>
          </Col>

          {/* General Inventory */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/general-inventory")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AF52DE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7h-9"/>
                  <path d="M14 17H5"/>
                  <circle cx="17" cy="17" r="3"/>
                  <path d="M3 3v18h18"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>General Inventory</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>{counts.generalInventory || 0}</Typography.Text>
            </Card>
          </Col>

          {/* Restricted Inventory */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/restricted-inventory")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v4"/>
                  <path d="M10 12h4"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>Restricted Items</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>{counts.restrictedInventory || 0}</Typography.Text>
            </Card>
          </Col>

          {/* Vehicles */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/vehicles")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
                  <path d="M5 17h14"/>
                  <path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
                  <path d="M9 12V6"/>
                  <path d="M15 12V6"/>
                  <path d="M3 9h18"/>
                  <path d="M3 6h18"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>Vehicles</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>{counts.vehicles || 0}</Typography.Text>
            </Card>
          </Col>

          {/* Expenses */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{ 
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e8e8e8",
                background: "#FAFAFA",
                height: "140px"
              }}
              bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onClick={() => router.push("/expenses")}
            >
              <div style={{
                width: "40px",
                height: "40px",
                marginBottom: "12px",
                position: "relative"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <Typography.Title level={5} style={{ margin: 0, color: "#666666", fontWeight: 400 }}>Expenses</Typography.Title>
              <Typography.Text style={{ fontSize: "20px", fontWeight: 300, color: "#333333" }}>PKS {counts.expenses.toLocaleString()}</Typography.Text>
            </Card>
          </Col>
        </Row>

        {/* Centered Small Chart */}
        <Row justify="center" style={{ marginTop: "24px" }}>
          <Col xs={24} md={16} lg={12}>
            <Card
              style={{ 
                borderRadius: "12px",
                border: "2px solid #e8e8e8",
                background: "transparent"
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Typography.Title level={4} style={{ margin: 0, color: "#1a1a1a", fontWeight: 600, marginBottom: "24px", textAlign: "center" }}>Client Contracts Overview</Typography.Title>
              
              {/* Small Gradient Background Chart with Circular Progress */}
              <div style={{ 
                height: "240px", 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                borderRadius: "12px", 
                padding: "20px",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Decorative Elements */}
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  pointerEvents: "none"
                }} />
                
                <div style={{ 
                  position: "relative", 
                  zIndex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  {/* Circular Progress Section */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    height: "140px"
                  }}>
                    {/* Circular Progress */}
                    <div style={{ 
                      position: "relative",
                      width: "80px",
                      height: "80px"
                    }}>
                      <svg style={{ 
                        width: "100%", 
                        height: "100%", 
                        transform: "rotate(-90deg)" 
                      }}>
                        {/* Background Circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke="white"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - (contractStats.activeContracts / Math.max(contractStats.activeContracts + 1, 1)))}`}
                          style={{ transition: "all 0.5s ease" }}
                        />
                      </svg>
                      {/* Center Text */}
                      <div style={{ 
                        position: "absolute", 
                        top: "50%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)", 
                        textAlign: "center",
                        color: "white"
                      }}>
                        <div style={{ fontSize: "18px", fontWeight: "600", lineHeight: "1" }}>
                          {contractStats.activeContracts}
                        </div>
                        <div style={{ fontSize: "8px", opacity: 0.8, marginTop: "1px" }}>
                          CONTRACTS
                        </div>
                      </div>
                    </div>
                    
                    {/* Mini Line Chart on the side */}
                    <div style={{ 
                      marginLeft: "20px",
                      width: "80px",
                      height: "40px",
                      position: "relative"
                    }}>
                      {/* Sparkline */}
                      <svg style={{ 
                        width: "100%", 
                        height: "100%" 
                      }}>
                        <polyline
                          fill="none"
                          stroke="rgba(255,255,255,0.6)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={contractStats.monthlyData.map((data, index) => {
                            const x = (index / (contractStats.monthlyData.length - 1 || 1)) * 100;
                            const maxValue = Math.max(...contractStats.monthlyData.map(d => d.contracts), 1);
                            const y = 100 - ((data.contracts / maxValue) * 100);
                            return `${x},${y}%`;
                          }).join(' ')}
                        />
                        {/* Fill area under line */}
                        <polygon
                          fill="rgba(255,255,255,0.1)"
                          points={contractStats.monthlyData.map((data, index) => {
                            const x = (index / (contractStats.monthlyData.length - 1 || 1)) * 100;
                            const maxValue = Math.max(...contractStats.monthlyData.map(d => d.contracts), 1);
                            const y = 100 - ((data.contracts / maxValue) * 100);
                            return `${x},${y}%`;
                          }).join(' ') + ` 100,100 0,100`}
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* White Statistics Cards */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "stretch",
                    gap: "8px"
                  }}>
                    <div style={{ 
                      flex: 1,
                      background: "rgba(255,255,255,0.95)", 
                      borderRadius: "6px", 
                      padding: "8px",
                      textAlign: "center",
                      backdropFilter: "blur(10px)"
                    }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", lineHeight: "1" }}>
                        {contractStats.activeContracts}
                      </div>
                      <div style={{ fontSize: "7px", color: "#666", marginTop: "1px", letterSpacing: "0.5px" }}>
                        ACTIVE
                      </div>
                    </div>
                    <div style={{ 
                      flex: 1,
                      background: "rgba(255,255,255,0.95)", 
                      borderRadius: "6px", 
                      padding: "8px",
                      textAlign: "center",
                      backdropFilter: "blur(10px)"
                    }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#34C759", lineHeight: "1" }}>
                        {contractStats.monthlyRevenue > 0 ? `PKS ${(contractStats.monthlyRevenue/1000).toFixed(0)}K` : "PKS 0"}
                      </div>
                      <div style={{ fontSize: "7px", color: "#666", marginTop: "1px", letterSpacing: "0.5px" }}>
                        REVENUE
                      </div>
                    </div>
                    <div style={{ 
                      flex: 1,
                      background: "rgba(255,255,255,0.95)", 
                      borderRadius: "6px", 
                      padding: "8px",
                      textAlign: "center",
                      backdropFilter: "blur(10px)"
                    }}>
                      <div style={{ 
                        fontSize: "14px", 
                        fontWeight: "600", 
                        color: contractStats.growthRate >= 0 ? "#34C759" : "#FF3B30",
                        lineHeight: "1"
                      }}>
                        {contractStats.growthRate >= 0 ? "+" : ""}{contractStats.growthRate}%
                      </div>
                      <div style={{ fontSize: "7px", color: "#666", marginTop: "1px", letterSpacing: "0.5px" }}>
                        GROWTH
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </>
  );
}
