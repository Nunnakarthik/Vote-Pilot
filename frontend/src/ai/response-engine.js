/* ==========================================
   Vote Pilot — AI Response Engine
   Gemini-first with local fallback
   ========================================== */

import { detectIntent, isFollowUp } from './intent-detector.js';
import { electionPhases, faqData, misinformationDB, electionDates, civicTips } from './knowledge-base.js';
import * as fmt from './response-formatter.js';
import { geminiEngine } from './gemini-engine.js';

class ResponseEngine {
  constructor() {
    this.conversationHistory = [];
    this.lastIntent = null;
    this.userName = 'there';
    this.knowledgeLevel = 'beginner';
  }

  /**
   * Main entry: try Gemini first, fall back to local
   */
  async processMessage(userMessage) {
    const { intent, confidence, entities } = detectIntent(userMessage);
    const followUp = isFollowUp(userMessage, this.conversationHistory);
    this.conversationHistory.push({ role: 'user', text: userMessage, intent });

    const effectiveIntent = (followUp && intent === 'general' && this.lastIntent)
      ? this.lastIntent : intent;

    // Try Gemini API first
    if (geminiEngine.isAvailable) {
      try {
        const geminiResponse = await geminiEngine.sendMessage(userMessage);
        if (geminiResponse) {
          this.lastIntent = effectiveIntent;
          this.conversationHistory.push({ role: 'ai', text: geminiResponse.text, intent: effectiveIntent });
          return {
            text: geminiResponse.text,
            suggestions: geminiResponse.suggestions || this.getDefaultSuggestions(effectiveIntent),
            source: 'gemini'
          };
        }
      } catch (e) {
        console.warn('Gemini failed, using local engine:', e);
      }
    }

    // Local fallback
    let response;
    switch (effectiveIntent) {
      case 'greeting': response = this.handleGreeting(entities); break;
      case 'registration': response = this.handleRegistration(userMessage, entities); break;
      case 'voting': response = this.handleVoting(userMessage, entities); break;
      case 'documents': response = this.handleDocuments(userMessage, entities); break;
      case 'timeline': response = this.handleTimeline(userMessage, entities); break;
      case 'results': response = this.handleResults(userMessage, entities); break;
      case 'misinformation': response = this.handleMisinformation(userMessage); break;
      case 'help': response = this.handleHelp(); break;
      case 'checklist': response = this.handleChecklist(entities); break;
      case 'thanks': response = this.handleThanks(); break;
      default: response = this.handleGeneral(userMessage); break;
    }

    this.lastIntent = effectiveIntent;
    this.conversationHistory.push({ role: 'ai', text: response.text, intent: effectiveIntent });
    response.source = 'local';

    const delay = 300 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    return response;
  }

  getDefaultSuggestions(intent) {
    const map = {
      registration: ['What documents do I need?', 'Find my polling station', 'View timeline'],
      voting: ['Mail-in ballot guide', 'Find polling station', 'What ID to bring'],
      documents: ['How to get voter ID?', 'Registration guide', 'Voting process'],
      timeline: ['Registration deadline', 'Early voting dates', 'Results date'],
      results: ['Electoral College?', 'What is a recount?', 'View timeline'],
    };
    return map[intent] || ['How do I register?', 'Voting process', 'View timeline', 'FAQ'];
  }

  handleGreeting(entities) {
    return {
      text: `Hello ${this.userName}! 👋 Welcome to <strong>Vote Pilot</strong>, your step-by-step election guide.

I can help you with:

${fmt.formatList([
  '<strong>Voter Registration</strong> — How to register & check your status',
  '<strong>Voting Process</strong> — Step-by-step guide to casting your ballot',
  '<strong>Key Dates & Timelines</strong> — Important deadlines you shouldn\'t miss',
  '<strong>Required Documents</strong> — What ID and papers you need',
  '<strong>Fact Checking</strong> — Verify claims about elections'
])}

${fmt.formatTip('Try asking: "How do I vote for the first time?" or click a suggestion below!')}`,
      suggestions: ['How do I register?', 'What documents do I need?', 'Show me the timeline', 'First-time voter guide']
    };
  }

