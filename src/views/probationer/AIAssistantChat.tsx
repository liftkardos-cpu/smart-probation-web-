import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import { Send, Sparkles, MessageSquare, ArrowRight, User, Compass, HelpCircle, AlertCircle } from "lucide-react";

export const AIAssistantChat: React.FC = () => {
  const { chatHistory, sendChatMessage, probationerProfile } = useApp();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested quick prompts (Page 10)
  const quickPrompts = [
    "เช็กวันรายงานตัวครั้งถัดไปและเงื่อนไขของฉัน",
    "ช่วยแนะนำงานฝึกวิชาชีพด้านช่างฝีมือเทคนิค",
    "เกณฑ์การประเมินคะแนนความประพฤติคืออะไร",
    "แนะนำกิจกรรมบริการสังคมในปทุมธานีให้หน่อย"
  ];

  // Scroll to bottom whenever messages list grows
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setInputText("");
    setIsLoading(true);

    try {
      await sendChatMessage(textToSend);
    } catch (err) {
      console.error("Chat transmission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">ถามตอบอัจฉริยะระบบคุมประพฤติ (AI Assistant Chat)</h2>
        <p className="text-xs text-slate-400 mt-1">
          ระบบแชตแนะนำสิทธิประโยชน์ทางกฎหมาย ตารางรายงานตัว และแนะนำคู่มือการฟื้นฟูวินัยตลอด 24 ชั่วโมง โดยเชื่อมต่อกับโมเดล Gemini AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Chat interface (Col Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
          
          {/* Chat box header */}
          <div className="bg-[#001D3D] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#cca43b]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Smart Probation AI Agent</h4>
                <p className="text-[10px] text-[#cca43b] font-medium">เชื่อมต่อ AI Gemini Engine (Online)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold text-slate-300">ความปลอดภัย 100%</span>
            </div>
          </div>

          {/* Messages Feed panel */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
            
            {chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-2.5 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {/* AI Profile Circle */}
                {msg.sender === "AI" && (
                  <div className="p-1.5 bg-[#00152e] text-[#cca43b] rounded-lg shrink-0 border border-[#cca43b]/20">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  msg.sender === "USER"
                    ? "bg-[#1b439c] text-white rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-200/60 font-medium"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] block text-right mt-1.5 opacity-60 font-mono font-bold">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Profile Circle */}
                {msg.sender === "USER" && (
                  <img
                    src={probationerProfile.avatarUrl}
                    alt={probationerProfile.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
                  />
                )}

              </div>
            ))}

            {/* Simulated Loading typing indicator */}
            {isLoading && (
              <div className="flex items-start space-x-2.5 justify-start">
                <div className="p-1.5 bg-[#00152e] text-[#cca43b] rounded-lg shrink-0">
                  <Sparkles className="w-4.5 h-4.5 animate-bounce" />
                </div>
                <div className="bg-white text-slate-400 rounded-2xl rounded-tl-none p-3.5 text-xs shadow-sm border border-slate-100 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[10px] ml-1.5">Smart AI กำลังพิมพ์ประมวลกฎหมาย...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations panel (Page 10 bottom) */}
          <div className="bg-white border-t border-slate-200 p-3 flex flex-wrap gap-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Text input area */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="พิมพ์ถามข้อสงสัยเกณฑ์คุมประพฤติ, หลักสูตรเรียน, หรือขอความช่วยเหลือ..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-[#cca43b]/40 focus:border-[#cca43b] text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-[#1b439c] hover:bg-[#cca43b] text-white hover:text-[#001D3D] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border border-blue-800 hover:border-[#cca43b] disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อความ</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right column: informational card */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">ความสามารถหลักของบอทอัจฉริยะ</h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              สแกนคำถามเชื่อมโยงฐานข้อมูลส่วนบุคคลของคุณสมชาย ใจดี และกฎหมายคุมประพฤติ พ.ศ. 2562 เพื่อตอบปัญหาสิทธิ์และระเบียบเกณฑ์วินัยได้ทันที:
            </p>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start space-x-2.5">
                <HelpCircle className="w-4 h-4 text-[#cca43b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-800">วิเคราะห์คำแนะนำคดีส่วนตัว:</span>
                  <span className="text-[11px] text-slate-400">บอกจำนวนรายงานตัวคงเหลือ, ชั่วโมงคงค้าง และแผนบำบัดรักษาพฤติกรรม</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <HelpCircle className="w-4 h-4 text-[#cca43b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-800">ค้นหาแนะนำกิจกรรมและอาชีพ:</span>
                  <span className="text-[11px] text-slate-400">แนะนำรายวิชาฝึกอาชีพ และแนะนำตำแหน่งงานของบริษัทพันธมิตรรอบบ้าน</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <HelpCircle className="w-4 h-4 text-[#cca43b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-800">ช่วยเขียนคำร้องออนไลน์เสนอต่อศาล:</span>
                  <span className="text-[11px] text-slate-400">ช่วยเหลือในการร่างใบขออนุญาตออกนอกพื้นที่ชั่วคราว หรือขอเลื่อนรายงานตัว</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl text-xs space-y-2 text-slate-700">
            <div className="flex items-center space-x-2 text-amber-800 font-bold">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>หมายเหตุความปลอดภัย:</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              แชทนี้ประมวลผลข้อมูลผ่าน Gemini AI เพื่อช่วยเหลือเบื้องต้นเท่านั้น ข้อมูลทั้งหมดถูกเก็บเป็นความลับสูงสุดของกองกฎหมาย หากมีความสงสัยที่เป็นทางการ กรุณาติดต่อสายตรงเจ้าพนักงานควบคุมคดี นายณัฐพงษ์ มั่นคง เบอร์โทร 02-123-4567 ต่อ 402 เพื่อยืนยันกฎสิทธิ์อย่างสมบูรณ์
            </p>
          </div>

        </div>

      </div>

      {/* Footer quotes decor */}
      <GovBanner />

    </div>
  );
};
