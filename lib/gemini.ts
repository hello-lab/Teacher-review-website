import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyAzC1WD0Zk7nKps-WJy-GQEnR-0SOMzqdY";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Compose prompt from chat history


export async function gemini(review: string) {
  try {
  
    if (!review) {
      return { error: "Missing or invalid id" }
    }
    if (!GEMINI_API_KEY) {
      return { error: "Missing GEMINI_API_KEY" }
    }

    // Compose instructions and chat history for Gemini context
    const instructions = `look for any profanity or suggestive or sexual content and say if its inappropriate. Do allow constructive criticism. If there is inappropriate content return true else false`;
    const prompt = instructions ;

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Configuration for structured response
    const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ["verdict"],
      properties: {
        verdict: {
          type: Type.BOOLEAN,
        },
      },
    },
    systemInstruction: [
        {
          text: instructions
        
        }
    ],
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: review,
        },
      ],
    },
  ];

    // Call Gemini using the SDK (non-streaming)
    const result = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // Parse the structured JSON result
    const responseText = "";
    const detected: string[] = [];
    return JSON.parse(result.text).verdict

    
  } catch (err: any) {
    return { error: err.message ?? "Unknown error" }
      
  }
}

