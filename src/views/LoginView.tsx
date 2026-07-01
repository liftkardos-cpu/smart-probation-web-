import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { AnimatePresence, motion } from "motion/react";
import progressPrimaryLogo from "../assets/images/progress_primary_logo_1782675430398.jpeg";
import progressHorizontalLogo from "../assets/images/progress_horizontal_logo_1782675445664.jpeg";
import progressAppIcon from "../assets/images/progress_app_icon_1782678504850.jpeg";
import progressMonogram from "../assets/images/progress_monogram_1782675476258.jpeg";
import studentChonlida from "../assets/images/student_6711010272_1782390537646.jpeg";
import studentEkraprawee from "../assets/images/student_6711010186_1782682785023.jpeg";
import studentSaruta from "../assets/images/student_6711010438_saruta_1782683063590.jpeg";
import studentNatjaya from "../assets/images/student_6711010080_natjaya_1782683085035.jpeg";
import studentAlisha from "../assets/images/student_6711010476_alisha_1782683103340.jpeg";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Users, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Phone, 
  Calendar, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  CheckCircle2,
  Building,
  Key,
  X,
  Briefcase,
  Award,
  MapPin,
  QrCode,
  MessageSquare,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  Shield,
  Video
} from "lucide-react";

// =============================================================
// กำหนดลิงก์หรือไอดีวิดีโอ YouTube สำหรับวิดีโอแนะนำระบบตรงนี้
// ท่านสามารถนำลิงก์จาก YouTube เช่น:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - หรือเฉพาะไอดีวิดีโอ 11 หลัก เช่น dQw4w9WgXcQ มาใส่แทนได้เลย
// =============================================================
const YOUTUBE_VIDEO_URL_OR_ID = "https://youtu.be/X1QzdgmNyYQ$0";

const getYouTubeEmbedUrl = (urlOrId: string) => {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  
  // ตรวจสอบว่าเป็นเฉพาะไอดีวิดีโอ 11 หลักเดี่ยวๆ หรือไม่
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?autoplay=1&mute=1&loop=1&playlist=${trimmed}`;
  }

  let videoId = "";

  // 1. ตรวจสอบรูปแบบ short URL เช่น youtu.be/X1QzdgmNyYQ$0 หรือ youtu.be/X1QzdgmNyYQ
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    videoId = shortMatch[1];
  } else {
    // 2. ตรวจสอบรูปแบบ watch?v= หรือ embed/ หรือ v/
    const longMatch = trimmed.match(/(?:v=|\/embed\/|\/v\/|watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (longMatch) {
      videoId = longMatch[1];
    } else {
      // 3. รูปแบบครอบจักรวาล หาตัวอักษร 11 ตัวที่ต่อจากเครื่องหมาย / หรือ =
      const fallbackMatch = trimmed.match(/[\/=]([a-zA-Z0-9_-]{11})/);
      if (fallbackMatch) {
        videoId = fallbackMatch[1];
      }
    }
  }

  // หากตรวจพบ Video ID ให้ทำการสร้าง Embed Link สำหรับ YouTube ในรูปแบบที่เล่นอัตโนมัติ วนซ้ำ และปิดเสียงเริ่มต้น
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  }

  // ตัวเลือกสำรองสุดท้าย: ดึงเอากลุ่มตัวอักษร 11 ตัวใดๆ ที่เจอใน URL
  const anyIdMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  if (anyIdMatch) {
    const fallbackId = anyIdMatch[1];
    return `https://www.youtube.com/embed/${fallbackId}?autoplay=1&mute=1&loop=1&playlist=${fallbackId}`;
  }

  return trimmed;
};

