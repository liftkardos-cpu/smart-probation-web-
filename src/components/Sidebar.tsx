import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  User,
  Clock,
  HeartHandshake,
  FileText,
  Briefcase,
  Folder,
  Bell,
  MessageSquare,
  Settings,
  Phone,
  LogOut,
  Calendar,
  Users,
  ShieldAlert,
  BarChart3,
  CheckCircle,
  ShieldCheck,
  Building,
  UserCheck
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { role, currentView, setCurrentView, notifications, setIsLoggedIn, probationerProfile } = useApp();

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Menu items config depending on selected role
  const getMenuItems = () => {
    switch (role) {
      case "PROBATIONER":
        return [
          { id: "DASHBOARD", label: "หน้าหลัก (Dashboard)", icon: LayoutDashboard },
          { id: "PROFILE", label: "ข้อมูลส่วนตัว (Profile)", icon: User },
          { id: "TRACKER", label: "ชั่วโมงสะสม (Hours)", icon: Clock },
          { id: "VOLUNTEER", label: "กิจกรรมบริการสังคม", icon: HeartHandshake },
          { id: "ONLINE_REPORT", label: "รายงานตัวออนไลน์", icon: FileText },
          { id: "JOB_HUB", label: "หางาน / ฝึกอาชีพ", icon: Briefcase },
          { id: "DOCUMENTS", label: "เอกสารของฉัน", icon: Folder },
          { id: "NOTIFICATIONS", label: "การแจ้งเตือน", icon: Bell, badge: unreadNotifications },
          { id: "AI_ASSISTANT", label: "AI Assistant", icon: MessageSquare, highlight: true },
          { id: "SETTINGS", label: "ตั้งค่าการใช้งาน", icon: Settings }
        ];
      case "OFFICER":
        return [
          { id: "OFFICER_DASHBOARD", label: "หน้าหลัก (Dashboard)", icon: LayoutDashboard },
          { id: "CASE_MANAGEMENT", label: "จัดการข้อมูลผู้คุมประพฤติ", icon: Users },
          { id: "APPOINTMENT_MANAGEMENT", label: "ปฏิทินนัดหมาย", icon: Calendar },
          { id: "VOLUNTEER_CONTROL", label: "จัดการกิจกรรมบริการสังคม", icon: HeartHandshake },
          { id: "RISK_ASSESSMENT", label: "ระบบประเมินความเสี่ยง", icon: ShieldAlert },
          { id: "ANALYTICS", label: "รายงานสถิติ & Analytics", icon: BarChart3 },
          { id: "SETTINGS", label: "ตั้งค่าระบบ", icon: Settings }
        ];
      case "PARTNER":
        return [
          { id: "PARTNER_DASHBOARD", label: "หน้าหลัก (Dashboard)", icon: LayoutDashboard },
          { id: "ACTIVITY_MANAGEMENT", label: "จัดการกิจกรรมบริการสังคม", icon: HeartHandshake },
          { id: "ATTENDANCE_VERIFICATION", label: "ยืนยันเวลาเข้าร่วม (QR)", icon: UserCheck },
          { id: "PERFORMANCE_EVALUATION", label: "ประเมินผลผู้เข้าร่วม", icon: ShieldCheck },
          { id: "SETTINGS", label: "ตั้งค่าหน่วยงาน", icon: Settings }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-72 bg-[#001D3D] text-white flex flex-col min-h-screen shadow-2xl shrink-0 border-r border-[#cca43b]/20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex flex-col items-center text-center bg-[#00152e]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#cca43b] mb-3">
          {/* Logo seal placeholder */}
          <span className="text-[#001D3D] font-extrabold text-2xl">ตรา</span>
        </div>
        <h2 className="text-sm font-semibold tracking-wider text-[#cca43b]">กรมคุมประพฤติ</h2>
        <p className="text-[10px] font-mono tracking-widest text-slate-400">DEPARTMENT OF PROBATION</p>
        <div className="mt-2 w-full bg-[#cca43b]/10 py-1 px-3 rounded-full border border-[#cca43b]/20 text-[11px] text-[#cca43b] font-medium uppercase tracking-wider">
          Smart Probation Ecosystem
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-medium transition-all duration-200 group text-left ${
                isActive
                  ? "bg-[#cca43b] text-[#00152e] font-semibold shadow-md shadow-[#cca43b]/10"
                  : item.highlight
                  ? "bg-[#002855] text-teal-400 border border-teal-500/30 hover:bg-teal-500/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-[#00152e]" : item.highlight ? "text-teal-400" : "text-slate-400 group-hover:text-[#cca43b]"
                }`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Widget - Help Desk */}
      <div className="p-4 mx-4 mb-3 bg-gradient-to-br from-[#002855] to-[#001D3D] rounded-xl border border-white/5 shadow-inner">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#cca43b]/10 rounded-lg border border-[#cca43b]/20">
            <Phone className="w-4 h-4 text-[#cca43b]" />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white">ต้องการความช่วยเหลือ?</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
              ติดต่อสายด่วนกรมคุมประพฤติ หรือผู้ดูแลคดีประจำตัว
            </p>
          </div>
        </div>
        <button 
          onClick={() => alert(`📞 ติดต่อสายด่วนกรมคุมประพฤติ: 0 2141 4740\n🕒 เวลาทำการ: จันทร์-ศุกร์ 08:30 - 16:30 น.`)}
          className="w-full mt-3 bg-[#003f7a] hover:bg-[#cca43b] hover:text-[#00152e] text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all border border-white/10 flex items-center justify-center space-x-1"
        >
          <span>ติดต่อเจ้าหน้าที่</span>
        </button>
      </div>

      {/* Footer Meta */}
      <div className="p-4 bg-[#00152e] border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
        <div>
          <span className="font-mono">เวอร์ชัน 1.0.0</span>
          <p className="mt-0.5 font-sans">© 2024 Dept of Probation</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          title="ออกจากระบบ"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
