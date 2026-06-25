import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { MapPin, Calendar, Clock, Camera, CheckCircle, RefreshCw, AlertCircle, Sparkles, ChevronLeft, ArrowRight, Smartphone, Compass, User } from "lucide-react";

export const QRCheckIn: React.FC = () => {
  const { activities, probationerProfile, checkInActivity, checkOutActivity, addNotification, setCurrentView } = useApp();
  
  // Choose an activity that is approved/active for checking in
  const approvedActs = activities.filter(act => 
    act.applicants.some(app => app.probationerId === probationerProfile.id && (app.status === "อนุมัติแล้ว" || app.status === "เช็กอินแล้ว" || app.status === "เสร็จสิ้น"))
  );

  const [selectedActId, setSelectedActId] = useState(approvedActs[0]?.id || activities[2]?.id);
  const [scanStep, setScanStep] = useState<"SELECT" | "SCANNING" | "CHECKIN_DONE" | "SIGNING" | "SUMMARY">("SELECT");
  const [signatureData, setSignatureData] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const selectedActivity = activities.find(a => a.id === selectedActId) || activities[0];
  const userApplicant = selectedActivity.applicants.find(a => a.probationerId === probationerProfile.id);

  // Drawing Canvas Methods
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#001D3D";
    
    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData("");
  };

  const triggerScan = () => {
    setScanStep("SCANNING");
    setTimeout(() => {
      checkInActivity(selectedActivity.id, probationerProfile.id, new Date().toLocaleTimeString("th-TH"));
      setScanStep("CHECKIN_DONE");
    }, 2000);
  };

  const triggerCheckOut = () => {
    setScanStep("SIGNING");
  };

  const submitCheckOut = () => {
    if (!signatureData) {
      alert("✍️ กรุณาเขียนลายเซ็นดิจิทัลของคุณก่อนกดยืนยันบันทึกเวลาออกงาน");
      return;
    }
    checkOutActivity(
      selectedActivity.id,
      probationerProfile.id,
      new Date().toLocaleTimeString("th-TH"),
      uploadedPhotos,
      signatureData
    );
    setScanStep("SUMMARY");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">เครื่องสแกนเช็กอินอัจฉริยะ (QR Check-In System)</h2>
        <p className="text-xs text-slate-400 mt-1">
          ระบบสแกนรับส่งเวลางานบริการสังคมผ่านโทรศัพท์มือถือ สำหรับส่งข้อมูลไปยังกองบังคับการแบบเรียลไทม์
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Columns: Simulator selector & info (Col Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">คำแนะนำการสแกนระบบมือถือ</h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              เมื่อเดินทางไปถึงสถานที่จัดกิจกรรมบำเพ็ญประโยชน์ (เช่น วัด โรงเรียน สวนสาธารณะ) ผู้ถูกคุมประพฤติจะต้องเปิดแอปนี้ในโทรศัพท์มือถือ เพื่อสแกน QR Code ประจำตัวจากหน่วยงานภาคีเพื่อทำบันทึกเข้างาน (Check-In) และเช็กเอาต์ออกงาน (Check-Out) เมื่อกิจกรรมสิ้นสุดลง
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">1. เลือกกิจกรรมที่คุณได้รับอนุมัติเพื่อทดลองระบบ:</label>
              
              <select
                value={selectedActId}
                onChange={(e) => {
                  setSelectedActId(e.target.value);
                  setScanStep("SELECT");
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-[#cca43b]/40 text-slate-700"
              >
                {activities.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.title} ({act.organizer})
                  </option>
                ))}
              </select>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                <span className="font-bold text-[#001D3D] block">สถานะปัจจุบันในการจัดงานนี้:</span>
                <p className="mt-1">
                  ชื่อผู้ลงชื่อ: <span className="font-semibold text-slate-700">{probationerProfile.name}</span> <br />
                  สถานะคำขอ: <span className="font-bold text-slate-800">{userApplicant?.status || "ยังไม่ได้ยื่นคำขอสมัคร"}</span>
                </p>
              </div>
            </div>

            <div className="border border-[#cca43b]/20 p-4 rounded-xl bg-amber-50/50 flex items-start space-x-3 text-xs leading-relaxed text-slate-700">
              <AlertCircle className="w-5 h-5 text-[#cca43b] shrink-0" />
              <div>
                <span className="font-bold block text-slate-800">🔒 มาตรฐานความปลอดภัยด้วยใบหน้า:</span>
                <span>ระบบจะบันทึกรอยประทับเวลา พิกัด GPS ความคืบหน้า และลายเซ็นส่งตรงไปยังพนักงานคุมประพฤติ {probationerProfile.probationOfficer.name} ทันที ป้องกันการทุจริตและการปลอมแปลงข้อมูล</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">ขั้นตอนที่ต้องปฏิบัติตนขณะร่วมงาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mx-auto mb-2">1</div>
                <span className="text-xs font-bold text-slate-700 block">สแกนเปิดเช็กอิน</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">สแกนรหัสเพื่อประทับเวลาเริ่มงานและส่ง GPS</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mx-auto mb-2">2</div>
                <span className="text-xs font-bold text-slate-700 block">ถ่ายรูปขณะทำกิจกรรม</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">อัปโหลดภาพหลักฐานการทำประโยชน์ 2 รูป</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mx-auto mb-2">3</div>
                <span className="text-xs font-bold text-slate-700 block">ลงลายมือชื่อเช็กเอาต์</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">เซ็นชื่อเพื่อคำนวณและปิดสะสมชั่วโมง</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: iPhone Interface Simulator (Page 6 & 7) */}
        <div className="flex justify-center">
          
          {/* Main iPhone Frame */}
          <div className="w-[330px] h-[670px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col overflow-hidden relative ring-4 ring-slate-800/50 shrink-0">
            {/* Dynamic island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-auto mr-4" />
            </div>

            {/* Simulated Mobile screen wrapper */}
            <div className="flex-1 bg-slate-50 rounded-[40px] flex flex-col justify-between overflow-hidden relative text-slate-800 font-sans border-2 border-black/40">
              
              {/* iPhone App Header */}
              <div className="bg-[#001D3D] text-white pt-9 pb-4 px-4 text-center shrink-0">
                <div className="flex items-center justify-between">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold tracking-wider text-[#cca43b]">กรมคุมประพฤติ</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-[11px] font-bold mt-2 uppercase tracking-wide">สแกนชั่วโมงบำเพ็ญประโยชน์</h4>
              </div>

              {/* Dynamic Step View inside Phone */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                
                {/* STEP 1: SELECT / INITIAL CAM SCANNERS */}
                {scanStep === "SELECT" && (
                  <div className="space-y-4 text-center pt-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">โหมดเช็กอิน / เช็กเอาต์</span>
                    
                    {/* Simulated Camera Window */}
                    <div className="w-full h-44 bg-slate-900 rounded-2xl relative border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                      {/* Scanning visual brackets */}
                      <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-md" />
                      <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-md" />
                      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-md" />
                      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-md" />
                      
                      <div className="text-center p-4">
                        <Smartphone className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
                        <span className="text-[9px] text-slate-400 block mt-2">หันกล้องไปที่ QR Code ของผู้ดูแล</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-left space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">รายละเอียดกิจกรรม:</span>
                      <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{selectedActivity.title}</h5>
                      <p className="text-[10px] text-slate-500 truncate">{selectedActivity.location}</p>
                    </div>

                    <button
                      onClick={triggerScan}
                      className="w-full bg-[#1b439c] hover:bg-[#cca43b] text-white hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow border border-blue-800"
                    >
                      กดเพื่อจำลองการสแกน QR
                    </button>
                  </div>
                )}

                {/* STEP 2: SCANNING PROGRESS BAR */}
                {scanStep === "SCANNING" && (
                  <div className="text-center space-y-4 pt-12">
                    <RefreshCw className="w-12 h-12 text-[#cca43b] animate-spin mx-auto" />
                    <h5 className="text-xs font-bold text-slate-800">กำลังเชื่อมต่อพิกัด GPS ประจำตัว...</h5>
                    <p className="text-[10px] text-slate-400">โปรดรอการยืนยันเวลาประทับลงสู่บล็อกเชนคุมประพฤติ</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#cca43b] h-full animate-[loading_2s_ease-in-out_infinite] w-1/2" />
                    </div>
                  </div>
                )}

                {/* STEP 3: CHECKIN DONE SUCCESS STATE */}
                {scanStep === "CHECKIN_DONE" && (
                  <div className="space-y-4 pt-2">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span className="font-bold">สแกน QR Code เช็กอินสำเร็จ!</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="text-center border-b border-slate-100 pb-3">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">เวลาเริ่มงานของคุณ</span>
                        <h4 className="text-2xl font-mono font-extrabold text-[#001D3D] mt-1">{userApplicant?.checkInTime || "08:35:22"} น.</h4>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">วันที่: {selectedActivity.date}</p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">กิจกรรม:</span>
                          <span className="font-bold text-slate-700 truncate max-w-[140px]">{selectedActivity.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ชั่วโมงเป้าหมาย:</span>
                          <span className="font-bold text-[#cca43b]">{selectedActivity.hours} ชั่วโมงสะสม</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] text-blue-800 leading-relaxed">
                      <span className="font-bold block">📸 อัปโหลดรูปภาพกิจกรรมขณะร่วมปฏิบัติ:</span>
                      <p className="text-slate-500 mt-1">อัปโหลดอย่างน้อย 2 ภาพเพื่อใช้เป็นหลักฐานส่งเสริมผู้คุมประพฤติ</p>
                      <button
                        onClick={() => {
                          setUploadedPhotos([
                            "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=100&auto=format&fit=crop&q=60",
                            "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=100&auto=format&fit=crop&q=60"
                          ]);
                          alert("📸 จำลองการถ่ายภาพทำความสะอาดและอัปโหลดหลักฐาน 2 รูปสำเร็จ!");
                        }}
                        className="mt-2 w-full bg-white text-blue-700 py-1.5 px-3 rounded-lg font-bold border border-blue-200 hover:bg-blue-50 flex items-center justify-center space-x-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>จำลองถ่ายรูปหน้างาน ({uploadedPhotos.length} รูป)</span>
                      </button>
                    </div>

                    <button
                      onClick={triggerCheckOut}
                      className="w-full bg-[#1b439c] hover:bg-[#cca43b] text-white hover:text-[#001D3D] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow"
                    >
                      สแกนและยืนยันออกงาน (Check-Out)
                    </button>
                  </div>
                )}

                {/* STEP 4: SIGNING CANVAS DRAWING */}
                {scanStep === "SIGNING" && (
                  <div className="space-y-4 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ขั้นตอนสุดท้าย: ลงลายมือชื่อดิจิทัล</span>
                    
                    {/* Simulated HTML Canvas Drawing Box */}
                    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-inner flex flex-col">
                      <div className="bg-slate-50 py-1 px-3 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400">กรุณาใช้นิ้วเซ็นชื่อลงในกรอบ</span>
                        <button onClick={clearCanvas} className="text-[9px] text-[#cca43b] font-bold hover:underline">ล้างกรอบ</button>
                      </div>
                      
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="bg-slate-50 cursor-crosshair w-full"
                      />
                    </div>

                    <button
                      onClick={submitCheckOut}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow"
                    >
                      บันทึกภาพถ่ายและลายเซ็นออกงาน
                    </button>
                  </div>
                )}

                {/* STEP 5: FINAL SUMMARY RESULTS (Page 7) */}
                {scanStep === "SUMMARY" && (
                  <div className="space-y-4 pt-1">
                    <div className="bg-emerald-500 text-white p-3 rounded-xl text-center space-y-1">
                      <CheckCircle className="w-6 h-6 mx-auto" />
                      <h5 className="text-xs font-bold">บันทึกกิจกรรมสะสมชั่วโมงสำเร็จ!</h5>
                      <p className="text-[9px] text-emerald-100">ส่งข้อมูลเข้าแดชบอร์ดเจ้าหน้าที่แล้ว</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span>ชั่วโมงที่ได้รับ:</span>
                        <span className="font-extrabold text-emerald-600">+{selectedActivity.hours} ชั่วโมง</span>
                      </div>
                      <div className="flex justify-between">
                        <span>สะสมรวมของท่าน:</span>
                        <span className="font-extrabold text-[#001D3D]">{probationerProfile.completedHours} / {probationerProfile.requiredHours} ชม.</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setScanStep("SELECT");
                        setUploadedPhotos([]);
                        setSignatureData("");
                      }}
                      className="w-full bg-slate-800 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all hover:bg-slate-700 text-center"
                    >
                      เสร็จสิ้นปิดหน้างานนี้
                    </button>
                  </div>
                )}

              </div>

              {/* iPhone Navigation Footer (Page 7 bottom) */}
              <div className="bg-[#001D3D] text-slate-400 py-3.5 border-t border-white/10 flex justify-around text-center shrink-0">
                <button onClick={() => setCurrentView("DASHBOARD")} className="flex flex-col items-center">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[8px] mt-1 text-slate-400 font-semibold">หน้าหลัก</span>
                </button>
                <button onClick={() => setCurrentView("VOLUNTEER")} className="flex flex-col items-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[8px] mt-1 text-slate-400 font-semibold">กิจกรรม</span>
                </button>
                <div className="flex flex-col items-center -mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#cca43b] text-[#001D3D] flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-[#cca43b]/30">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[8px] mt-1 text-[#cca43b] font-bold">สแกน QR</span>
                </div>
                <button onClick={() => setCurrentView("TRACKER")} className="flex flex-col items-center">
                  <Clock className="w-3.5 h-3.5 text-[#cca43b]" />
                  <span className="text-[8px] mt-1 text-[#cca43b] font-semibold">ชั่วโมงฉัน</span>
                </button>
                <button onClick={() => setCurrentView("PROFILE")} className="flex flex-col items-center">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[8px] mt-1 text-slate-400 font-semibold">โปรไฟล์</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Footer motive quotes banner */}
      <GovBanner />

    </div>
  );
};