export const LoginView: React.FC = () => {
  const { setRole, setIsLoggedIn, addNotification, probationers, updateProbationerProfile } = useApp();
  const [selectedTab, setSelectedTab] = useState<UserRole>("PROBATIONER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isIntroVideoOpen, setIsIntroVideoOpen] = useState(false);
  const [dontShowIntroAgain, setDontShowIntroAgain] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualActiveTab, setManualActiveTab] = useState<"probationer" | "officer" | "partner" | "faq">("probationer");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const creators = [
    {
      name: "นายเอกประวีร์ แสงคง",
      studentId: "6711010186",
      gradient: "from-amber-500/10 to-yellow-600/10",
      borderColor: "border-amber-500/20",
      textAccent: "text-amber-700",
      avatarInitials: "EP",
      imageSrc: studentEkraprawee
    },
    {
      name: "นางสาวชลิดา ขุนแก้ว",
      studentId: "6711010272",
      gradient: "from-blue-500/10 to-[#001D3D]/10",
      borderColor: "border-blue-500/20",
      textAccent: "text-blue-700",
      avatarInitials: "CL",
      imageSrc: studentChonlida
    },
    {
      name: "นางสาวณัจยา ศรีมณี",
      studentId: "6711010080",
      gradient: "from-purple-500/10 to-indigo-600/10",
      borderColor: "border-purple-500/20",
      textAccent: "text-purple-700",
      avatarInitials: "NJ",
      imageSrc: studentNatjaya
    },
    {
      name: "นางสาวอลิชาเฟียร์ สามะ",
      studentId: "6711010476",
      gradient: "from-rose-500/10 to-pink-600/10",
      borderColor: "border-rose-500/20",
      textAccent: "text-rose-700",
      avatarInitials: "AF",
      imageSrc: studentAlisha
    },
    {
      name: "นางสาวศรุตา แซ่โอ้ว",
      studentId: "6711010438",
      gradient: "from-emerald-500/10 to-teal-600/10",
      borderColor: "border-emerald-500/20",
      textAccent: "text-emerald-700",
      avatarInitials: "SR",
      imageSrc: studentSaruta
    }
  ];

  const [activeCreatorIdx, setActiveCreatorIdx] = useState(0);
  const [isCreatorAutoplay, setIsCreatorAutoplay] = useState(true);

  useEffect(() => {
    if (!isCreatorAutoplay) return;
    const interval = setInterval(() => {
      setActiveCreatorIdx((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCreatorAutoplay]);

  useEffect(() => {
    const hideIntro = localStorage.getItem("hideIntroVideo");
    if (hideIntro !== "true") {
      setIsIntroVideoOpen(true);
    }
  }, []);

  const handleCloseIntroVideo = () => {
    if (dontShowIntroAgain) {
      localStorage.setItem("hideIntroVideo", "true");
    }
    setIsIntroVideoOpen(false);
  };

  // Auto-fill mock login details for demonstration
  const handleSimulateLogin = (role: UserRole, email: string, pass: string) => {
    setSelectedTab(role);
    setUsername(email);
    setPassword(pass);
    addNotification(
      `จำลองบัญชีผู้ใช้สำเร็จ`,
      `กรอกอีเมลสาธิตและสลับระบบไปยังบทบาท "${
        role === "PROBATIONER" ? "ผู้ถูกคุมประพฤติ" : role === "OFFICER" ? "เจ้าหน้าที่" : "หน่วยงานภาคี"
      }" เรียบร้อยแล้ว`,
      "ระบบ"
    );
  };

  // Quick direct simulated login for 3 roles
  const handleQuickLoginDirectly = (role: UserRole, email: string, pass: string) => {
    setSelectedTab(role);
    setUsername(email);
    setPassword(pass);
    setRole(role);
    
    if (role === "PROBATIONER") {
      const trimmedUser = email.trim().toLowerCase();
      const matched = probationers.find(p => {
        const rawId = p.id.replace("PB-", "");
        return rawId === trimmedUser || p.id.toLowerCase() === trimmedUser || p.email.toLowerCase() === trimmedUser || p.name.includes(email);
      });
      
      if (matched) {
        updateProbationerProfile(matched);
        addNotification(
          "เข้าสู่ระบบสำเร็จ (ผู้ถูกคุมประพฤติ)",
          `ยินดีต้อนรับคุณ ${matched.name} (${matched.id.replace("PB-", "รหัสนิสิต ")}) เข้าสู่ระบบ PROGRESS+`,
          "ระบบ"
        );
      } else {
        updateProbationerProfile(probationers[0]);
        addNotification(
          "เข้าสู่ระบบสำเร็จ (ผู้ถูกคุมประพฤติ)",
          `ยินดีต้อนรับคุณ ${probationers[0].name} เข้าสู่ระบบ PROGRESS+`,
          "ระบบ"
        );
      }
    } else if (role === "OFFICER") {
      addNotification(
        "เข้าสู่ระบบสำเร็จ (เจ้าหน้าที่)",
        `ยินดีต้อนรับ คุณณัฐพงษ์ รักงาน เข้าสู่ระบบ PROGRESS+`,
        "ระบบ"
      );
    } else if (role === "PARTNER") {
      addNotification(
        "เข้าสู่ระบบสำเร็จ (หน่วยงานภาคีเครือข่าย)",
        `ยินดีต้อนรับ ผู้แทนหน่วยงานภาคีเครือข่าย เข้าสู่ระบบ PROGRESS+`,
        "ระบบ"
      );
    }
    
    setIsLoggedIn(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    setRole(selectedTab);
    
    if (selectedTab === "PROBATIONER") {
      const trimmedUser = username.trim().toLowerCase();
      // Match by Student ID (e.g. 6711010186), context ID (e.g. PB-6711010186), or email, or name
      const matched = probationers.find(p => {
        const rawId = p.id.replace("PB-", "");
        return rawId === trimmedUser || p.id.toLowerCase() === trimmedUser || p.email.toLowerCase() === trimmedUser || p.name.includes(username);
      });
      
      if (matched) {
        updateProbationerProfile(matched);
        addNotification(
          "เข้าสู่ระบบสำเร็จ (ฐานข้อมูลนิสิต)",
          `ยินดีต้อนรับคุณ ${matched.name} (${matched.id.replace("PB-", "รหัสนิสิต ")}) เข้าสู่ระบบ PROGRESS+`,
          "ระบบ"
        );
      } else {
        // Fallback to first student
        updateProbationerProfile(probationers[0]);
        addNotification(
          "เข้าสู่ระบบสำเร็จ (ฐานข้อมูลนิสิต)",
          `ยินดีต้อนรับคุณ ${probationers[0].name} เข้าสู่ระบบ PROGRESS+`,
          "ระบบ"
        );
      }
    } else {
      addNotification(
        "เข้าสู่ระบบสำเร็จ",
        `ยินดีต้อนรับเข้าสู่ระบบ PROGRESS+ : ก้าวใหม่ สู่โอกาสใหม่`,
        "ระบบ"
      );
    }
    
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf5fc] via-[#f4fafe] to-[#e4f2fd] flex flex-col justify-between font-sans relative overflow-x-hidden select-none">
      
      {/* Main Container - Skyline & Justice background element */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-10 flex flex-col justify-center relative z-10">
        
        {/* Responsive Grid System: Left branding (7 cols), Right form (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* =============================================================
              LEFT SIDE: BRANDING, BRIDGE GRAPHICS, AND STATS PANELS
              ============================================================= */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-4">
            
            {/* Top Thai Government Seal and department names */}
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 shrink-0 shadow-md bg-[#001D3D] rounded-full border border-[#cca43b]/40 overflow-hidden p-0.5">
                <img
                  src={progressMonogram}
                  alt="PROGRESS+ Logo"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-tight text-slate-800 leading-tight">กรมคุมประพฤติ</h3>
                <p className="text-[10px] font-bold tracking-widest text-blue-800 uppercase font-mono">DEPARTMENT OF PROBATION</p>
              </div>
            </div>

            {/* Heading Titles */}
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-black text-[#031d44] tracking-tight leading-none uppercase">
                PROGRESS+
                <span className="block mt-2 text-2xl lg:text-3xl text-blue-600 font-black normal-case">ก้าวใหม่ สู่โอกาสใหม่</span>
              </h1>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                แพลตฟอร์มดิจิทัลอัจฉริยะเพื่อการฟื้นฟู พัฒนศักยภาพ และคืนคนดีสู่สังคมอย่างยั่งยืน
              </p>
            </div>

            {/* Motivational Quote & Bridge/Scales Illustration */}
            <div className="relative py-4">
              
              {/* Quote container */}
              <div className="text-center bg-white/45 backdrop-blur-sm border border-white/40 py-4 px-6 rounded-2xl shadow-sm max-w-lg mx-auto relative z-20">
                <p className="text-slate-700 text-sm font-semibold">
                  “ โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...<span className="text-blue-600 font-extrabold">คุณทำได้</span> ”
                </p>
              </div>

              {/* Spectacular Bridge Background Graphic */}
              <div className="w-full h-44 relative mt-4 overflow-hidden rounded-3xl flex items-end justify-center pointer-events-none select-none">
                
                {/* Glowing radial background represent solar light */}
                <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-white/70 via-transparent to-transparent z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/15 rounded-full blur-3xl z-0" />
                
                {/* Scales of justice in the background */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-0 opacity-25">
                  <svg viewBox="0 0 200 200" className="w-40 h-40 text-blue-900 fill-none stroke-current" strokeWidth="3" strokeLinecap="round">
                    <path d="M70 180 L130 180 M90 180 L90 170 L110 170 L110 180" />
                    <path d="M100 170 L100 40" strokeWidth="4" />
                    <circle cx="100" cy="35" r="6" fill="currentColor" />
                    <path d="M40 60 Q100 55 160 60" strokeWidth="4" />
                    <path d="M40 60 L25 110 M40 60 L55 110" strokeWidth="1.5" />
                    <path d="M160 60 L145 110 M160 60 L175 110" strokeWidth="1.5" />
                    <path d="M20 110 Q40 120 60 110 Z" fill="currentColor" opacity="0.3" />
                    <path d="M140 110 Q160 120 180 110 Z" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>

                {/* Suspension bridge arch wires and path */}
                <div className="absolute bottom-0 w-full h-24 z-10 opacity-70">
                  <svg viewBox="0 0 600 100" className="w-full h-full text-blue-500 fill-none stroke-current" strokeWidth="1.5">
                    <path d="M0,90 Q300,10 600,90" />
                    <path d="M0,95 Q300,30 600,95" />
                    {/* Bridge vertical cords */}
                    <line x1="100" y1="80" x2="100" y2="92" />
                    <line x1="200" y1="52" x2="200" y2="94" />
                    <line x1="300" y1="42" x2="300" y2="95" />
                    <line x1="400" y1="52" x2="400" y2="94" />
                    <line x1="500" y1="80" x2="500" y2="92" />
                  </svg>
                </div>

                {/* Road surface gradient */}
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-sky-200/50 to-transparent z-10 border-b border-sky-300/30" />

                {/* 5 Silhouettes of people walking towards the future */}
                <div className="flex items-end justify-center space-x-6 pb-2 relative z-20">
                  {/* Person 1 */}
                  <div className="w-3.5 h-10 bg-slate-800 rounded-t-full relative opacity-85 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full absolute -top-3.5 left-1/2 -translate-x-1/2" />
                  </div>
                  {/* Person 2 */}
                  <div className="w-4 h-12 bg-slate-800 rounded-t-full relative opacity-90 shadow-sm">
                    <div className="w-3 h-3 bg-slate-800 rounded-full absolute -top-4 left-1/2 -translate-x-1/2" />
                  </div>
                  {/* Person 3 (center) */}
                  <div className="w-4 h-14 bg-[#1b439c] rounded-t-full relative opacity-100 shadow-md">
                    <div className="w-3 h-3 bg-[#1b439c] rounded-full absolute -top-4 left-1/2 -translate-x-1/2" />
                  </div>
                  {/* Person 4 */}
                  <div className="w-3.5 h-11 bg-slate-800 rounded-t-full relative opacity-85 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full absolute -top-3.5 left-1/2 -translate-x-1/2" />
                  </div>
                  {/* Person 5 */}
                  <div className="w-3.5 h-9 bg-slate-800 rounded-t-full relative opacity-80 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full absolute -top-3 left-1/2 -translate-x-1/2" />
                  </div>
                </div>

              </div>
            </div>

            {/* 1. Translucent Connected Parties Card ("ระบบที่เชื่อมโยงทุกภาคส่วน") */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-5 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider pl-1">
                ระบบที่เชื่อมโยงทุกภาคส่วน
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Item 1: ผู้ถูกคุมประพฤติ */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">ผู้ถูกคุมประพฤติ</span>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    ติดตามประพฤติ รายงานตัว และพัฒนาตนเอง
                  </p>
                </div>

                {/* Item 2: เจ้าหน้าที่ */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    {/* High fidelity SVG of officer peak cap */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-current">
                      <path d="M12 2C8 2 4 5 4 8c0 0 3 0 4-1 .5-.5 1-1.5 4-1.5s3.5 1 4 1.5c1 1 4 1 4 1 0-3-4-6-8-6z" />
                      <path d="M4 9c0 .5.5 1 1 1h14c.5 0 1-.5 1-1H4z" opacity="0.8" />
                      <path d="M5 11c0 3 2.5 6 7 6s7-3 7-6H5z" opacity="0.5" />
                      <path d="M8 18c0 1.5 1.5 3 4 3s4-1.5 4-3H8z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">เจ้าหน้าที่</span>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    บริหารจัดการ ติดตาม และประเมินผลอย่างมีประสิทธิภาพ
                  </p>
                </div>

                {/* Item 3: หน่วยงานภาคี */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">หน่วยงานภาคี</span>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    บูรณาการความร่วมมือ เพื่อการฟื้นฟูอย่างยั่งยืน
                  </p>
                </div>

                {/* Item 4: เพื่อสังคมที่ปลอดภัย */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">เพื่อสังคมที่ปลอดภัย</span>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    ลดการกระทำผิดซ้ำ สร้างคนดีคืนสู่สังคม
                  </p>
                </div>

              </div>
            </div>

            {/* 2. Translucent Stats Card ("ข้อมูลภาพรวม ( ณ วันที่ 20 พฤษภาคม 2567 )") */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-5 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider pl-1">
                ข้อมูลภาพรวม <span className="text-[10px] text-slate-500 font-medium tracking-normal">( ณ วันที่ 20 พฤษภาคม 2570 )</span>
              </h4>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                
                {/* Stat Col 1: ผู้ถูกคุมประพฤติ */}
                <div className="space-y-1 pl-1">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#1b439c] shrink-0" />
                    <span className="text-[10px] text-slate-700 font-bold">ผู้ถูกคุมประพฤติทั้งหมด</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-lg font-black text-[#031d44] block">28,246 <span className="text-[11px] font-medium text-slate-600">ราย</span></span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 9.8% จากเดือนที่ผ่านมา</span>
                  </div>
                </div>

                {/* Stat Col 2: รายงานตัววันนี้ */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <ClipboardCheck className="w-4 h-4 text-[#1b439c] shrink-0" />
                    <span className="text-[10px] text-slate-700 font-bold">รายงานตัววันนี้</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-lg font-black text-[#031d44] block">1,245 <span className="text-[11px] font-medium text-slate-600">ราย</span></span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 15.7% จากเมื่อวาน</span>
                  </div>
                </div>

                {/* Stat Col 3: ชั่วโมงบำเพ็ญ */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-[#1b439c] shrink-0" />
                    <span className="text-[10px] text-slate-700 font-bold">ชั่วโมงบริการสังคมรวม</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-lg font-black text-[#031d44] block">1,245,678 <span className="text-[11px] font-medium text-slate-600">ชั่วโมง</span></span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 12.3% จากเดือนที่ผ่านมา</span>
                  </div>
                </div>

                {/* Stat Col 4: อัตราผิดซ้ำ */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1b439c] shrink-0" />
                    <span className="text-[10px] text-slate-700 font-bold">อัตราการกระทำผิดซ้ำ</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-lg font-black text-[#031d44] block">12.45%</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↓ 2.35% จากเดือนที่ผ่านมา</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* =============================================================
              RIGHT SIDE: THE MAGNIFICENT WHITE LOGIN CARD
              ============================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            
            <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-xl border border-white/60 max-w-[460px] w-full space-y-6 relative z-10">
              
              {/* Form logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#001D3D] rounded-2xl border border-[#cca43b]/30 flex items-center justify-center p-0.5 shadow-md relative overflow-hidden">
                   <img
                    src={progressAppIcon}
                    alt="PROGRESS+ Logo"
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              {/* Form header titles */}
              <div className="text-center space-y-1.5">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">เข้าสู่ระบบ</h2>
                <p className="text-xs font-bold text-blue-800 uppercase font-sans tracking-wider">PROGRESS+ : ก้าวใหม่ สู่โอกาสใหม่</p>
                <p className="text-xs font-medium text-slate-400">กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ</p>
              </div>

              {/* Roles switcher tabs (3 roles) */}
              <div className="grid grid-cols-3 gap-2">
                
                {/* 1. Probationer Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTab("PROBATIONER")}
                  className={`py-3.5 px-1 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    selectedTab === "PROBATIONER"
                      ? "bg-blue-50/50 border-blue-600 text-[#1b439c] ring-2 ring-blue-600/10"
                      : "border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white"
                  }`}
                >
                  <User className={`w-5 h-5 ${selectedTab === "PROBATIONER" ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-[10px] sm:text-xs font-bold">ผู้ถูกคุมประพฤติ</span>
                </button>

                {/* 2. Officer Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTab("OFFICER")}
                  className={`py-3.5 px-1 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    selectedTab === "OFFICER"
                      ? "bg-blue-50/50 border-blue-600 text-[#1b439c] ring-2 ring-blue-600/10"
                      : "border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white"
                  }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center ${selectedTab === "OFFICER" ? "text-blue-600" : "text-slate-400"}`}>
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                      <path d="M12 2C8 2 4 5 4 8c0 0 3 0 4-1 .5-.5 1-1.5 4-1.5s3.5 1 4 1.5c1 1 4 1 4 1 0-3-4-6-8-6z" />
                      <path d="M4 9c0 .5.5 1 1 1h14c.5 0 1-.5 1-1H4z" opacity="0.8" />
                      <path d="M5 11c0 3 2.5 6 7 6s7-3 7-6H5z" opacity="0.5" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold">เจ้าหน้าที่</span>
                </button>

                {/* 3. Partner Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTab("PARTNER")}
                  className={`py-3.5 px-1 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    selectedTab === "PARTNER"
                      ? "bg-blue-50/50 border-blue-600 text-[#1b439c] ring-2 ring-blue-600/10"
                      : "border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white"
                  }`}
                >
                  <Building className={`w-5 h-5 ${selectedTab === "PARTNER" ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-[10px] sm:text-xs font-bold">หน่วยงานภาคี</span>
                </button>

              </div>

              {/* actual form fields */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Username Input */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[11px] font-bold text-slate-500">
                    {selectedTab === "PROBATIONER" 
                      ? "รหัสนิสิต / ชื่อผู้ถูกคุมประพฤติ (ค้นหาจากฐานข้อมูล 375 คน)" 
                      : "เลขประจำตัวประชาชน / เลขบัตรประจำตัวเจ้าหน้าที่ / อีเมล"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onFocus={() => setShowStudentDropdown(true)}
                      onBlur={() => setTimeout(() => setShowStudentDropdown(false), 200)}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setShowStudentDropdown(true);
                      }}
                      placeholder={
                        selectedTab === "PROBATIONER"
                          ? "พิมพ์ชื่อ หรือ รหัสนิสิต (เช่น มุกธิดา หรือ 6710111002)"
                          : selectedTab === "OFFICER"
                          ? "กรอกเลขบัตรประจำตัวเจ้าหน้าที่ / อีเมล"
                          : "กรอกเลขทะเบียนหน่วยงาน / อีเมล"
                      }
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-slate-800 font-medium placeholder:text-slate-400"
                    />
                  </div>

                  {/* Search Autocomplete Dropdown for Probationer Database */}
                  {selectedTab === "PROBATIONER" && (
                    <div className="text-[10px] text-slate-400 font-medium px-1 flex items-center justify-between">
                      <span>💡 ค้นหาและเลือกรหัสนิสิตหรือชื่อจริงจาก 375 คนได้ทันที</span>
                    </div>
                  )}

                  {selectedTab === "PROBATIONER" && showStudentDropdown && (
                    (() => {
                      const query = username.trim().toLowerCase();
                      const filtered = query
                        ? probationers.filter(p => {
                            const rawId = p.id.replace("PB-", "");
                            return p.name.toLowerCase().includes(query) || 
                                   rawId.includes(query) || 
                                   p.id.toLowerCase().includes(query);
                          }).slice(0, 6)
                        : probationers.slice(0, 6); // default suggestions

                      if (filtered.length > 0) {
                        return (
                          <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                            <div className="bg-slate-50 text-[10px] font-bold text-slate-400 px-3 py-1.5 flex justify-between items-center">
                              <span>พบรายชื่อที่ตรงกัน (แสดงสูงสุด 6 รายการ)</span>
                              <span>ทั้งหมด 375 รายชื่อ</span>
                            </div>
                            {filtered.map((student) => {
                              const rawId = student.id.replace("PB-", "");
                              return (
                                <button
                                  key={student.id}
                                  type="button"
                                  onMouseDown={() => {
                                    setUsername(rawId);
                                    setPassword("student123");
                                    setShowStudentDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs text-slate-700 flex items-center justify-between transition-all"
                                >
                                  <div className="flex items-center space-x-2.5">
                                    <img 
                                      src={student.avatarUrl} 
                                      alt={student.name} 
                                      className="w-7 h-7 rounded-full object-cover border border-slate-100" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <div className="font-bold text-slate-800">{student.name}</div>
                                      <div className="text-[10px] text-slate-400 font-medium">รหัสนิสิต: {rawId} • {student.email}</div>
                                    </div>
                                  </div>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                    student.status === "ปกติ" 
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                      : student.status === "เฝ้าระวังพิเศษ"
                                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                                      : "bg-amber-50 text-amber-600 border border-amber-100"
                                  }`}>
                                    {student.status}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-bold text-slate-500">
                      รหัสผ่าน
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("💡 หากท่านไม่ทราบหรือลืมรหัสผ่าน กรุณาตรวจสอบจากหนังสือแนะนำ หรือติดต่อสำนักงานคุมประพฤติสายด่วน 0 2141 4740เพื่อดำเนินการขอรหัสผ่านใหม่")}
                      className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Key className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่าน"
                      className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-slate-800 font-medium placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember checkbox */}
                <div className="flex items-center">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-slate-50 border border-slate-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white stroke-2 fill-none stroke-current" style={{ display: rememberMe ? "block" : "none" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="ml-2 text-xs font-bold text-slate-500 select-none">
                      จดจำฉันไว้ในระบบ
                    </span>
                  </label>
                </div>

                {/* blue Login button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white py-3 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </button>

              </form>

              {/* Or separator */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ทางเลือกสำหรับทดสอบ</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Simulated Quick Login (ระบบจำลองข้อมูลสำหรับผู้พัฒนา/ทดสอบ) */}
              <div className="space-y-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] text-slate-500 font-black text-center mb-1 flex items-center justify-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>สิทธิ์การใช้งานจำลอง (Quick Direct Login)</span>
                </div>

                {/* 1. Probationer Quick Login */}
                <button
                  type="button"
                  onClick={() => handleQuickLoginDirectly("PROBATIONER", "somchai.jaidee@email.com", "somchai123")}
                  className="w-full bg-white hover:bg-blue-50/30 border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-700 p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-800 text-[11px] group-hover:text-blue-700">1. ผู้ถูกคุมประพฤติจำลอง</div>
                      <div className="text-[9px] text-slate-400 font-medium">นายสมชาย ใจดี (รหัสนิสิตจำลอง)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>

                {/* 2. Officer Quick Login */}
                <button
                  type="button"
                  onClick={() => handleQuickLoginDirectly("OFFICER", "nattapong.officer@probation.go.th", "officer123")}
                  className="w-full bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-700 p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-800 text-[11px] group-hover:text-indigo-700">2. เจ้าหน้าที่คุมประพฤติ</div>
                      <div className="text-[9px] text-slate-400 font-medium">คุณณัฐพงษ์ รักงาน (ผู้ประเมินหลัก)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>

                {/* 3. Partner Quick Login */}
                <button
                  type="button"
                  onClick={() => handleQuickLoginDirectly("PARTNER", "hatyai.partner@hatyai.go.th", "partner123")}
                  className="w-full bg-white hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-800 text-[11px] group-hover:text-emerald-700">3. หน่วยงานภาคีเครือข่าย</div>
                      <div className="text-[9px] text-slate-400 font-medium">เทศบาลนครหาดใหญ่ (ผู้ดูแลงานบริการสังคม)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>

              {/* Bottom user manual link */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  id="btn-user-manual"
                  onClick={() => setIsManualOpen(true)}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>คู่มือการใช้งานระบบ</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =============================================================
          CREATORS & INNOVATORS SECTION (Auto-sliding Carousel)
          ============================================================= */}
      <div className="w-full bg-slate-50 border-t border-slate-200/60 py-10 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold tracking-wider uppercase">คณะผู้จัดทำนวัตกรรม</span>
            <h3 className="text-base md:text-lg font-black text-[#031d44] tracking-tight mt-2">
              คณะผู้จัดทำระบบเว็บไซต์ PROGRESS+
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              สาขาการบริหารงานตำรวจและกระบวนการยุติธรรม วิทยาลัยการจัดการเพื่อการพัฒนา มหาวิทยาลัยทักษิณ
            </p>
          </div>

          {/* Carousel Card */}
          <div 
            className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 md:p-6 transition-all relative overflow-hidden"
            onMouseEnter={() => setIsCreatorAutoplay(false)}
            onMouseLeave={() => setIsCreatorAutoplay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCreatorIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center gap-6"
              >
                {/* Creator Avatar Cylinder */}
                <div className="relative shrink-0">
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-tr ${creators[activeCreatorIdx].gradient} border-2 ${creators[activeCreatorIdx].borderColor} flex items-center justify-center shadow-md relative overflow-hidden`}>
                    {!imageErrors[activeCreatorIdx] ? (
                      <img 
                        src={creators[activeCreatorIdx].imageSrc} 
                        alt={creators[activeCreatorIdx].name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('student_')) {
                            // Try loading by student ID directly if custom path fails
                            target.src = `/assets/images/${creators[activeCreatorIdx].studentId}.jpeg`;
                          } else {
                            setImageErrors(prev => ({ ...prev, [activeCreatorIdx]: true }));
                          }
                        }}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center select-none">
                        <span className={`text-2xl md:text-3xl font-black ${creators[activeCreatorIdx].textAccent}`}>
                          {creators[activeCreatorIdx].avatarInitials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Absolute Badge for Student ID */}
                  <div className="absolute -top-1.5 -right-1.5 bg-[#031d44] border border-[#cca43b]/40 text-white rounded-full p-1.5 shadow-sm flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-[#cca43b]" />
                  </div>
                </div>

                {/* Creator Metadata */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <div className="space-y-2">
                      <h4 className="text-base md:text-lg font-bold text-slate-800 flex flex-col md:flex-row md:items-center gap-1 md:gap-3 justify-center md:justify-start">
                        <span className="font-bold text-slate-400 text-xs md:text-sm uppercase tracking-wider block md:inline-block w-20">ชื่อ-สกุล:</span> 
                        <span className="font-black text-[#031d44]">{creators[activeCreatorIdx].name}</span>
                      </h4>
                      <p className="text-sm font-bold text-slate-600 flex flex-col md:flex-row md:items-center gap-1 md:gap-3 justify-center md:justify-start">
                        <span className="font-bold text-slate-400 text-xs md:text-sm uppercase tracking-wider block md:inline-block w-20">รหัสนิสิต:</span> 
                        <span className="font-mono text-blue-700 font-black bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">{creators[activeCreatorIdx].studentId}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                    สาขาการบริหารงานตำรวจและกระบวนการยุติธรรม วิทยาลัยการจัดการเพื่อการพัฒนา มหาวิทยาลัยทักษิณ
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual Navigation Controls */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              {/* Left arrow */}
              <button
                type="button"
                onClick={() => {
                  setIsCreatorAutoplay(false);
                  setActiveCreatorIdx((prev) => (prev - 1 + 5) % 5);
                }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots indicators */}
              <div className="flex space-x-1.5">
                {creators.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsCreatorAutoplay(false);
                      setActiveCreatorIdx(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeCreatorIdx === idx ? "w-5 bg-[#031d44]" : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Right arrow */}
              <button
                type="button"
                onClick={() => {
                  setIsCreatorAutoplay(false);
                  setActiveCreatorIdx((prev) => (prev + 1) % 5);
                }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =============================================================
          FOOTER STRIP (At the very bottom, exactly like image)
          ============================================================= */}
      <div className="bg-[#031d44] text-white py-6 border-t border-blue-950 px-4 md:px-10 mt-auto select-none">
        <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Block */}
          <div className="text-center lg:text-left">
            <h4 className="text-xs font-black tracking-wider text-slate-100 uppercase">PROGRESS+ : ก้าวใหม่ สู่โอกาสใหม่</h4>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5 uppercase">POWERED BY DEPARTMENT OF PROBATION</p>
          </div>

          {/* Center Block (Phone & Clock) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-xs text-slate-200">
            {/* Phone */}
            <div className="flex items-center space-x-2 font-medium">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold leading-none">ติดต่อสอบถาม</span>
                <span className="font-bold">0 2141 4740</span>
              </div>
            </div>

            {/* Clock */}
            <div className="flex items-center space-x-2 font-medium">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold leading-none">เวลาทำการ</span>
                <span className="font-bold">จันทร์ - ศุกร์ 08:30 - 16:30 น.</span>
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="text-center lg:text-right text-[11px] text-slate-400 font-medium">
            <span className="block font-bold text-slate-200">เวอร์ชัน 1.0.0</span>
            <span className="block mt-0.5">© 2024 Department of Probation. All Rights Reserved.</span>
          </div>

        </div>
      </div>

      {/* =============================================================
          INTERACTIVE USER MANUAL MODAL (PROGRESS+ SYSTEM MANUAL)
          ============================================================= */}
      <AnimatePresence>
        {isManualOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-[#031d44] p-5 md:p-6 text-white flex items-center justify-between border-b border-blue-900/40 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)] pointer-events-none" />
                <div className="flex items-center space-x-3.5 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-[#cca43b]/40 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={progressAppIcon}
                      alt="PROGRESS+ Logo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] bg-[#cca43b]/20 text-[#cca43b] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">SYSTEM MANUAL</span>
                    <h3 className="text-lg md:text-xl font-black tracking-tight mt-0.5">คู่มือการใช้งานระบบนิเวศอัจฉริยะ PROGRESS+</h3>
                    <p className="text-xs text-slate-300 font-medium">ก้าวใหม่ สู่โอกาสใหม่ - แนะนำเครื่องมือและการใช้งานอย่างละเอียด</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManualOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer relative z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-slate-50 border-b border-slate-200 flex overflow-x-auto scrollbar-none px-4 md:px-6 py-2.5 gap-2 shrink-0">
                {[
                  { id: "probationer", label: "ผู้ถูกคุมประพฤติ", icon: User, color: "text-blue-600 bg-blue-50 border-blue-200", activeColor: "bg-blue-600 text-white" },
                  { id: "officer", label: "เจ้าหน้าที่คุมประพฤติ", icon: Shield, color: "text-amber-600 bg-amber-50 border-amber-200", activeColor: "bg-amber-600 text-white" },
                  { id: "partner", label: "หน่วยงานบริการสังคม/ภาคี", icon: Building, color: "text-emerald-600 bg-emerald-50 border-emerald-200", activeColor: "bg-emerald-600 text-white" },
                  { id: "faq", label: "คำถามที่พบบ่อย (FAQ)", icon: HelpCircle, color: "text-violet-600 bg-violet-50 border-violet-200", activeColor: "bg-violet-600 text-white" }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = manualActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setManualActiveTab(tab.id as any);
                        setActiveFaq(null);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isActive 
                          ? `${tab.activeColor} shadow-sm border border-transparent` 
                          : "text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-slate-50/30">
                <AnimatePresence mode="wait">
                  {manualActiveTab === "probationer" && (
                    <motion.div
                      key="probationer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Top Summary Banner */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-900">สำหรับผู้ถูกคุมประพฤติ (Probationer Portal)</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            เครื่องมือหลักในการปฏิบัติตามคำสั่งศาลแบบออนไลน์ ช่วยให้การสะสมชั่วโมงงานบริการสังคม การรายงานตัว และการมองหาโอกาสงานสร้างชีวิตใหม่เป็นเรื่องง่าย สะดวก ปลอดภัย และโปร่งใส
                          </p>
                        </div>
                      </div>

                      {/* Steps Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            step: "01",
                            title: "การนัดหมาย & รายงานตัวออนไลน์",
                            desc: "หน้าหลักแสดงวันนัดถัดไปอย่างเด่นชัด มีตัวจับเวลาเตือนความจำ ระบบจะอัปเดตอัตโนมัติเมื่อเจ้าหน้าที่นัดหมาย สามารถตรวจสอบประวัติการรายงานตัวย้อนหลังอย่างละเอียดได้ทันที",
                            icon: Calendar,
                            tag: "การรายงานตัว",
                            tagColor: "bg-blue-100 text-blue-700"
                          },
                          {
                            step: "02",
                            title: "บันทึกและหาตำแหน่งงานบริการสังคม",
                            desc: "ระบบแสดงความคืบหน้าของชั่วโมงสะสมด้วยวงแหวนสถิติ คุณสามารถค้นหาสถานที่บำเพ็ญประโยชน์ใกล้ตัว ลงทะเบียนจองวันเวลาที่สะดวก และนำเสนอ QR Code บนแอปพลิเคชันให้หน่วยงานสแกนลงเวลาทำความดีอย่างสะดวกสบาย",
                            icon: Award,
                            tag: "งานบริการสังคม",
                            tagColor: "bg-amber-100 text-amber-700"
                          },
                          {
                            step: "03",
                            title: "โอกาสสร้างงาน (ReStart Job Hub)",
                            desc: "ศูนย์รวมตำแหน่งงานเฉพาะที่เปิดใจต้อนรับและมอบโอกาสใหม่ให้ผู้ถูกคุมความประพฤติ เลือกคัดกรองงานตามความถนัด สมัครงานได้ทันที และติดตามประวัติการสมัครจากบริษัทภาคีรัฐและเอกชนชั้นนำ",
                            icon: Briefcase,
                            tag: "การสร้างอาชีพ",
                            tagColor: "bg-emerald-100 text-emerald-700"
                          },
                          {
                            step: "04",
                            title: "ถามตอบอัจฉริยะกับผู้ช่วย AI",
                            desc: "ปรึกษาข้อมูล ค้นหากฎระเบียบคุมประพฤติ วันนัดหมาย ชั่วโมงคงเหลือ หรือแนะนำสายอาชีพ ตลอด 24 ชั่วโมง โดยพิมพ์ถามตอบกับ PROGRESS+ AI Agent ที่เชื่อมต่อโดยตรงกับระบบประมวลผล Gemini อัจฉริยะ",
                            icon: Sparkles,
                            tag: "ระบบ AI อัจฉริยะ",
                            tagColor: "bg-violet-100 text-violet-700"
                          }
                        ].map((item, index) => {
                          const StepIcon = item.icon;
                          return (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                      <StepIcon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                                  </div>
                                  <span className="text-lg font-black text-slate-200 select-none">{item.step}</span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-800 mt-1">{item.title}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tips Banner */}
                      <div className="bg-slate-100 rounded-2xl p-4 flex items-center space-x-3.5 border border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">💡 ข้อแนะนำสำหรับการลงเวลาทำความดีสะสมชั่วโมง:</p>
                          <p className="text-slate-600 mt-0.5">พกสมาร์ทโฟนของท่านในวันทำกิจกรรม และเปิดหน้า QR Code ส่วนตัวให้เจ้าหน้าที่หน่วยงานภาคีสแกนทั้งก่อนเริ่มงานและหลังจบงานทุกครั้ง เพื่อยืนยันข้อมูลชั่วโมงอย่างถูกต้อง</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {manualActiveTab === "officer" && (
                    <motion.div
                      key="officer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Top Summary Banner */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start space-x-3">
                        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-900">สำหรับเจ้าหน้าที่คุมประพฤติ (Officer Portal)</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            เครื่องมือยกระดับประสิทธิภาพการทำงานของเจ้าหน้าที่ ช่วยลดขั้นตอนด้านเอกสาร ติดตามความคืบหน้าของผู้ถูกคุมความประพฤติในความดูแล ตรวจสอบหลักฐานพิกัด และส่งต่อความช่วยเหลือแบบบูรณาการ
                          </p>
                        </div>
                      </div>

                      {/* Grid Steps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            step: "01",
                            title: "แดชบอร์ดติดตามสถานะคุมประพฤติ",
                            desc: "ตรวจสอบรายชื่อและระดับความเสี่ยงของผู้ถูกคุมประพฤติทั้งหมดที่อยู่ในความดูแล ดูภาพรวมร้อยละความสำเร็จของชั่วโมงกิจกรรม เพื่อคัดกรองเคสที่มีโอกาสผิดเงื่อนไขได้ล่วงหน้าอย่างแม่นยำ",
                            icon: Users,
                            tag: "ระบบติดตามเคส",
                            tagColor: "bg-blue-100 text-blue-700"
                          },
                          {
                            step: "02",
                            title: "อนุมัติชั่วโมงบำเพ็ญประโยชน์ออนไลน์",
                            desc: "เมื่อผู้ถูกคุมประพฤติทำกิจกรรมเสร็จสิ้นและยื่นคำขอ ระบบจะแสดงพิกัด GPS บนแผนที่ และภาพหลักฐานกิจกรรม เจ้าหน้าที่สามารถตรวจสอบความถูกต้องแล้วกดอนุมัติชั่วโมงสะสมเพื่อเชื่อมข้อมูลทันที",
                            icon: CheckSquare,
                            tag: "การอนุมัติชั่วโมง",
                            tagColor: "bg-amber-100 text-amber-700"
                          },
                          {
                            step: "03",
                            title: "ประเมินความเสี่ยงและส่งต่อเคสฟื้นฟู",
                            desc: "ประเมินประวัติพฤติกรรมเพื่อวางแนวทางการฟื้นฟูเฉพาะบุคคล ส่งต่อผู้ถูกคุมประพฤติไปยังช่องทางสิทธิบำบัดรักษา หรือส่งต่อไปยังหน่วยงานนายจ้างเพื่อฝึกงานสร้างอาชีพตามเป้าหมายคืนคนดีสู่สังคม",
                            icon: ChevronRight,
                            tag: "การฟื้นฟูส่งต่อ",
                            tagColor: "bg-emerald-100 text-emerald-700"
                          },
                          {
                            step: "04",
                            title: "ระบบสนทนาความช่วยเหลือ & แชทสด",
                            desc: "ประสานงานกับผู้ถูกคุมประพฤติหรือตัวแทนหน่วยงานบริการสังคมโดยตรงผ่านหน้าจอแชท เพื่อความสะดวกในการชี้แจงข้อตกลง ตักเตือน หรือแก้ไขปัญหาข้อผิดพลาดได้อย่างรวดเร็ว",
                            icon: MessageSquare,
                            tag: "การสื่อสารบูรณาการ",
                            tagColor: "bg-violet-100 text-violet-700"
                          }
                        ].map((item, index) => {
                          const StepIcon = item.icon;
                          return (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                      <StepIcon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                                  </div>
                                  <span className="text-lg font-black text-slate-200 select-none">{item.step}</span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-800 mt-1">{item.title}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {manualActiveTab === "partner" && (
                    <motion.div
                      key="partner"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Top Summary Banner */}
                      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start space-x-3">
                        <Building className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-900">สำหรับหน่วยงานบริการสังคมและภาคีเครือข่าย (Partner Portal)</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            ช่องทางอำนวยความสะดวกสำหรับองค์กรปกครองส่วนท้องถิ่น วัด โรงเรียน นายจ้าง และหน่วยงานบริการสังคมภาคี ในการบริหารจัดการพื้นที่บำเพ็ญประโยชน์และการโพสต์รับสมัครพนักงาน
                          </p>
                        </div>
                      </div>

                      {/* Grid Steps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            step: "01",
                            title: "การประกาศรับสมัครงานบำเพ็ญประโยชน์",
                            desc: "สร้างตำแหน่งงานบริการสังคม กำหนดจำนวนที่รับ ช่วงเวลาที่ปฏิบัติงาน และหน้าที่รับผิดชอบ เพื่อให้ผู้ถูกคุมความประพฤติในระบบสามารถเลือกค้นหาและลงทะเบียนจองทำความดีสะสมชั่วโมงได้อย่างทั่วถึง",
                            icon: Briefcase,
                            tag: "สร้างประกาศกิจกรรม",
                            tagColor: "bg-blue-100 text-blue-700"
                          },
                          {
                            step: "02",
                            title: "การสแกนลงเวลาด้วย QR Code ระบบดิจิทัล",
                            desc: "ใช้แท็บเล็ตหรือสมาร์ทโฟนเข้าหน้าจอบัญชีภาคีเพื่อกดเปิดกล้องสแกน QR Code ประจำตัวของผู้ถูกคุมความประพฤติ เมื่อเริ่มเข้าปฏิบัติงาน และสแกนอีกครั้งเพื่อระบุเวลาสิ้นสุดการบำเพ็ญประโยชน์อย่างแม่นยำ",
                            icon: QrCode,
                            tag: "การเช็คชื่อเข้างาน",
                            tagColor: "bg-amber-100 text-amber-700"
                          },
                          {
                            step: "03",
                            title: "การส่งแบบประเมินและรายงานพฤติกรรม",
                            desc: "ประเมินวินัย ความตั้งใจทำงาน และพฤติกรรมทั่วไปของผู้เข้าร่วมบำเพ็ญประโยชน์ โดยกรอกแบบประเมินสั้น ๆ ในระบบ ซึ่งจะส่งรายงานไปให้เจ้าหน้าที่คุมประพฤติพิจารณาประกอบการสะสมชั่วโมงและประเมินผลคุมประพฤติ",
                            icon: ClipboardCheck,
                            tag: "การประเมินผลงาน",
                            tagColor: "bg-emerald-100 text-emerald-700"
                          },
                          {
                            step: "04",
                            title: "โพสต์ประกาศรับสมัครงานสร้างชีวิตใหม่",
                            desc: "สำหรับภาคีนายจ้างและบริษัทเอกชนที่เปิดโอกาสให้สิทธิ์พิเศษ สามารถโพสต์โฆษณาจัดหางานสำหรับผู้ใกล้พ้นคุกหรือผู้ที่ประพฤติดีในโปรแกรมฟื้นฟูของกรมคุมประพฤติ เพื่อรับสมัครและคัดสรรบุคลากรฝีมือดี",
                            icon: Users,
                            tag: "การร่วมสร้างชีวิตใหม่",
                            tagColor: "bg-violet-100 text-violet-700"
                          }
                        ].map((item, index) => {
                          const StepIcon = item.icon;
                          return (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                      <StepIcon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                                  </div>
                                  <span className="text-lg font-black text-slate-200 select-none">{item.step}</span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-800 mt-1">{item.title}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {manualActiveTab === "faq" && (
                    <motion.div
                      key="faq"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 flex items-start space-x-3 mb-2">
                        <HelpCircle className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-violet-900">คำถามที่พบบ่อย (FAQs)</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            ไขข้อสงสัยและคำถามเกี่ยวกับการปฏิบัติตน ชั่วโมงบำเพ็ญประโยชน์ และการประสานงานในโครงการ PROGRESS+
                          </p>
                        </div>
                      </div>

                      {[
                        {
                          q: "1. ขั้นตอนการลงเวลาทำความดีสะสมชั่วโมงด้วยระบบดิจิทัล ทำอย่างไร?",
                          a: "ผู้ถูกคุมความประพฤติเข้าสู่ระบบในมือถือ ไปที่แท็บ 'งานบริการสังคม' แล้วกดปุ่มเปิดแสดง QR Code ประจำตัว จากนั้นให้ผู้ประสานงานหน่วยงานบริการสังคมใช้สมาร์ทโฟนสแกนก่อนเริ่มทำกิจกรรม และสแกนซ้ำอีกครั้งหลังทำกิจกรรมเสร็จเพื่อลงบันทึกเวลาทำงานสะสมโดยอัตโนมัติ"
                        },
                        {
                          q: "2. หากติดธุระสำคัญ เจ็บป่วย หรือไม่สามารถไปรายงานตัวตามกำหนดต้องทำอย่างไร?",
                          a: "ผู้ถูกคุมความประพฤติต้องส่งคำร้องขอเลื่อนกำหนดนัดล่วงหน้าอย่างน้อย 3 วันผ่านแอปพลิเคชัน พร้อมอัปโหลดหลักฐานประกอบ เช่น ใบรับรองแพทย์ หรือกรณีฉุกเฉินให้ประสานงานติดต่อเจ้าหน้าที่คุมประพฤติเจ้าของสำนวนเพื่อทำการนัดหมายรายงานตัวออนไลน์ทดแทนทันที"
                        },
                        {
                          q: "3. ระยะเวลาการตรวจสอบและยืนยันอนุมัติชั่วโมงบำเพ็ญประโยชน์ใช้เวลานานเท่าใด?",
                          a: "หลังจากหน่วยงานบริการสังคมส่งแบบประเมินและลงเวลาสำเร็จผ่านแอปพลิเคชัน รายงานดิจิทัลจะถูกส่งตรงเข้าแผงงานของเจ้าหน้าที่คุมประพฤติทันที โดยทั่วไปเจ้าหน้าที่จะทำการตรวจสอบพิกัด GPS/ภาพถ่ายหลักฐาน และกดลงนามอนุมัติชั่วโมงภายใน 24-48 ชั่วโมง"
                        },
                        {
                          q: "4. สำหรับภาคีหรือบริษัทเอกชนที่สนใจเข้าร่วมมอบโอกาสงาน มีวิธีลงทะเบียนอย่างไร?",
                          a: "สามารถติดต่อกองพัฒนาพฤติกรรมผู้ถูกคุมประพฤติ หรือกดสมัครสมาชิกผ่านช่องทาง 'หน่วยงานบริการสังคม/ภาคี' ยื่นกรอกรายละเอียดพร้อมเอกสารจดทะเบียนบริษัท เจ้าหน้าที่จะทำการวิเคราะห์ประวัติและจัดส่งรหัสเข้าใช้งาน (Partner ID) ให้บริษัทเพื่อเปิดประกาศตำแหน่งงานภายใน 5 วันทำการ"
                        },
                        {
                          q: "5. ข้อมูลประวัติการคุมประพฤติและตำแหน่งงานจะถูกเปิดเผยต่อภายนอกหรือไม่?",
                          a: "ระบบ PROGRESS+ พัฒนาขึ้นโดยมีระบบรักษาความปลอดภัยเคร่งครัดตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ข้อมูลพฤติกรรมและการทำความผิดจะไม่มีการเปิดเผยต่อสาธารณะ และมีเพียงเจ้าหน้าที่ที่ได้รับมอบสิทธิ์รับผิดชอบสำนวนเท่านั้นที่สามารถเข้าถึงข้อมูลของท่านได้"
                        }
                      ].map((faq, idx) => {
                        const isOpen = activeFaq === idx;
                        return (
                          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all">
                            <button
                              onClick={() => setActiveFaq(isOpen ? null : idx)}
                              className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span>{faq.q}</span>
                              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-slate-100 bg-slate-50/50"
                                >
                                  <p className="p-4 text-xs text-slate-600 leading-relaxed">
                                    {faq.a}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer / Quick contact */}
              <div className="bg-slate-50 px-5 md:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  <span>ระบบได้รับมาตรฐานความปลอดภัยระดับพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <a
                    href="tel:021414740"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>โทรด่วนสายตรง</span>
                  </a>
                  <button
                    onClick={() => setIsManualOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    ปิดคู่มือใช้งาน
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =============================================================
          INTRODUCTORY VIDEO POPUP (PROGRESS+ INTRO VIDEO)
          ============================================================= */}
      <AnimatePresence>
        {isIntroVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-3xl z-[200] flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Frameless Cinematic Video Player (Apple / Instagram Style) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black/90 shadow-[0_0_60px_rgba(0,0,0,0.85)] border border-white/10"
            >
              <iframe
                src={getYouTubeEmbedUrl(YOUTUBE_VIDEO_URL_OR_ID)}
                title="PROGRESS+ Introductory Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />

              {/* Minimal Floating Close Circle (Frosted Glass) */}
              <button
                onClick={handleCloseIntroVideo}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-black/40 hover:bg-black/65 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 shadow-lg"
                title="ปิด"
              >
                <X className="w-5.5 h-5.5" />
              </button>

              {/* Tiny Floating Sound Hint */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] text-white/90 font-medium tracking-wide flex items-center space-x-2 border border-white/10 pointer-events-none shadow-md">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                <span>🔊 คลิกเปิดเสียงในเครื่องเล่น YouTube</span>
              </div>
            </motion.div>

            {/* Glassmorphic Minimalist Controls below Video */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.15 }}
              className="mt-6 flex flex-col sm:flex-row items-center gap-4 text-white font-medium"
            >
              {/* Checkbox (Modern Round Bubble style) */}
              <label className="flex items-center cursor-pointer select-none bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md transition-all active:scale-98">
                <input
                  type="checkbox"
                  checked={dontShowIntroAgain}
                  onChange={(e) => setDontShowIntroAgain(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 bg-transparent border border-white/35 rounded-full peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-black stroke-3 fill-none stroke-current" style={{ display: dontShowIntroAgain ? "block" : "none" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="ml-3 text-white/90 font-sans text-xs tracking-wide">
                  ไม่ต้องแสดงวิดีโอนี้อีกในครั้งถัดไป
                </span>
              </label>

              {/* Close and Enter button */}
              <button
                onClick={handleCloseIntroVideo}
                className="px-6 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-sans text-xs tracking-wide font-bold transition-all shadow-lg shadow-white/5 cursor-pointer active:scale-98"
              >
                เข้าสู่หน้าแรกระบบ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
