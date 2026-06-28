// ==========================================
// 🇹🇭 ไฟล์: /src/views/probationer/AIAssistantChat.tsx
// คำอธิบาย: ห้องแชตถามตอบอัจฉริยะ (AI Assistant Chat) เชื่อมต่อโมเดล AI สำหรับให้ผู้ถูกคุมประพฤติสอบถามข้อมูล
// โครงสร้างไฟล์:
//   - ส่วนนำเข้าข้อมูลและไอคอน (Imports) พร้อมโปรไฟล์โมเดลการ์ด P+
//   - คำถามแนะนำด่วน (Quick Suggested Prompts)
//   - การแสดงประวัติการแชต, คัดลอก, แหล่งอ้างอิง และอ่านออกเสียงแบบ Real-time
//   - กล่องข้อความอินพุตและการประมวลผลคำสั่งส่งข้อความ (Chat Input & Processing Logic)
// ==========================================

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { GovBanner } from "../../components/GovBanner";
import progressBotAvatar from "../../assets/images/progress_bot_avatar_1782684805448.jpeg";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  User, 
  Compass, 
  HelpCircle, 
  AlertCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Globe,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export const AIAssistantChat: React.FC = () => {
  const { chatHistory, sendChatMessage, probationerProfile, clearChatHistory } = useApp();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Voice synthesis & copy state management
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Suggested quick prompts
  const quickPrompts = [
    "เช็กวันรายงานตัวครั้งถัดไปและเงื่อนไขของฉัน",
    "ช่วยแนะนำงานฝึกวิชาชีพด้านช่างฝีมือเทคนิค",
    "เกณฑ์การประเมินคะแนนความประพฤติคืออะไร",
    "แนะนำกิจกรรมบริการสังคมในจังหวัดสงขลาให้หน่อย"
  ];

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Voice synthesis implementation
  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    // Cancel currently speaking voices first
    window.speechSynthesis.cancel();

    // Clean markdown notation for better voice output
    const cleanText = text
      .replace(/[*_#`\-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "th-TH";
    utterance.rate = 1.05; // Slightly faster for natural feel

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when navigating away
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Clipboard copy implementation
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

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
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#cca43b] animate-pulse" />
            <span>ถามตอบอัจฉริยะ PROGRESS+ (AI Assistant)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ปรึกษาสิทธิ์ รายงานตัว และการพัฒนาวินัยผ่านโมเดล Gemini อัจฉริยะ พร้อมระบบ Google Search ค้นหาข้อมูลกฎหมายแบบเรียลไทม์
          </p>
        </div>
        
        {chatHistory.length > 1 && (
          <button
            onClick={() => {
              if (window.confirm("คุณต้องการล้างประวัติการสนทนาทั้งหมดหรือไม่?")) {
                clearChatHistory?.();
              }
            }}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-all self-start md:self-center"
          >
            ล้างประวัติการสนทนา
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Premium Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[580px] overflow-hidden">
          
          {/* Header Panel */}
          <div className="bg-[#001D3D] text-white p-4 flex items-center justify-between shrink-0 border-b border-white/5 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img 
                  src={progressBotAvatar} 
                  alt="P+ Bot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-white">PROGRESS+ AI Assistant (P+)</h4>
                  <span className="bg-[#cca43b]/20 text-[#cca43b] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-[#cca43b]/25">
                    Premium Active
                  </span>
                </div>
                <p className="text-[10px] text-[#cca43b] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>โมเดล Gemini-3.5-Flash + Search Grounding</span>
                </p>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <span className="text-[9px] bg-white/10 text-slate-300 px-2.5 py-1 rounded-full font-bold tracking-wider">
                ความปลอดภัยระดับรัฐบาลดิจิทัล
              </span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-50/70 to-white">
            
            {chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar */}
                {msg.role === "model" && (
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 mt-0.5">
                    <img 
                      src={progressBotAvatar} 
                      alt="P+" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col max-w-[82%] space-y-1.5">
                  <div className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-tr from-[#1b439c] to-[#255bc2] text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200/70"
                  }`}>
                    
                    {/* Message Body */}
                    <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                    
                    {/* Render Citations / Sources if present */}
                    {msg.role === "model" && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                        <div className="flex items-center space-x-1 text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
                          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>สืบค้นออนไลน์สำเร็จ (Google Search Grounding):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-100/50 text-blue-700 hover:text-blue-800 rounded-xl text-[10px] font-bold transition-all truncate max-w-full"
                            >
                              <span className="truncate max-w-[180px]">{src.title}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Message Sub-Actions (TTS & Copy) */}
                    {msg.role === "model" && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100/70 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-bold font-mono">
                          {msg.timestamp instanceof Date 
                            ? msg.timestamp.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) 
                            : new Date(msg.timestamp).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[9px] font-bold"
                            title="คัดลอกข้อความ"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">คัดลอกแล้ว</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>คัดลอก</span>
                              </>
                            )}
                          </button>

                          <div className="w-px h-3 bg-slate-200" />

                          {/* Read Aloud Button */}
                          <button
                            onClick={() => handleSpeak(msg.text, msg.id)}
                            className={`p-1 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1 text-[9px] font-bold ${
                              speakingId === msg.id ? "text-amber-600 bg-amber-50" : "text-slate-400 hover:text-slate-600"
                            }`}
                            title="อ่านออกเสียงภาษาไทย"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                                <span>หยุดอ่าน</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>ฟังเสียงอ่าน</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* User timestamp */}
                    {msg.role === "user" && (
                      <span className="text-[9px] block text-right mt-1.5 opacity-70 font-mono font-bold">
                        {msg.timestamp instanceof Date 
                          ? msg.timestamp.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) 
                          : new Date(msg.timestamp).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}

                  </div>

                  {/* Contextual Suggested Next Questions (Page 10, rendered inside bubble tree) */}
                  {msg.role === "model" && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2 pl-2 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#cca43b]" />
                        <span>ถามต่อเนื่องอย่างรวดเร็ว:</span>
                      </span>
                      <div className="flex flex-col gap-1.5 max-w-full">
                        {msg.suggestedActions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={() => handleSend(act)}
                            className="text-left bg-blue-50/50 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 text-blue-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="truncate pr-2">{act}</span>
                            <ChevronRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <img
                    src={probationerProfile.avatarUrl}
                    alt={probationerProfile.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-100 shrink-0 mt-0.5"
                  />
                )}

              </div>
            ))}

            {/* Smart Typing Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img 
                    src={progressBotAvatar} 
                    alt="P+" 
                    className="w-full h-full object-cover animate-pulse"
                  />
                </div>
                <div className="bg-white text-slate-500 rounded-2xl rounded-tl-none p-4 text-xs shadow-sm border border-slate-200/80 flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1b439c] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1b439c] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1b439c] animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[10px] font-bold ml-1.5 text-slate-500">P+ Smart AI กำลังคิดวิเคราะห์ข้อมูลและใช้ Google Search...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Core Suggestions Banner (Quick suggestions panel at bottom) */}
          <div className="bg-slate-50 border-t border-slate-200/60 p-3 flex flex-wrap gap-2 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-900 border border-slate-200 text-[10px] font-black px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Compass className="w-3 h-3 text-[#cca43b]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="bg-white border-t border-slate-200 p-3 shrink-0">
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
                placeholder="พิมพ์ถามข้อสงสัยเกณฑ์คุมประพฤติ, หลักสูตรเรียน, ขอเลื่อนนัด หรือคุยได้ทุกเรื่อง..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-2xl text-xs bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-[#cca43b]/40 focus:border-[#cca43b] text-slate-800 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-[#001D3D] to-[#1b439c] hover:from-[#1b439c] hover:to-[#cca43b] text-white hover:text-white py-3 px-5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border border-transparent disabled:bg-slate-200 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-blue-900/10"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อความ</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Information panel & User Profile context */}
        <div className="space-y-6">
          
          {/* AI Helper details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                <img src={progressBotAvatar} alt="P+" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-black text-slate-800">ขอบเขตเทคโนโลยีของ P+ AI</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              นี่คือระบบผู้ช่วยอัจฉริยะที่ผสมผสานความแม่นยำด้านข้อมูลส่วนบุคคลของคุณเข้ากับระบบค้นหาระดับสากล:
            </p>

            <div className="space-y-4 text-xs text-slate-600 font-medium">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-50 text-[#1b439c] rounded-xl shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-[12px]">วิเคราะห์คดีและตารางเวลาส่วนตัว:</span>
                  <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                    ตรวจเช็ควันรายงานตัวคงเหลือ, ค้นหายอดชั่วโมงบำเพ็ญสาธารณประโยชน์ และระดับคะแนนวินัยพฤติกรรมสะสม
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-amber-50 text-[#cca43b] rounded-xl shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-[12px]">ระบบ Google Search Grounding:</span>
                  <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                    สามารถดึงหลักข้อมูลระเบียบกฎหมายกระทรวงยุติธรรม พระราชบัญญัติคุมประพฤติ พ.ศ. 2562 และข่าวสารสังคมแบบเรียลไทม์
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-purple-50 text-purple-700 rounded-xl shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-[12px]">เสียงอ่านระบบอัจฉริยะ (TTS):</span>
                  <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                    มีโหมดสังเคราะห์เสียงอ่านภาษาไทยที่เป็นมิตร เหมาะสำหรับผู้ถูกคุมประพฤติที่ต้องการฟังเสียงอธิบายเพื่อความสะดวก
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Safety Warning Card */}
          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-3xl text-xs space-y-2.5 text-slate-700">
            <div className="flex items-center space-x-2 text-amber-800 font-extrabold">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>ความปลอดภัยและความเที่ยงตรง</span>
            </div>
            <p className="leading-relaxed text-[11px] font-medium text-slate-600">
              ข้อมูลที่ป้อนลงในแชทบอท PROGRESS+ AI Assistant (P+) จะถูกประมวลผลอย่างเข้มงวดภายใต้กรอบพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) ข้อมูลเหล่านี้ใช้เพื่อการพัฒนาพฤตินิสัยและการส่งต่อโอกาสอาชีพเท่านั้น
            </p>
            <p className="leading-relaxed text-[11px] font-bold text-amber-900 border-t border-amber-200/50 pt-2">
              📞 หากต้องการตรวจสอบตารางอย่างเป็นทางการกับพนักงานโดยตรง กรุณาติดต่อ นายณัฐพงษ์ มั่นคง โทร 02-123-4567 ต่อ 402
            </p>
          </div>

        </div>

      </div>

      {/* Government Footer Decor */}
      <GovBanner />

    </div>
  );
};
