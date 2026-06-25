import React from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Clock, CheckCircle2, AlertTriangle, Calendar, Star, MapPin, Award, Check } from "lucide-react";

export const ServiceHourTracker: React.FC = () => {
  const { probationerProfile, activities } = useApp();

  const completedActivities = activities.filter(act => 
    act.applicants.some(app => app.probationerId === probationerProfile.id && app.status === "เสร็จสิ้น")
  );

  const hoursPct = Math.round((probationerProfile.completedHours / probationerProfile.requiredHours) * 100);
  const remainingHours = Math.max(0, probationerProfile.requiredHours - probationerProfile.completedHours);

  return (
    <div className="space-y-6">
      
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">ประวัติและชั่วโมงบำเพ็ญประโยชน์ (Service Hour Tracker)</h2>
        <p className="text-xs text-slate-400 mt-1">
          ตรวจสอบประวัติการทำความดี ยอดสะสมชั่วโมงช่วยเหลือประชาชน และคะแนนพฤติกรรมจากหน่วยงานผู้ควบคุม
        </p>
      </div>

      {/* Stats counter row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Completed Hours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ชั่วโมงทำความดีสะสม</span>
            <span className="text-3xl font-extrabold text-[#001D3D] block">{probationerProfile.completedHours} ชั่วโมง</span>
            <span className="text-[10px] text-emerald-600 font-bold">จากเป้าหมาย {probationerProfile.requiredHours} ชั่วโมง</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* KPI 2: Remaining Hours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ชั่วโมงที่ยังขาดอยู่</span>
            <span className="text-3xl font-extrabold text-amber-600 block">{remainingHours} ชั่วโมง</span>
            <span className="text-[10px] text-slate-400 font-bold">ต้องจัดหาส่งภายในกำหนด</span>
          </div>
          <div className="p-4 bg-amber-50 rounded-full border border-amber-100 text-amber-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* KPI 3: Progress percentage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">เปอร์เซ็นต์ความสำเร็จ</span>
            <span className="text-3xl font-extrabold text-[#1b439c] block">{hoursPct}%</span>
            <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-[#cca43b] h-full" style={{ width: `${hoursPct}%` }} />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-full border border-blue-100 text-[#1b439c]">
            <Award className="w-8 h-8" />
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: History stream of completed social works (Col Span 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>ประวัติกิจกรรมทำความดีที่ได้รับรองผลงานแล้ว</span>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              เสร็จสิ้นทั้งหมด {completedActivities.length} รายการ
            </span>
          </h3>

          {completedActivities.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              ยังไม่มีการบันทึกชั่วโมงกิจกรรมที่ได้รับการยืนยันผลจากหน่วยงานภาคี
            </div>
          ) : (
            <div className="space-y-4">
              {completedActivities.map((act) => {
                const myApp = act.applicants.find(a => a.probationerId === probationerProfile.id);
                const rating = myApp?.rating;

                return (
                  <div key={act.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 hover:border-slate-300 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={act.imageUrl}
                          alt={act.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{act.title}</h4>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{act.organizer}</span>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                          ✓ บันทึกชั่วโมงแล้ว
                        </span>
                        <p className="text-xs font-extrabold text-[#cca43b] mt-1 font-mono">+{act.hours} ชั่วโมงทำความดี</p>
                      </div>
                    </div>

                    {/* Timeline Check-in info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200/30">
                      <div>
                        <span className="text-slate-400 block font-medium">วันที่จัดงาน:</span>
                        <span className="font-bold text-slate-700">{act.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">เวลางานทั้งหมด:</span>
                        <span className="font-bold text-slate-700">{act.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">เวลาเช็กอิน (จริง):</span>
                        <span className="font-bold text-slate-700">{myApp?.checkInTime || "08:35:10"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">เวลาเช็กเอาต์ (จริง):</span>
                        <span className="font-bold text-slate-700">{myApp?.checkOutTime || "12:05:00"}</span>
                      </div>
                    </div>

                    {/* Evaluation results */}
                    {rating && (
                      <div className="p-3 bg-white border border-slate-200/50 rounded-lg text-[11px] space-y-2">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-100 pb-1.5 font-bold">
                          <span>ผลการประเมินจากผู้ควบคุมงาน:</span>
                          <span className="text-[#cca43b]">{rating.date}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-semibold">
                          <div>
                            <span className="text-slate-400 block font-medium text-[9px]">ความรับผิดชอบ:</span>
                            <span className="text-[#cca43b]">{rating.responsibility} / 5 ดาว</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium text-[9px]">ความตรงต่อเวลา:</span>
                            <span className="text-[#cca43b]">{rating.punctuality} / 5 ดาว</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium text-[9px]">ความร่วมมือ:</span>
                            <span className="text-[#cca43b]">{rating.cooperation} / 5 ดาว</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium text-[9px]">พฤติกรรมโดยรวม:</span>
                            <span className="text-[#cca43b]">{rating.behavior} / 5 ดาว</span>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="p-2 bg-slate-50 rounded italic text-slate-600 border-l-2 border-[#cca43b] leading-relaxed mt-1">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Criteria details and progress dial */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">เกณฑ์กำหนดชั่วโมงบำเพ็ญประโยชน์</h4>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              สอดคล้องตามประมวลกฎหมายอาญา มาตรา 56 แห่งศาลสถิตยุติธรรมไทย กรมคุมประพฤติกำหนดหลักการสะสมชั่วโมงสาธารณประโยชน์ดังนี้:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <div className="p-1 bg-blue-100 text-blue-700 rounded mt-0.5"><Check className="w-3 h-3" /></div>
                <div>
                  <span className="font-bold block text-slate-800">งานศาสนา / พัฒนาวัด</span>
                  <span className="text-slate-500 block text-[10px]">ปัดกวาดเช็ดถูวัด, ถือศีล, ช่วยงานเทศกาล (4 ชม. ต่อรอบ)</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="p-1 bg-blue-100 text-blue-700 rounded mt-0.5"><Check className="w-3 h-3" /></div>
                <div>
                  <span className="font-bold block text-slate-800">งานช่วยเหลือสังคมสิ่งแวดล้อม</span>
                  <span className="text-slate-500 block text-[10px]">ปลูกต้นไม้, กำจัดวัชพืชรอบคลองสาธารณะ (4 ชม. ต่อรอบ)</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="p-1 bg-blue-100 text-blue-700 rounded mt-0.5"><Check className="w-3 h-3" /></div>
                <div>
                  <span className="font-bold block text-slate-800">งานสาธารณสุข / เยี่ยมผู้ป่วย</span>
                  <span className="text-slate-500 block text-[10px]">ช่วยเสิร์ฟอาหารกลางวันโรงนอนผู้สูงอายุ (4 ชม. ต่อรอบ)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#001D3D] to-[#003466] text-white p-6 rounded-2xl border border-[#cca43b]/10 shadow-md space-y-3">
            <span className="text-[10px] text-[#cca43b] font-bold block uppercase tracking-wider">ใบรับรองสากล</span>
            <h5 className="text-xs font-bold leading-relaxed">พิมพ์ใบรับรองการบำเพ็ญประโยชน์</h5>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              เมื่อทำชั่วโมงครบ 200 ชั่วโมงตามเกณฑ์แล้ว ท่านสามารถกดปุ่มเพื่อพิมพ์เอกสารดิจิทัลที่มีลายเซ็นประทับ เพื่อยื่นต่อศาลสถิตยุติธรรมเพื่อปิดคดีโดยอัตโนมัติ
            </p>
            <button
              onClick={() => {
                if (hoursPct < 100) {
                  alert(`⚠️ ชั่วโมงสะสมของท่านในระบบคือ ${probationerProfile.completedHours} / 200 ชม. ยังสะสมไม่ครบตามแผนเงื่อนไขศาล กรุณาเข้าร่วมกิจกรรมบำเพ็ญประโยชน์ให้ครบถ้วนเพื่อเปิดปุ่มพิมพ์เอกสารนำเสนอศาล`);
                } else {
                  alert("🎉 ยินดีด้วยค่ะ! ชั่วโมงสะสมครบ 100% แล้ว กำลังสร้างเอกสารใบรับรองผลงานส่งพิมพ์...");
                }
              }}
              className="w-full bg-[#cca43b] text-[#00152e] hover:bg-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow border border-[#cca43b]"
            >
              พิมพ์ใบรับรองปิดแผนคดี
            </button>
          </div>

        </div>

      </div>

      {/* Footer quotes */}
      <GovBanner />

    </div>
  );
};
