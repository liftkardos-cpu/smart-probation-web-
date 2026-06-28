import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import progressBotAvatar from "../assets/images/progress_bot_avatar_1782684805448.jpeg";
import { MessageSquare, X, Sparkles } from "lucide-react";

export const FloatingBot: React.FC = () => {
  const { isLoggedIn, currentView, setCurrentView } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show a gentle greeting bubble after 3 seconds, only once
  useEffect(() => {
    if (isLoggedIn && currentView !== "AI_ASSISTANT" && !isDismissed) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isLoggedIn, currentView, isDismissed]);

  // If the user is not logged in, or already in the AI Assistant view, hide the widget or keep it minimal
  if (!isLoggedIn) return null;

  const handleClick = () => {
    setCurrentView("AI_ASSISTANT");
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {/* Tooltip / Speech bubble */}
      <AnimatePresence>
        {showTooltip && currentView !== "AI_ASSISTANT" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 bg-white/95 backdrop-blur-md border border-blue-200 text-slate-800 p-3 rounded-2xl shadow-xl max-w-[240px] pointer-events-auto relative text-xs flex flex-col gap-1"
          >
            {/* Close button for the bubble */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
                setIsDismissed(true);
              }}
              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
              title="ปิดการแนะนำ"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Bubble content */}
            <div className="flex items-center gap-1 text-[#1b439c] font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#cca43b]" />
              <span>AI Assistant (P+)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed pr-3">
              สวัสดีครับ! สงสัยเรื่องการรายงานตัวหรือชั่วโมงกิจกรรมอาสา ถามผมได้ตลอด 24 ชั่วโมงเลยครับ
            </p>
            
            <button
              onClick={handleClick}
              className="mt-1 bg-[#1b439c] hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>เริ่มต้นถามเลย</span>
            </button>

            {/* Little notch arrow at the bottom right */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-blue-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot character */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="pointer-events-auto cursor-pointer relative group"
        onClick={handleClick}
      >
        {/* Soft glowing neon circle orbit underneath/around the robot */}
        <div className="absolute inset-0 bg-blue-400/35 rounded-full blur-md opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 animate-pulse" />
        
        {/* Outer glowing border ring */}
        <div className="relative w-16 h-16 rounded-full border-2 border-blue-500/50 bg-[#001D3D] p-0.5 overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-[#cca43b]/80 group-active:scale-95">
          <img
            src={progressBotAvatar}
            alt="P+ AI Assistant"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Small badge icon (AI Indicator) */}
        <div className="absolute top-0 right-0 bg-[#cca43b] text-[#001D3D] p-1 rounded-full border border-white shadow-md flex items-center justify-center">
          <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Unobtrusive Label tooltip on hover of the avatar */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md border border-slate-700">
          เปิด AI Assistant (P+)
        </div>
      </motion.div>

    </div>
  );
};
