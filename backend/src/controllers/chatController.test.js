import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import chatRoutes from '../routes/chatRoutes.js';
import * as aiService from '../services/aiService.js';

// Mock the aiService
vi.mock('../services/aiService.js', () => ({
  generateAIResponse: vi.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('chatController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Prompt is required');
  });

  it('should return 200 and formatted response for valid prompt', async () => {
    const mockResponse = {
      message: 'This is a mocked AI response.',
      isLocal: false
    };
    aiService.generateAIResponse.mockResolvedValue(mockResponse);

    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'How do I vote?' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response', mockResponse.message);
    expect(res.body).toHaveProperty('isLocal', false);
    expect(res.body).toHaveProperty('metadata');
    expect(res.body.metadata).toHaveProperty('timestamp');
  });

  it('should handle errors thrown by aiService', async () => {
    aiService.generateAIResponse.mockRejectedValue(new Error('AI Service Error'));

    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Tell me a joke.' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
    expect(res.body).toHaveProperty('details', 'AI Service Error');
  });
});
