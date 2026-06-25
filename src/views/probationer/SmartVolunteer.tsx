import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Search, MapPin, Calendar, Clock, Eye, Send, Users, Filter, CheckCircle2, RefreshCw } from "lucide-react";

export const SmartVolunteer: React.FC = () => {
  const { activities, probationerProfile, applyForActivity, currentView, setCurrentView } = useApp();
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");

  const categories = ["ทั้งหมด", "วัด/ศาสนสถาน", "โรงเรียน/การศึกษา", "เทศบาล/ชุมชน", "สิ่งแวดล้อม", "สาธารณประโยชน์"];

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = provinceFilter === "ทั้งหมด" || act.province === provinceFilter;
    const matchesCategory = categoryFilter === "ทั้งหมด" || act.category === categoryFilter;
    
    return matchesSearch && matchesProvince && matchesCategory;
  });

  const handleApply = (id: string) => {
    applyForActivity(id, probationerProfile.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">ค้นหากิจกรรมบริการสังคม (Smart Volunteer)</h2>
        <p className="text-xs text-slate-400 mt-1">สมัครเข้าร่วมกิจกรรมสาธารณประโยชน์ ทำดีสะสมชั่วโมงช่วยเหลือประชาชนเพื่อปฏิบัติตามคำสั่งศาล</p>
      </div>

      {/* Main Filter Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Row 1: Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Text Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="พิมพ์คำค้นหากิจกรรม, สถานที่จัดงาน, หน่วยงาน"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#cca43b]/40 outline-none transition-all"
            />
          </div>

          {/* Select Province */}
          <div>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#cca43b]/40 transition-all text-slate-700"
            >
              <option value="ทั้งหมด">กรองตามจังหวัด: ทั้งหมด</option>
              <option value="ปทุมธานี">ปทุมธานี</option>
              <option value="นนทบุรี">นนทบุรี</option>
              <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
              <option value="สงขลา">สงขลา</option>
            </select>
          </div>

          {/* Buttons: Submit & Reset */}
          <div className="flex space-x-2">
            <button
              onClick={() => alert(`🔍 ค้นหากิจกรรมที่ตรงกันทั้งหมด ${filteredActivities.length} รายการสำเร็จ`)}
              className="flex-1 bg-[#1b439c] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors py-2 flex items-center justify-center space-x-1 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>ค้นหา</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                setProvinceFilter("ทั้งหมด");
                setCategoryFilter("ทั้งหมด");
              }}
              className="px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-500 hover:text-slate-700 transition-all"
              title="ล้างตัวกรอง"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Row 2: Pills categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-2">หมวดหมู่:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                categoryFilter === cat
                  ? "bg-[#cca43b] text-[#001D3D] border-[#cca43b] shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid: Map on the right, list on the left */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Grid column: list of volunteer jobs (col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">กิจกรรมแนะนำสำหรับคุณ ({filteredActivities.length} กิจกรรม)</h3>
          
          {filteredActivities.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              ไม่พบกิจกรรมคุมประพฤติบำเพ็ญประโยชน์ที่ตรงเงื่อนไขที่คุณระบุ กรุณาลองเลือกตัวกรองใหม่อีกครั้ง
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((act) => {
                const myApp = act.applicants.find(a => a.probationerId === probationerProfile.id);
                const hasApplied = !!myApp;
                const appStatus = myApp?.status;

                return (
                  <div key={act.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                    
                    {/* Top image & meta tag */}
                    <div className="relative h-40 w-full overflow-hidden shrink-0">
                      <img
                        src={act.imageUrl}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#001D3D] text-[#cca43b] text-[9px] font-extrabold px-2.5 py-1 rounded-lg border border-[#cca43b]/30 shadow-md">
                        {act.category}
                      </span>
                    </div>

                    {/* Description body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug hover:text-[#1b439c] transition-colors">{act.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center">
                          <MapPin className="w-3 h-3 text-[#cca43b] mr-1 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Detail row */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
                          <span>{act.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
                          <span>{act.time}</span>
                        </div>
                        <div className="flex items-center col-span-2 text-[#cca43b] bg-amber-50/50 py-1 px-2.5 rounded-lg border border-amber-100/50 justify-between mt-1.5">
                          <span>ชั่วโมงทำความดี:</span>
                          <span className="font-mono text-xs font-extrabold">{act.hours} ชั่วโมงสะสม</span>
                        </div>
                      </div>

                    </div>

                    {/* Interactive Action buttons */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => alert(`ℹ️ รายละเอียดกิจกรรม:\n\nหัวข้อ: ${act.title}\nหน่วยงานจัด: ${act.organizer}\nสถานที่จัด: ${act.location}\nเวลางาน: ${act.date} (${act.time})\nสะสมชั่วโมง: ${act.hours} ชั่วโมง`)}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>รายละเอียด</span>
                      </button>

                      {hasApplied ? (
                        <div className="flex-1 text-center">
                          {appStatus === "รออนุมัติ" && (
                            <span className="w-full block bg-amber-100 text-amber-800 border border-amber-200/50 py-2 rounded-xl text-[11px] font-extrabold shadow-sm">
                              ⏳ รออนุมัติ...
                            </span>
                          )}
                          {appStatus === "อนุมัติแล้ว" && (
                            <button
                              onClick={() => setCurrentView("TRACKER")} // Go to check in tracker screen
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center space-x-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>อนุมัติแล้ว (สแกน QR)</span>
                            </button>
                          )}
                          {appStatus === "เสร็จสิ้น" && (
                            <span className="w-full block bg-slate-200 text-slate-500 py-2 rounded-xl text-[11px] font-extrabold">
                              ✓ เข้าร่วมแล้ว
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(act.id)}
                          disabled={act.status !== "เปิดรับสมัคร"}
                          className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 shadow-sm ${
                            act.status === "เปิดรับสมัคร"
                              ? "bg-[#cca43b] hover:bg-[#001D3D] text-[#00152e] hover:text-white"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>สมัครเข้าร่วม</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right column: Interactive map and stats */}
        <div className="space-y-6">
          
          {/* Simulated Geographic Location Map (Page 5) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>แผนที่กิจกรรมใกล้เคียง</span>
              <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">GPS: ปทุมธานี</span>
            </h3>
            
            {/* Visual mockup map canvas wrapper */}
            <div className="relative h-64 bg-sky-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Fake roads and rivers lines drawn using grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400" />
                <div className="absolute top-0 left-1/3 w-1.5 h-full bg-blue-500" />
                <div className="absolute top-1/4 left-0 w-full h-0.5 bg-slate-300" />
                <div className="absolute top-0 left-2/3 w-0.5 h-full bg-slate-300" />
              </div>

              {/* Thailand Pathum Thani area label */}
              <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[9px] font-bold text-slate-500 px-2 py-1 rounded shadow-sm">
                อ.คลองหลวง จ.ปทุมธานี
              </span>

              {/* Marker pin 1: Temple */}
              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <div className="p-1.5 bg-red-600 text-white rounded-full shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm text-slate-700 mt-1">วัดพระธรรมกาย</span>
              </div>

              {/* Marker pin 2: School */}
              <div className="absolute top-2/3 left-1/2 flex flex-col items-center">
                <div className="p-1.5 bg-[#cca43b] text-white rounded-full shadow-lg border-2 border-white">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm text-slate-700 mt-1">ร.ร.คลองหลวง</span>
              </div>

              {/* Marker pin 3: Park */}
              <div className="absolute top-1/4 left-2/3 flex flex-col items-center">
                <div className="p-1.5 bg-emerald-600 text-white rounded-full shadow-lg border-2 border-white">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="bg-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm text-slate-700 mt-1">สวนสาธารณะ</span>
              </div>

              {/* ZOOM CONTROLS */}
              <div className="absolute bottom-3 right-3 flex flex-col space-y-1">
                <button onClick={() => alert("🔍 ซูมเข้าแผนที่สำเร็จ")} className="w-6 h-6 bg-white rounded border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-sm">+</button>
                <button onClick={() => alert("🔍 ซูมออกแผนที่สำเร็จ")} className="w-6 h-6 bg-white rounded border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-sm">-</button>
              </div>

            </div>

            <p className="text-[10px] text-slate-400 font-semibold text-center leading-relaxed">
              * แฟลตฟอร์มระบุพิกัดอัตโนมัติรอบที่อยู่อาศัยของคุณในรัศมี 15 กิโลเมตร
            </p>
          </div>

          {/* Social Volunteer Stats widgets (Page 5 bottom) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">สถิติสะสมกิจกรรมบำเพ็ญประโยชน์</h4>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">กิจกรรมสะสมสำเร็จ</span>
                <span className="text-xl font-extrabold text-[#001D3D] block mt-1">5</span>
                <span className="text-[9px] text-[#cca43b] font-bold">จาก 6 ทริป</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">ประโยชน์ต่อสังคม</span>
                <span className="text-xl font-extrabold text-[#001D3D] block mt-1">150+</span>
                <span className="text-[9px] text-[#cca43b] font-bold">คนได้รับความดี</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-2 text-blue-800">
              <span className="font-bold block">📌 แนะนำสำหรับการทำดีถัดไป:</span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                เนื่องจากชั่วโมงบำเพ็ญประโยชน์ของคุณสมชายขาดอีกเพียง **50 ชั่วโมง** แนะนำให้สมัครกิจกรรมเทศบาลเมืองปทุมธานีในวันพุธถัดไปเพื่อสะสมให้ครบตามเป้าหมายของคำสั่งศาลค่ะ
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Decorative quotes */}
      <GovBanner />

    </div>
  );
};
