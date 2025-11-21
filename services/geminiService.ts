import { GoogleGenAI, Type } from "@google/genai";
import { Book, GeminiAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAcquisitionList = async (books: Book[]): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key is missing. Please check your .env.local settings.");
  }

  // Prepare a summarized list of books for the prompt to save tokens
  const bookData = books.map(b => ({
    title: b.title,
    author: b.author,
    publisher: b.publisher,
    price: b.priceSales,
    category: b.categoryName || "Unknown"
  }));

  const prompt = `
    Analyze the following list of books selected for library acquisition.
    Book List: ${JSON.stringify(bookData)}
    
    Please provide a JSON response with:
    1. A summary of the collection and why it's a balanced selection (summary).
    2. An analysis of the budget and pricing efficiency (budgetAnalysis).
    3. A breakdown of the categories represented (categoryBreakdown).
    4. A recommendation score from 0 to 100 based on diversity, price efficiency, and general quality (recommendationScore).
    
    Language: Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert librarian and collection development specialist. You analyze book lists for public libraries, ensuring diversity, budget efficiency, and community relevance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            budgetAnalysis: { type: Type.STRING },
            categoryBreakdown: { type: Type.STRING },
            recommendationScore: { type: Type.NUMBER },
          },
          required: ["summary", "budgetAnalysis", "categoryBreakdown", "recommendationScore"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(text) as GeminiAnalysis;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze book list using Gemini.");
  }
};