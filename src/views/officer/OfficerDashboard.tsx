import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Users, Search, CheckCircle, AlertTriangle, FileText, ArrowRight, Star, Plus, Shield, ExternalLink, Calendar, Mail } from "lucide-react";

export const OfficerDashboard: React.FC = () => {
  const { probationersList, selectProbationer, setCurrentView, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const filteredList = probationersList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.charge.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ทั้งหมด" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEvaluateClick = (pId: string) => {
    selectProbationer(pId);
    setCurrentView("OFFICER_EVALUATE");
  };

  const handleSendMessage = (pName: string) => {
    const msg = prompt(`💬 พิมพ์ข้อความแจ้งเตือนด่วนเพื่อส่ง SMS ไปยังคุณ ${pName}:`, "กรุณารายงานตัวครั้งถัดไปในวันที่ 20 พฤษภาคม 2567 นี้ให้ตรงกำหนดด้วยค่ะ");
    if (msg) {
      addNotification(`แจ้งเตือน SMS ถึงคุณ ${pName}`, `ข้อความส่งสำเร็จ: "${msg}"`, "เจ้าหน้าที่");
      alert(`✅ ส่งข้อความด่วนไปยังคุณ ${pName} สำเร็จ!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Bio Card & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-gradient-to-r from-[#00152e] to-[#002d5c] text-white p-6 rounded-2xl shadow-md border border-[#cca43b]/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-[#cca43b] rounded-2xl flex items-center justify-center font-bold text-2xl text-[#001D3D] shadow-md border border-white/20">
              พณ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">นายณัฐพงษ์ มั่นคง</h2>
                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-500/50">
                  พนักงานเจ้าหน้าที่ชำนาญการ
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">รหัสพนักงาน: <span className="font-mono font-bold text-[#cca43b]">OFF6702-54321</span></p>
              <p className="text-slate-400 text-[11px] mt-0.5">สังกัด: กองบริหารงานคุมประพฤติเขต 1 ปทุมธานี • คดีความในความดูแล: 15 คดี</p>
            </div>
          </div>
          
          <button 
            onClick={() => alert("📂 เปิดฐานข้อมูลสิทธิ์การเข้าถึงข้อมูลฝ่ายนิติกรและคดีความพิเศษ กรมคุมประพฤติสำเร็จ")}
            className="bg-[#cca43b] hover:bg-white text-[#00152e] hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow border border-[#cca43b] flex items-center space-x-1"
          >
            <Shield className="w-4 h-4" />
            <span>ใบอนุญาตตรวจคดีระดับสูง</span>
          </button>
        </div>

        {/* Global Assigned overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-[#1b439c] rounded-xl border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">การรายงานตัวเดือนนี้</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1 leading-snug">
              ผู้ถูกคุมรายงานตัวแล้ว 12 / 15 ราย
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              อัตราการปฏิบัติตามวินัยสูงถึง <b>80.45%</b> มีทัศนคติความประพฤติเชิงบวก
            </p>
          </div>
        </div>

      </div>

      {/* 4-Part KPI Status for Officers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">รายชื่อในความดูแลทั้งหมด</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-extrabold text-[#001D3D]">15</span>
            <span className="text-xs text-slate-400 font-bold">ราย</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 block">เขตอำเภอคลองหลวง ปทุมธานี</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">รายงานตัวครบถ้วนงวดนี้</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">12</span>
            <span className="text-xs text-slate-400 font-bold">ราย</span>
          </div>
          <span className="text-[9px] text-emerald-500 font-bold mt-1 block">✓ ยืนยันพิกัด GPS ครบถ้วน</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ขาดรายงานตัว / เฝ้าระวังด่วน</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-extrabold text-red-500">2</span>
            <span className="text-xs text-slate-400 font-bold">ราย</span>
          </div>
          <span className="text-[9px] text-red-500 font-bold mt-1 block">⚠️ เลยกำหนดนัดนัดรายงานตัว</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">รอยื่นขอปิดคดีสู่ศาลสำเร็จ</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-extrabold text-[#cca43b]">1</span>
            <span className="text-xs text-slate-400 font-bold">ราย</span>
          </div>
          <span className="text-[9px] text-[#cca43b] font-bold mt-1 block">✓ ทำกิจกรรมครบ 200 ชั่วโมง</span>
        </div>

      </div>

      {/* Main interactive Table & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table header / actions filter bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">บัญชีทะเบียนผู้ถูกคุมความประพฤติ (คดีในความรับผิดชอบ)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">ค้นหาผู้ถูกคุมประพฤติ คัดแยกพฤติกรรม และประเมินสะสมชั่วโมงช่วยเหลือประชาชน</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อ, รหัสคดี, หรือข้อหา..."
                className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:bg-white outline-none w-full sm:w-56"
              />
            </div>

            {/* Select Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-700 outline-none"
            >
              <option value="ทั้งหมด">กรองพฤติกรรม: ทั้งหมด</option>
              <option value="ปกติ">ปกติ</option>
              <option value="ต้องติดตาม">ต้องติดตาม</option>
              <option value="รอยื่นปิดคดี">รอยื่นปิดคดี</option>
            </select>
          </div>
        </div>

        {/* Database table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-5">ผู้ถูกคุมประพฤติ (ID)</th>
                <th className="py-3 px-3">ข้อหาหลักตามฟ้อง</th>
                <th className="py-3 px-3">ระยะเวลาคุมประพฤติ</th>
                <th className="py-3 px-3 text-center">ชั่วโมงทำความดี (เป้า)</th>
                <th className="py-3 px-3 text-center">คะแนนประพฤติ</th>
                <th className="py-3 px-3 text-center">สถานะวินัย</th>
                <th className="py-3 px-5 text-right">ดำเนินการประเมิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Name and avatar */}
                  <td className="py-3 px-5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#cca43b]/10"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{p.name}</span>
                        <span className="font-mono text-[9px] text-slate-400 block font-semibold">{p.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Charge info */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700 line-clamp-1 max-w-[150px]" title={p.charge}>
                      {p.charge}
                    </span>
                  </td>

                  {/* Period info */}
                  <td className="py-3 px-3 text-slate-500 font-semibold text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.probationPeriod.start} - {p.probationPeriod.end}</span>
                    </div>
                  </td>

                  {/* Progress bar */}
                  <td className="py-3 px-3">
                    <div className="max-w-[110px] mx-auto space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-slate-600 font-bold">
                        <span>{p.completedHours} / {p.requiredHours} ชม.</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#1b439c] h-full" 
                          style={{ width: `${(p.completedHours / p.requiredHours) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Behavior Score rating stars */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-extrabold text-[#001D3D] block text-sm">{p.behaviorScore}</span>
                    <span className="text-[9px] text-slate-400 font-bold">คะแนน</span>
                  </td>

                  {/* Current disciplinary status */}
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                      p.status === "ปกติ" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200/50" 
                        : p.status === "ต้องติดตาม"
                        ? "bg-red-100 text-red-800 border border-red-200/50 animate-pulse"
                        : "bg-amber-100 text-amber-800 border border-amber-200/50"
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleSendMessage(p.name)}
                        className="p-1.5 border border-slate-200 text-slate-500 hover:text-blue-600 bg-white hover:bg-slate-50 rounded-lg shadow-sm"
                        title="ส่งข้อความแจ้งเตือนด่วน"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEvaluateClick(p.id)}
                        className="bg-slate-800 text-white hover:bg-[#cca43b] hover:text-[#00152e] px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                      >
                        ประเมินพฤติกรรม
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Grid: Charts & Analytics panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Case Success bars */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">อัตราความสำเร็จของคดีสะสม</h3>
              <p className="text-[11px] text-slate-400">ภาพรวมการบำบัดรักษาพฤติกรรมและพ้นความผิดคุมประพฤติรายไตรมาสปี 2567</p>
            </div>
            <span className="text-xs text-slate-500 font-bold bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg">
              เป้าหมายอัตราพ้นคดี: 90%
            </span>
          </div>

          {/* Graphical simulated bars */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 font-bold mb-1">
                <span>ไตรมาสที่ 1 (ม.ค. - มี.ค. 2567)</span>
                <span className="text-emerald-600">82.35% (สำเร็จ 112/136 ราย)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-full rounded-lg" style={{ width: "82%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 font-bold mb-1">
                <span>ไตรมาสที่ 2 (เม.ย. - มิ.ย. 2567 - ล่าสุด)</span>
                <span className="text-[#cca43b]">87.95% (สำเร็จ 146/166 ราย)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-full rounded-lg" style={{ width: "88%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: ReStart Job Hub placement rates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>ผลการใช้สิทธิ์ ReStart Job Hub</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">อัตราก้าวหน้าสูง</span>
          </h3>

          <div className="text-center flex flex-col items-center">
            {/* Pie matching rate circle */}
            <div className="relative w-24 h-24 flex items-center justify-center bg-sky-50 rounded-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#1b439c]" strokeDasharray="85, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-[#001D3D] block">85%</span>
                <span className="text-[8px] text-slate-400 font-bold block">ของกลุ่ม</span>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed mt-3 max-w-xs font-semibold">
              ผู้ถูกคุมความประพฤติภายใต้การดูแล ได้รับสิทธิ์การฝึกวิชาชีพด้านช่างฝีมือและได้รับการว่าจ้างงานสุจริตจาก SCG / CP ALL สำเร็จ
            </p>
          </div>
        </div>

      </div>

      {/* Decorative quotes */}
      <GovBanner />

    </div>
  );
};
