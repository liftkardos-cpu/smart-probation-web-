import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Search, MapPin, CheckCircle, Calendar, Users, Star, Camera, Eye, Heart, Compass, ShieldCheck } from "lucide-react";

export const PartnerDashboard: React.FC = () => {
  const { activities, probationersList, addNotification, approveActivityApplication, completeActivityApplication, selectProbationer, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "PENDING">("ACTIVE");

  // Filter activities hosted by this partner (e.g. Temple, School, Parks)
  // Let's list the applicants registered in our activities
  const partnerApplicantsList: Array<{
    probationerId: string;
    probationerName: string;
    avatarUrl: string;
    activityId: string;
    activityTitle: string;
    status: string;
    checkInTime?: string;
    checkOutTime?: string;
  }> = [];

  activities.forEach(act => {
    act.applicants.forEach(app => {
      const prob = probationersList.find(p => p.id === app.probationerId);
      if (prob) {
        partnerApplicantsList.push({
          probationerId: prob.id,
          probationerName: prob.name,
          avatarUrl: prob.avatarUrl,
          activityId: act.id,
          activityTitle: act.title,
          status: app.status,
          checkInTime: app.checkInTime,
          checkOutTime: app.checkOutTime
        });
      }
    });
  });

  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(partnerApplicantsList[0]?.probationerId || "");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(partnerApplicantsList[0]?.activityId || "");
  const [evalComment, setEvalComment] = useState("");
  const [responsibility, setResponsibility] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [cooperation, setCooperation] = useState(5);

  const activeApplicant = partnerApplicantsList.find(a => a.probationerId === selectedApplicantId && a.activityId === selectedActivityId) || partnerApplicantsList[0];

  const handlePartnerScan = () => {
    // Simulate scan QR Code of a probationer to clock them in
    const randomProb = probationersList[0]; // นายสมชาย ใจดี
    const act = activities[2]; // พัฒนาสวนสาธารณะ
    approveActivityApplication(act.id, randomProb.id);
    addNotification(
      "พันธมิตรสแกนบัตรสิทธิ์สำเร็จ",
      `วัดพระธรรมกายได้จำลองสแกนรหัส QR Code ของคุณ ${randomProb.name} เพื่อบันทึกเวลางานบริการเรียบร้อย`,
      "หน่วยงานภาคี"
    );
    alert(`📸 จำลองสแกน QR Code ของคุณ ${randomProb.name} สำเร็จ! อนุมัติสิทธิ์เข้าร่วมงาน '${act.title}' ของหน่วยงานเรียบร้อย`);
  };

  const handlePartnerEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplicant) {
      alert("⚠️ กรุณาเลือกผู้ถูกคุมประพฤติที่จะทำการประเมินจากรายการข้างซ้าย");
      return;
    }

    const ratingObj = {
      responsibility,
      punctuality,
      cooperation,
      behavior: Math.round((responsibility + punctuality + cooperation) / 3),
      comment: evalComment || "ทำงานบริการสาธารณะ ปัดกวาดลานวัดและล้างสุขภัณฑ์ร่วมกับกลุ่มได้อย่างยอดเยี่ยม ขยันขันแข็งมาก",
      date: new Date().toLocaleDateString("th-TH")
    };

    completeActivityApplication(activeApplicant.activityId, activeApplicant.probationerId, ratingObj);
    addNotification(
      "บันทึกประเมินคุณภาพจิตอาสาสำเร็จ",
      `หน่วยงานได้ทำการบันทึกคะแนนงานบำเพ็ญประโยชน์ให้แก่คุณ ${activeApplicant.probationerName} เรียบร้อยแล้ว`,
      "หน่วยงานภาคี"
    );
    alert(`🎉 ยื่นรายงานประเมินและโอนคะแนนสะสมชั่วโมงให้แก่คุณ ${activeApplicant.probationerName} สำเร็จ!`);
    setEvalComment("");
  };

  return (
    <div className="space-y-6">
      
      {/* Partner Bio summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-gradient-to-r from-[#001D3D] via-[#003466] to-[#00152e] text-white p-6 rounded-2xl shadow-md border border-[#cca43b]/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-[#cca43b] rounded-2xl flex items-center justify-center font-bold text-2xl text-[#001D3D] shadow-md border border-white/20">
              ศอ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">นางศรีนวล อิ่มเอิบ</h2>
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/50">
                  ผู้ดูแลหน่วยงานบริการสังคมภาคี
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">รหัสพันธมิตร: <span className="font-mono font-bold text-[#cca43b]">PT6703-9876</span></p>
              <p className="text-slate-400 text-[11px] mt-0.5">สังกัด: วัดพระธรรมกาย อำเภอคลองหลวง ปทุมธานี • กิจกรรมดูแลรวม: 2 กิจกรรม</p>
            </div>
          </div>
          
          <button 
            onClick={handlePartnerScan}
            className="bg-[#cca43b] hover:bg-white text-[#00152e] hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow border border-[#cca43b] flex items-center space-x-1"
          >
            <Camera className="w-4 h-4" />
            <span>สแกน QR รับผู้เข้าร่วมงาน</span>
          </button>
        </div>

        {/* Overview status box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ผู้เข้าร่วมทำความดีวันนี้</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1 leading-snug">
              สแกนเช็กอินแล้ว 5 / 6 ราย
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              สแกนตรวจสอบเวลาเข้าร่วม บันทึกพิกัด และยืนยันความประพฤติครบถ้วน
            </p>
          </div>
        </div>

      </div>

      {/* 4-Part KPI stats for Partner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">กิจกรรมในความรับผิดชอบ</span>
          <span className="text-2xl font-extrabold text-[#001D3D] block mt-1">2</span>
          <span className="text-[9px] text-[#cca43b] font-bold">กิจกรรมลานวัด/ขัดสุขภัณฑ์</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">สมัครร่วมทริปวันนี้</span>
          <span className="text-2xl font-extrabold text-[#001D3D] block mt-1">6</span>
          <span className="text-[9px] text-emerald-500 font-bold">ราย (อนุมัติเข้างานครบ)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">สแกนตรวจสอบแล้ว</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">5</span>
          <span className="text-[9px] text-emerald-500 font-bold">ราย (เช็กอินและส่งพิกัด)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">คะแนนผลงานเฉลี่ย</span>
          <span className="text-2xl font-extrabold text-[#cca43b] block mt-1">4.8</span>
          <span className="text-[9px] text-[#cca43b] font-bold">จาก 5 ดาวดีเยี่ยม</span>
        </div>
      </div>

      {/* Main Grid: list of participants + Evaluation sheet form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: List of participants in their activities (Col Span 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              รายชื่อผู้ถูกคุมประพฤติร่วมปฏิบัติธรรมและทำงานสาธารณประโยชน์
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              ทั้งหมด {partnerApplicantsList.length} คน
            </span>
          </div>

          <div className="space-y-3">
            {partnerApplicantsList.map((app, idx) => {
              const isSelected = app.probationerId === selectedApplicantId && app.activityId === selectedActivityId;
              const isCheckedIn = app.status === "เช็กอินแล้ว";
              const isCompleted = app.status === "เสร็จสิ้น";

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedApplicantId(app.probationerId);
                    setSelectedActivityId(app.activityId);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#fffdf5] border-[#cca43b] ring-2 ring-[#cca43b]/10"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  
                  {/* profile */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.avatarUrl}
                      alt={app.probationerName}
                      className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{app.probationerName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">รหัสคดี: {app.probationerId}</p>
                      <p className="text-[10px] text-[#1b439c] font-bold mt-1">เข้าร่วมกิจกรรม: {app.activityTitle}</p>
                    </div>
                  </div>

                  {/* Timestamps status */}
                  <div className="text-left sm:text-right font-medium text-xs text-slate-500 space-y-1">
                    <div className="flex items-center sm:justify-end space-x-1">
                      <span className={`w-2 h-2 rounded-full ${isCheckedIn ? "bg-blue-500 animate-ping" : "bg-slate-400"}`} />
                      <span className="text-[10px] font-bold text-slate-700">{app.status}</span>
                    </div>
                    {app.checkInTime && (
                      <p className="text-[10px] text-slate-400">เช็กอิน: <span className="font-mono text-slate-700 font-bold">{app.checkInTime}</span></p>
                    )}
                    {app.checkOutTime && (
                      <p className="text-[10px] text-slate-400">เช็กเอาต์: <span className="font-mono text-slate-700 font-bold">{app.checkOutTime}</span></p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Interactive Evaluation Sheet */}
        <div className="space-y-6">
          
          {activeApplicant ? (
            <form onSubmit={handlePartnerEvaluate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                ใบประเมินและโอนชั่วโมงการทำงาน
              </h3>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">ผู้รับการประเมิน:</span>
                <p className="font-bold text-slate-800">{activeApplicant.probationerName} ({activeApplicant.probationerId})</p>
                <p className="text-[10px] text-[#1b439c] font-bold mt-1">งาน: {activeApplicant.activityTitle}</p>
              </div>

              {/* Sliders for evaluations metrics */}
              <div className="space-y-3.5">
                
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>1. ความรับผิดชอบต่องานหลัก:</span>
                    <span className="text-[#cca43b]">{responsibility} / 5 ดาว</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={responsibility}
                    onChange={(e) => setResponsibility(Number(e.target.value))}
                    className="w-full accent-[#cca43b] cursor-pointer"
                  />
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>2. ความตรงต่อเวลานัดหมาย:</span>
                    <span className="text-[#cca43b]">{punctuality} / 5 ดาว</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={punctuality}
                    onChange={(e) => setPunctuality(Number(e.target.value))}
                    className="w-full accent-[#cca43b] cursor-pointer"
                  />
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>3. ความร่วมมือกับผู้อื่นในกลุ่ม:</span>
                    <span className="text-[#cca43b]">{cooperation} / 5 ดาว</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={cooperation}
                    onChange={(e) => setCooperation(Number(e.target.value))}
                    className="w-full accent-[#cca43b] cursor-pointer"
                  />
                </div>

                {/* Comment area */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    เขียนคำติชม/บันทึกความตั้งใจทำดี:
                  </label>
                  <textarea
                    rows={3}
                    value={evalComment}
                    onChange={(e) => setEvalComment(e.target.value)}
                    placeholder="ปัดกวาดลานวัดและล้างเครื่องสุขภัณฑ์ร่วมกับกลุ่มจิตอาสาได้อย่างขยันขันแข็ง อนุมัติสะสมชั่วโมงงานสำเร็จ"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#cca43b]/40 text-slate-800"
                  />
                </div>

              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={activeApplicant.status === "เสร็จสิ้น"}
                className="w-full bg-[#1b439c] hover:bg-[#cca43b] text-white hover:text-[#001D3D] py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-1.5 border border-blue-800 disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{activeApplicant.status === "เสร็จสิ้น" ? "ประเมินและเพิ่มชั่วโมงแล้ว" : "ส่งผลประเมินและเพิ่มชั่วโมงสะสม"}</span>
              </button>

            </form>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-400 text-xs">
              กรุณาเลือกรายชื่อผู้ถูกคุมประพฤติจากตารางซ้ายมือเพื่อเริ่มการประเมิน
            </div>
          )}

          {/* Partner role guidelines info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">จรรยาบรรณหน่วยงานภาคี</h4>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed list-disc list-inside">
              <li>ทำการตรวจสแกนเวลาเข้างาน (Check-In) และออกงาน (Check-Out) เฉพาะตัวบุคคลผู้ปฏิบัติงานจริงด้วยกล้องอุปกรณ์พกพาเท่านั้น</li>
              <li>การตัดสินใจประเมินแต้มและคะแนนต้องยึดหลักเกณฑ์ความตรงไปตรงมา ไม่เอาความชอบส่วนตัวมาอคติ</li>
              <li>หากตรวจพบพฤติกรรมความไม่ประพฤติผิดปกติหรือพฤติกรรมรุนแรง ต้องกดปุ่มรายงานเตือนภัยด่วนถึงพนักงานคุมประพฤติทันที</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Motivational quote banner */}
      <GovBanner />

    </div>
  );
};
