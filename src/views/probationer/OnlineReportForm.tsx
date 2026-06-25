import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { ShieldCheck, Compass, Camera, FileText, Send, CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export const OnlineReportForm: React.FC = () => {
  const { probationerProfile, appointments, addNotification, submitOnlineReport, setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [reportText, setReportText] = useState("ข้าพเจ้านายสมชาย ใจดี ประกอบสัมมาชีพสุจริต เป็นผู้ช่วยช่างทาสีรับจ้างทั่วไป ไม่เคยไปข้องเกี่ยวกับยาเสพติดหรือกระทำความผิดซ้ำตามที่ให้สัญญาไว้ ปฏิบัติตามวินัยคุมประพฤติอย่างเข้มงวด");
  const [faceScanned, setFaceScanned] = useState(false);
  const [scanningFace, setScanningFace] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFaceScan = () => {
    setScanningFace(true);
    setTimeout(() => {
      setScanningFace(false);
      setFaceScanned(true);
      addNotification("สแกนใบหน้ารายงานตัวผ่าน", "ระบบระบุใบหน้า นายสมชาย ใจดี ตรงกับรหัสคดี PB6705-123456 แนบข้อมูลลายนิ้วมือสำเร็จ", "ระบบ");
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceScanned) {
      alert("⚠️ กรุณากระทำการสแกนตรวจสอบใบหน้า (Face Recognition) เพื่อยืนยันอัตลักษณ์ส่วนบุคคลก่อนยื่นรายงานตัว");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitOnlineReport("รายงานตัวครั้งที่ 9 (งวดประจำเดือน พ.ค. 2567)", reportText);
      setSubmitting(false);
      setCurrentStep(4);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ยื่นรายงานตัวคุมประพฤติออนไลน์ (Face ID Online Report)</h2>
          <p className="text-xs text-slate-400 mt-1">ระบบยืนยันตนผ่านสแกนใบหน้าระดับปลอดภัยสูง ลดปัญหาการเสียเวลาเดินทางไปที่สำนักงานคุมประพฤติ</p>
        </div>
        <button
          onClick={() => setCurrentView("DASHBOARD")}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าแรก</span>
        </button>
      </div>

      {/* Steps Visual Progress bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs text-slate-500 font-bold">
          
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-400"
            }`}>1</div>
            <span className={currentStep === 1 ? "text-blue-600" : ""}>งวดรายงานตัว</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

          <div className="flex flex-col items-center space-y-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-400"
            }`}>2</div>
            <span className={currentStep === 2 ? "text-blue-600" : ""}>สแกนใบหน้า</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

          <div className="flex flex-col items-center space-y-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-400"
            }`}>3</div>
            <span className={currentStep === 3 ? "text-blue-600" : ""}>กรอกแบบรายงาน</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

          <div className="flex flex-col items-center space-y-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 4 ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-slate-400"
            }`}>✓</div>
            <span className={currentStep === 4 ? "text-emerald-600" : ""}>ส่งคำขอสำเร็จ</span>
          </div>

        </div>
      </div>

      {/* Main Forms Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main grid forms (Span 2) */}
        <div className="lg:col-span-2">
          
          {currentStep < 4 && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 py-3 px-5 border-b border-slate-200 text-xs font-bold text-slate-600 flex justify-between items-center">
                <span>แบบสัญญารายงานตัวและตรวจสอบอัตลักษณ์</span>
                <span className="text-[#cca43b]">งวดรายงานตัวครั้งถัดไป: 20 พฤษภาคม 2567</span>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Step 1 Content: Information confirmation */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#1b439c] uppercase tracking-wider border-b border-slate-100 pb-2">1. ข้อมูลการรายงานตัวและคดีความ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">ชื่อ-นามสกุล:</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{probationerProfile.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">รหัสประจำตัวคดี:</span>
                      <span className="font-mono font-bold text-red-600 block mt-0.5">{probationerProfile.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">งวดที่ต้องสแกนส่ง:</span>
                      <span className="font-bold text-[#001D3D] block mt-0.5">รายงานตัวครั้งที่ 9 (งวดเดือน พฤษภาคม 2567)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">เจ้าหน้าที่ควบคุมคดีประจำตน:</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{probationerProfile.probationOfficer.name}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 Content: Face biometric verification */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-[#1b439c] uppercase tracking-wider border-b border-slate-100 pb-2">2. ถ่ายรูปยืนยันตัวตนด้วยใบหน้า (Face Recognition Verification)</h4>
                  
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    
                    {/* Simulator camera lens screen */}
                    <div className="w-44 h-44 bg-slate-900 rounded-full border-4 border-slate-700 overflow-hidden relative flex items-center justify-center shrink-0">
                      {scanningFace ? (
                        <div className="text-center">
                          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                          <span className="text-[9px] text-slate-400 block mt-2">กำลังตรวจสอบโครงกระดูกใบหน้า...</span>
                        </div>
                      ) : faceScanned ? (
                        <div className="w-full h-full relative">
                          <img
                            src={probationerProfile.avatarUrl}
                            alt="ใบหน้าได้รับการอนุมัติ"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center rounded-full">
                            <span className="bg-emerald-600 text-white font-bold text-[9px] py-1 px-2.5 rounded-full shadow">
                              สแกนใบหน้าผ่าน 100%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                          <span className="text-[9px] text-slate-400 block mt-2">โปรดขยับใบหน้าให้อยู่ในกรอบ</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        การรายงานตัวผ่านระบบออนไลน์ มีการซิงค์ข้อมูลใบหน้าและการสแกนม่านตากับฐานข้อมูลกระทรวงมหาดไทย เพื่อให้มั่นใจว่าเป็นผู้ถูกคุมความประพฤติตัวจริงปฏิบัติอย่างซื่อสัตย์
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleFaceScan}
                        disabled={scanningFace}
                        className="bg-blue-50 hover:bg-blue-100 text-[#1b439c] py-2 px-4 rounded-xl text-xs font-bold transition-all border border-blue-200 flex items-center space-x-1"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{faceScanned ? "สแกนตรวจสอบใบหน้าอีกครั้ง" : "กดปุ่มเพื่อเริ่มสแกนใบหน้าผ่านหน้ากล้อง"}</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Step 3 Content: Reflection report & comments */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-[#1b439c] uppercase tracking-wider border-b border-slate-100 pb-2">3. รายงานความประพฤติและการประกอบชีพส่วนตัว</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">คำชี้แจงการทำงานสุจริตและความพฤติ (โปรดเขียนบรรยายตามความเป็นจริง):</label>
                    <textarea
                      required
                      rows={4}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="อธิบายพฤติกรรม อาชีพการงาน และความก้าวหน้าการสะสมความดีในงวดนี้"
                      className="w-full p-3 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#cca43b]/40 text-slate-800 leading-relaxed font-semibold"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                    <span className="font-bold text-slate-700 block flex items-center">
                      <Compass className="w-4.5 h-4.5 text-[#cca43b] mr-1.5" />
                      <span>4. ระบบตรวจจับพิกัดจีพีเอสผ่านเบราว์เซอร์อัตโนมัติ (Mock GPS):</span>
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-slate-500 text-[11px] font-semibold">
                      <div>
                        <span>พิกัด GPS ละติจูด:</span>
                        <span className="font-mono text-slate-700 block font-bold">14.0725° N</span>
                      </div>
                      <div>
                        <span>ลองจิจูด:</span>
                        <span className="font-mono text-slate-700 block font-bold">100.6189° E</span>
                      </div>
                      <div className="col-span-2">
                        <span>สถานที่ได้รับการตรวจประทับ:</span>
                        <span className="text-emerald-600 block font-bold">✓ อำเภอคลองหลวง จังหวัดปทุมธานี (รัศมีใกล้บ้านพักจริง)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Buttons footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentView("DASHBOARD")}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-white transition-all shadow-sm"
                >
                  ยกเลิก
                </button>
                
                <button
                  type="submit"
                  disabled={submitting || !faceScanned}
                  className="bg-[#1b439c] hover:bg-[#cca43b] text-white hover:text-[#001D3D] py-2 px-5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งบันทึกความคืบหน้า...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>บันทึกและส่งใบรายงานตัวไปยังพนักงาน</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Success screen (currentStep === 4) */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">ยื่นรายงานตัวงวด พฤษภาคม 2567 สำเร็จเรียบร้อย!</h3>
                <p className="text-xs text-slate-400">ระบบได้ตรวจสอบลายนิ้วมือ พิกัด GPS ความเหมาะสม และภาพสแกนโครงหน้าเรียบร้อยแล้ว</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs text-left space-y-1.5">
                <p className="text-slate-500 font-semibold text-[11px]">เอกสารอ้างอิงรหัสประกันตัว:</p>
                <p className="font-mono font-bold text-slate-800">RP-2024-5502-8819</p>
                <p className="text-slate-500 font-semibold text-[11px] mt-2">ประเมินวันครบกำหนดครั้งถัดไป:</p>
                <p className="font-bold text-red-600">20 มิถุนายน 2567 เวลา 08:30 น.</p>
              </div>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFaceScanned(false);
                  }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                >
                  ยื่นรายงานตัวซ้ำ (จำลองคัดลอกพฤติกรรม)
                </button>
                <button
                  onClick={() => setCurrentView("DASHBOARD")}
                  className="px-5 py-2 bg-[#1b439c] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  กลับหน้าแรกแดชบอร์ด
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right sidebar instruction criteria (Span 1) */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">กฎเกณฑ์เงื่อนไขการรายงานตัวออนไลน์</h4>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              สิทธิ์การใช้งานแอปพลิเคชันสแกนส่งใบหน้าออนไลน์นี้ มอบให้เฉพาะผู้ถูกคุมความประพฤติที่มีคุณสมบัติพฤติกรรมปกติและสะสมชั่วโมงทำความดีอย่างน้อย 50% ขึ้นไปเท่านั้น
            </p>

            <ul className="space-y-2.5 text-[11px] text-slate-600 leading-relaxed font-semibold">
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ต้องรายงานตัวภายในช่วงเวลาที่สำนักงานกำหนด (ก่อนหรือหลังวันนัดไม่เกิน 3 วัน)</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>กล้องตรวจสอบใบหน้าต้องอยู่กลางแจ้งหรือห้องสว่างปกติ ห้ามปกปิดหู สวมแว่นดำ หรือสวมผ้าคาดปาก</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ห้ามหลอกลวงหรือใช้ระบบ Mock Location พิกัดดาวเทียมเด็ดขาด ตรวจพบมีโทษตามพฤติกรรมปรับขัง</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#001D3D] text-white p-6 rounded-2xl border border-[#cca43b]/20 shadow-md space-y-3">
            <span className="text-[10px] text-[#cca43b] font-extrabold uppercase tracking-widest block">ต้องการเลื่อนนัดรายงานตัว?</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              กรณีเจ็บป่วยกระทันหันหรือมีเหตุจำเป็นพิเศษไม่สามารถสแกนใบหน้าได้ทันเวลา ท่านสามารถติดต่อขอเลื่อนนัดล่วงหน้า 1 วัน ได้ทาง AI Chat Assistant หรือแจ้งสายตรงผู้คุมคดีของท่าน
            </p>
            <button
              onClick={() => setCurrentView("AI_ASSISTANT")}
              className="w-full bg-[#cca43b] text-[#00152e] hover:bg-white py-2 px-3 rounded-xl text-[10px] font-bold transition-all shadow border border-[#cca43b]"
            >
              ปรึกษา AI Assistant ร่างจดหมายขอเลื่อนนัด
            </button>
          </div>

        </div>

      </div>

      {/* Decorative motivational banner */}
      <GovBanner />

    </div>
  );
};
