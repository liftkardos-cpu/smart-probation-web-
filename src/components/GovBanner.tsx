import React from "react";

export const GovBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#001D3D] via-[#003f7a] to-[#00152e] py-6 px-8 flex flex-col md:flex-row items-center justify-between border border-[#cca43b]/20 shadow-xl mt-6">
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-[#cca43b]/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-center space-x-4">
        <span className="text-3xl md:text-4xl text-[#cca43b] font-serif leading-none">“</span>
        <div className="text-center md:text-left">
          <p className="text-white font-sans text-base md:text-lg font-bold tracking-wide italic">
            โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...<span className="text-[#cca43b]">คุณทำได้</span>
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5 tracking-wider uppercase font-mono">
            Smart Probation Rehabilitation Initiative • Department of Probation
          </p>
        </div>
        <span className="text-3xl md:text-4xl text-[#cca43b] font-serif leading-none">”</span>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-300 text-[11px] font-medium font-sans">
          ระบบรายงานตัวแบบออนไลน์ ปลอดภัย ถูกต้อง 100%
        </span>
      </div>
    </div>
  );
};
