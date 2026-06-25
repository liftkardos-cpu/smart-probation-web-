import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LoginView } from "../views/LoginView";

// Probationer Views
import { ProbationerDashboard } from "../views/probationer/ProbationerDashboard";
import { ProbationerProfile } from "../views/probationer/ProbationerProfile";
import { SmartVolunteer } from "../views/probationer/SmartVolunteer";
import { QRCheckIn } from "../views/probationer/QRCheckIn";
import { ServiceHourTracker } from "../views/probationer/ServiceHourTracker";
import { ReStartJobHub } from "../views/probationer/ReStartJobHub";
import { NotificationCenter } from "../views/probationer/NotificationCenter";
import { AIAssistantChat } from "../views/probationer/AIAssistantChat";
import { OnlineReportForm } from "../views/probationer/OnlineReportForm";

// Officer Views
import { OfficerDashboard } from "../views/officer/OfficerDashboard";
import { OfficerEvaluate } from "../views/officer/OfficerEvaluate";
import { CaseClosedApprovals } from "../views/officer/CaseClosedApprovals";

// Partner Views
import { PartnerDashboard } from "../views/partner/PartnerDashboard";

// Secondary Fallbacks and Utilities
import { Calendar, ShieldAlert, CheckCircle, BarChart3, Settings, HelpCircle, UserCheck } from "lucide-react";

