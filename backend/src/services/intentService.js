/**
 * Intent Detection Service
 * Categorizes user queries based on keywords to route to the correct local knowledge logic.
 *
 * @param {string} message - The raw text input from the user.
 * @returns {{ intent: string, confidence: number }} An object containing the matched intent and a confidence score.
 */
export const detectIntent = (message) => {
  const query = message.toLowerCase();
  
  const rules = [
    { intent: 'registration', keywords: [/regist/i, /apply/i, /sign up/i, /form 6/i, /enroll/i] },
    { intent: 'voting', keywords: [/vote/i, /voting/i, /ballot/i, /booth/i, /cast/i, /evm/i, /vvpat/i] },
    { intent: 'documents', keywords: [/id /i, /document/i, /paper/i, /proof/i, /aadhaar/i, /epic/i, /licen/i] },
    { intent: 'timeline', keywords: [/date/i, /when/i, /deadline/i, /timeline/i, /schedule/i, /phase/i] },
    { intent: 'results', keywords: [/result/i, /count/i, /winner/i, /who won/i, /leads/i] }
  ];

  for (const rule of rules) {
    const matchCount = rule.keywords.filter(k => k.test(query)).length;
    if (matchCount > 0) {
      // Calculate a basic confidence score
      const confidence = Math.min(0.5 + (matchCount * 0.1), 0.95);
      return { intent: rule.intent, confidence };
    }
  }

  return { intent: 'general', confidence: 0.1 };
};
