// ==========================================
// 🇹🇭 ไฟล์: /src/views/officer/OfficerDashboard.tsx
// คำอธิบาย: แผงควบคุมสถิติหลักของเจ้าหน้าที่คุมประพฤติ (Officer Dashboard)
// โครงสร้างไฟล์:
//   - ส่วนนำเข้าข้อมูลและไลบรารีสถิติ (Imports, Recharts)
//   - การคำนวณและข้อมูลจำลองรายเดือนและผลลัพธ์ (Statistics Data)
//   - แผงสถิติรวมแบบตัวเลข (Overview Counter Stats Cards)
//   - กราฟแนวโน้มคดีรายเดือนและแผนภูมิสัดส่วนประเภทความผิด (Charts & Visualizations)
//   - รายการคดีความเคลื่อนไหวล่าสุดและการแจ้งเตือนสำคัญ (Recent Activities & Key Alerts)
// ==========================================

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  User, 
  CheckSquare, 
  FileText,
  Activity,
  HeartHandshake
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from "recharts";

export const OfficerDashboard: React.FC = () => {
  const { currentView, setCurrentView, emergencyRequests, updateEmergencyRequestStatus, probationers } = useApp();
  const [fiscalYear, setFiscalYear] = useState("ปีงบประมาณ 2567");
  const [notifiedCases, setNotifiedCases] = useState<string[]>([]);

  const dashboardMapContainerRef = useRef<HTMLDivElement>(null);
  const dashboardMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!dashboardMapContainerRef.current) return;
    if (dashboardMapRef.current) return; // Prevent double-initialization

    // Initialize Map centered on Thailand
    const map = L.map(dashboardMapContainerRef.current, {
      center: [13.4, 100.8],
      zoom: 5,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 14,
    });

    // Add CartoDB tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    dashboardMapRef.current = map;

    // High-risk areas to match the sidebar list
    const points = [
      { id: "bkk", name: "กรุงเทพมหานคร", coords: [13.7563, 100.5018], cases: "1,246 คน", pulseClass: "pulse-marker-red", color: "#EF4444" },
      { id: "non", name: "นนทบุรี", coords: [13.8591, 100.4908], cases: "892 คน", pulseClass: "pulse-marker-blue", color: "#3B82F6" },
      { id: "samut", name: "สมุทรปราการ", coords: [13.5991, 100.5968], cases: "745 คน", pulseClass: "pulse-marker-yellow", color: "#EAB308" },
      { id: "chon", name: "ชลบุรี", coords: [13.3611, 100.9847], cases: "623 คน", pulseClass: "pulse-marker-emerald", color: "#10B981" },
      { id: "song", name: "สงขลา", coords: [7.1898, 100.5954], cases: "512 คน", pulseClass: "pulse-marker-purple", color: "#8B5CF6" },
    ];

    points.forEach(p => {
      const icon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="${p.pulseClass}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(p.coords as L.LatLngExpression, { icon }).addTo(map);
      marker.bindPopup(`
        <div class="p-1 font-sans text-slate-900 text-[11px] leading-relaxed">
          <p class="font-extrabold flex items-center gap-1 text-[#0f2d59] text-xs">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${p.color}"></span>
            ${p.name}
          </p>
          <p class="text-[10px] text-slate-500 mt-1 font-bold">จำนวนผู้คุมประพฤติ: <span class="text-blue-600 font-black">${p.cases}</span></p>
        </div>
      `, {
        closeButton: false,
        offset: L.point(0, -5)
      });
    });

    // Cleanup on unmount
    return () => {
      if (dashboardMapRef.current) {
        dashboardMapRef.current.remove();
        dashboardMapRef.current = null;
      }
    };
  }, []);

  const handleSendAlert = (caseId: string) => {
    setNotifiedCases(prev => [...prev, caseId]);
    alert("📢 ส่งหนังสือเตือนวินัยอัตโนมัติสำเร็จ! ส่งสำเนาคำเตือนไปทาง SMS มือถือ และลงทะเบียนบันทึกพ้นทัณฑ์บนขัดรายงานตัวเรียบร้อย");
  };

  // Monthly trends mock data matching the line chart in Image 1
  const monthlyData = [
    { name: "ม.ค.", "ผู้ถูกคุมประพฤติ": 8500, "รายงานตัว": 6000, "ขาดนัด": 4000, "บริการสังคม (ชม.)": 1900 },
    { name: "ก.พ.", "ผู้ถูกคุมประพฤติ": 8200, "รายงานตัว": 5900, "ขาดนัด": 4300, "บริการสังคม (ชม.)": 1800 },
    { name: "มี.ค.", "ผู้ถูกคุมประพฤติ": 8300, "รายงานตัว": 5600, "ขาดนัด": 3800, "บริการสังคม (ชม.)": 1850 },
    { name: "เม.ย.", "ผู้ถูกคุมประพฤติ": 8900, "รายงานตัว": 6100, "ขาดนัด": 4100, "บริการสังคม (ชม.)": 1650 },
    { name: "พ.ค.", "ผู้ถูกคุมประพฤติ": 8600, "รายงานตัว": 5800, "ขาดนัด": 3800, "บริการสังคม (ชม.)": 1650 },
    { name: "มิ.ย.", "ผู้ถูกคุมประพฤติ": 8800, "รายงานตัว": 5900, "ขาดนัด": 3600, "บริการสังคม (ชม.)": 1600 },
    { name: "ก.ค.", "ผู้ถูกคุมประพฤติ": 8400, "รายงานตัว": 5950, "ขาดนัด": 3800, "บริการสังคม (ชม.)": 1500 },
    { name: "ส.ค.", "ผู้ถูกคุมประพฤติ": 8700, "รายงานตัว": 5700, "ขาดนัด": 3600, "บริการสังคม (ชม.)": 1550 },
    { name: "ก.ย.", "ผู้ถูกคุมประพฤติ": 8500, "รายงานตัว": 5850, "ขาดนัด": 3900, "บริการสังคม (ชม.)": 1300 },
    { name: "ต.ค.", "ผู้ถูกคุมประพฤติ": 8800, "รายงานตัว": 5900, "ขาดนัด": 3750, "บริการสังคม (ชม.)": 1400 },
    { name: "พ.ย.", "ผู้ถูกคุมประพฤติ": 8900, "รายงานตัว": 6000, "ขาดนัด": 3750, "บริการสังคม (ชม.)": 1450 },
    { name: "ธ.ค.", "ผู้ถูกคุมประพฤติ": 9100, "รายงานตัว": 6200, "ขาดนัด": 3800, "บริการสังคม (ชม.)": 1350 },
  ];

  // Donut 1: Gender Statistics
  const genderData = [
    { name: "ชาย", value: 91.2, count: 1130, color: "#1E40AF" },
    { name: "หญิง", value: 8.8, count: 116, color: "#EF4444" }
  ];

  // Donut 2: Case Types
  const caseTypeData = [
    { name: "คดีอาญา", value: 68.3, color: "#1D4ED8" },
    { name: "คดีจราจร", value: 18.7, color: "#3B82F6" },
    { name: "คดีความผิดอื่นๆ", value: 8.9, color: "#60A5FA" },
    { name: "คดีเศรษฐกิจ", value: 4.1, color: "#93C5FD" }
  ];

  // Donut 3: Probation Status
  const statusData = [
    { name: "คุมประพฤติอยู่", value: 8742, color: "#1E40AF" },
    { name: "ใกล้สิ้นสุด", value: 2145, color: "#60A5FA" },
    { name: "สิ้นสุดแล้ว", value: 1959, color: "#10B981" }
  ];

  // Monthly report-in compliance data (for Bar Chart visualization)
  const monthlyReportStatusData = [
    { name: "ม.ค.", "รายงานตัวตรงกำหนด": 520, "รายงานตัวล่าช้า": 45, "ขาดรายงานตัว": 38 },
    { name: "ก.พ.", "รายงานตัวตรงกำหนด": 540, "รายงานตัวล่าช้า": 32, "ขาดรายงานตัว": 41 },
    { name: "มี.ค.", "รายงานตัวตรงกำหนด": 500, "รายงานตัวล่าช้า": 55, "ขาดรายงานตัว": 29 },
    { name: "เม.ย.", "รายงานตัวตรงกำหนด": 560, "รายงานตัวล่าช้า": 42, "ขาดรายงานตัว": 35 },
    { name: "พ.ค.", "รายงานตัวตรงกำหนด": 580, "รายงานตัวล่าช้า": 30, "ขาดรายงานตัว": 22 },
    { name: "มิ.ย.", "รายงานตัวตรงกำหนด": 610, "รายงานตัวล่าช้า": 25, "ขาดรายงานตัว": 15 },
  ];

  // Cases that missed reporting in Songkhla province
  const SONGKHLA_MISSED_CASES = [
    {
      id: "PB6705-123458",
      name: "นายทวีศักดิ์ มั่นคง",
      subdistrict: "ต.บ่อยาง อ.เมืองสงขลา",
      missedCount: 2,
      lastAttempt: "20 มิถุนายน 2569",
      status: "ขาดรายงานตัว",
      phone: "089-761-xxxx",
      riskLevel: "สูง"
    },
    {
      id: "PB6705-123490",
      name: "นายรณชัย ศรีสุข",
      subdistrict: "ต.พะวง อ.เมืองสงขลา",
      missedCount: 1,
      lastAttempt: "18 มิถุนายน 2569",
      status: "ขาดรายงานตัว",
      phone: "081-342-xxxx",
      riskLevel: "ปานกลาง"
    },
    {
      id: "PB6705-123512",
      name: "นายวิศรุต สุวรรณ",
      subdistrict: "ต.หาดใหญ่ อ.หาดใหญ่",
      missedCount: 3,
      lastAttempt: "10 มิถุนายน 2569",
      status: "พ้นกำหนดเฉียบพลัน",
      phone: "082-995-xxxx",
      riskLevel: "สูงมาก"
    }
  ];

  // Age groups mock values (bar chart)
  const ageGroups = [
    { range: "ต่ำกว่า 20 ปี", percent: "8.5%", width: "w-[8.5%]" },
    { range: "20 - 30 ปี", percent: "34.2%", width: "w-[34.2%]" },
    { range: "31 - 40 ปี", percent: "32.7%", width: "w-[32.7%]" },
    { range: "31 - 50 ปี", percent: "17.6%", width: "w-[17.6%]" },
    { range: "มากกว่า 50 ปี", percent: "7.0%", width: "w-[7.0%]" }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-400 block">จำนวนผู้ถูกคุมประพฤติ</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#0f2d59]">12,846</span>
              <span className="text-xs text-slate-500 font-bold">คน</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center">
              ↑ 8.5% <span className="text-slate-400 font-normal ml-1">จากเดือนที่แล้ว</span>
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-400 block">จำนวนผู้รายงานตัววันนี้</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#0f2d59]">1,246</span>
              <span className="text-xs text-slate-500 font-bold">คน</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center">
              ↑ 12.3% <span className="text-slate-400 font-normal ml-1">จากเมื่อวาน</span>
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-400 block">ผู้ขาดนัดวันนี้</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#0f2d59]">86</span>
              <span className="text-xs text-slate-500 font-bold">คน</span>
            </div>
            <span className="text-[10px] text-green-500 font-bold flex items-center">
              ↓ 5.2% <span className="text-slate-400 font-normal ml-1">จากเมื่อวาน</span>
            </span>
          </div>
          <div className="p-4 bg-red-50 text-red-500 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-400 block">ชั่วโมงบริการสังคมรวม</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#0f2d59]">24,356</span>
              <span className="text-xs text-slate-500 font-bold">ชม.</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center">
              ↑ 15.7% <span className="text-slate-400 font-normal ml-1">จากเดือนที่แล้ว</span>
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid for Monthly Line Chart & Risk Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Line Chart (8 columns on desktop) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0f2d59]">สถิติการคุมประพฤติรายเดือน</h3>
            <div className="relative">
              <button className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700">
                <span>{fiscalYear}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B", fontWeight: "bold" }} stroke="#E2E8F0" />
                <YAxis domain={[0, 10000]} tick={{ fontSize: 10, fill: "#64748B", fontWeight: "bold" }} stroke="#E2E8F0" />
                <Tooltip />
                <Line type="monotone" dataKey="ผู้ถูกคุมประพฤติ" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="รายงานตัว" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ขาดนัด" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="บริการสังคม (ชม.)" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Line legends */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-bold text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span>ผู้ถูกคุมประพฤติ</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>รายงานตัว</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>ขาดนัด</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>บริการสังคม (ชม.)</span>
            </div>
          </div>
        </div>

        {/* Heat Map of Risk areas (5 columns on desktop) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          {/* Styles Injection for pulsing markers & Leaflet popups */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <style>{`
            .pulse-marker-red {
              position: relative;
              width: 14px;
              height: 14px;
            }
            .pulse-marker-red::before {
              content: '';
              position: absolute;
              top: -13px;
              left: -13px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(239, 68, 68, 0.5);
              animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .pulse-marker-red::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #ef4444;
              border: 2.5px solid white;
              box-shadow: 0 0 10px rgba(239, 68, 68, 0.9);
              animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
            }

            .pulse-marker-blue {
              position: relative;
              width: 14px;
              height: 14px;
            }
            .pulse-marker-blue::before {
              content: '';
              position: absolute;
              top: -13px;
              left: -13px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(59, 130, 246, 0.5);
              animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .pulse-marker-blue::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #3b82f6;
              border: 2.5px solid white;
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.9);
              animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
            }

            .pulse-marker-yellow {
              position: relative;
              width: 14px;
              height: 14px;
            }
            .pulse-marker-yellow::before {
              content: '';
              position: absolute;
              top: -13px;
              left: -13px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(234, 179, 8, 0.5);
              animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .pulse-marker-yellow::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #eab308;
              border: 2.5px solid white;
              box-shadow: 0 0 10px rgba(234, 179, 8, 0.9);
              animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
            }

            .pulse-marker-emerald {
              position: relative;
              width: 14px;
              height: 14px;
            }
            .pulse-marker-emerald::before {
              content: '';
              position: absolute;
              top: -13px;
              left: -13px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(16, 185, 129, 0.5);
              animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .pulse-marker-emerald::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #10b981;
              border: 2.5px solid white;
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.9);
              animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
            }

            .pulse-marker-purple {
              position: relative;
              width: 14px;
              height: 14px;
            }
            .pulse-marker-purple::before {
              content: '';
              position: absolute;
              top: -13px;
              left: -13px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(139, 92, 246, 0.5);
              animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .pulse-marker-purple::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #8b5cf6;
              border: 2.5px solid white;
              box-shadow: 0 0 10px rgba(139, 92, 246, 0.9);
              animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
            }

            @keyframes pulse-ring-anim {
              0% { transform: scale(0.25); opacity: 0.95; }
              80%, 100% { transform: scale(1.3); opacity: 0; }
            }
            @keyframes pulse-dot-anim {
              0% { transform: scale(0.8); }
              50% { transform: scale(1.2); }
              100% { transform: scale(0.8); }
            }
          `}</style>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#0f2d59]">Heat Map พื้นที่เสี่ยง</h3>
              <button
                onClick={() => setCurrentView("HEAT_MAP")}
                className="text-[10px] font-black text-[#1e40af] hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <span>ดูแบบเต็มจอ ➔</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Map of Thailand Representation - Interactive Leaflet Map */}
              <div className="md:col-span-7 relative w-full h-[280px] rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-100">
                <div 
                  ref={dashboardMapContainerRef} 
                  className="w-full h-full z-0 bg-slate-50"
                />
                <div className="absolute left-2.5 bottom-2.5 z-[1000] bg-slate-900/80 text-[8px] text-white px-2 py-1 rounded-md pointer-events-none font-bold">
                  📍 แผนที่แบบโต้ตอบ
                </div>
              </div>

              {/* Sidebar Listing of high risk zones */}
              <div className="md:col-span-5 space-y-3">
                <span className="text-[11.5px] font-black text-slate-700 block">พื้นที่ที่มีความเสี่ยงสูงสุด</span>
                
                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[9px] font-black">1</span>
                      <span className="text-[11px]">กรุงเทพมหานคร</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">1,246 คน</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-black">2</span>
                      <span className="text-[11px]">นนทบุรี</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">892 คน</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-[9px] font-black">3</span>
                      <span className="text-[11px]">สมุทรปราการ</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">745 คน</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-black">4</span>
                      <span className="text-[11px]">ชลบุรี</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">623 คน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-black">5</span>
                      <span className="text-[11px]">สงขลา</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">512 คน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map legend */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-bold">
            <span>ระดับความเสี่ยง</span>
            <div className="flex items-center space-x-3.5">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span>ต่ำ</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                <span>ปานกลาง</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block" />
                <span>สูง</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
                <span>สูงมาก</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 🇹🇭 แดชบอร์ดสรุปสถิติผู้ขาดรายงานตัวและกราฟวิเคราะห์รายเดือน (Songkhla Compliance Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* กราฟแท่งแสดงสถานะการรายงานตัวรายเดือน (Bar Chart Data Visualization) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-sm font-black text-[#0f2d59]">แผนภูมิวิเคราะห์สถานะรายงานตัวรายเดือน (Monthly Compliance Chart)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">แสดงสัดส่วนผู้รายงานตัวตรงนัด ล่าช้า และผู้ขาดรายงานตัว เพื่อการวางแผนกำลังพล</p>
            </div>
            <span className="bg-blue-50 text-blue-600 font-extrabold text-[10px] py-1 px-2.5 rounded-lg">
              ข้อมูลสงขลาล่าสุด
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReportStatusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B", fontWeight: "bold" }} stroke="#E2E8F0" />
                <YAxis tick={{ fontSize: 10, fill: "#64748B", fontWeight: "bold" }} stroke="#E2E8F0" />
                <Tooltip />
                <Legend tick={{ fontSize: 10 }} />
                <Bar dataKey="รายงานตัวตรงกำหนด" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="รายงานตัวล่าช้า" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ขาดรายงานตัว" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ตารางเคสที่ค้างชำระ/ขาดรายงานตัวในพื้นที่สงขลา (Songkhla Overdue & Missed Case Tracker) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-sm font-black text-red-600">เคสค้างรายงานตัว / ขัดวินัยคุมประพฤติ (จังหวัดสงขลา)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">ระบบแจ้งเตือนอัตโนมัติแจ้งสิทธิ์ตามรายชื่อผู้ที่ขาดนัดรายงานตัวในพิกัดสงขลาล่าสุด</p>
              </div>
              <span className="bg-red-50 text-red-600 font-extrabold text-[10px] py-1 px-2.5 rounded-lg animate-pulse">
                ระวังพิเศษ
              </span>
            </div>

            <div className="space-y-3">
              {SONGKHLA_MISSED_CASES.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-800">{item.name}</span>
                      <span className="font-mono text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">{item.id}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg ${
                        item.riskLevel === "สูงมาก" ? "bg-red-100 text-red-600" : item.riskLevel === "สูง" ? "bg-orange-100 text-orange-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        ความเสี่ยง {item.riskLevel}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold space-x-2">
                      <span>📍 พิกัด: {item.subdistrict}</span>
                      <span>•</span>
                      <span className="text-red-500 font-bold">ขาดรายงานตัว {item.missedCount} ครั้ง</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSendAlert(item.id)}
                    disabled={notifiedCases.includes(item.id)}
                    className={`text-[10px] font-black py-1.5 px-3 rounded-lg transition-all shadow-xs ${
                      notifiedCases.includes(item.id)
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    }`}
                  >
                    {notifiedCases.includes(item.id) ? "✓ เตือนแล้ว" : "⚡ เตือนอัตโนมัติ"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-[10px] text-red-700 font-bold leading-relaxed flex items-center space-x-2 mt-3">
            <span>💡</span>
            <span><b>คำแนะนำเจ้าหน้าที่:</b> คุณสามารถคลิกส่งแจ้งเตือนอัตโนมัติ เพื่อยิงเอกสารทวงวินัยและข้อความแจ้งทางมือถือไปยังผู้มีรายชื่อนอกกำหนดทันที</span>
          </div>
        </div>

      </div>

      {/* Row of 4 Donut / Demographic Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Chart 1: Gender Statistics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">สถิติแยกตามเพศ</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={2} dataKey="value">
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs font-bold text-slate-700 pl-4 w-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-800" />
                  <span>ชาย</span>
                </span>
                <span>91.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>หญิง</span>
                </span>
                <span>8.8%</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 text-right">
                1,130 คน
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Age Demographics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2.5">สถิติแยกตามช่วงอายุ</h3>
          
          <div className="space-y-1.5 pt-1">
            {ageGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>{group.range}</span>
                  <span>{group.percent}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-blue-600 h-full rounded-full ${group.width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Offense Category Statistics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">ประเภทคดี</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={caseTypeData} cx="50%" cy="50%" innerRadius={28} outerRadius={40} paddingAngle={2} dataKey="value">
                    {caseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-[11px] font-bold text-slate-700 pl-4 w-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-800" />
                  <span>คดีอาญา</span>
                </span>
                <span>68.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>คดีจราจร</span>
                </span>
                <span>18.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>คดีความผิดอื่นๆ</span>
                </span>
                <span>8.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-200" />
                  <span>คดีเศรษฐกิจ</span>
                </span>
                <span>4.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Probation Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">สถานะการคุมประพฤติ</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={2} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-[12px] font-black text-blue-900 leading-none">12,846</span>
                <span className="text-[7.5px] text-slate-400 font-bold block">ทั้งหมด</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-bold text-slate-700 pl-4 w-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-950" />
                  <span className="text-[11px]">คุมประพฤติอยู่</span>
                </span>
                <span className="text-slate-500 text-[10.5px]">8,742 คน</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[11px]">ใกล้สิ้นสุด</span>
                </span>
                <span className="text-slate-500 text-[10.5px]">2,145 คน</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px]">สิ้นสุดแล้ว</span>
                </span>
                <span className="text-slate-500 text-[10.5px]">1,959 คน</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 🚨 รายการคำร้องขอช่วยเหลือฉุกเฉิน (SOS Emergency Requests Queue) */}
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-red-50 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚨</span>
            <div>
              <h3 className="text-sm font-black text-red-600">กล่องรับเรื่องร้องเรียนช่วยเหลือฉุกเฉินระดับสูง (SOS Live Queue)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">รับเรื่องแจ้งจากผู้ถูกคุมประพฤติที่มีปัญหาฉุกเฉินกะทันหัน หรือปัญหาการเดินทางในสงขลา</p>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 font-extrabold text-[10.5px] py-1 px-3 rounded-full flex items-center space-x-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>มีสายร้องขอ {emergencyRequests.filter(r => r.status === "รอการติดต่อกลับ").length} เคสใหม่</span>
          </span>
        </div>

        {emergencyRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-semibold">
            ไม่มีคำร้องขอความช่วยเหลือฉุกเฉินในขณะนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-red-200 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-800">{req.probationerName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === "รอการติดต่อกลับ" ? "bg-red-100 text-red-600 animate-pulse" : req.status === "กำลังดำเนินการ" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-semibold space-y-1">
                    <p className="text-slate-800"><b>เหตุขัดข้อง:</b> <span className="text-red-600 font-bold">{req.reason}</span></p>
                    <p className="leading-relaxed"><b>คำอธิบาย:</b> {req.details}</p>
                    <p className="text-slate-400 text-[10px]"><b>แจ้งเมื่อ:</b> {req.timestamp} • 📍 พิกัด GPS: {req.location.lat.toFixed(4)}, {req.location.lng.toFixed(4)}</p>
                  </div>
                </div>

                {req.status !== "ช่วยเหลือแล้ว" && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                    {req.status === "รอการติดต่อกลับ" && (
                      <button
                        onClick={() => updateEmergencyRequestStatus(req.id, "กำลังดำเนินการ")}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                      >
                        📞 รับเรื่องประสานงาน
                      </button>
                    )}
                    <button
                      onClick={() => {
                        updateEmergencyRequestStatus(req.id, "ช่วยเหลือแล้ว");
                        alert(`✅ ทำการส่งพนักงานสงขลาเข้าไปช่วยเหลือคุณ ${req.probationerName} หรือติดต่อประสานงานเสร็จสิ้นแล้ว`);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                    >
                      ✓ บันทึกว่าช่วยเหลือแล้ว
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 4: Recent Activities, Important Alerts, and Today's Mission Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Recent Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#0f2d59] border-b border-slate-50 pb-2">กิจกรรมล่าสุด</h3>
          
          <div className="space-y-4 pt-1">
            {/* Activity 1 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_วสันต์" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#022c22"/><stop offset="100%" stop-color="#064e3b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_วสันต์)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="\'Sarabun\', sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ว</text></svg>')}`} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <span className="text-[12px] font-black text-slate-800 block">นายวสันต์ คำดี</span>
                  <span className="text-[10px] text-slate-400 block font-medium">รายงานตัวผ่าน Application</span>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-slate-400 shrink-0">08:30 น.</span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-black text-xs ring-2 ring-red-100">
                  ⚠️
                </div>
                <div>
                  <span className="text-[12px] font-black text-slate-800 block">นายทวีศักดิ์ มั่นคง</span>
                  <span className="text-[10px] text-red-500 block font-bold">ขาดการรายงานตัว</span>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-slate-400 shrink-0">07:45 น.</span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-xs ring-2 ring-emerald-100">
                  🌱
                </div>
                <div>
                  <span className="text-[12px] font-black text-slate-800 block">น.ส.สุภาภรณ์ ใจงาม</span>
                  <span className="text-[10px] text-slate-400 block font-medium">ทำงานบริการสังคม 6 ชม.</span>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-slate-400 shrink-0">08:15 น.</span>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-black text-xs ring-2 ring-blue-100">
                  🧪
                </div>
                <div>
                  <span className="text-[12px] font-black text-slate-800 block">นายพิชิต ชัยชนะ</span>
                  <span className="text-[10px] text-slate-400 block font-medium">ตรวจดี - ไม่พบสารเสพติด</span>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-slate-400 shrink-0">07:30 น.</span>
            </div>
          </div>
        </div>

        {/* Column 2: Important Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#0f2d59] border-b border-slate-50 pb-2">การแจ้งเตือนสำคัญ</h3>
          
          <div className="space-y-4 pt-1">
            {/* Alert 1 */}
            <div className="flex items-start space-x-4 bg-red-50/50 p-3 rounded-xl border border-red-100">
              <div className="p-2 bg-red-500 text-white rounded-lg shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[12px] font-black text-slate-800 block">ผู้ขาดนัดรายงานตัว</span>
                  <span className="text-red-500 font-black text-xs">86 ราย</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold leading-relaxed">
                  เพิ่มขึ้น 5 รายจากเมื่อวาน
                </p>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="flex items-start space-x-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[12px] font-black text-slate-800 block">ใกล้ครบกำหนดคุมประพฤติ</span>
                  <span className="text-amber-600 font-black text-xs">145 ราย</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold leading-relaxed">
                  ภายใน 7 วัน
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Today's Mission */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#0f2d59] border-b border-slate-50 pb-2">ภารกิจวันนี้</h3>
          
          <div className="space-y-3.5 pt-1 text-xs font-bold text-slate-700">
            {/* Mission 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="flex items-center space-x-3">
                <span className="text-emerald-500">✓</span>
                <span>รายงานตัวที่ต้องดำเนินการ</span>
              </span>
              <span className="text-slate-500 font-black">32 ราย</span>
            </div>

            {/* Mission 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="flex items-center space-x-3">
                <span className="text-emerald-500">✓</span>
                <span>ติดตามเยี่ยมบ้าน</span>
              </span>
              <span className="text-slate-500 font-black">8 ราย</span>
            </div>

            {/* Mission 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="flex items-center space-x-3">
                <span className="text-emerald-500">✓</span>
                <span>ตรวจสารเสพติด</span>
              </span>
              <span className="text-slate-500 font-black">15 ราย</span>
            </div>

            {/* Mission 4 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="flex items-center space-x-3">
                <span className="text-emerald-500">✓</span>
                <span>บริการสังคมที่นัดหมาย</span>
              </span>
              <span className="text-slate-500 font-black">6 ราย</span>
            </div>
          </div>
        </div>

      </div>

      {/* Blue wave banner with Quote */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 p-6 rounded-2xl border border-blue-800 text-center relative overflow-hidden shadow-md">
        {/* Stylized background lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 flex flex-col justify-between pointer-events-none">
          <div className="h-6 w-full bg-gradient-to-b from-white to-transparent" />
          <div className="h-6 w-full bg-gradient-to-t from-white to-transparent" />
        </div>

        <p className="text-white text-base md:text-lg font-bold tracking-wide">
          “ โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...<span className="text-yellow-400 font-extrabold text-lg md:text-xl">คุณทำได้</span> ”
        </p>
      </div>

    </div>
  );
};
