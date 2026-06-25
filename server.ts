import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
      if (!ai) {
        return res.json({
          text: `สวัสดีค่ะคุณสมชาย ยินดีต้อนรับสู่บริการแชทบอทอัจฉริยะ (Smart Probation AI Assistant) นะคะ 

⚠️ (ขณะนี้ระบบกำลังรันในโหมดสาธิต เนื่องจากยังไม่ได้กำหนดคีย์ GEMINI_API_KEY ในแผงควบคุม Secrets)

แต่หนูสามารถช่วยแนะนำข้อมูลจำลองของคุณได้ค่ะ:
- 📅 **วันรายงานตัวถัดไป:** วันที่ 20 พฤษภาคม 2567 เวลา 08:30 น. (เหลือเวลาอีก 5 วัน)
- ⏱️ **ชั่วโมงบำเพ็ญประโยชน์:** สะสมแล้ว 150 ชั่วโมง (เป้าหมาย 200 ชั่วโมง ขาดอีก 50 ชั่วโมง)
- 🌟 **คะแนนความประพฤติ:** 95 คะแนน (ระดับดีมาก)

ต้องการให้หนูช่วยแนะนำกิจกรรมบำเพ็ญประโยชน์ หรือสมัครงานในระบบ ReStart Job Hub ด้านไหนดีคะ?`
        });
      }

      // Format a prompt with context
      const systemInstruction = `คุณคือ "Smart Probation AI Assistant" ผู้ช่วยอัจฉริยะสำหรับระบบคุมประพฤติอัจฉริยะ (Smart Probation Ecosystem) ประเทศไทย
คุณมีหน้าที่ตอบคำถาม ให้คำแนะนำ และช่วยเหลือผู้ใช้งาน (ผู้ถูกคุมประพฤติ เจ้าหน้าที่ และหน่วยงานภาคี)
ข้อมูลบริบทของผู้ใช้งานปัจจุบัน: ${JSON.stringify(context || {})}
จงตอบคำถามผู้ใช้ด้วยภาษาไทยที่สุภาพ เป็นมิตร อบอุ่น มีวุฒิภาวะ ให้เกียรติ และให้คำแนะนำในเชิงสนับสนุนเพื่อการฟื้นฟูพัฒนาคุณภาพชีวิตและการกลับคืนสู่สังคมอย่างยั่งยืน
สโลแกนของระบบคือ: "โอกาสคือการเริ่มต้นใหม่ เราเชื่อว่า...คุณทำได้"

หากถามเกี่ยวกับข้อมูลส่วนตัว วันรายงานตัว หรือชั่วโมงสะสม ให้ใช้ข้อมูลจากบริบทข้างต้นในการตอบคำถามอย่างถูกต้องสมจริง หากไม่มีข้อมูลในบริบทค่อยตอบอย่างสุภาพตามหลักการทั่วไป`;

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

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการประมวลผลคำตอบจาก AI: " + error.message });
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
