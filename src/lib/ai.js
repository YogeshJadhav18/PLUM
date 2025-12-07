import { GoogleGenAI } from "@google/genai";
import { summarizePrompt, rewritePrompt } from '../utils/prompts';

// Vite uses import.meta.env for environment variables
// The API key should be set as VITE_GEMINI_API_KEY in .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function callAI(prompt, system = 'You are a concise summarizer.') {
  if (!ai) {
    throw new Error('AI service is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: system,
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    return response.text;
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to generate AI response. Please check your API key and try again.');
  }
}

// callAI();

export async function summarizeArticle(article) {
  const prompt = summarizePrompt(article);
  const aiOutput = await callAI(prompt, 'You are an expert health-news editor. Be concise.');
  // The AI returns structured text — we'll return raw and let consumer parse or store raw.
  return aiOutput;
}

/** Rewrite the original article into a simpler, friendly tone */
export async function rewriteArticleSimpler(article) {
  const prompt = rewritePrompt(article);
  const aiOutput = await callAI(prompt, 'You are a friendly journalist who explains complex health topics simply.');
  return aiOutput;
}