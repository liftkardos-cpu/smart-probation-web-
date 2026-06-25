import React from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Clock, Calendar, CheckCircle, Shield, FileText, Star, ArrowRight, Activity, Bell, Briefcase, MessageSquare, MapPin, HeartHandshake, Folder } from "lucide-react";

export const ProbationerDashboard: React.FC = () => {
  const { probationerProfile, activities, setCurrentView, appointments } = useApp();

  // Calculate percentage for hours
  const hoursPct = Math.round((probationerProfile.completedHours / probationerProfile.requiredHours) * 100);

  // Render stars based on behavior score
  const renderStars = (score: number) => {
    const starCount = Math.round(score / 20); // 95 -> 5 stars
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < starCount ? "fill-amber-400" : "text-slate-200"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Profile summary & Next report timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal ID card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#001D3D] to-[#002f5c] text-white p-6 rounded-2xl shadow-md border border-[#cca43b]/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-5">
            <img
              src={probationerProfile.avatarUrl}
              alt={probationerProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#cca43b] shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{probationerProfile.name}</h2>
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {probationerProfile.status}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">รหัสผู้คุมประพฤติ: <span className="font-mono font-bold text-[#cca43b]">{probationerProfile.id}</span></p>
              <p className="text-slate-400 text-[11px] mt-0.5">อายุ {probationerProfile.age} ปี | คดีหลัก: {probationerProfile.charge}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentView("PROFILE")}
            className="bg-[#cca43b] hover:bg-white text-[#00152e] hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow border border-[#cca43b] flex items-center space-x-1"
          >
            <span>ดูข้อมูลคดีอย่างละเอียด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Report Alert Card */}
        <div className="bg-[#fff9e6] border border-[#f5c642]/30 p-6 rounded-2xl shadow-md flex items-start space-x-4">
          <div className="p-3 bg-[#f5c642]/10 rounded-xl border border-[#f5c642]/20">
            <Calendar className="w-6 h-6 text-[#cca43b]" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">นัดรายงานตัวด่วน</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1 leading-snug">
              วันรายงานตัวครั้งถัดไป: 20 พฤษภาคม 2567
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">เวลา 08:30 น. (สำนักงานปทุมธานี)</p>
            <div className="flex items-center justify-between mt-3">
              <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg animate-pulse">
                เหลืออีก 5 วัน
              </span>
              <button
                onClick={() => setCurrentView("ONLINE_REPORT")}
                className="text-xs text-[#001D3D] font-bold hover:underline flex items-center space-x-0.5"
              >
                <span>กดเพื่อขอรายงานตัว</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 6-Part KPI Status Indicators Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Accumulated Hours */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชั่วโมงสะสมทำความดี</span>
          <div className="mt-2 flex items-center space-x-3">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              {/* Circular progress track */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#cca43b]" strokeDasharray={`${hoursPct}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-700">{hoursPct}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{probationerProfile.completedHours} / {probationerProfile.requiredHours}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">ชั่วโมง</p>
            </div>
          </div>
        </div>

        {/* KPI 2: Attended Activities */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ร่วมกิจกรรมแล้ว</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#001D3D]">{probationerProfile.totalActivities}</span>
            <span className="text-xs text-slate-400 font-bold">กิจกรรม</span>
          </div>
          <span className="text-[9px] text-emerald-500 font-bold mt-1 block">✓ สำเร็จ 5, รอเข้าร่วม 1</span>
        </div>

        {/* KPI 3: Reporting Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายงานตัวสำเร็จ</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#001D3D]">{probationerProfile.completedReports}</span>
            <span className="text-slate-400 text-xs">/ {probationerProfile.totalReports}</span>
            <span className="text-[10px] text-slate-400 font-bold">ครั้ง</span>
          </div>
          <span className="text-[9px] text-emerald-500 font-bold mt-1 block">✓ ครบถ้วนตามกำหนด</span>
        </div>

        {/* KPI 4: Conduct behavior score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">คะแนนความประพฤติ</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#001D3D]">{probationerProfile.behaviorScore}</span>
            <span className="text-[10px] text-slate-400 font-bold ml-1">คะแนน</span>
            {renderStars(probationerProfile.behaviorScore)}
          </div>
        </div>

        {/* KPI 5: Uploaded files */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เอกสารในระบบ</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#001D3D]">{probationerProfile.documentCount}</span>
            <span className="text-slate-400 text-xs">/ {probationerProfile.totalDocuments}</span>
            <span className="text-[10px] text-slate-400 font-bold">ไฟล์</span>
          </div>
          <span className="text-[9px] text-amber-500 font-bold mt-1 block">⚠️ ขาดเอกสารส่งตัว 1 ใบ</span>
        </div>

        {/* KPI 6: Overall Status badge */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สถานะคุมประพฤติ</span>
          <div className="mt-3 flex items-center space-x-1.5">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-extrabold text-emerald-600">ปกติและสงบเสงี่ยม</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">อัปเดตระบบ: ล่าสุดวันนี้</span>
        </div>

      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hour Tracker Chart Simulator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">กราฟความคืบหน้าชั่วโมงบำเพ็ญประโยชน์</h3>
                <p className="text-[11px] text-slate-400">แสดงเปรียบเทียบชั่วโมงสะสมจริงกับเป้าหมายตามเกณฑ์ศาล</p>
              </div>
              <span className="text-xs text-[#cca43b] font-bold bg-[#cca43b]/10 py-1 px-3 rounded-lg border border-[#cca43b]/20">
                เป้าหมาย: 200 ชั่วโมง
              </span>
            </div>
            
            {/* Visual Simulator bar chart */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>ชั่วโมงสะสมปัจจุบัน (ทำความสะอาดวัด, ทาสีโรงเรียน, อบรมวิชาชีพ)</span>
                  <span className="font-bold text-[#1b439c]">{probationerProfile.completedHours} / 200 ชม. ({hoursPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-[#1b439c] to-blue-500 h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                    style={{ width: `${hoursPct}%` }}
                  >
                    {hoursPct > 15 && `${probationerProfile.completedHours} ชม.`}
                  </div>
                </div>
              </div>

              {/* Month-by-month mini logs */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold text-slate-500 pt-3">
                <div className="p-2 bg-slate-50 rounded border border-slate-200/50">
                  <span className="block text-slate-400 font-medium">ม.ค. - ก.พ.</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">30 ชม.</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200/50">
                  <span className="block text-slate-400 font-medium">มี.ค.</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">50 ชม.</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200/50">
                  <span className="block text-slate-400 font-medium">เม.ย.</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">40 ชม.</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                  <span className="block text-emerald-600 font-medium">พ.ค. (ล่าสุด)</span>
                  <span className="text-xs font-bold text-emerald-700 mt-1 block">30 ชม.</span>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-100">
                  <span className="block text-amber-600 font-medium">คงเหลือเป้า</span>
                  <span className="text-xs font-bold text-amber-700 mt-1 block">50 ชม.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Grid Menu buttons (Page 3) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">เมนูหลักบริการด่วน (Quick Access)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Button 1 */}
              <button
                onClick={() => setCurrentView("ONLINE_REPORT")}
                className="p-4 bg-[#f8fbff] hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">รายงานตัวออนไลน์</span>
                <span className="text-[9px] text-slate-400 mt-1">ส่งพาสปอร์ตรอบถัดไป</span>
              </button>

              {/* Button 2 */}
              <button
                onClick={() => setCurrentView("VOLUNTEER")}
                className="p-4 bg-[#fbfbfb] hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">กิจกรรมบริการสังคม</span>
                <span className="text-[9px] text-slate-400 mt-1">ค้นหาและสมัครเข้าร่วม</span>
              </button>

              {/* Button 3 */}
              <button
                onClick={() => setCurrentView("TRACKER")}
                className="p-4 bg-[#fcfdf9] hover:bg-lime-50 border border-slate-200 hover:border-lime-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-lime-100 text-lime-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">ชั่วโมงบำเพ็ญประโยชน์</span>
                <span className="text-[9px] text-slate-400 mt-1">ประวัติความสำเร็จสะสม</span>
              </button>

              {/* Button 4 */}
              <button
                onClick={() => setCurrentView("JOB_HUB")}
                className="p-4 bg-[#fffdfa] hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">หางาน / ฝึกอาชีพ</span>
                <span className="text-[9px] text-slate-400 mt-1">โอกาสสร้างอาชีพใหม่</span>
              </button>

              {/* Button 5 */}
              <button
                onClick={() => setCurrentView("DOCUMENTS")}
                className="p-4 bg-[#fbfcfd] hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <Folder className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">เอกสารของฉัน</span>
                <span className="text-[9px] text-slate-400 mt-1">ดูใบคำสั่งศาล/ไฟล์คดี</span>
              </button>

              {/* Button 6 */}
              <button
                onClick={() => setCurrentView("AI_ASSISTANT")}
                className="p-4 bg-[#f8fdfc] hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-teal-100 text-teal-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">AI Assistant Chat</span>
                <span className="text-[9px] text-slate-400 mt-1">ถาม-ตอบปัญหาตลอด 24 ชม.</span>
              </button>

              {/* Button 7 */}
              <button
                onClick={() => setCurrentView("NOTIFICATIONS")}
                className="p-4 bg-[#fffbfa] hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">แจ้งเตือนเร่งด่วน</span>
                <span className="text-[9px] text-slate-400 mt-1">เช็กพฤติกรรมความประพฤติ</span>
              </button>

              {/* Button 8 */}
              <button
                onClick={() => alert("📍 ระบบระบุแผนที่สิ่งอำนวยความสะดวก: กำลังดึงที่ตั้งสำนักงานคุมประพฤติและหน่วยงานบริการสังคมใกล้เคียง 10 แห่งในจังหวัดปทุมธานี")}
                className="p-4 bg-[#fcfcfc] hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-center flex flex-col items-center group shadow-sm"
              >
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">สถานที่ใกล้ตัวฉัน</span>
                <span className="text-[9px] text-slate-400 mt-1">สำนักงาน/วัด/โรงเรียน</span>
              </button>

            </div>
          </div>

        </div>

        {/* Right Sidebar Columns */}
        <div className="space-y-6">
          
          {/* Latest Attended Volunteer Activities */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">กิจกรรมที่คุณเข้าร่วมล่าสุด</h3>
              <button
                onClick={() => setCurrentView("VOLUNTEER")}
                className="text-[11px] font-bold text-[#1b439c] hover:underline"
              >
                ดูทั้งหมด
              </button>
            </div>
            
            <div className="space-y-3.5">
              {activities.slice(0, 3).map((act) => {
                const myApp = act.applicants.find(a => a.probationerId === probationerProfile.id);
                return (
                  <div key={act.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={act.imageUrl}
                        alt={act.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{act.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{act.organizer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        act.status === "เสร็จสิ้น"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {act.status}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 font-mono">{act.hours} ชม.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Announcements & News feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">ข่าวสารประชาสัมพันธ์</h3>
            
            <div className="space-y-4">
              {/* News 1 */}
              <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="text-[9px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md uppercase">Hot</span>
                <a href="#news" onClick={(e) => { e.preventDefault(); alert("📣 ข่าวด่วน: การเปิดให้ดาวน์โหลดเอกสารอิเล็กทรอนิกส์ในระบบผ่านช่องทาง Digital ID เพื่อเพิ่มความเร็วในการยื่นประกันตัว"); }} className="block text-xs font-bold text-slate-800 hover:text-[#1b439c] transition-colors mt-1 leading-normal">
                  เปิดตัวบริการดาวน์โหลดเอกสารกฎหมายผ่านระบบออนไลน์ฟรี 100%
                </a>
                <p className="text-[10px] text-slate-400 mt-1">เผยแพร่เมื่อ: 18 พฤษภาคม 2567</p>
              </div>

              {/* News 2 */}
              <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md uppercase">ข่าวกรม</span>
                <a href="#news" onClick={(e) => { e.preventDefault(); alert("📣 ข่าวประชาสัมพันธ์: โครงการฝึกหัดทำวิชาชีพร้านกาแฟ และคลังสินค้า ร่วมกับ CP All คลับสะสมผู้กลับตัวช่วยเหลือสังคม"); }} className="block text-xs font-bold text-slate-800 hover:text-[#1b439c] transition-colors mt-1 leading-normal">
                  โครงการ ReStart Job Hub ขยายรับสิทธิประโยชน์ฝึกงานร่วมกับภาคเอกชน
                </a>
                <p className="text-[10px] text-slate-400 mt-1">เผยแพร่เมื่อ: 15 พฤษภาคม 2567</p>
              </div>

              {/* News 3 */}
              <div className="pb-3 last:border-0 last:pb-0">
                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md uppercase">อบรม</span>
                <a href="#news" onClick={(e) => { e.preventDefault(); alert("📣 การฝึกสัมมนาออนไลน์: เรื่องคุณสมบัติความปลอดภัยทางวินัยยานยนต์เพื่อแก้ไขพฤติกรรมขับขี่"); }} className="block text-xs font-bold text-slate-800 hover:text-[#1b439c] transition-colors mt-1 leading-normal">
                  สัมมนาปรับวินัยยานยนต์ประพฤติสติอารมณ์เพื่อคืนคนดีสู่สังคม
                </a>
                <p className="text-[10px] text-slate-400 mt-1">เผยแพร่เมื่อ: 12 พฤษภาคม 2567</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Motivational quote bottom banner component */}
      <GovBanner />
    </div>
  );
};
