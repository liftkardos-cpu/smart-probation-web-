import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Bell, Calendar, FileText, CheckCircle2, MessageSquare, Briefcase, Sparkles, Filter, Trash2, Eye } from "lucide-react";

export const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, clearAllNotifications } = useApp();
  const [filterType, setFilterType] = useState<string>("ทั้งหมด");

  const filterCategories = ["ทั้งหมด", "รายงานตัว", "กิจกรรม", "เอกสาร", "โอกาสงาน", "ระบบ"];

  // Filter list
  const filteredNotifications = notifications.filter(noti => {
    if (filterType === "ทั้งหมด") return true;
    return noti.category === filterType;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "รายงานตัว":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "กิจกรรม":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "เอกสาร":
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case "โอกาสงาน":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleRead = (id: string) => {
    markAsRead(id);
  };

  const handleClear = () => {
    clearAllNotifications();
    alert("🗑️ ล้างการแจ้งเตือนทั้งหมดในถังขยะเรียบร้อย!");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ศูนย์แจ้งเตือนและกล่องจดหมาย (Notification Center)</h2>
          <p className="text-xs text-slate-400 mt-1">
            รับทราบข่าวสารด่วนจากกรมคุมประพฤติ ประกาศเวลานัดพนักงาน และสถานะชั่วโมงการให้บริการสังคมประจำตัว
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => alert("🔔 เปิดการตั้งค่าแจ้งเตือน SMS/Email: ระบบจะแจ้งเตือนความปลอดภัยล่วงหน้า 3 วันเมื่อใกล้วันนัดรายงานตัว")}
            className="text-xs border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-3 rounded-lg shadow-sm text-slate-600 font-semibold"
          >
            ตั้งค่าแจ้งเตือน SMS
          </button>
          
          <button
            onClick={handleClear}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 py-1.5 px-3 rounded-lg border border-red-200/50 font-semibold flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างข้อความทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-wider flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" />
          <span>กรองประเภท:</span>
        </span>
        
        {filterCategories.map((cat) => {
          const count = noti => noti.category === cat || cat === "ทั้งหมด";
          const countVal = notifications.filter(noti => cat === "ทั้งหมด" ? true : noti.category === cat).length;
          
          return (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold border transition-all ${
                filterType === cat
                  ? "bg-[#cca43b] text-[#001D3D] border-[#cca43b] shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {cat} ({countVal})
            </button>
          );
        })}
      </div>

      {/* Main Mail Grid List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-5 text-xs font-bold text-slate-500 flex justify-between items-center">
          <span>รายการข้อความทั้งหมดในกล่องจดหมาย ({filteredNotifications.length} รายการ)</span>
          <span className="text-[10px] text-[#cca43b]">คลิกที่ปุ่มดวงตาเพื่อบันทึกว่าอ่านแล้ว</span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            ไม่มีข้อความแจ้งเตือนที่อยู่ในหมวดหมู่ '{filterType}' ในประวัติของคุณ
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((noti) => (
              <div 
                key={noti.id} 
                className={`p-5 flex items-start space-x-4 transition-all hover:bg-slate-50/50 ${
                  !noti.isRead ? "bg-blue-50/30 border-l-4 border-blue-600" : ""
                }`}
              >
                
                {/* Status icon badge */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  !noti.isRead 
                    ? "bg-blue-100/50 border-blue-200/50 text-blue-600" 
                    : "bg-slate-100 border-slate-200/50 text-slate-400"
                }`}>
                  {getIcon(noti.category)}
                </div>

                {/* Content text */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-800">{noti.title}</span>
                      {!noti.isRead && (
                        <span className="bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{noti.time}</span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {noti.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 pt-1 text-[10px] text-slate-400 font-semibold">
                    <span>ผู้ส่ง: <b className="text-slate-600">{noti.sender}</b></span>
                    <span>•</span>
                    <span className="bg-slate-100 text-slate-500 py-0.5 px-2 rounded-md font-bold uppercase">{noti.category}</span>
                  </div>
                </div>

                {/* Mark as read clicker */}
                {!noti.isRead && (
                  <button
                    onClick={() => handleRead(noti.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200/50 transition-colors shrink-0"
                    title="ทำเครื่องหมายว่าอ่านแล้ว"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Decorative motiv quote */}
      <GovBanner />

    </div>
  );
};
