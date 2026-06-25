import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Briefcase, BookOpen, Star, HelpCircle, ArrowRight, Building, Award, CheckCircle } from "lucide-react";

export const ReStartJobHub: React.FC = () => {
  const { jobs, courses } = useApp();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApplyJob = (jobId: string, jobTitle: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs(prev => [...prev, jobId]);
    alert(`💼 ส่งเอกสารใบสมัครของท่านสำหรับตำแหน่ง '${jobTitle}' ไปยังแผนกบุคคลของบริษัทเรียบร้อย! โปรดรอเจ้าหน้าที่ติดต่อกลับเพื่อรับวันสัมภาษณ์งาน`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">ศูนย์อาชีพคนดี (ReStart Job Hub)</h2>
        <p className="text-xs text-slate-400 mt-1">
          โอกาสแก้ไขปรับตัวเริ่มต้นชีวิตใหม่ด้วยงานสุจริตและหลักสูตรฝึกทักษะอาชีพออนไลน์ฟรี 100% สิทธิประโยชน์สนับสนุนโดยกรมคุมประพฤติร่วมกับบริษัทพันธมิตร
        </p>
      </div>

      {/* Stats job overview row (Page 9 top right) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">ตำแหน่งงานเปิดรับ</span>
          <span className="text-2xl font-extrabold text-[#001D3D] block mt-1">124</span>
          <span className="text-[9px] text-[#cca43b] font-bold">บริษัทชั้นนำร่วมทุน</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">ยื่นใบสมัครสำเร็จ</span>
          <span className="text-2xl font-extrabold text-[#001D3D] block mt-1">{appliedJobs.length}</span>
          <span className="text-[9px] text-emerald-500 font-bold">ตรวจสอบสถานะใบสมัคร</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">เรียกสัมภาษณ์งาน</span>
          <span className="text-2xl font-extrabold text-[#001D3D] block mt-1">4</span>
          <span className="text-[9px] text-[#cca43b] font-bold">รอการนัดหมายติดต่อ</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">ได้งานสุจริตแล้ว</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">2</span>
          <span className="text-[9px] text-emerald-500 font-bold">✓ พ้นจากการรายงานตัว</span>
        </div>
      </div>

      {/* Main Job Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Job lists & Partner logos (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Job Recommendations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>ตำแหน่งงานแนะนำประจำวันสำหรับคุณ</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                ตรงตามข้อมูลพฤติกรรมของคุณ
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const hasApplied = appliedJobs.includes(job.id);
                return (
                  <div key={job.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all">
                    
                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                          {job.company}
                        </span>
                        <span className="text-xs font-extrabold text-[#cca43b]">{job.salary}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-2 leading-snug">{job.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                        <Building className="w-3 h-3 mr-1 text-slate-400" />
                        <span>พื้นที่ปฏิบัติงาน: {job.location}</span>
                      </p>
                      
                      {/* Qualification info */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 mt-3 font-semibold">
                        <div>
                          <span className="text-slate-400 block text-[8px] uppercase">คุณสมบัติ</span>
                          <span>{job.qualification}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[8px] uppercase">ประสบการณ์</span>
                          <span>{job.experience}</span>
                        </div>
                      </div>

                      {/* Tag pills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-200/50 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply actions */}
                    <button
                      onClick={() => handleApplyJob(job.id, job.title)}
                      className={`w-full mt-4 py-2 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center space-x-1 ${
                        hasApplied
                          ? "bg-emerald-500 text-white border-emerald-500 cursor-default"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 hover:border-[#1b439c]"
                      }`}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>สมัครเรียบร้อยแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>สมัครเข้ารับการสัมภาษณ์</span>
                        </>
                      )}
                    </button>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Partner logos (Page 9 left bottom) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-4">
              องค์กรพันธมิตรที่ร่วมส่งเสริมสิทธิ์คนสร้างตัว
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center items-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-sm font-extrabold text-slate-700 block">SCG</span>
                <span className="text-[8px] text-slate-400">ปูนซิเมนต์ไทย</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-sm font-extrabold text-slate-700 block">CP ALL</span>
                <span className="text-[8px] text-slate-400">ซีพี ออลล์ (7-11)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-sm font-extrabold text-slate-700 block">PTT</span>
                <span className="text-[8px] text-slate-400">ปตท. น้ำมัน</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                <span className="text-sm font-extrabold text-slate-700 block">Lotus's</span>
                <span className="text-[8px] text-slate-400">โลตัสซุปเปอร์</span>
              </div>
            </div>
          </div>

          {/* Section: Online Training Courses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>หลักสูตรพัฒนาทักษะวิชาชีพฟรีออนไลน์</span>
              <button onClick={() => alert("📖 เปิดแค็ตตาล็อกรายวิชาวิชาชีพคุมประพฤติฟรีกว่า 50 รายการจากสถาบันฝีมือแรงงาน")} className="text-xs text-[#1b439c] font-bold hover:underline">
                ดูทั้งหมด
              </button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="flex p-3 bg-slate-50 border border-slate-200 rounded-xl space-x-3 items-center hover:border-slate-300 transition-all">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">{course.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{course.provider}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center text-amber-400 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        <span>{course.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{course.views} ผู้รับชม</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                        {course.isFree ? "เรียนฟรี" : "ไม่มีค่าใช้จ่าย"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Career Recommendation Coach (Page 9 top right) */}
        <div className="space-y-6">
          
          {/* AI career suggest */}
          <div className="bg-gradient-to-br from-[#001D3D] via-[#002f5c] to-[#00152e] text-white p-6 rounded-2xl border border-[#cca43b]/20 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] text-[#cca43b] font-extrabold uppercase tracking-widest block">AI Career Advisor Coach</span>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <div className="text-center flex flex-col items-center">
              {/* Dial gauge showing 85% match */}
              <div className="relative w-28 h-28 flex items-center justify-center bg-white/5 rounded-full ring-4 ring-teal-400/10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/10" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-teal-400" strokeDasharray="85, 100" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-white">85%</span>
                  <span className="text-[8px] text-teal-300 font-bold block">Match Rate</span>
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-white mt-3">ตำแหน่งงานตรงคุณลักษณะ: <b>ช่างเทคนิคซ่อมบำรุง</b></h4>
              <p className="text-[10px] text-slate-300 mt-1 max-w-xs leading-relaxed">
                วิเคราะห์ผลงานจากคุณลักษณะการซ่อมแซมสีและพฤติกรรมความตั้งใจของคุณสมชาย เหมาะสมกับตำแหน่งวิชาชีพช่างเทคนิคซ่อมบำรุงมากที่สุด
              </p>
            </div>

            {/* Bullet points explaining match rationale */}
            <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed border-t border-white/10 pt-3">
              <span className="font-bold text-[#cca43b] block">เหตุผลสนับสนุนการจับคู่:</span>
              <div className="flex items-start space-x-1.5">
                <span className="text-teal-400">•</span>
                <span><b>มีทักษะงานฝีมือเด่นชัด:</b> มีส่วนร่วมสำคัญในการปรับปรุงทาสีรั้ว ร.ร.บ้านคลองหลวง และได้รับการประเมินความรับผิดชอบดีเยี่ยมจากเทศบาล</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <span className="text-teal-400">•</span>
                <span><b>ผ่านการบำบัดอย่างสม่ำเสมอ:</b> ได้รับคะแนนความประพฤติเต็ม 95 คะแนน และผ่านเกณฑ์ตรวจสารเสพติดเป็นศูนย์ (Clean status)</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <span className="text-teal-400">•</span>
                <span><b>บริษัทพันธมิตรร่วมประกันตัว:</b> บริษัท ปตท. จำกัด มีสัญญาสมทบอาชีพพร้อมอบรมเพิ่มรายได้สตาร์ทอัป 18,000 บาท</span>
              </div>
            </div>

            <button
              onClick={() => alert("💬 เปิดกระดานสัมมนา AI Career Coach: กำลังพาสร้างประวัติเรซูเม่อัจฉริยะสำหรับส่งให้บริษัทพันธมิตรเรียบร้อย")}
              className="w-full bg-teal-400 hover:bg-teal-500 text-[#00152e] py-2 px-3 rounded-xl text-[10px] font-bold transition-all shadow"
            >
              ปรึกษา AI Career Coach เพิ่มเติม
            </button>

          </div>

          {/* Guidelines on probationer job placement */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">สิทธิประโยชน์ผู้ถูกจ้างงานสุจริต</h4>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed list-disc list-inside">
              <li>ได้รับการเสนอรายชื่อขอลดระยะเวลาควบคุมความประพฤติต่อเจ้าพนักงานเมื่อทำงานสุจริตติดต่อกันครบ 6 เดือน</li>
              <li>เงินสงเคราะห์กู้ยืมสวัสดิการประกอบอาชีพรายย่อย วงเงินกู้สูงสุด 50,000 บาท ดอกเบี้ย 0% นาน 1 ปีแรก</li>
              <li>สิทธิ์คุ้มครองความปลอดภัยจากเจ้าหน้าที่เยี่ยมบ้านสม่ำเสมอสัปดาห์ละ 1 ครั้งเพื่อความปลอดภัยในงาน</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Quote Banner */}
      <GovBanner />

    </div>
  );
};
