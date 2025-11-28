import { GoogleGenAI, Type } from '@google/genai';
import { GeneratedMetadata } from '../types';

// Initialize the Gemini client
// API Key is strictly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSiteMetadata = async (url: string): Promise<GeneratedMetadata> => {
  try {
    // Using gemini-2.5-flash for fast, efficient text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this URL: "${url}". 
      
      Please provide the response in Korean (한국어).

      1. Extract or infer a clean, displayable Title (e.g., "Google" instead of "Google - Search").
      2. Write a short, engaging description in Korean (max 80 characters).
      3. Assign a single word Category in Korean (e.g., "뉴스", "쇼핑", "기술", "디자인", "게임").
      
      If the URL is invalid or you can't determine content, make a best guess based on the domain name.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ['title', 'description', 'category'],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error('No response from AI');
    }
    
    return JSON.parse(text) as GeneratedMetadata;

  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback if AI fails
    return {
      title: '',
      description: '',
      category: '기타',
    };
  }
};