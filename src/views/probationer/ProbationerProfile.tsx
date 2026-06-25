import React from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { User, Shield, ShieldAlert, FileText, Download, CheckCircle, AlertCircle, Award, Star, ArrowLeft } from "lucide-react";

export const ProbationerProfile: React.FC = () => {
  const { probationerProfile, setCurrentView } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ข้อมูลคุมประพฤติดิจิทัล (Digital Probation Profile)</h2>
          <p className="text-xs text-slate-400 mt-1">รายละเอียดประวัติคดี ข้อกำหนดศาล และสถานะการรายงานตัวปัจจุบันในฐานข้อมูลกลาง</p>
        </div>
        <button
          onClick={() => setCurrentView("DASHBOARD")}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าแดชบอร์ด</span>
        </button>
      </div>

      {/* Main Profile Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Timeline (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-slate-100">
              <img
                src={probationerProfile.avatarUrl}
                alt={probationerProfile.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#cca43b]/20 shadow-md"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                  <h3 className="text-lg font-bold text-slate-800">{probationerProfile.name}</h3>
                  <span className="mt-1 md:mt-0 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block border border-red-200/50">
                    {probationerProfile.status}
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-[#cca43b] mt-1">รหัสคดีคุมประพฤติ: {probationerProfile.id}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ผู้ถูกคุมประพฤติสัญชาติไทย สังกัดฝ่ายคุมประพฤติพื้นที่ปทุมธานี อยู่ในกระบวนการฟื้นฟูช่วยเหลือฟื้นฟูจิตใจและฝีมือแรงงานเพื่อกลับคืนสู่สังคมอย่างสงบสุขและมีอนาคตที่มั่นคง
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">เริ่มต้นคุมประพฤติ</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{probationerProfile.probationPeriod.start}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">สิ้นสุดคุมประพฤติ</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{probationerProfile.probationPeriod.end}</span>
              </div>
              <div className="p-3 bg-[#e6fcf4] rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-600 font-bold block uppercase">ระยะเวลาที่เหลือ</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 block">อีก {probationerProfile.probationPeriod.remainingDays} วัน</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-600 font-bold block uppercase">สถานะปัจจุบัน</span>
                <span className="text-xs font-bold text-blue-700 mt-1 block">ปฏิบัติตามแผนเงื่อนไข</span>
              </div>
            </div>
          </div>

          {/* Biometrics & Personal Information Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Personal Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#1b439c] uppercase tracking-wider border-b border-slate-100 pb-2">ข้อมูลส่วนบุคคล</h4>
              
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">เลขประชาชน:</span>
                <span className="col-span-2 font-mono font-bold text-slate-800">{probationerProfile.nationalId}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">วันเกิด / อายุ:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{probationerProfile.birthDate} ({probationerProfile.age} ปี)</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">เพศ / สัญชาติ:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{probationerProfile.gender} / {probationerProfile.nationality}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">เบอร์โทรศัพท์:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{probationerProfile.phone}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">อีเมลลงทะเบียน:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{probationerProfile.email}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">ที่อยู่อาศัย:</span>
                <span className="col-span-2 text-slate-800 leading-relaxed text-[11px]">{probationerProfile.address}</span>
              </div>
            </div>

            {/* Column 2: Court/Case terms */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider border-b border-slate-100 pb-2">คำพิพากษาศาล & แผนเงื่อนไข</h4>
              
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">เลขคดีดำ/แดง:</span>
                <span className="col-span-2 font-mono font-bold text-red-700">{probationerProfile.caseId}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">ศาลที่พิพากษา:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{probationerProfile.court}</span>
              </div>
              <div className="grid grid-cols-3 text-xs text-[11px]">
                <span className="text-slate-400">ฐานข้อความผิด:</span>
                <span className="col-span-2 text-slate-800 font-bold leading-snug">{probationerProfile.charge}</span>
              </div>
              
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">เงื่อนไขคุมประพฤติศาลสั่ง:</span>
                {probationerProfile.sentenceConditions.map((cond, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-[10px] text-slate-600 leading-relaxed">
                    <span className="text-[#cca43b] font-bold">•</span>
                    <span>{cond}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] leading-relaxed">
                <span className="font-bold text-slate-700 block">พนักงานคุมประพฤติประจำตัว:</span>
                <span className="text-slate-500">{probationerProfile.probationOfficer.name} ({probationerProfile.probationOfficer.contact})</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar: QR Code, Stats Score, Checklist */}
        <div className="space-y-6">
          
          {/* Behavior Credit Rating Score */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เกณฑ์คะแนนความประพฤติ</span>
            
            <div className="my-4 relative flex items-center justify-center">
              {/* Score circle dial */}
              <div className="w-28 h-28 rounded-full border-4 border-slate-100 flex items-center justify-center bg-gradient-to-tr from-amber-50 to-white ring-4 ring-[#cca43b]/10">
                <div>
                  <span className="text-4xl font-extrabold text-[#00152e]">{probationerProfile.behaviorScore}</span>
                  <span className="text-[10px] text-slate-400 font-bold block">จาก 100</span>
                </div>
              </div>
              <div className="absolute -bottom-1 bg-emerald-500 text-white font-extrabold text-[9px] py-0.5 px-2.5 rounded-full shadow border-2 border-white">
                ดีมาก
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs mt-2">
              ประพฤติปฏิบัติตามข้อกำหนดครบถ้วน ไม่เคยขาดนัดรายงานตัวหรือมีสารเสพติด ได้รับสิทธิ์เข้าข่ายคืนคะแนนเต็มที่!
            </p>

            <div className="flex space-x-1 text-amber-400 mt-3 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4.5 h-4.5 fill-amber-400" />
              ))}
            </div>
          </div>

          {/* ID QR CODE CARD */}
          <div className="bg-[#001D3D] text-white p-6 rounded-2xl border border-[#cca43b]/20 shadow-md text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <span className="text-[10px] text-[#cca43b] font-bold uppercase tracking-widest">QR Code ประจำตัวพาสปอร์ต</span>
            
            {/* Simulated QR Code drawing using styled grids */}
            <div className="my-4 p-4 bg-white rounded-xl border-2 border-[#cca43b]">
              <div className="w-32 h-32 bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-2">
                <div className="grid grid-cols-5 gap-1 w-full h-full opacity-90">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${(i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 4 || i === 12 || i === 20 || i === 24 ? "bg-slate-900" : "bg-transparent"}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#001D3D] font-mono font-bold mt-2 tracking-wider">PB6705-123456</p>
            </div>

            <button
              onClick={() => alert("⬇️ ดาวน์โหลดบัตรคุมประพฤติดิจิทัล (QR ID Card) เข้าระบบคลังภาพมือถือเพื่อใช้สแกนรายงานตัว/เข้าร่วมกิจกรรมอัจฉริยะสำเร็จ")}
              className="w-full bg-[#cca43b] hover:bg-white text-[#00152e] hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow border border-[#cca43b] flex items-center justify-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด QR ID Card</span>
            </button>
          </div>

          {/* Checklist rules status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">ความคืบหน้าเงื่อนไข</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">รายงานตัวออนไลน์ (8/12)</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">ปฏิบัติตามกำหนด</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ทำงานสาธารณะ (150/200ชม.)</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">ปฏิบัติตามกำหนด</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ส่งอัปโหลดเอกสารคดี (4/5)</span>
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">รอส่งมอบเพิ่ม 1</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ตรวจหาสารเสพติด (3/3 ครั้ง)</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">ผ่านเกณฑ์ปกติ</span>
              </div>
            </div>
          </div>

          {/* Case Documents Downloads */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">เอกสารคดีสำคัญดาวน์โหลด</h4>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-slate-700">คำสั่งศาลคุมประพฤติ.pdf</span>
                </div>
                <button onClick={() => alert("⬇️ ดาวน์โหลดเอกสาร: คำสั่งศาลคุมประพฤติ รหัส PB6705-123456 (ขนาด 1.2MB)")} className="text-slate-400 hover:text-[#cca43b]">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-slate-700">แผนบำบัดฟื้นฟูรายบุคคล.pdf</span>
                </div>
                <button onClick={() => alert("⬇️ ดาวน์โหลดเอกสาร: แผนบำบัดฟื้นฟูรายบุคคล (ขนาด 890KB)")} className="text-slate-400 hover:text-[#cca43b]">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-slate-700">ใบรับรองชั่วโมงบริการสะสม.pdf</span>
                </div>
                <button onClick={() => alert("⬇️ ดาวน์โหลดเอกสาร: ใบรับรองชั่วโมงบริการสะสม 150 ชั่วโมง (ขนาด 950KB)")} className="text-slate-400 hover:text-[#cca43b]">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Quote decoration footer banner */}
      <GovBanner />

    </div>
  );
};
