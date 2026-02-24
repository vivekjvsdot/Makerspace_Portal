
import { GoogleGenAI, Type } from "@google/genai";
import { ComponentItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFeasibilityAdvice = async (components: ComponentItem[]) => {
  const prompt = `Act as an expert makerspace technician. I have a project with the following components:
  ${components.map((c, i) => `
    Component ${i + 1}: ${c.name}
    Description: ${c.description}
    Machine: ${c.machine}
    Material: ${c.material}
    Quantity: ${c.quantity}
  `).join('\n')}

  Please provide a brief, professional summary (max 3 sentences) for EACH component regarding its feasibility for the selected machine and material. Also suggest if another machine or material might be better for the job. Return the result in a friendly tone.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate advice at this time. Please proceed with your submission.";
  }
};
