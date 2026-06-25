import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { ArrowLeft, User, ShieldAlert, FileText, CheckCircle2, Star, Save, Plus, Minus, ThumbsUp } from "lucide-react";

export const OfficerEvaluate: React.FC = () => {
  const { 
    selectedProbationerId, 
    probationersList, 
    activities, 
    updateBehaviorScore, 
    approveActivityApplication, 
    completeActivityApplication,
    setCurrentView,
    addNotification
  } = useApp();

  // Find selected probationer. Default to first if none
  const activeProbationer = probationersList.find(p => p.id === selectedProbationerId) || probationersList[0];

  const [comment, setComment] = useState("");
  const [scoreChangeReason, setScoreChangeReason] = useState("เข้าร่วมกิจกรรมจิตอาสาสม่ำเสมอด้วยความพยายามและตั้งใจ");
  const [scoreValue, setScoreValue] = useState<number>(5);

  // Get activities related to this probationer
  const probationerActivities = activities.filter(act => 
    act.applicants.some(app => app.probationerId === activeProbationer.id)
  );

  const handleApplyScore = (isAddition: boolean) => {
    const finalVal = isAddition ? scoreValue : -scoreValue;
    updateBehaviorScore(activeProbationer.id, finalVal);
    
    const changeType = isAddition ? "เพิ่มคะแนน" : "หักคะแนน";
    addNotification(
      `ปรับคะแนนพฤติกรรมคุณ ${activeProbationer.name}`,
      `พนักงานเจ้าหน้าที่ได้ทำการ${changeType} ${scoreValue} คะแนน เนื่องจาก: "${scoreChangeReason}"`,
      "เจ้าหน้าที่"
    );
    
    alert(`🎯 ประมวลผลสำเร็จ: ${changeType} ${scoreValue} คะแนน แก่คุณ ${activeProbationer.name} เรียบร้อย!`);
  };

  const handleApproveApp = (actId: string) => {
    approveActivityApplication(actId, activeProbationer.id);
    addNotification(
      "อนุมัติสิทธิ์จิตอาสา",
      `พนักงานได้รับการอนุมัติใบสมัครงานสำหรับคดีคุมประพฤติของคุณ ${activeProbationer.name} เรียบร้อยแล้ว`,
      "เจ้าหน้าที่"
    );
    alert(`✅ อนุมัติสิทธิ์ให้คุณ ${activeProbationer.name} เข้าร่วมกิจกรรมจิตอาสาเรียบร้อย!`);
  };

  const handleCompleteApp = (actId: string) => {
    // Generate evaluation comment
    const ratingObj = {
      responsibility: 5,
      punctuality: 5,
      cooperation: 4,
      behavior: 5,
      comment: comment || "ปฏิบัติงานทาสีปัดกวาดเช็ดถูทำความดีช่วยเหลือประชาชนได้อย่างขยันขันแข็ง อนุมัติชั่วโมงสะสม",
      date: new Date().toLocaleDateString("th-TH")
    };

    completeActivityApplication(actId, activeProbationer.id, ratingObj);
    addNotification(
      "ยืนยันบันทึกชั่วโมงสำเร็จ",
      `พนักงานได้ตรวจอนุมัติและเพิ่มชั่วโมงสะสมให้แก่คุณ ${activeProbationer.name} สำเร็จและประทับลายนิ้วมือ`,
      "เจ้าหน้าที่"
    );
    alert(`🎉 ประมวลชั่วโมงสะสมทำความดีสำเร็จ! ข้อมูลถูกบันทึกเรียบร้อย`);
    setComment("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">แผงประเมินวินัยพฤติกรรมรายบุคคล (Disciplinary Evaluation)</h2>
          <p className="text-xs text-slate-400 mt-1">ประเมินอนุมัติชั่วโมงกิจกรรมบำเพ็ญประโยชน์ ปรับคะแนนความประพฤติ และลงลายมือชื่อพนักงาน</p>
        </div>
        
        <button
          onClick={() => setCurrentView("OFFICER_DASHBOARD")}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับแดชบอร์ดเจ้าหน้าที่</span>
        </button>
      </div>

      {/* Main Grid evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Probationer Case files summaries (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile overview card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start space-x-5 pb-5 border-b border-slate-100">
              <img
                src={activeProbationer.avatarUrl}
                alt={activeProbationer.name}
                className="w-16 h-16 rounded-xl object-cover ring-4 ring-slate-100 shadow-inner"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-800">{activeProbationer.name}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    activeProbationer.status === "ปกติ" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800 animate-pulse"
                  }`}>
                    {activeProbationer.status}
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-[#cca43b] mt-0.5">ID คดี: {activeProbationer.id}</p>
                <p className="text-[11px] text-slate-500 mt-1"><b>ฐานความผิด:</b> {activeProbationer.charge}</p>
              </div>
            </div>

            {/* Quick stats metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">ชั่วโมงบำเพ็ญสะสม</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{activeProbationer.completedHours} / {activeProbationer.requiredHours} ชม.</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">รายงานตัวสำเร็จ</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{activeProbationer.completedReports} / 12 ครั้ง</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">คะแนนความประพฤติ</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{activeProbationer.behaviorScore} คะแนน</span>
              </div>
            </div>
          </div>

          {/* Section: Manage pending community services (Approve/Complete) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              อนุมัติการสมัครและประเมินผลชั่วโมงบำเพ็ญประโยชน์สะสม
            </h3>

            {probationerActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                ผู้ถูกคุมประพฤติรายนี้ยังไม่มีประวัติยื่นขอเข้าร่วมกิจกรรมอาสาใดๆ ในระบบดิจิทัล
              </div>
            ) : (
              <div className="space-y-4">
                {probationerActivities.map((act) => {
                  const myApp = act.applicants.find(a => a.probationerId === activeProbationer.id);
                  const isPendingApprove = myApp?.status === "รออนุมัติ";
                  const isCheckedIn = myApp?.status === "เช็กอินแล้ว";
                  const isCompleted = myApp?.status === "เสร็จสิ้น";

                  return (
                    <div key={act.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{act.title}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{act.organizer} | สะสมได้: <b className="text-[#cca43b]">{act.hours} ชม.</b></span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                            isPendingApprove ? "bg-amber-100 text-amber-800 border border-amber-200/50" :
                            isCheckedIn ? "bg-blue-100 text-blue-800 border border-blue-200/50" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {myApp?.status}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Buttons for Officer */}
                      <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200/50">
                        {isPendingApprove && (
                          <button
                            onClick={() => handleApproveApp(act.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>อนุมัติให้เข้าร่วมกิจกรรม</span>
                          </button>
                        )}

                        {isCheckedIn && (
                          <div className="w-full space-y-3 pt-2">
                            {/* Signature and picture summary */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-[10px] space-y-2 text-slate-500 font-semibold">
                              <span className="text-[#1b439c] font-bold block uppercase tracking-wider">ตรวจสอบพาสปอร์ตหลักฐาน:</span>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span>รูปถ่ายหน้างาน (จากกล้อง):</span>
                                  <div className="flex space-x-1 mt-1">
                                    <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[8px] text-slate-400">ภาพ 1</div>
                                    <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[8px] text-slate-400">ภาพ 2</div>
                                  </div>
                                </div>
                                <div>
                                  <span>ลายมือชื่อเช็กเอาต์:</span>
                                  <div className="w-full h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-[9px] font-serif text-slate-700 italic font-bold">
                                    สมชาย ใจดี
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="เขียนบันทึกประเมิน/คอมเมนต์ความดีเพิ่มเติม..."
                                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white outline-none"
                              />
                              <button
                                onClick={() => handleCompleteApp(act.id)}
                                className="bg-[#1b439c] hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center space-x-1 shrink-0"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>ตรวจและอนุมัติบวกชั่วโมง</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {isCompleted && (
                          <p className="text-[10px] text-slate-400 italic">
                            * ตรวจสอบผลสำเร็จเรียบร้อย มีการบวกสะสมแล้ว {act.hours} ชั่วโมง
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right column: Modify behavior point boards (Page 13 right) */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
              แผงควบคุมคะแนนประพฤติ (Credit Core Score)
            </h4>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              เครื่องมือเจ้าหน้าที่คุมประพฤติสำหรับตัดแต้มกรณีละเมิดระเบียบ หรือคืนแต้มคะแนนความประพฤติกรณีทำดีอย่างยอดเยี่ยม:
            </p>

            <div className="space-y-3">
              {/* Reason list */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  เลือกเหตุผลทางวินัย/คุณความดี:
                </label>
                <select
                  value={scoreChangeReason}
                  onChange={(e) => setScoreChangeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-700 outline-none"
                >
                  <option value="เข้าร่วมกิจกรรมจิตอาสาสม่ำเสมอด้วยความพยายามและตั้งใจ">เพิ่มแต้ม: ช่วยเหลือสังคมยอดเยี่ยม</option>
                  <option value="รายงานตัวครบถ้วนสมบูรณ์ตามงวดกำหนดติดต่อกัน 3 งวด">เพิ่มแต้ม: ตระหนักวินัยสูงตรงกำหนด</option>
                  <option value="ละเมิดไม่มารายงานตัวตามนัดหมายโดยไม่มีเหตุจำเป็นเร่งด่วน">หักแต้ม: ขาดรายงานตัวไม่สมเหตุสมผล</option>
                  <option value="สแกนส่งพิกัดตรวจสารเสพติดและพบสารกลุ่มแอมเฟตามีน">หักแต้ม: ฝ่าฝืนเงื่อนไขห้ามเสพยาเสพติด</option>
                  <option value="ขับรถหวาดเสียวหวาดประเสริฐและได้รับการร้องเรียนผ่านสายตรง">หักแต้ม: มีพฤติกรรมขับขี่รถน่าหวาดกลัว</option>
                </select>
              </div>

              {/* Adjust value count */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  มูลค่าคะแนนที่จะปรับแต้ม ({scoreValue} คะแนน):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setScoreValue(v)}
                      className={`py-1.5 border rounded-lg text-xs font-bold transition-all ${
                        scoreValue === v
                          ? "bg-[#cca43b] text-[#001D3D] border-[#cca43b] shadow-sm"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {v} แต้ม
                    </button>
                  ))}
                </div>
              </div>

              {/* Modify buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleApplyScore(false)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 border border-red-200/50"
                >
                  <Minus className="w-4 h-4 shrink-0" />
                  <span>หักคะแนนประพฤติ</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleApplyScore(true)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 border border-emerald-200/50"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>เพิ่มคืนคะแนนเต็ม</span>
                </button>
              </div>

            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs leading-relaxed text-slate-500">
            <span className="font-bold text-slate-700 block">ℹ️ ผลสะท้อนการประพฤติทางศาล:</span>
            <p>
              หากคะแนนประพฤติของคุณสมชายลดต่ำลงกว่า <b>60 คะแนน</b> ระบบจะส่งสัญญานเตือนภัยกระตุ้นไปยัง กรมคุมประพฤติเพื่อพิจารณาเปลี่ยนสถานะคดีเป็น "ละเมิดอย่างร้ายแรง" และยื่นเสนอศาลขอเปลี่ยนทัณฑ์บนกลับไปกักขังชั่วคราว
            </p>
          </div>

        </div>

      </div>

      {/* Decorative motivational banner */}
      <GovBanner />

    </div>
  );
};
