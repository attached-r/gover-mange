import { GoogleGenAI } from "@google/genai";

// In a real app, this would be process.env.API_KEY. 
// For this demo, we assume the environment is set up correctly.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeGovData = async (text: string): Promise<{ summary: string; tags: string[]; sensitivity: string }> => {
  if (!ai) {
    // Fallback if no API key is present
    return {
      summary: "AI服务未连接，无法生成摘要。",
      tags: ["未分类"],
      sensitivity: "未知"
    };
  }

  try {
    const prompt = `
      请作为一名专业的政务数据分析师，分析以下文本。
      任务：
      1. 生成50字以内的摘要。
      2. 提取3-5个关键标签。
      3. 判断是否包含敏感个人信息（身份证、手机号等），返回"高"、"中"、"低"。
      
      返回JSON格式: { "summary": "...", "tags": ["tag1", "tag2"], "sensitivity": "..." }
      
      文本内容:
      ${text.substring(0, 1000)}... (truncated)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      summary: result.summary || '无法生成摘要',
      tags: result.tags || [],
      sensitivity: result.sensitivity || '低'
    };
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return {
      summary: "分析失败，请重试。",
      tags: [],
      sensitivity: "未知"
    };
  }
};