import { detectIntent } from '../services/intentService.js';
import { getKnowledge } from '../services/knowledgeService.js';
import { callAI } from '../services/aiService.js';
import { formatLocalResponse } from '../services/formatterService.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

/**
 * Chat Controller
 * Orchestrates the hybrid AI logic (Local + Remote) and handles caching
 *
 * @param {import('express').Request} req - The HTTP request containing body.message and body.userLevel
 * @param {import('express').Response} res - The HTTP response
 * @returns {Promise<void>}
 */
export const processChat = async (req, res, next) => {
  const { message, userLevel } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check Cache
  const cacheKey = `${message}-${userLevel || 'standard'}`;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log(`[DEBUG] Cache hit for: "${message}"`);
    return res.status(200).json(cachedResponse);
  }

  console.log(`[DEBUG] Processing message: "${message}" for level: ${userLevel}`);

  try {
    // 1. Detect Intent
    const { intent, confidence } = detectIntent(message);
    console.log(`[DEBUG] Intent: ${intent} (Confidence: ${confidence})`);

    // 2. Fetch Knowledge (Fixed from getLocalKnowledge to getKnowledge)
    const localData = await getKnowledge(intent);

    // 3. Decision Logic (Hybrid AI)
    // IF intent confidence > 0.7 AND local knowledge exists
    if (confidence > 0.7 && localData) {
      console.log('[DEBUG] Result from: LOCAL KNOWLEDGE BASE');
      const responsePayload = {
        reply: formatLocalResponse(localData),
        source: 'local',
        intent: intent
      };
      cache.set(cacheKey, responsePayload);
      return res.status(200).json(responsePayload);
    }

    // ELSE call AI fallback (Antigravity)
    console.log('[DEBUG] Result from: AI SERVICE (ANTIGRAVITY)');
    const aiReply = await callAI(message, userLevel);

    const responsePayload = {
      reply: aiReply,
      source: 'antigravity',
      intent: intent
    };
    cache.set(cacheKey, responsePayload);
    
    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error('[ERROR] Controller failed:', error.message);
    next(error); // Pass to global error handler
  }
};
