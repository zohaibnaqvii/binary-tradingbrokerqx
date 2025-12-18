
import { GoogleGenAI } from "@google/genai";
import { CandlestickData, AISignal } from "../types";

export const getTradingSignal = async (assetName: string, recentCandles: CandlestickData[]): Promise<AISignal> => {
  try {
    // Initializing with direct process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const candleSummary = recentCandles.map(c => 
      `O: ${c.open}, H: ${c.high}, L: ${c.low}, C: ${c.close}`
    ).join('\n');

    const prompt = `
      You are a high-frequency trading analyst for binary options.
      Analyze the following 1-minute candle data for ${assetName} and provide a trading signal for a 1-minute expiration.
      
      Last Candles (most recent last):
      ${candleSummary}

      Return only a JSON object with this exact structure:
      {
        "direction": "BULLISH" | "BEARISH" | "NEUTRAL",
        "confidence": number (0-100),
        "reason": "short technical reason"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    // Accessing .text property directly and trimming as per guidelines
    const jsonStr = response.text?.trim() || '{}';
    const result = JSON.parse(jsonStr);
    return {
      direction: result.direction || 'NEUTRAL',
      confidence: result.confidence || 0,
      reason: result.reason || 'Insufficient data'
    };
  } catch (error) {
    console.error("Gemini Signal Error:", error);
    return {
      direction: 'NEUTRAL',
      confidence: 0,
      reason: 'AI Analysis currently unavailable'
    };
  }
};