export const AppLayout: React.FC = () => {
  const { isLoggedIn, currentView, role, probationerProfile, setCurrentView } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not logged in, show beautiful Gov login view
  if (!isLoggedIn) {
    return <LoginView />;
  }

  // View routing switcher
  const renderCurrentViewContent = () => {
    switch (currentView) {
      
      // ==========================================
      // 1. PROBATIONER ROLE VIEWS
      // ==========================================
      case "DASHBOARD":
        return <ProbationerDashboard />;
      case "PROFILE":
      case "DOCUMENTS":
        return <ProbationerProfile />;
      case "TRACKER":
        return <ServiceHourTracker />;
      case "VOLUNTEER":
        return <SmartVolunteer />;
      case "ONLINE_REPORT":
        return <OnlineReportForm />;
      case "JOB_HUB":
        return <ReStartJobHub />;
      case "NOTIFICATIONS":
        return <NotificationCenter />;
      case "AI_ASSISTANT":
        return <AIAssistantChat />;
      case "SETTINGS":
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700">
            <div>
              <h3 className="text-base font-bold text-slate-800">ตั้งค่าการบัญชีความปลอดภัย (Disciplinary Security Settings)</h3>
              <p className="text-xs text-slate-400 mt-1">ตั้งค่าพินโค้ด, ลายนิ้วมือสแกนใบหน้า และการอนุญาตพิกัดจีพีเอสผ่านแอปพลิเคชัน</p>
            </div>
            
            <div className="space-y-4 max-w-md text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold block">สแกน Face ID เข้าสู่ระบบความเร็วสูง</span>
                  <span className="text-[10px] text-slate-400">ข้ามหน้ากรอกรหัสผ่านโดยใช้อัตลักษณ์ใบหน้าตนเอง</span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#cca43b] rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold block">เปิดรับสัญญานเตือนล่วงหน้าทางข้อความ SMS</span>
                  <span className="text-[10px] text-slate-400">เตือนวันนัดหมายรายงานตัว 3 วันล่วงหน้าอัตโนมัติ</span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#cca43b] rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold block">เปิดพิกัดบอกจีพีเอสแบบเบราว์เซอร์อัตโนมัติ</span>
                  <span className="text-[10px] text-slate-400">ใช้สิทธิ์เช็กพิกัดระยะทางกิจกรรมอาสาเพื่อบวกชั่วโมง</span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#cca43b] rounded cursor-pointer" />
              </div>
            </div>

            <button onClick={() => alert("💾 บันทึกการตั้งค่าสากลเรียบร้อย")} className="bg-[#1b439c] text-white py-2 px-5 rounded-xl text-xs font-bold transition-all shadow hover:bg-blue-700">
              บันทึกการตั้งค่า
            </button>
          </div>
        );

      // ==========================================
      // 2. OFFICER ROLE VIEWS
      // ==========================================
      case "OFFICER_DASHBOARD":
      case "CASE_MANAGEMENT":
        return <OfficerDashboard />;
      case "OFFICER_EVALUATE":
      case "VOLUNTEER_CONTROL":
        return <OfficerEvaluate />;
      case "OFFICER_CLEARANCE":
        return <CaseClosedApprovals />;
      
      // Officer Calendar Scheduler fallback (Page 12 menu)
      case "APPOINTMENT_MANAGEMENT":
        return (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">ปฏิทินตรวจนัดรายงานตัวพนักงาน</h3>
                <p className="text-xs text-slate-400">ปฏิทินส่วนกลางแสดงวันกำหนดรายงานตัวของผู้คุมประพฤติภายใต้การดูแล</p>
              </div>
              <button onClick={() => alert("➕ นัดหมายครั้งใหม่: ดึงข้อมูลแบบคำรองนัดตรวจปัสสาวะ/ตรวจแอลกอฮอล์รายบุคคล")} className="bg-[#1b439c] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all">
                + สร้างนัดหมายใหม่
              </button>
            </div>

            {/* Simulated Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1">
                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full block w-max uppercase font-bold">ขาดนัด</span>
                <span className="text-slate-800 block">นายสกล จอมพลัง</span>
                <span className="text-slate-400 text-[10px]">นัดรายงานตัวงวด 9 • 15 พ.ค. 2567</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full block w-max uppercase font-bold">ยืนยันแล้ว</span>
                <span className="text-slate-800 block">{probationerProfile.name}</span>
                <span className="text-slate-400 text-[10px]">นัดรายงานตัวครั้งที่ 9 • 20 พ.ค. 2567</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded-full block w-max uppercase font-bold">รอยืนยัน</span>
                <span className="text-slate-800 block">นางสาวสมใจ นึกงาม</span>
                <span className="text-slate-400 text-[10px]">นัดตรวจสารเสพติด • 22 พ.ค. 2567</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full block w-max uppercase font-bold">ยืนยันแล้ว</span>
                <span className="text-slate-800 block">นายกิตติ เกษมราษฎร์</span>
                <span className="text-slate-400 text-[10px]">นัดบำเพ็ญวัดพระธรรม • 25 พ.ค. 2567</span>
              </div>
            </div>
          </div>
        );

      // Officer Risk analysis fallback
      case "RISK_ASSESSMENT":
        return (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">ระบบประเมินดัชนีเฝ้าระวังความเสี่ยงประพฤติผิดซ้ำ (Risk Watch Index)</h3>
              <p className="text-xs text-slate-400 mt-1">คำนวณสถิติและอัตราการเสพสารซ้ำ ปริมาณชั่วโมงจิตอาสา และความตรงเวลาเพื่อป้องกันความเสี่ยงระดับประเทศ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Dial gauge indicator */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full ring-4 ring-emerald-500/10">
                  <span className="text-3xl font-extrabold text-emerald-600">8.45%</span>
                  <span className="absolute bottom-3 text-[9px] text-slate-400 uppercase font-bold">อัตราเสี่ยงของแผน</span>
                </div>
                <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow mt-4">
                  ระดับความเสี่ยง: ต่ำมาก (เกณฑ์ปลอดภัย)
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>ผู้ถูกคุมที่อยู่ในระดับเสี่ยงรุนแรง:</span>
                  <span className="text-red-600 font-extrabold">1 ราย (เฝ้าสังเกต)</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>ตรวจหาสารเสพติดเฉลี่ยรายงวด:</span>
                  <span className="text-emerald-600 font-extrabold">98.45% ปกติ</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span>ประสานพาสปอร์ตส่งเสริมร่วมงาน:</span>
                  <span className="text-[#cca43b] font-extrabold">15 ราย เข้าร่วมครบ</span>
                </div>
              </div>

            </div>
          </div>
        );

      case "ANALYTICS":
        return <OfficerDashboard />;

      // ==========================================
      // 3. PARTNER ROLE VIEWS
      // ==========================================
      case "PARTNER_DASHBOARD":
      case "ACTIVITY_MANAGEMENT":
      case "ATTENDANCE_VERIFICATION":
      case "PERFORMANCE_EVALUATION":
        return <PartnerDashboard />;

      default:
        return (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-400 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">กำลังดาวน์โหลดข้อมูลส่วนกลาง</h3>
            <p className="text-xs leading-relaxed max-w-sm mx-auto">
              หน้าเว็บหรือบริการ "{currentView}" สำหรับบทบาท {role} กำลังเตรียมเอกสารข้อมูลเชิงลึกในฐานระบบ
            </p>
            <button
              onClick={() => setCurrentView(role === "PROBATIONER" ? "DASHBOARD" : role === "OFFICER" ? "OFFICER_DASHBOARD" : "PARTNER_DASHBOARD")}
              className="bg-[#1b439c] text-white py-1.5 px-4 rounded-xl text-xs font-bold transition-all shadow"
            >
              กลับหน้าหลักแดชบอร์ด
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Desktop Sidebar (Left Panel) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Workspace Frame (Right Panel) */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Workspace Shared Header */}
        <Header />

        {/* Dynamic Inner Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentViewContent()}
          </div>
        </main>

      </div>

    </div>
  );
};
