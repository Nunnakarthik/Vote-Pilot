import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * AI Service (Antigravity/Gemini Integration)
 * Calls the external AI model for complex queries
 */
export const callAI = async (userMessage, userLevel = 'beginner') => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = 'gemini-1.5-flash'; // High performance fallback
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemPrompt = `You are an election assistant. 
  Current context: User is at ${userLevel} knowledge level.
  Always respond in clear step-by-step format. 
  Avoid bias. Keep answers simple.
  Use markdown for bolding key terms.`;

  try {
    const response = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from AI');
  }
};
