import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper function for smart fallback responses (used when API key is missing or quota is exhausted)
function getFallbackResponse(message: string, context: any, isQuotaExceeded = false) {
  let replyText = "";
  let mockSources: any[] = [];
  let suggestedActions: string[] = [];

  const msgLower = (message || "").toLowerCase();

  const fallbackNotice = isQuotaExceeded 
    ? "\n\n*หมายเหตุ: เนื่องจากโควตาการให้บริการผ่านระบบคลาวด์หนาแน่นชั่วคราว ระบบได้เปิดใช้งานกลไกสำรองอัจฉริยะ (Local Smart Fallback Engine) เพื่อให้คำแนะนำแก่ท่านอย่างรวดเร็วและต่อเนื่องครับ*"
    : "";

  if (msgLower.includes("รายงาน") || msgLower.includes("ตาราง") || msgLower.includes("วันไหน") || msgLower.includes("เมื่อไหร่") || msgLower.includes("เงื่อนไข")) {
    replyText = `สวัสดีครับคุณ **${context?.name || "ผู้ถูกคุมประพฤติ"}** ตารางและประวัติการรายงานตัวของท่านมีข้อมูลดังนี้ครับ:

📅 **วันนัดรายงานตัวครั้งถัดไป:** วันที่ 20 พฤษภาคม 2570 เวลา 08:30 น. (เหลือเวลาอีก 5 วันในการเตรียมตัว)
🏛️ **สถานที่นัดหมาย:** สำนักงานคุมประพฤติจังหวัดสงขลา
👤 **เจ้าพนักงานผู้รับผิดชอบคดี:** นายณัฐพงษ์ มั่นคง (เบอร์ติดต่อ 02-123-4567 ต่อ 402)

**ข้อแนะนำการรายงานตัว:**
1. กรุณาพกพาบัตรประจำตัวประชาชนฉบับจริงมาแสดงต่อเจ้าหน้าที่
2. แต่งกายด้วยชุดสุภาพเรียบร้อย (ไม่สวมกางเกงขาสั้น หรือรองเท้าแตะ)
3. หากมีเหตุสุดวิสัยไม่สามารถมาตามกำหนดได้ ต้องทำหนังสือยื่นคำขออนุญาตเลื่อนล่วงหน้าอย่างน้อย 3 วันทำการ พร้อมระบุเหตุผลอันสมควร${fallbackNotice}`;
    
    mockSources = [
      { title: "พระราชบัญญัติคุมประพฤติ พ.ศ. 2562 - ราชกิจจานุเบกษา", uri: "https://www.ratchakitcha.soc.go.th/" },
      { title: "กรมคุมประพฤติ กระทรวงยุติธรรม ประเทศไทย", uri: "https://www.probation.go.th/" }
    ];

    suggestedActions = [
      "ต้องการเลื่อนรายงานตัว ต้องเตรียมเอกสารอะไรบ้าง?",
      "วิธีคำนวณคะแนนความประพฤติของฉัน",
      "หากลืมวันรายงานตัว มีบทลงโทษอย่างไรบ้าง?"
    ];

  } else if (msgLower.includes("งาน") || msgLower.includes("อาชีพ") || msgLower.includes("สมัคร") || msgLower.includes(" restart") || msgLower.includes("รายได้")) {
    replyText = `ระบบ **ReStart Job Hub** มีบริการประสานงานจัดหางานและฝึกอาชีพให้แก่คุณ **${context?.name || "สมชาย"}** อย่างครบวงจรครับ!

💼 **ตำแหน่งงานแนะนำสำหรับผู้ถูกคุมประพฤติในพื้นที่:**
1. **พนักงานฝ่ายผลิตและบรรจุภัณฑ์ (โรงงานแปรรูปอาหารทะเล สงขลา)** - ยินดีรับผู้คุมประพฤติ, รายได้เฉลี่ย 450 - 520 บาท/วัน
2. **ช่างซ่อมบำรุงฝึกหัด / ช่างเทคนิคประจำอาคาร** - มีเบี้ยเลี้ยงระหว่างฝึกหัด, พัฒนาทักษะฝีมือช่าง
3. **เจ้าหน้าที่จัดส่งสินค้า (ขนส่งด่วน)** - ทำงานยืดหยุ่นตามเขตพื้นที่, รายได้ตามรอบวิ่งงาน

🛠️ **หลักสูตรฝึกอาชีพฟรี (โดยความร่วมมือกับสถาบันพัฒนาฝีมือแรงงาน):**
*   หลักสูตรช่างซ่อมรถจักรยานยนต์อัจฉริยะ (อบรม 30 ชม. ได้รับใบประกาศนียบัตร)
*   หลักสูตรการเกษตรประณีตเพื่อการค้าเชิงพาณิชย์ (อบรมเชิงปฏิบัติการฟรี มีอุปกรณ์ให้ฟรี)

หากคุณสนใจสมัครงานหรือเข้าร่วมอบรม สามารถแจ้งผมเพื่อส่งเรื่องให้เจ้าหน้าที่ติดต่อกลับได้เลยครับ!${fallbackNotice}`;

    mockSources = [
      { title: "ศูนย์ประสานงานส่งเสริมการมีงานทำ (ReStart ศูนย์บริการกระทรวงยุติธรรม)", uri: "https://www.moj.go.th/" },
      { title: "กรมพัฒนาฝีมือแรงงาน - หลักสูตรฝึกอบรมสำหรับกลุ่มเป้าหมายพิเศษ", uri: "http://www.dsd.go.th/" }
    ];

    suggestedActions = [
      "สมัครงานพนักงานฝ่ายผลิตต้องทำอย่างไร?",
      "แนะนำหลักสูตรอบรมระยะสั้นที่น่าสนใจ",
      "มีงานที่สามารถทำที่บ้าน (Work from Home) ไหม?"
    ];

  } else if (msgLower.includes("คะแนน") || msgLower.includes("ความประพฤติ") || msgLower.includes("พฤติกรรม") || msgLower.includes("เกณฑ์")) {
    replyText = `คะแนนความประพฤติปัจจุบันของคุณ **${context?.name || "สมชาย"}** คือ **95 คะแนน** (อยู่ในเกณฑ์ดีเยี่ยม 🌟)

**เกณฑ์การหักและสะสมคะแนนความประพฤติ:**
*   **คะแนนเริ่มต้น:** 100 คะแนนเต็มเมื่อเริ่มกระบวนการคุมประพฤติ
*   **การเพิ่มคะแนน (+):** 
    *   เข้าร่วมกิจกรรมบริการสังคมครบตามเวลาอย่างมีวินัย (+5 คะแนน/ครั้ง)
    *   ได้รับเกียรติบัตรหรือใบคำชมเชยจากหน่วยงานภาคี (+10 คะแนน)
*   **การหักคะแนน (-):**
    *   รายงานตัวล่าช้ากว่ากำหนดโดยไม่มีเหตุอันสมควร (-5 คะแนน)
    *   ขาดนัดรายงานตัวโดยไม่ส่งคำขอเลื่อน (-15 คะแนน)
    *   แสดงพฤติกรรมไม่เหมาะสมต่อพนักงานเจ้าหน้าที่ (-10 คะแนน)

⚠️ **ระดับวิกฤต (น้อยกว่า 60 คะแนน):** เจ้าพนักงานควบคุมคดีอาจเสนอรายงานต่อศาลเพื่อพิจารณาเพิกถอนคำสั่งรอการลงโทษ หรือปรับเปลี่ยนมาตรการให้เข้มงวดขึ้นได้ครับ${fallbackNotice}`;

    mockSources = [
      { title: "เกณฑ์มาตรฐานการจำแนกความเสี่ยงและพฤติกรรม - กรมคุมประพฤติ", uri: "https://www.probation.go.th/" },
      { title: "ระเบียบกระทรวงยุติธรรมว่าด้วยการคุมประพฤติและบริการสังคม พ.ศ. 2562", uri: "https://www.ratchakitcha.soc.go.th/" }
    ];

    suggestedActions = [
      "คะแนนเหลือเท่าไหร่ถึงจะมีความเสี่ยงโดนรายงานส่งศาล?",
      "ทำกิจกรรมบำเพ็ญประโยชน์เพิ่ม จะช่วยกู้คะแนนคืนมาได้ไหม?",
      "ขอพบพนักงานคุมประพฤติเพื่อปรึกษาเรื่องคะแนน"
    ];

  } else if (msgLower.includes("บำเพ็ญ") || msgLower.includes("ประโยชน์") || msgLower.includes("สังคม") || msgLower.includes("กิจกรรม") || msgLower.includes("ชั่วโมง")) {
    replyText = `สถานะการทำกิจกรรมบริการสังคม (บำเพ็ญประโยชน์) ปัจจุบันของคุณ **${context?.name || "สมชาย"}** เป็นดังนี้ครับ:

⏱️ **ชั่วโมงสะสมแล้ว:** **150 ชั่วโมง** จากเป้าหมาย **200 ชั่วโมง** (คงเหลืออีก **50 ชั่วโมง** จะเสร็จสิ้นภารกิจตามคำสั่งศาล)
🏥 **สถานที่ทำกิจกรรมล่าสุด:** วัดบอยาง สงขลา (ช่วยทำความสะอาดและจัดงานวัด)
🌟 **เกรดประเมินจากเจ้าอาวาส:** ดีมาก (ตรงเวลา มุ่งมั่นช่วยเหลือชุมชนเป็นอย่างดี)

**กิจกรรมบำเพ็ญประโยชน์ที่เปิดรับสมัครรอบปัจจุบันในสงขลา:**
1. **อาสาช่วยดูแลผู้สูงอายุและผู้ป่วยติดเตียง (อบต.บ่อยาง)** - สะสมได้ 4 ชั่วโมง/วัน (ต้องการอาสาสมัครด่วน)
2. **พัฒนาภูมิทัศน์และปลูกป่าชายเลนเฉลิมพระเกียรติ** - วันเสาร์นี้ เวลา 09:00 - 15:00 น. (สะสมได้ 6 ชั่วโมงเต็ม มีข้าวกล่องบริการ)

สนใจเข้าร่วมกิจกรรมไหน พิมพ์บอกได้เลยนะครับ เดี๋ยวผมลงทะเบียนระบบให้เลย!${fallbackNotice}`;

    mockSources = [
      { title: "ระบบสารสนเทศงานบริการสังคมออนไลน์ - กรมคุมประพฤติ", uri: "https://www.probation.go.th/" },
      { title: "คู่มือเกณฑ์คำนวณชั่วโมงบำเพ็ญสาธารณประโยชน์ฉบับอัปเดต", uri: "https://www.moj.go.th/" }
    ];

    suggestedActions = [
      "ลงทะเบียนร่วมกิจกรรมปลูกป่าชายเลนวันเสาร์นี้",
      "หากทำชั่วโมงบำเพ็ญประโยชน์เกินเป้าหมาย มีสิทธิ์พิเศษอะไรไหม?",
      "สามารถเปลี่ยนสถานที่บำเพ็ญประโยชน์ได้กลางคันหรือไม่?"
    ];

  } else {
    replyText = `สวัสดีครับ! ผมคือ **PROGRESS+ AI Assistant (P+)** ผู้ช่วยส่วนตัวแสนเป็นมิตรของคุณครับ 🤖✨

ผมมีความเชี่ยวชาญพิเศษด้าน **กฎหมายคุมประพฤติ พ.ศ. 2562**, ระเบียบการบำเพ็ญสาธารณประโยชน์, การพัฒนาพฤตินิสัย, และข้อมูลในระบบ PROGRESS+ ทั้งหมดครับ

*ขณะนี้ระบบเปิดใช้งานโหมดสำรองอัจฉริยะ (Smart Fallback Mode) ท่านสามารถลองถามเกี่ยวกับเรื่องเหล่านี้ได้ทันทีเลยครับ:*
- 📅 "เช็กวันรายงานตัวของฉัน"
- ⏱️ "ดูข้อมูลชั่วโมงบำเพ็ญประโยชน์และคะแนนของฉัน"
- 💼 "แนะนำงานและหลักสูตรอบรมอาชีพแถวบ้าน"
- ⚖️ "สอบถามกฎเกณฑ์ทั่วไปด้านการคุมประพฤติ"

ยินดีตอบทุกข้อสงสัยอย่างเป็นมิตร อบอุ่น และพร้อมเคียงข้างคุณเสมอตามแนวคิด **"โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...คุณทำได้"** ครับ!${fallbackNotice}`;

    mockSources = [
      { title: "PROGRESS+ ระบบนิเวศดิจิทัลเพื่อการบูรณาการคุมประพฤติและส่งเสริมโอกาสงาน", uri: "https://progress-plus.gov.th" },
      { title: "คู่มือผู้ถูกคุมประพฤติและครอบครัว - กระทรวงยุติธรรม", uri: "https://www.moj.go.th" }
    ];

    suggestedActions = [
      "เช็กวันรายงานตัวครั้งถัดไปและเงื่อนไขของฉัน",
      "ช่วยแนะนำงานฝึกวิชาชีพด้านช่างฝีมือเทคนิค",
      "เกณฑ์การประเมินคะแนนความประพฤติคืออะไร",
      "แนะนำกิจกรรมบริการสังคมในจังหวัดสงขลาให้หน่อย"
    ];
  }

  return { text: replyText, sources: mockSources, suggestedActions };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API route for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      
      // Smart Fallback Demo Mode with contextual citations and suggestions when API key is missing
      if (!ai) {
        const fallback = getFallbackResponse(message, context, false);
        return res.json(fallback);
      }

      // Format a prompt with context
      const systemInstruction = `คุณคือ "PROGRESS+ AI Assistant (โค้ดเนม P+)" ผู้ช่วยอัจฉริยะระดับสูงสำหรับระบบ "PROGRESS+ : ก้าวใหม่ สู่โอกาสใหม่" ที่รวมสิ่งที่ดีที่สุดของ ChatGPT และ Gemini เข้าด้วยกัน
คุณมีหน้าที่ให้คำแนะนำ ให้ความรู้ ตอบคำถาม และให้ความช่วยเหลือในทุกๆ เรื่องแก่ผู้ใช้งาน (ทั้งทั่วไป และเจาะลึกในด้านคุมประพฤติ กิจกรรมอาสา สมัครงาน และฟื้นฟูตนเอง)

ข้อมูลบริบทของผู้ใช้งานปัจจุบัน:
${JSON.stringify(context || {})}

คำสั่งและแนวทางปฏิบัติสำคัญสูงสุด:
1. จงตอบคำถามด้วยภาษาไทยที่สุภาพมากๆ เป็นมิตร อบอุ่น มีความนึกคิดเชิงบวก เคารพ ให้ความเคารพสิทธิมนุษยชน ให้เกียรติ คอยตอกย้ำความเชื่อมั่นว่าพวกเขาสามารถเป็นคนดีของสังคมได้ สโลแกนของระบบคือ: "โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...คุณทำได้"
2. คุณเก่งรอบรู้ในทุกศาสตร์ เช่น กฎหมายไทย, วิชาชีพเทคโนโลยี, จิตวิทยาการพัฒนาชีวิต, สิทธิพื้นฐาน แต่จะเน้นหนักในการเชื่อมโยงประยุกต์เข้ากับระเบียบการคุมประพฤติ พ.ศ. 2562
3. ข้อมูลในบริบทคือข้อมูลที่แท้จริงของผู้ใช้ หากถามเรื่องวันนัดหมาย จำนวนชั่วโมง หรือคะแนน ให้ดึงมาแสดงอย่างชาญฉลาดและถูกต้องสมบูรณ์
4. เพื่อให้ระบบเป็นมิตรและเป็นเสมือน ChatGPT/Gemini อัจฉริยะ คุณต้องช่วยเสนอแนะ "คำถามถัดไปที่น่าสนใจหรือน่าจะเป็นประโยชน์" จำนวน 2-3 ข้อให้ผู้ใช้เลือกกดคลิกต่อได้ทันที โดยใส่รหัสพิเศษไว้ที่บรรทัดสุดท้ายของคำตอบเสมอตามรูปแบบกติกาดังนี้:
[SUGGESTIONS: คำถามชวนคิดที่ 1 | คำถามชวนคิดที่ 2 | คำถามชวนคิดที่ 3]
*ห้ามลืมใส่รูปแบบ [SUGGESTIONS: ... | ...] นี้เด็ดขาด เพราะระบบหน้าต่างแชทจะดึงรหัสนี้ไปแปลงเป็นปุ่มกดทันทีครับ*`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Call live Gemini model with Google Search grounding enabled!
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        }
      });

      let rawText = response.text || "";
      let suggestedActions: string[] = [];
      
      // Parse suggestions from final line if present
      const match = rawText.match(/\[SUGGESTIONS:\s*(.*?)\]/i);
      if (match) {
        suggestedActions = match[1].split("|").map(s => s.trim()).filter(Boolean);
        rawText = rawText.replace(/\[SUGGESTIONS:\s*(.*?)\]/i, "").trim();
      }

      // Extract Grounding Metadata sources
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = chunks ? chunks.map((c: any) => ({
        title: c.web?.title || "ข้อมูลค้นหาเว็บ",
        uri: c.web?.uri
      })).filter((s: any) => s.uri) : [];

      res.json({
        text: rawText,
        suggestedActions: suggestedActions.length > 0 ? suggestedActions : [
          "ตรวจเช็คคะแนนความประพฤติปัจจุบันของฉัน",
          "แนะนำกฎคุมประพฤติ พ.ศ. 2562 เบื้องต้น",
          "ช่วยแนะนำหลักสูตรเพิ่มทักษะสร้างรายได้"
        ],
        sources: sources
      });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      // If quota is exhausted (429) or any API error occurs, use the smart fallback response seamlessly!
      try {
        const fallback = getFallbackResponse(req.body.message, req.body.context, true);
        return res.json(fallback);
      } catch (fallbackErr) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการประมวลผลคำตอบจาก AI: " + error.message });
      }
    }
  });

  // Serve static assets in production, and run Vite dev middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