  handleRegistration(message, entities) {
    const phase = electionPhases.find(p => p.id === 'registration');
    const isFirstTime = entities.firstTimeVoter || /first[\s-]*time/i.test(message);
    const isEligibility = /eligib/i.test(message) || /can\s*i\s*vote/i.test(message) || /who\s*can/i.test(message);

    if (isEligibility) {
      return {
        text: `${fmt.formatHeading('✅', 'Voter Eligibility Requirements')}

To be eligible to vote, you must meet these criteria:

${fmt.formatSteps([
  { label: 'Age Requirement', desc: 'You must be at least 18 years old on or before Election Day.' },
  { label: 'Citizenship', desc: 'You must be a citizen of your respective country.' },
  { label: 'Residency', desc: 'You must be a resident of the state/district where you intend to vote.' },
  { label: 'Registration', desc: 'You must be registered to vote before your state\'s deadline.' },
  { label: 'No Disqualifications', desc: 'In most states, you must not be currently serving a felony sentence (laws vary).' }
])}

${fmt.formatTip('Even if you\'re not sure, check! Use your state\'s online portal to verify.')}`,
        suggestions: ['How do I register?', 'What documents do I need?', 'Registration deadlines']
      };
    }

    if (isFirstTime) {
      return {
        text: `${fmt.formatHeading('🎉', 'First-Time Voter Guide')}

Congratulations on taking this important step! Here's everything you need:

${fmt.formatSteps(phase.details.steps)}

${fmt.formatHeading('📄', 'Documents You\'ll Need')}
${fmt.formatList(phase.details.documents)}

${fmt.formatTip(phase.details.tips[0])}

${fmt.formatNote('* Most states require registration 15-30 days before Election Day.')}`,
        suggestions: ['What documents do I need?', 'Find my polling station', 'View election timeline']
      };
    }

    return {
      text: `${fmt.formatHeading('📝', 'Voter Registration Guide')}

Here's how to register to vote, step by step:

${fmt.formatSteps(phase.details.steps)}

${fmt.formatHeading('📋', 'Registration Deadlines')}
${fmt.formatDateCards([electionDates.onlineRegistration, electionDates.inPersonRegistration])}

${fmt.formatNote('* Dates are subject to change if new legislative bills are ratified.')}

${fmt.formatMiniTimeline([
  { label: 'Registration Opens', date: 'System initialization complete', active: true },
  { label: 'Primary Day', date: 'November 4, 2024', active: false }
])}

${fmt.formatTip('Would you like a personalized checklist of documents required for registration?')}`,
      suggestions: ['What documents do I need?', 'Find my polling station', 'Absentee ballot info']
    };
  }

  handleVoting(message, entities) {
    const phase = electionPhases.find(p => p.id === 'voting');
    if (/absentee|mail[\s-]*in/i.test(message)) {
      return {
        text: `${fmt.formatHeading('📮', 'Absentee / Mail-In Voting Guide')}

Mail-in voting lets you vote from home. Here's how:

${fmt.formatSteps([
  { label: 'Request Your Ballot', desc: 'Apply through your state\'s election website. Do this well before the deadline.' },
  { label: 'Receive Your Ballot', desc: 'Your ballot arrives by mail with instructions and a return envelope.' },
  { label: 'Mark Your Ballot', desc: 'Carefully fill in your choices using the specified marking method.' },
  { label: 'Seal & Sign', desc: 'Place ballot in secrecy envelope, then return envelope. Sign where required.' },
  { label: 'Return Your Ballot', desc: 'Mail it back or drop it off at a designated location.' }
])}

${fmt.formatTip('Request your ballot early — it can take 1-2 weeks to arrive!')}
${fmt.formatWarning('Late ballots may not be counted. Check your state\'s receipt deadline.')}`,
        suggestions: ['Track my ballot', 'Voting day process', 'What if I make a mistake?']
      };
    }

    if (/polling|station|location|where/i.test(message)) {
      return {
        text: `${fmt.formatHeading('📍', 'Finding Your Polling Station')}

Your polling station is assigned based on your registered address:

${fmt.formatSteps([
  { label: 'Check Voter Registration Card', desc: 'Your polling location is usually printed on your card.' },
  { label: 'Use Your State\'s Online Tool', desc: 'Visit your state\'s election board website and enter your address.' },
  { label: 'Call Your Election Office', desc: 'Contact your county election office for your assigned location.' },
  { label: 'Check for Changes', desc: 'Polling locations can change between elections. Always verify!' }
])}

${fmt.formatTip('Visit your polling station before Election Day to know exactly where to go.')}`,
        suggestions: ['What to bring', 'Early voting locations', 'Accessibility accommodations']
      };
    }

    return {
      text: `${fmt.formatHeading('🗳️', 'How to Vote — Complete Guide')}

Your step-by-step guide to casting your ballot:

${fmt.formatSteps(phase.details.steps)}

${fmt.formatHeading('📋', 'Voting Methods Available')}
${fmt.formatVotingMethods(phase.details.votingMethods)}

${fmt.formatTip(phase.details.tips[3] || phase.details.tips[0])}
${fmt.formatNote('If you\'re in line when polls close, you have the right to vote!')}`,
      suggestions: ['Mail-in ballot guide', 'Find my polling station', 'What documents to bring']
    };
  }

