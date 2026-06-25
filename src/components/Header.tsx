import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bell, MessageSquare, Search, Shield, User, RefreshCw } from "lucide-react";
import { UserRole } from "../types";

export const Header: React.FC = () => {
  const { role, setRole, currentView, setCurrentView, notifications, probationerProfile } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

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

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm sticky top-0 z-40">
      {/* Page Title / Section */}
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center">
          {role === "PROBATIONER" && <span className="text-[#001D3D] mr-2">🔒 Smart Probation Portal</span>}
          {role === "OFFICER" && <span className="text-red-700 mr-2">⚖️ Probation Officer Systems</span>}
          {role === "PARTNER" && <span className="text-emerald-700 mr-2">🤝 Partner Coordination Hub</span>}
          <span className="text-slate-400 font-light mx-2">|</span>
          <span className="text-[#cca43b] text-sm font-semibold tracking-wider font-mono">
            {role === "PROBATIONER" && "นายสมชาย ใจดี"}
            {role === "OFFICER" && "พนักงานคุมประพฤติ"}
            {role === "PARTNER" && "เทศบาลนครหาดใหญ่"}
          </span>
        </h1>
      </div>

      {/* Utilities Control Bar */}
      <div className="flex items-center space-x-6">
        {/* Role Fast Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#cca43b] animate-spin-hover" />
            <span>สลับบทบาท: </span>
            <span className={`px-2 py-0.5 rounded border ${getRoleBadgeColor(role)} text-[10px]`}>
              {getRoleLabel(role)}
            </span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">เลือกระบบทดสอบ</span>
              </div>
              <button
                onClick={() => {
                  setRole("PROBATIONER");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "PROBATIONER" ? "font-bold text-[#1b439c]" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>1. ผู้ถูกคุมประพฤติ (Probationer)</span>
              </button>
              <button
                onClick={() => {
                  setRole("OFFICER");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "OFFICER" ? "font-bold text-red-600" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>2. เจ้าหน้าที่คุมประพฤติ (Officer)</span>
              </button>
              <button
                onClick={() => {
                  setRole("PARTNER");
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                  role === "PARTNER" ? "font-bold text-emerald-600" : "text-slate-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>3. หน่วยงานภาคี (Partner)</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Notifications Icon */}
        <button
          onClick={() => setCurrentView(role === "PROBATIONER" ? "NOTIFICATIONS" : currentView)}
          className="relative p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group"
          title="กล่องข้อความแจ้งเตือน"
        >
          <Bell className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#cca43b] transition-colors" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Direct Chat Icon */}
        <button
          onClick={() => setCurrentView(role === "PROBATIONER" ? "AI_ASSISTANT" : currentView)}
          className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group"
          title="ติดต่อสอบถาม AI / ข้อความด่วน"
        >
          <MessageSquare className="w-4.5 h-4.5 text-slate-500 group-hover:text-teal-500 transition-colors" />
        </button>

        <span className="w-px h-6 bg-slate-200" />

        {/* Profile Avatar Card */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">
              {role === "PROBATIONER" && probationerProfile.name}
              {role === "OFFICER" && "พนักงานคุมประพฤติ ณัฐพงษ์"}
              {role === "PARTNER" && "เทศบาลนครหาดใหญ่"}
            </p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
              {role === "PROBATIONER" && `ID: ${probationerProfile.id}`}
              {role === "OFFICER" && "กองบังคับการปทุมธานี"}
              {role === "PARTNER" && "ผู้ประสานงานหลัก"}
            </p>
          </div>
          <div className="relative group cursor-pointer">
            <img
              src={
                role === "PROBATIONER"
                  ? probationerProfile.avatarUrl
                  : role === "OFFICER"
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=facearea&facepad=2"
                  : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=facearea&facepad=2"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#cca43b]/10 group-hover:ring-[#cca43b]/50 transition-all shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
