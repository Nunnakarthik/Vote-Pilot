/* ==========================================
   CivicAlly — Intent Detection Module
   Pattern-based intent classification
   ========================================== */

const intentPatterns = {
  greeting: {
    patterns: [
      /^(hi|hello|hey|howdy|greetings|good\s*(morning|evening|afternoon)|yo|sup|what'?s?\s*up)/i,
      /^(hola|namaste|salaam)/i
    ],
    priority: 1
  },
  registration: {
    patterns: [
      /regist(er|ration|ering)/i,
      /sign\s*up\s*(to\s*vote|for\s*voting)/i,
      /how\s*(do|can)\s*i\s*(register|sign\s*up)/i,
      /voter\s*registration/i,
      /enroll/i,
      /eligib(le|ility)/i,
      /am\s*i\s*eligible/i,
      /can\s*i\s*vote/i,
      /who\s*can\s*vote/i,
      /first[\s-]*time\s*voter/i,
      /new\s*voter/i,
      /vote\s*for\s*the\s*first\s*time/i
    ],
    priority: 5
  },
  voting: {
    patterns: [
      /how\s*(do|can|to)\s*(i\s*)?(vote|cast)/i,
      /voting\s*(process|procedure|method|day)/i,
      /cast\s*(my|a|the)\s*(vote|ballot)/i,
      /election\s*day/i,
      /polling\s*(station|place|booth|location|center)/i,
      /early\s*voting/i,
      /absentee/i,
      /mail[\s-]*in\s*(ballot|voting)/i,
      /ballot/i,
      /where\s*(do|can)\s*i\s*vote/i,
      /evm|electronic\s*voting/i
    ],
    priority: 5
  },
  documents: {
    patterns: [
      /document/i,
      /what\s*(do\s*i\s*need|documents|papers|id)/i,
      /voter\s*id/i,
      /identification/i,
      /photo\s*id/i,
      /proof\s*of/i,
      /id\s*(card|required|requirements|needed)/i,
      /epic\s*card/i,
      /driver'?s?\s*license/i,
      /passport/i
    ],
    priority: 4
  },
  timeline: {
    patterns: [
      /timeline/i,
      /schedule/i,
      /when\s*(is|are|does)/i,
      /deadline/i,
      /date/i,
      /key\s*dates/i,
      /election\s*(date|schedule|calendar)/i,
      /phase/i,
      /how\s*long/i,
      /registration\s*deadline/i,
      /important\s*dates/i
    ],
    priority: 4
  },
  results: {
    patterns: [
      /result/i,
      /who\s*won/i,
      /winner/i,
      /count(ing|ed)?/i,
      /tally/i,
      /outcome/i,
      /electoral\s*college/i,
      /certification/i
    ],
    priority: 4
  },
  misinformation: {
    patterns: [
      /fraud/i,
      /rigged/i,
      /fake/i,
      /stolen\s*election/i,
      /dead\s*people\s*vot/i,
      /illegal\s*vot/i,
      /hacked/i,
      /manipulated/i,
      /doesn'?t?\s*matter/i,
      /vote\s*doesn'?t/i,
      /my\s*vote\s*(won'?t|doesn'?t|don'?t)/i,
      /non[\s-]*citizen/i,
      /cheating/i
    ],
    priority: 6
  },
  help: {
    patterns: [
      /help/i,
      /what\s*can\s*you\s*do/i,
      /what\s*do\s*you\s*know/i,
      /feature/i,
      /guide\s*me/i,
      /how\s*does\s*this\s*work/i,
      /explain\s*(the\s*)?election/i,
      /tell\s*me\s*about\s*(the\s*)?election/i,
      /overview/i,
      /election\s*process/i
    ],
    priority: 3
  },
  checklist: {
    patterns: [
      /checklist/i,
      /what\s*should\s*i\s*do/i,
      /prepare/i,
      /ready\s*(to|for)\s*vote/i,
      /steps?\s*(to|for)/i,
      /todo/i,
      /action\s*items/i
    ],
    priority: 4
  },
  thanks: {
    patterns: [
      /^(thank|thanks|ty|thx|appreciate)/i,
      /^(great|awesome|perfect|wonderful|excellent|cool|nice)/i,
      /that\s*help(s|ed)/i,
      /got\s*it/i
    ],
    priority: 2
  }
};

/**
 * Detect the user's intent from their message.
 * Returns { intent, confidence, entities }
 */
export function detectIntent(message) {
  const normalizedMsg = message.trim().toLowerCase();

  let bestMatch = { intent: 'general', confidence: 0, entities: {} };

  // Check each intent
  for (const [intent, config] of Object.entries(intentPatterns)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedMsg)) {
        const confidence = config.priority * 0.2;
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence, entities: {} };
        }
        break; // Found a match for this intent, move to next
      }
    }
  }

  // Extract entities
  bestMatch.entities = extractEntities(normalizedMsg);

  // If no pattern matched but message is a question, classify as general
  if (bestMatch.intent === 'general' && normalizedMsg.includes('?')) {
    bestMatch.confidence = 0.3;
  }

  return bestMatch;
}

/**
 * Extract entities like locations, dates from message
 */
function extractEntities(message) {
  const entities = {};

  // Check for state mentions
  const states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new hampshire', 'new jersey', 'new mexico', 'new york',
    'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west virginia', 'wisconsin', 'wyoming'
  ];

  for (const state of states) {
    if (message.includes(state)) {
      entities.state = state.replace(/\b\w/g, l => l.toUpperCase());
      break;
    }
  }

  // Check for first-time voter
  if (/first[\s-]*time/i.test(message) || /new\s*voter/i.test(message)) {
    entities.firstTimeVoter = true;
  }

  // Check for specific year
  const yearMatch = message.match(/\b(202[4-9]|203\d)\b/);
  if (yearMatch) {
    entities.year = yearMatch[1];
  }

  return entities;
}

/**
 * Determine if this is a follow-up question
 */
export function isFollowUp(message, conversationHistory) {
  if (conversationHistory.length === 0) return false;

  const followUpPatterns = [
    /^(and|also|what about|how about|tell me more|more info|elaborate|explain more|go on|continue)/i,
    /^(yes|yeah|yep|sure|ok|okay|please|do that|go ahead)/i,
    /^(what|how|when|where|why|can|could|should|is|are|do|does)\s/i
  ];

  return followUpPatterns.some(p => p.test(message.trim()));
}
