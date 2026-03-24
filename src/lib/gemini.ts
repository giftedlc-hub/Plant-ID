import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function identifyPlant(base64Image: string): Promise<string> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Identify this plant. Provide its common name, scientific name, a brief description, and 3 key care tips (Watering, Sunlight, Soil). Format the response in Markdown.",
          },
        ],
      },
    ],
  });
  return response.text || "Could not identify the plant.";
}

export async function diagnoseDisease(base64Image: string): Promise<string> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Analyze this plant for diseases or pests. If any are found, provide the name of the disease/pest, symptoms visible, and recommended treatment or prevention steps. If the plant looks healthy, say so. Format the response in Markdown.",
          },
        ],
      },
    ],
  });
  return response.text || "Could not diagnose the plant.";
}

export function createChat() {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a professional botanist and plant care assistant. Provide helpful, accurate, and concise advice on plant care, identification, and disease management. If asked about something unrelated to plants, politely redirect the conversation back to plant care.",
    },
  });
}