  handleDocuments(message, entities) {
    const phase = electionPhases.find(p => p.id === 'registration');
    return {
      text: `${fmt.formatHeading('🪪', 'Required Documents for Voting')}

${fmt.formatHeading('📝', 'For Registration')}
${fmt.formatList(phase.details.documents)}

${fmt.formatHeading('🗳️', 'For Voting Day')}
${fmt.formatList([
  'Valid photo ID (Driver\'s License, Passport, Military ID, State-issued ID)',
  'Voter registration card or confirmation letter',
  'Some states accept non-photo ID (utility bill, bank statement)',
  'Student ID (accepted in some states — check your state\'s rules)'
])}

${fmt.formatWarning('ID requirements vary significantly by state. Check your state\'s specific requirements!')}
${fmt.formatTip('Make copies of your ID documents. If your ID is lost, contact your DMV before Election Day.')}`,
      suggestions: ['How do I get a voter ID?', 'What if I forgot my ID?', 'State ID requirements']
    };
  }

  handleTimeline(message, entities) {
    const timelineItems = electionPhases.map(p => ({
      label: `${p.phase}: ${p.name}`, date: p.date,
      active: p.status === 'active' || p.status === 'completed'
    }));

    return {
      text: `${fmt.formatHeading('📅', 'Election Timeline — Key Dates')}

Critical dates for the upcoming election cycle:

${fmt.formatDateCards([
  electionDates.onlineRegistration, electionDates.inPersonRegistration,
  electionDates.earlyVoting, electionDates.electionDay, electionDates.resultsExpected
])}

${fmt.formatHeading('🗓️', 'Election Roadmap')}
${fmt.formatMiniTimeline(timelineItems)}

${fmt.formatTip('Set reminders for key dates! Missing registration = unable to vote.')}
${fmt.formatNote('* Dates may vary by state. Check your state\'s election board.')}`,
      suggestions: ['Registration deadline', 'Early voting dates', 'When are results?']
    };
  }

  handleResults(message, entities) {
    const phase = electionPhases.find(p => p.id === 'results');
    const countingPhase = electionPhases.find(p => p.id === 'counting');
    return {
      text: `${fmt.formatHeading('📊', 'Election Results & Counting Process')}

${fmt.formatHeading('🔢', 'Vote Counting')}
${fmt.formatSteps(countingPhase.details.steps)}

${fmt.formatHeading('🏆', 'Results Declaration')}
${fmt.formatSteps(phase.details.steps)}

${fmt.formatTip(countingPhase.details.tips[0])}
${fmt.formatNote('Multiple verification steps ensure every valid vote is counted accurately.')}`,
      suggestions: ['Electoral College?', 'What is a recount?', 'View full timeline']
    };
  }

  handleMisinformation(message) {
    const normalizedMsg = message.toLowerCase();
    let bestMatch = null;
    for (const item of misinformationDB) {
      if (normalizedMsg.includes(item.claim) ||
          item.claim.split(' ').some(word => normalizedMsg.includes(word) && word.length > 4)) {
        bestMatch = item; break;
      }
    }

    if (bestMatch) {
      return {
        text: `${fmt.formatHeading('🔍', 'Fact Check')}

I understand there are concerns. Let me provide verified information:

${fmt.formatCorrection(bestMatch.claim, bestMatch.correction, bestMatch.source)}

${fmt.formatTip('Always verify through official sources like your state\'s election board or the Election Assistance Commission.')}

${fmt.formatList([
  'Official Sources: <strong>vote.gov</strong>, your state\'s Secretary of State',
  'Nonpartisan Research: <strong>Brennan Center</strong>, <strong>MIT Election Lab</strong>',
  'Fact Checking: <strong>FactCheck.org</strong>, <strong>PolitiFact</strong>, <strong>Snopes</strong>'
])}`,
        suggestions: ['How is voting secure?', 'Election process', 'How are votes counted?']
      };
    }

    return {
      text: `${fmt.formatHeading('🔍', 'Verifying Election Information')}

How to verify election claims:

${fmt.formatSteps([
  { label: 'Check Official Sources', desc: 'Start with your state\'s election board or vote.gov.' },
  { label: 'Cross-Reference', desc: 'Compare against multiple reputable news sources.' },
  { label: 'Look for Evidence', desc: 'Credible claims cite specific data and official records.' },
  { label: 'Use Fact-Checkers', desc: 'FactCheck.org, PolitiFact, and Snopes specialize in election claims.' }
])}

${fmt.formatWarning('Be cautious of unsourced social media claims. When in doubt, check with your local election office.')}`,
      suggestions: ['Vote protection', 'Election security', 'Report misinformation']
    };
  }

