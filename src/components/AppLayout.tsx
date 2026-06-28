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
import { CaseManagement } from "../views/officer/CaseManagement";
import { OfficerReports } from "../views/officer/OfficerReports";
import { AppointmentManagement } from "../views/officer/AppointmentManagement";
import { VolunteerControl } from "../views/officer/VolunteerControl";
import { DrugTest } from "../views/officer/DrugTest";
import { RiskAssessmentView } from "../views/officer/RiskAssessmentView";
import { AnalyticsView } from "../views/officer/AnalyticsView";
import { RehabilitationPlan } from "../views/officer/RehabilitationPlan";
import { HeatMapView } from "../views/officer/HeatMapView";
import { OfficerSettings } from "../views/officer/OfficerSettings";

// Partner Views
import { PartnerDashboard } from "../views/partner/PartnerDashboard";
import { FloatingBot } from "./FloatingBot";

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
        if (role === "OFFICER") {
          return <OfficerSettings />;
        }
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
        return <OfficerDashboard />;
      case "CASE_MANAGEMENT":
        return <CaseManagement />;
      case "OFFICER_REPORTS":
        return <OfficerReports />;
      case "APPOINTMENT_MANAGEMENT":
        return <AppointmentManagement />;
      case "VOLUNTEER_CONTROL":
        return <VolunteerControl />;
      case "DRUG_TEST":
        return <DrugTest />;
      case "RISK_ASSESSMENT":
        return <RiskAssessmentView />;
      case "ANALYTICS":
        return <AnalyticsView />;
      case "REHABILITATION_PLAN":
        return <RehabilitationPlan />;
      case "HEAT_MAP":
        return <HeatMapView />;

      // ==========================================
      // 3. PARTNER ROLE VIEWS
      // ==========================================
      case "PARTNER_DASHBOARD":
      case "ACTIVITY_MANAGEMENT":
      case "APPLICANTS_MANAGEMENT":
      case "PARTICIPANTS_MANAGEMENT":
      case "SERVICE_HOURS":
      case "REPORTS_STATS":
      case "DOCUMENTS_ANNOUNCEMENTS":
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
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      
      {/* Mobile/Tablet Sidebar Drawer overlay and sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Sidebar drawer body */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#091535] transition-transform duration-300 transform translate-x-0 shadow-2xl h-full z-10">
            {/* Close button inside sidebar on mobile */}
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Sidebar content */}
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Left Panel) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Workspace Frame (Right Panel) */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Workspace Shared Header */}
        <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Dynamic Inner Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentViewContent()}
          </div>
        </main>

      </div>

      {/* Floating Robot AI Assistant (P+) */}
      <FloatingBot />

    </div>
  );
};
