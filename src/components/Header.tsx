import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import progressAppIcon from "../assets/images/progress_app_icon_1782675461193.jpg";
import { Bell, MessageSquare, Menu, ChevronDown, RefreshCw } from "lucide-react";
import { UserRole } from "../types";

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { role, setRole, currentView, setCurrentView, notifications, probationerProfile } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case "PROBATIONER":
        return "ผู้ถูกคุมประพฤติ";
      case "OFFICER":
        return "เจ้าหน้าที่คุมประพฤติ";
      case "PARTNER":
        return "หน่วยงานภาคี";
    }
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case "PROBATIONER":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "OFFICER":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "PARTNER":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  const getHeaderInfo = () => {
    switch (currentView) {
      case "DASHBOARD":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              PROGRESS+ <span className="text-blue-600">: ก้าวใหม่ สู่โอกาสใหม่</span>
            </h1>
          ),
          subtitle: "แพลตฟอร์มดิจิทัลอัจฉริยะเพื่อการฟื้นฟู พัฒนศักยภาพ และคืนคนดีสู่สังคมอย่างยั่งยืน",
        };
      case "VOLUNTEER":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              SMART <span className="text-blue-600">VOLUNTEER</span>
            </h1>
          ),
          subtitle: "ค้นหากิจกรรมบริการสังคมใกล้คุณ เพื่อสร้างประโยชน์ให้สังคม",
        };
      case "JOB_HUB":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              RESTART <span className="text-blue-600">JOB HUB</span>
            </h1>
          ),
          subtitle: "โอกาสใหม่ในการเริ่มต้นอาชีพ เพื่ออนาคตที่ดีกว่า",
        };
      case "PROFILE":
      case "DOCUMENTS":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              DIGITAL <span className="text-blue-600">PROBATION PROFILE</span>
            </h1>
          ),
          subtitle: "ข้อมูลผู้ถูกคุมประพฤติ (ระบบดิจิทัล)",
        };
      case "TRACKER":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              SERVICE <span className="text-blue-600">HOUR TRACKER</span>
            </h1>
          ),
          subtitle: "ระบบติดตามชั่วโมงบำเพ็ญประโยชน์ เพื่อการพัฒนาและคืนคนดีสู่สังคม",
        };
      case "NOTIFICATIONS":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              PROGRESS+ <span className="text-blue-600">: ก้าวใหม่ สู่โอกาสใหม่</span>
            </h1>
          ),
          subtitle: "ระบบแจ้งเตือน ติดตามทุกการแจ้งเตือนสำคัญของคุณแบบเรียลไทม์",
        };
      case "AI_ASSISTANT":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              AI <span className="text-blue-600">ASSISTANT</span> ผู้ช่วยอัจฉริยะสำหรับผู้ถูกคุมประพฤติ
            </h1>
          ),
          subtitle: "ระบบปัญญาประดิษฐ์เพื่อการให้คำแนะนำ และติดตามการปฏิบัติตามเงื่อนไข",
        };
      case "ONLINE_REPORT":
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              ONLINE <span className="text-blue-600">PROBATION REPORT</span>
            </h1>
          ),
          subtitle: "ระบบรายงานตัวออนไลน์ อำนวยความสะดวกสำหรับผู้ถูกคุมความประพฤติ",
        };
      default:
        return {
          title: (
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0f2d59] tracking-wider font-sans">
              PROGRESS+ <span className="text-blue-600">: ก้าวใหม่ สู่โอกาสใหม่</span>
            </h1>
          ),
          subtitle: "แพลตฟอร์มดิจิทัลอัจฉริยะเพื่อการฟื้นฟู พัฒนศักยภาพ และคืนคนดีสู่สังคมอย่างยั่งยืน",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const getProfileData = () => {
    switch (role) {
      case "PROBATIONER":
        return {
          name: probationerProfile?.name || "ผู้ถูกคุมประพฤติ",
          roleLabel: "ผู้ถูกคุมประพฤติ",
          avatar: probationerProfile?.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_default" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_default)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="\'Sarabun\', sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">👤</text></svg>')}`,
        };
      case "OFFICER":
        return {
          name: "นางสาวกัลยา รักษดี",
          roleLabel: "เจ้าพนักงานคุมประพฤติ",
          avatar: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="o_ก" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o_ก)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="\'Sarabun\', sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ก</text></svg>')}`,
        };
      case "PARTNER":
        return {
          name: "เทศบาลนครหาดใหญ่",
          roleLabel: "หน่วยงานภาคี",
          avatar: "svg:hatyai",
        };
    }
  };

  const profile = getProfileData();

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-6 lg:px-8 flex items-center justify-between shadow-sm sticky top-0 z-40 relative overflow-hidden font-sans">
      
      {/* Background decoration matching the image */}
      <div className="absolute right-[22%] top-0 bottom-0 w-[40%] pointer-events-none hidden xl:flex items-center justify-center opacity-70 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-end">
          {/* Subtle gradient curves */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-blue-100/10" />
          {/* SVG scales of justice + people silhouettes */}
          <svg viewBox="0 0 600 120" className="h-full w-auto text-blue-200/50 fill-current select-none">
            {/* Scales of Justice */}
            <g transform="translate(320, 15) scale(0.75)" className="text-blue-300/40">
              <path d="M50 15 L50 95" stroke="currentColor" strokeWidth="2.5" />
              <path d="M20 95 L80 95" stroke="currentColor" strokeWidth="3" />
              <path d="M10 35 Q50 25 90 35" stroke="currentColor" strokeWidth="3.5" fill="none" />
              {/* Left Pan */}
              <line x1="15" y1="35" x2="5" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="35" x2="25" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 65 L28 65 Q15 72 2 65" fill="currentColor" />
              {/* Right Pan */}
              <line x1="85" y1="35" x2="75" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <line x1="85" y1="35" x2="95" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <path d="M72 65 L98 65 Q85 72 72 65" fill="currentColor" />
              {/* Center Arch */}
              <path d="M40 25 L50 12 L60 25" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </g>
            {/* Text labels */}
            <text x="330" y="94" className="text-[9px] font-bold fill-blue-500/40 text-center font-sans tracking-widest">คืนคนดีสู่สังคม</text>
            
            {/* Silhouettes of people walking */}
            <g transform="translate(140, 52) scale(0.85)" className="text-blue-300/40">
              {/* Person 1 */}
              <circle cx="100" cy="15" r="8" fill="currentColor" />
              <path d="M90 27 Q100 23 110 27 L106 60 L94 60 Z" fill="currentColor" />
              {/* Person 2 */}
              <circle cx="130" cy="18" r="7" fill="currentColor" />
              <path d="M121 29 Q130 25 139 29 L135 60 L125 60 Z" fill="currentColor" />
              {/* Person 3 (Walking together) */}
              <circle cx="160" cy="13" r="8.5" fill="currentColor" />
              <path d="M149 25 Q160 21 171 25 L166 60 L154 60 Z" fill="currentColor" />
              {/* Person 4 */}
              <circle cx="190" cy="16" r="7.5" fill="currentColor" />
              <path d="M181 28 Q190 24 199 28 L195 60 L185 60 Z" fill="currentColor" />
            </g>
          </svg>
        </div>
      </div>

      {/* Brand & Subtitle block */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* Hamburger Menu Bar */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer mr-1"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo and Text details */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg border border-[#cca43b]/20 bg-[#001D3D] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={progressAppIcon}
              alt="PROGRESS+ Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {headerInfo.title}
            </div>
            <p className="text-[11.5px] font-medium text-slate-500 mt-0.5 hidden md:block">
              {headerInfo.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Utilities Control Bar */}
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 relative z-10">
        {/* Role Fast Switcher (Compact for preview testing) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-hover" />
            <span className="text-[10.5px] hidden sm:inline">สลับบทบาท: </span>
            <span className={`px-2 py-0.5 rounded-lg border ${getRoleBadgeColor(role)} text-[9.5px] font-bold`}>
              {getRoleLabel(role)}
            </span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">สลับฝั่งการแสดงผล</span>
              </div>
              <button
                onClick={() => {
                  setRole("PROBATIONER");
                  setCurrentView("DASHBOARD");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "PROBATIONER" ? "font-bold text-blue-600" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>1. ผู้ถูกคุมประพฤติ (Probationer)</span>
              </button>
              <button
                onClick={() => {
                  setRole("OFFICER");
                  setCurrentView("OFFICER_DASHBOARD");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "OFFICER" ? "font-bold text-blue-700" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-700" />
                <span>2. เจ้าหน้าที่คุมประพฤติ (Officer)</span>
              </button>
              <button
                onClick={() => {
                  setRole("PARTNER");
                  setCurrentView("PARTNER_DASHBOARD");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "PARTNER" ? "font-bold text-emerald-600" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>3. หน่วยงานภาคี (Partner)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with Red Badge '3' */}
        <button
          onClick={() => {
            if (role === "OFFICER") {
              setCurrentView("OFFICER_REPORTS");
            } else if (role === "PROBATIONER") {
              setCurrentView("NOTIFICATIONS");
            }
          }}
          className="relative p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group"
          title="การแจ้งเตือน"
        >
          <Bell className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
            3
          </span>
        </button>

        {/* Chat / Message Icon */}
        <button
          className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group"
          title="กล่องข้อความ"
          onClick={() => {
            if (role === "PROBATIONER") setCurrentView("AI_ASSISTANT");
            else alert("💬 กล่องข้อความและการประสานงานฝ่ายเจ้าหน้าที่");
          }}
        >
          <MessageSquare className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
        </button>

        <span className="w-px h-6 bg-slate-200" />

        {/* Profile Avatar Card - นายสมชาย ใจดี / เจ้าพนักงาน */}
        <div className="flex items-center space-x-3 pl-1">
          <div className="relative group cursor-pointer">
            {profile.avatar && profile.avatar.startsWith("svg:") ? (
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-500/30 flex items-center justify-center p-1 shadow-md ring-2 ring-blue-600/10 group-hover:ring-emerald-600 transition-all">
                <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-700 fill-current">
                  <circle cx="50" cy="50" r="45" fill="#f0fdf4" stroke="#047857" strokeWidth="5" />
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#eab308" strokeWidth="3" />
                  {/* Local municipal elements (three-headed elephant/temple structure) */}
                  <path d="M32,65 Q50,35 68,65 Z" fill="#047857" />
                  <path d="M42,65 Q50,45 58,65 Z" fill="#eab308" />
                  <circle cx="50" cy="38" r="7" fill="#eab308" />
                </svg>
              </div>
            ) : (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-600/10 group-hover:ring-blue-600 transition-all shadow-md"
              />
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div className="text-left cursor-pointer group hidden md:flex items-center space-x-2">
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                {profile.name}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                {profile.roleLabel}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};
