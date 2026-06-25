import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Award, FileText, CheckCircle2, ChevronRight, ArrowLeft, Download, ShieldCheck, Clock, ExternalLink } from "lucide-react";

export const CaseClosedApprovals: React.FC = () => {
  const { probationersList, activities, addNotification, closeProbationerCase, setCurrentView } = useApp();
  const [selectedPId, setSelectedPId] = useState<string>("");
  const [isApproved, setIsApproved] = useState(false);

  // Filter probationers who have completed or nearly completed their required hours
  const eligibleProbationers = probationersList.filter(p => p.completedHours >= p.requiredHours);

  // If no one is fully completed yet, fallback to all so the tester can play with anyone
  const displayedList = eligibleProbationers.length > 0 ? eligibleProbationers : probationersList.slice(0, 2);

  const activeProbationer = probationersList.find(p => p.id === selectedPId) || displayedList[0];

  const handleCloseCase = () => {
    if (!activeProbationer) return;
    closeProbationerCase(activeProbationer.id);
    setIsApproved(true);
    addNotification(
      `ยินดีด้วย! ศาลพิจารณาปิดคดีสำเร็จ`,
      `ความพยายามบำเพ็ญประโยชน์ครบถ้วน ${activeProbationer.completedHours} ชั่วโมง ได้รับการตรวจอนุมัติส่งเรื่องศาลเพื่อยกเลิกทัณฑ์บนอย่างเป็นทางการแล้ว`,
      "ศาลสถิตยุติธรรม"
    );
    alert(`🎉 ดำเนินการอนุมัติปิดแฟ้มคดีและยื่นเสนอสำนักศาลจังหวัดปทุมธานีให้แก่คุณ ${activeProbationer.name} สำเร็จ!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">อนุมัติปิดแผนคดีและเสนอศาล (Case Closed Approval Panel)</h2>
          <p className="text-xs text-slate-400 mt-1">
            พิจารณาอนุมัติคำร้องปิดคดีความคุมประพฤติอัตโนมัติ สำหรับผู้ถูกคุมประพฤติที่บำเพ็ญประโยชน์ครบ 200 ชั่วโมงตามศาลสั่ง
          </p>
        </div>
        
        <button
          onClick={() => setCurrentView("OFFICER_DASHBOARD")}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับแดชบอร์ด</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: List of eligible probationers (Col Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>รายชื่อผู้บำเพ็ญประโยชน์สำเร็จครบ 100% รอนำเสนอศาล</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                เข้าเกณฑ์ส่งฟ้องปิดคดี
              </span>
            </h3>

            <div className="space-y-3">
              {displayedList.map((p) => {
                const isSelected = p.id === activeProbationer.id;
                const progress = Math.min(100, Math.round((p.completedHours / p.requiredHours) * 100));

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPId(p.id);
                      setIsApproved(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#fffdf5] border-[#cca43b] ring-2 ring-[#cca43b]/10"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    
                    {/* User profile */}
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover ring-2 ring-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id} • {p.charge}</p>
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-1.5 md:w-44 text-xs font-semibold text-slate-600">
                      <div className="flex justify-between">
                        <span>กิจกรรมทำความดี:</span>
                        <span className="font-extrabold text-emerald-600">{p.completedHours} / {p.requiredHours} ชม.</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* Check icon or arrow */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 py-0.5 px-2.5 rounded-full font-bold">
                        ทำดีสำเร็จครบงวด
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "rotate-90 text-[#cca43b]" : ""}`} />
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Court Petition form generator (Page 14 left bottom) */}
          {activeProbationer && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>พรีวิวดราฟต์เอกสารคำร้องเสนอศาลชั้นต้น (Draft Petition Form)</span>
                <button
                  onClick={() => alert(`⬇️ ดึงแบบบันทึกคำร้องพ้นความผิดเพื่อสแกนพิมพ์ รหัสคดี: ${activeProbationer.id}`)}
                  className="text-xs text-[#1b439c] font-bold hover:underline flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์ PDF</span>
                </button>
              </h3>

              {/* simulated document layout sheet */}
              <div className="bg-[#fcfdfa] p-8 rounded-xl border border-slate-300 font-serif leading-relaxed text-slate-800 text-[11px] shadow-inner max-w-2xl mx-auto space-y-4 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 border-2 border-red-200 rounded-full flex items-center justify-center text-red-400 font-bold text-[8px] transform rotate-12">
                  ตรากรมคุมประพฤติ
                </div>
                
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wide">แบบเสนอรายงานพ้นการคุมความประพฤติโดยสมบูรณ์</h4>
                  <p className="text-slate-500">สังกัด: สำนักงานคุมประพฤติปทุมธานี เขต 1</p>
                </div>

                <div className="text-right">
                  <p>เขียนที่ กรมคุมประพฤติปทุมธานี</p>
                  <p>วันที่: {new Date().toLocaleDateString("th-TH")}</p>
                </div>

                <div className="space-y-2">
                  <p><b>เรื่อง:</b> รายงานการบำเพ็ญประโยชน์สาธารณะและความพฤติของผู้ถูกคุมความประพฤติครบแผนที่กำหนด</p>
                  <p><b>เรียน:</b> ผู้พิพากษาศาลแขวงจังหวัดปทุมธานี</p>
                  
                  <p className="indent-8 text-justify">
                    ตามที่ศาลแขวงจังหวัดปทุมธานี ได้มีคำพิพากษาในคดีดำหมายเลข {activeProbationer.id} ให้ควบคุมความประพฤติ <b>{activeProbationer.name}</b> ฐานความผิดขับขี่รถจักรยานยนต์ขณะมึนเมาสุรา มีกำหนดระยะเวลา 1 ปี โดยสั่งให้ปฏิบัติกิจกรรมบริการสังคมและบำเพ็ญประโยชน์ครบ <b>{activeProbationer.requiredHours} ชั่วโมง</b> นั้น
                  </p>
                  
                  <p className="indent-8 text-justify">
                    บัดนี้ ผู้ถูกคุมความประพฤติรายดังกล่าว ได้รับความร่วมมือและปฏิบัติตามแผนฟื้นฟู มีส่วนร่วมทำความสะอาดทำนุบำรุงวัดพระธรรมกายและโรงเรียนบ้านคลองหลวงอย่างสม่ำเสมอ รวมสะสมผลงานได้ทั้งสิ้น <b>{activeProbationer.completedHours} ชั่วโมง</b> ครบถ้วนตามมาตรฐานทางกฎหมาย มีคะแนนวินัยความประพฤติอยู่ในเกณฑ์ดีเยี่ยม (<b>{activeProbationer.behaviorScore} คะแนน</b>) อีกทั้งผลตรวจสอบสารเสพติดเป็นศูนย์ ปฏิบัติธรรมถือวินัยสุจริต
                  </p>

                  <p className="indent-8 text-justify font-bold text-slate-900">
                    ข้าพเจ้าในฐานะพนักงานเจ้าหน้าที่คุมประพฤติชำนาญการ ได้ประเมินแล้วเห็นสมควรนำเรียนเสนอท่านผู้พิพากษา เพื่อขออนุมัติสั่งยกเลิกเงื่อนไขควบคุมและปิดแฟ้มคดีนี้โดยสมบูรณ์ คืนสิทธิ์การประกอบชีพสุจริตแก่พลเมืองเพื่อประโยชน์แก่สังคมสืบไป
                  </p>
                </div>

                <div className="pt-6 text-center space-y-1 max-w-xs ml-auto border-t border-dashed border-slate-300">
                  <p className="font-bold">ลงชื่อ ................................................................ พนักงานผู้ดูแลคดี</p>
                  <p className="text-slate-500">( นายณัฐพงษ์ มั่นคง )</p>
                  <p className="text-slate-400">เจ้าพนักงานคุมประพฤติชำนาญการ</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Case Close Submission Dashboard Action (Page 14 top right) */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-[#001D3D] via-[#002f5c] to-[#00152e] text-white p-6 rounded-2xl border border-[#cca43b]/20 shadow-md space-y-4">
            <span className="text-[10px] text-[#cca43b] font-extrabold uppercase tracking-widest block">ส่งฟ้องคำสั่งศาลอิเล็กทรอนิกส์</span>
            
            <div className="space-y-3.5 text-xs text-slate-300">
              <p className="leading-relaxed">
                การอนุมัติส่งเรื่องนี้ จะกระทำการส่งบันทึกความดี ผลการปฏิบัติงาน ลายมือชื่อ และ GPS ทั้งหมดเข้าสู่พอร์ทัลศาลยุติธรรมแห่งประเทศไทยแบบปลอดภัย 100%
              </p>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span>ผู้เสนอคำร้อง:</span>
                  <span className="text-[#cca43b] font-bold">นายณัฐพงษ์ มั่นคง</span>
                </div>
                <div className="flex justify-between">
                  <span>ผู้ได้รับการเสนอ:</span>
                  <span className="text-[#cca43b] font-bold">{activeProbationer?.name || "สมชาย ใจดี"}</span>
                </div>
                <div className="flex justify-between">
                  <span>เป้าหมายศาล:</span>
                  <span className="text-[#cca43b] font-bold">ปิดแฟ้มคดีและลบประวัติ</span>
                </div>
              </div>

              {isApproved ? (
                <div className="bg-emerald-500 text-white p-3 rounded-xl text-center font-bold">
                  ✓ ส่งเรื่องถึงระบบศาลสำเร็จแล้ว
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCloseCase}
                  className="w-full bg-[#cca43b] hover:bg-white text-[#00152e] hover:text-[#001D3D] py-3 px-4 rounded-xl text-xs font-extrabold transition-all shadow border border-[#cca43b] flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>ลงนามและอนุมัติส่งเรื่องศาล</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs leading-relaxed text-slate-500">
            <span className="font-bold text-slate-700 block">⚡ ประโยชน์ของการปิดคดีดิจิทัล:</span>
            <p>
              ด้วยกระบวนการยื่นคำร้องแบบออนไลน์นี้ การแจ้งคำร้องจะใช้เวลาพิจารณาจากผู้พิพากษาเพียง <b>24-48 ชั่วโมง</b> เปรียบเทียบกับระบบจัดส่งกระดาษดั้งเดิมที่ใช้เวลาสูงถึง 30-45 วัน ช่วยให้ผู้กลับตัวได้รับสิทธิ์กู้ยืมและทำงานสุจริตได้อย่างรวดเร็ว
            </p>
          </div>

        </div>

      </div>

      {/* Decorative banner */}
      <GovBanner />

    </div>
  );
};