  handleHelp() {
    return {
      text: `${fmt.formatHeading('🧭', 'Welcome to Vote Pilot')}

I'm your AI-powered civic education assistant. Here's what I can help with:

${fmt.formatSteps([
  { label: 'Voter Registration', desc: 'Step-by-step guide, eligibility checks, deadline reminders.' },
  { label: 'Voting Process', desc: 'How to vote in person, by mail, or early. Find your polling station.' },
  { label: 'Required Documents', desc: 'Exactly what ID and paperwork you need.' },
  { label: 'Election Timeline', desc: 'Key dates with Google Calendar reminders.' },
  { label: 'Fact Checking', desc: 'Verify claims with evidence-based explanations.' },
  { label: 'Voice Interaction', desc: 'Click the 🎤 mic button to ask questions by voice!' }
])}

${fmt.formatTip('Just ask anything about elections! I\'m here to help you become a confident voter.')}`,
      suggestions: ['How do I register?', 'First-time voter guide', 'View timeline', 'What documents?']
    };
  }

  handleChecklist(entities) {
    return {
      text: `${fmt.formatHeading('✅', 'Your Election Readiness Checklist')}

Complete these before Election Day:

${fmt.formatSteps([
  { label: 'Verify Registration', desc: 'Confirm your voter registration is active and up to date.' },
  { label: 'Check ID Requirements', desc: 'Find out what identification your state requires.' },
  { label: 'Find Your Polling Station', desc: 'Locate your assigned polling place and plan your route.' },
  { label: 'Review Your Ballot', desc: 'Research candidates and ballot measures beforehand.' },
  { label: 'Plan Your Vote', desc: 'Decide: in person, early, or by mail. Mark the date!' },
  { label: 'Prepare Documents', desc: 'Gather your ID, voter card, and other required documents.' }
])}

${fmt.formatTip('Complete these at least 1 week before Election Day!')}`,
      suggestions: ['Registration status', 'ID requirements', 'Find polling station']
    };
  }

  handleThanks() {
    const r = [
      `You're welcome! 😊 Anything else about elections?`,
      `Happy to help! 🏛️ An informed voter is an empowered voter!`,
      `Glad I could help! ✨ Good luck with your civic journey!`
    ];
    return { text: r[Math.floor(Math.random() * r.length)], suggestions: ['Registration', 'Voting', 'Timeline', 'FAQ'] };
  }

  handleGeneral(message) {
    const normalizedMsg = message.toLowerCase();
    const matchedFaq = faqData.find(faq =>
      faq.question.toLowerCase().split(' ').filter(w => w.length > 3)
        .some(keyword => normalizedMsg.includes(keyword))
    );

    if (matchedFaq) {
      return {
        text: `${fmt.formatHeading('💬', matchedFaq.question)}\n\n${matchedFaq.answer}\n\n${fmt.formatTip('Want to dive deeper? Just ask a follow-up!')}`,
        suggestions: ['Registration', 'Voting methods', 'Timeline', 'More FAQ']
      };
    }

    return {
      text: `${fmt.formatHeading('🤔', 'Let Me Help You')}

I specialize in:

${fmt.formatList([
  '<strong>Voter Registration</strong> — Register, check status, update info',
  '<strong>Voting Process</strong> — In-person, mail-in, early voting',
  '<strong>Election Timeline</strong> — Key dates and deadlines',
  '<strong>Required Documents</strong> — ID requirements',
  '<strong>Fact Checking</strong> — Verify election claims'
])}

Could you rephrase your question, or pick a topic above? 😊`,
      suggestions: ['How do I vote?', 'Registration guide', 'Election timeline', 'What ID do I need?']
    };
  }

  resetConversation() {
    this.conversationHistory = [];
    this.lastIntent = null;
    geminiEngine.reset();
  }

  getRandomTip() {
    return civicTips[Math.floor(Math.random() * civicTips.length)];
  }
}

export const responseEngine = new ResponseEngine();
