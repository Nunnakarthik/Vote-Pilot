import { detectIntent } from '../services/intentService.js';
import { getKnowledge } from '../services/knowledgeService.js';
import { callAI } from '../services/aiService.js';
import { formatLocalResponse } from '../services/formatterService.js';

/**
 * Chat Controller
 * Orchestrates the hybrid AI logic (Local + Remote)
 */
export const processChat = async (req, res) => {
  const { message, userLevel } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log(`[DEBUG] Processing message: "${message}" for level: ${userLevel}`);

  try {
    // 1. Detect Intent
    const { intent, confidence } = detectIntent(message);
    console.log(`[DEBUG] Intent: ${intent} (Confidence: ${confidence})`);

    // 2. Fetch Knowledge
    const localData = await getLocalKnowledge(intent);

    // 3. Decision Logic (Hybrid AI)
    // IF intent confidence > 0.7 AND local knowledge exists
    if (confidence > 0.7 && localData) {
      console.log('[DEBUG] Result from: LOCAL KNOWLEDGE BASE');
      return res.status(200).json({
        reply: formatLocalResponse(localData),
        source: 'local',
        intent: intent
      });
    }

    // ELSE call AI fallback (Antigravity)
    console.log('[DEBUG] Result from: AI SERVICE (ANTIGRAVITY)');
    const aiReply = await callAI(message, userLevel);

    return res.status(200).json({
      reply: aiReply,
      source: 'antigravity',
      intent: intent
    });

  } catch (error) {
    console.error('[ERROR] Controller failed:', error.message);
    res.status(500).json({ error: 'Internal server error while processing query' });
  }
};
