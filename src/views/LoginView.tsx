import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { Eye, EyeOff, Lock, User, ShieldCheck, HelpCircle, BarChart3, Users, Clock, AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";

export const LoginView: React.FC = () => {
  const { setRole, setIsLoggedIn, addNotification } = useApp();
  const [selectedTab, setSelectedTab] = useState<UserRole>("PROBATIONER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Pre-fill credentials based on selected role tab for ease of prototype review
  const getPlaceholderUsername = () => {
    switch (selectedTab) {
      case "PROBATIONER":
        return "กรอกเลขประจำตัวประชาชน 13 หลัก หรืออีเมล";
      case "OFFICER":
        return "กรอกเลขบัตรประจำตัวเจ้าหน้าที่ / อีเมล";
      case "PARTNER":
        return "กรอกเลขทะเบียนหน่วยงาน / อีเมล";
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedTab);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#cca43b]/30">
      
      {/* Top Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        {/* Main Grid Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col lg:flex-row min-h-[580px]">
          
          {/* Left Side: Brand presentation with Silhouette Graphics */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#001D3D] via-[#002d5c] to-[#00152e] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative shining background blobs */}
            <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#cca43b]/10 rounded-full blur-3xl" />
            
            {/* Brand Logo & Seals */}
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#cca43b] shadow-inner shrink-0">
                <span className="text-[#001D3D] text-[11px] font-bold">ตรา</span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-slate-100">กรมคุมประพฤติ</h3>
                <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Department of Probation</p>
              </div>
            </div>

            {/* Central Graphic Mockup with Silhouette & Golden Bridges */}
            <div className="my-8 relative z-10 flex flex-col items-center">
              <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-center leading-tight">
                SMART PROBATION
                <span className="block text-[#cca43b] mt-1 text-3xl md:text-4.5xl">ECOSYSTEM</span>
              </h1>
              <p className="text-xs text-slate-300 font-medium text-center mt-3 max-w-md leading-relaxed">
                ระบบบริหารงานคุมประพฤติอัจฉริยะเพื่อการฟื้นฟูและคืนคนดีสู่สังคม
              </p>
              
              {/* Golden quotes */}
              <div className="mt-8 border-y border-white/10 py-4 w-full max-w-sm text-center">
                <p className="italic text-slate-100 text-sm font-semibold tracking-wide">
                  " โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...คุณทำได้ "
                </p>
              </div>

              {/* Silhouette Graphics of rehabilitation */}
              <div className="w-full mt-6 h-40 relative flex items-end justify-center">
                {/* Bridge vector simulated using borders */}
                <div className="absolute inset-x-0 bottom-0 h-16 border-t-2 border-[#cca43b]/30 flex items-center justify-around">
                  <div className="w-0.5 h-16 bg-white/20" />
                  <div className="w-0.5 h-16 bg-white/20" />
                  <div className="w-0.5 h-16 bg-white/20" />
                  <div className="w-0.5 h-16 bg-white/20" />
                  <div className="w-0.5 h-16 bg-white/20" />
                </div>
                {/* Simulated suspension suspension bridge cords */}
                <svg className="absolute bottom-0 w-full h-32 text-[#cca43b]/10 stroke-current fill-none stroke-1" viewBox="0 0 400 100">
                  <path d="M0,80 Q200,10 400,80" />
                  <path d="M0,90 Q200,30 400,90" />
                </svg>
                {/* Team of silhouettes walk towards bridge */}
                <div className="flex items-end justify-center space-x-4 pb-0.5 z-10">
                  <div className="w-4 h-12 bg-white/70 rounded-t-full" />
                  <div className="w-3.5 h-10 bg-white/50 rounded-t-full" />
                  <div className="w-5 h-14 bg-[#cca43b] rounded-t-full relative">
                    <span className="absolute -top-6 -left-1 text-[10px] text-[#cca43b] font-bold">START</span>
                  </div>
                  <div className="w-4 h-11 bg-white/60 rounded-t-full" />
                  <div className="w-4 h-9 bg-white/40 rounded-t-full" />
                </div>
              </div>
            </div>

            {/* Sidebar bottom guide */}
            <div className="relative z-10 text-[11px] text-slate-400 bg-black/20 p-3 rounded-xl border border-white/5">
              <span className="font-semibold text-slate-200">ระบบที่เชื่อมโยงทุกภาคส่วน:</span>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[10px]">
                <div className="p-1 bg-white/5 rounded">ผู้ถูกคุมประพฤติ</div>
                <div className="p-1 bg-white/5 rounded">เจ้าหน้าที่คุมประพฤติ</div>
                <div className="p-1 bg-white/5 rounded">หน่วยงานภาคี</div>
              </div>
            </div>

          </div>

          {/* Right Side: Login Form with GovTech aesthetics */}
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            {/* Form Title */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">เข้าสู่ระบบ</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">SMART PROBATION ECOSYSTEM</p>
              <p className="text-[11px] text-slate-500 mt-1">กรุณาเลือกบทบาทและระบุรหัสประจำตัวเพื่อใช้งานระบบ</p>
            </div>

            {/* Role Tabs Picker */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl mb-6 border border-slate-200/50">
              <button
                type="button"
                onClick={() => setSelectedTab("PROBATIONER")}
                className={`py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  selectedTab === "PROBATIONER"
                    ? "bg-white text-[#001D3D] shadow border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>ผู้ถูกคุมประพฤติ</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("OFFICER")}
                className={`py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  selectedTab === "OFFICER"
                    ? "bg-white text-[#001D3D] shadow border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>เจ้าหน้าที่</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("PARTNER")}
                className={`py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  selectedTab === "PARTNER"
                    ? "bg-white text-[#001D3D] shadow border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>หน่วยงานภาคี</span>
              </button>
            </div>

            {/* Mock/Test Credentials Section */}
            <div className="mb-5 bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs text-slate-700 shadow-sm">
              <div className="flex items-center space-x-1.5 mb-2.5 text-amber-800 font-bold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>ระบบบัญชีสาธิตสำหรับทดสอบ (คลิกเพื่อเลือกบทบาทและกรอกข้อมูลด่วน)</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {/* 1. Probationer */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTab("PROBATIONER");
                    setUsername("somchai.jaidee@email.com");
                    setPassword("somchai123");
                    addNotification("สลับไปยังบทบาทผู้ถูกคุมประพฤติ", "กรอกอีเมลทดสอบ: somchai.jaidee@email.com เรียบร้อยแล้ว", "ระบบ");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedTab === "PROBATIONER"
                      ? "bg-blue-50/80 border-blue-200 ring-1 ring-blue-200"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 text-xs">
                      ผู้ถูก
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-800">1. ผู้ถูกคุมประพฤติ (นายสมชาย)</div>
                      <div className="text-[10px] text-slate-500 font-mono">somchai.jaidee@email.com / somchai123</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    เลือกและกรอกข้อมูล
                  </span>
                </button>

                {/* 2. Officer */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTab("OFFICER");
                    setUsername("nattapong.officer@probation.go.th");
                    setPassword("officer123");
                    addNotification("สลับไปยังบทบาทเจ้าหน้าที่", "กรอกอีเมลทดสอบ: nattapong.officer@probation.go.th เรียบร้อยแล้ว", "ระบบ");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedTab === "OFFICER"
                      ? "bg-red-50/80 border-red-200 ring-1 ring-red-200"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0 text-xs">
                      เจ้าหน้าที่
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-800">2. เจ้าหน้าที่คุมประพฤติ (นายณัฐพงษ์)</div>
                      <div className="text-[10px] text-slate-500 font-mono">nattapong.officer@probation.go.th / officer123</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    เลือกและกรอกข้อมูล
                  </span>
                </button>

                {/* 3. Partner */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTab("PARTNER");
                    setUsername("temple.organizer@buddha.or.th");
                    setPassword("partner123");
                    addNotification("สลับไปยังบทบาทหน่วยงานภาคี", "กรอกอีเมลทดสอบ: temple.organizer@buddha.or.th เรียบร้อยแล้ว", "ระบบ");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedTab === "PARTNER"
                      ? "bg-emerald-50/80 border-emerald-200 ring-1 ring-emerald-200"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-xs">
                      ภาคี
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-800">3. หน่วยงานภาคี (วัดพระธรรมกาย)</div>
                      <div className="text-[10px] text-slate-500 font-mono">temple.organizer@buddha.or.th / partner123</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    เลือกและกรอกข้อมูล
                  </span>
                </button>
              </div>
            </div>

            {/* Actual Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Field: Username */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  เลขประจำตัวประชาชน / เลขบัตรประจำตัวเจ้าหน้าที่ / อีเมล
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={getPlaceholderUsername()}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#cca43b]/40 focus:border-[#cca43b] transition-all outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    รหัสผ่านเข้าใช้งาน
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("💡 สำหรับผู้ถูกคุมประพฤติ: รหัสเริ่มต้นคือรหัส 6 หลักที่สำนักงานจัดส่งทาง SMS หรือติดต่อสายด่วน 0 2141 4740 เพื่อขอรหัสใหม่")}
                    className="text-[10px] text-[#cca43b] font-bold hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน (รหัสผ่านสาธิต กรอกอะไรก็ได้)"
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#cca43b]/40 focus:border-[#cca43b] transition-all outline-none text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#cca43b] focus:ring-[#cca43b] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer select-none">
                  จดจำรหัสประจำตัวไว้ในระบบ
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#1b439c] hover:bg-[#cca43b] hover:text-[#001D3D] text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>เข้าสู่ระบบความปลอดภัย</span>
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-400 font-bold">หรือ</span></div>
            </div>

            {/* Gov Alternative logins */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setRole(selectedTab);
                  setIsLoggedIn(true);
                  addNotification("เข้าสู่ระบบด้วย ThaiID สำเร็จ", "ระบบซิงโครไนซ์ข้อมูลพาสปอร์ตส่วนตัวด้วย ThaiID เรียบร้อย", "ระบบ");
                }}
                className="w-full border border-slate-300 hover:border-[#1b439c] bg-white text-slate-700 hover:text-[#1b439c] py-2.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                <span>เข้าสู่ระบบด้วย <b>ThaiID</b></span>
              </button>
              
              <button
                onClick={() => {
                  setRole(selectedTab);
                  setIsLoggedIn(true);
                  addNotification("เข้าสู่ระบบด้วย Digital ID สำเร็จ", "ระบบซิงโครไนซ์เอกสารด้วย Digital ID เรียบร้อย", "ระบบ");
                }}
                className="w-full border border-slate-300 hover:border-emerald-600 bg-white text-slate-700 hover:text-emerald-600 py-2.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                <span>เข้าสู่ระบบด้วย <b>Digital ID</b></span>
              </button>
            </div>

            {/* Document Guide */}
            <a
              href="#guide"
              onClick={(e) => {
                e.preventDefault();
                alert("📖 ดาวน์โหลดคู่มือผู้ถูกคุมประพฤติเวอร์ชัน PDF (ขนาด 12MB) สำหรับอธิบายเกณฑ์การรายงานตัวและสะสมชั่วโมงสาธารณประโยชน์");
              }}
              className="mt-6 text-center text-[11px] text-slate-500 hover:text-[#cca43b] transition-all flex items-center justify-center space-x-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#cca43b]" />
              <span>เปิดคู่มือการสอนใช้งานระบบออนไลน์</span>
            </a>

          </div>
        </div>

      </div>

      {/* Bottom Summary Statistics Row (ณ วันที่ 20 พฤษภาคม 2567) */}
      <div className="bg-[#001D3D] text-white border-y border-[#cca43b]/20 py-4 px-6 md:px-12">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex items-center space-x-2 text-[#cca43b] text-xs font-bold mb-3">
            <BarChart3 className="w-4 h-4" />
            <span>ข้อมูลภาพรวมระดับประเทศ (ณ วันรายงานตัวล่าสุด 20 พฤษภาคม 2567)</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Stat 1 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-semibold">ผู้ถูกคุมประพฤติทั้งหมด</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg md:text-xl font-extrabold text-[#cca43b]">28,246</span>
                <span className="text-xs text-slate-300">ราย</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-auto">↑ 9.8% จากก่อนหน้า</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-semibold">รายงานตัวสะสมวันนี้</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg md:text-xl font-extrabold text-[#cca43b]">1,245</span>
                <span className="text-xs text-slate-300">ราย</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-auto">↑ 15.7% จากเมื่อวาน</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-semibold">ชั่วโมงบริการสังคมรวม</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg md:text-xl font-extrabold text-[#cca43b]">1,245,678</span>
                <span className="text-xs text-slate-300">ชม.</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-auto">↑ 12.3% จากไตรมาสก่อน</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-semibold">อัตราการกระทำผิดซ้ำ</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg md:text-xl font-extrabold text-red-400">12.45%</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-auto">↓ 2.35% จากเป้าหมาย</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer information section */}
      <footer className="bg-[#00152e] text-slate-400 py-4 px-6 md:px-12 text-center md:text-left border-t border-white/5">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between text-xs space-y-3 md:space-y-0">
          <div className="flex items-center space-x-6">
            <span><b>ติดต่อสอบถาม:</b> 0 2141 4740</span>
            <span><b>เวลาทำการ:</b> จันทร์ - ศุกร์ 08:30 - 16:30 น.</span>
          </div>
          <div className="text-[11px]">
            <span>ระบบคุมประพฤติอัจฉริยะ (Smart Probation Ecosystem) • เวอร์ชัน 1.0.0</span>
            <p className="md:inline md:ml-3 block mt-1 md:mt-0 font-medium text-slate-500">© 2024 Department of Probation. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
