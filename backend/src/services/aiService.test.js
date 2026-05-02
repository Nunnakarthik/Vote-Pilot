import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { callAI } from './aiService.js';

vi.mock('axios');

describe('aiService', () => {
  it('should call Gemini API and return text', async () => {
    const mockResponse = {
      data: {
        candidates: [
          { content: { parts: [{ text: 'This is the AI response.' }] } }
        ]
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await callAI('What is the voting age?');
    expect(result).toBe('This is the AI response.');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the API fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(callAI('Hello')).rejects.toThrow('Failed to get response from AI');
  });
});
