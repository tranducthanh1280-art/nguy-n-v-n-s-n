
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIHelp = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "Bạn là trợ lý ảo hỗ trợ khách thăm tại một tòa nhà công sở. Trả lời ngắn gọn, lịch sự về quy trình đăng ký: 1. Đăng ký thông tin. 2. Chờ cán bộ duyệt. 3. Tra cứu bằng số điện thoại. 4. Xuất trình CMND khi đến."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.";
  }
};

export const analyzeVisitPurpose = async (purpose: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích mức độ tin cậy của lý do thăm sau: "${purpose}". Trả lời dạng JSON: { "reliability": "High/Medium/Low", "summary": "tóm tắt ngắn" }`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { reliability: "Unknown", summary: "Không thể phân tích lý do." };
  }
};
