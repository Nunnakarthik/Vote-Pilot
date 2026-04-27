/* ==========================================
   Vote Pilot — Google Gemini AI Engine
   Integration with Google Gemini API for
   intelligent, context-aware responses
   ========================================== */

const SYSTEM_PROMPT = `You are "Vote Pilot," an AI-powered civic education assistant that helps users understand election processes clearly and interactively.

## Your Core Behavior:
1. Provide accurate, unbiased, step-by-step explanations of election processes.
2. Adapt explanations based on user knowledge level (beginner, intermediate, advanced).
3. Use structured formatting: numbered steps, bullet points, bold headings.
4. Detect and correct misinformation politely with verified explanations.
5. Avoid political bias or opinions — remain strictly nonpartisan.

## Response Format Rules:
- Always start with a concise 1-2 sentence overview.
- Break complex topics into numbered steps.
- Include a 💡 Tip at the end when helpful.
- Highlight key terms in bold.
- If location-specific info is needed, ask a clarifying question.
- If unsure about something, state your limitations and suggest official sources.

## What You Know About:
- Voter registration (online, by mail, in person)
- Eligibility requirements (age, citizenship, residency)
- Required documents and ID laws
- Voting methods (in-person, early, absentee/mail-in)
- Election timelines and key dates
- Vote counting and result certification
- Electoral systems (Electoral College, popular vote)
- Common election misinformation and corrections
- Civic rights and voter protections

## Formatting Instructions:
When providing steps, format like:
**Step 1: Title**
Description text here.

**Step 2: Title**
Description text here.

When listing items, use bullet points with •

Always end with a follow-up question or suggested next topic to keep the conversation flowing.

## Misinformation Handling:
If a user states something incorrect about elections, gently correct them:
1. Acknowledge their concern
2. Provide the factual information
3. Cite the type of source (e.g., "According to the Election Assistance Commission...")
4. Offer to explain further

## Context Awareness:
- Remember what the user asked previously in the conversation
- Build on prior answers
- If the user seems confused, simplify your language
- If the user is knowledgeable, provide more detailed information`;

class GeminiEngine {
  constructor() {
    this.apiKey = null;
    this.conversationHistory = [];
    this.model = 'gemini-2.0-flash';
    this.isAvailable = false;
    this.userProfile = {
      knowledgeLevel: 'beginner',
      interests: [],
      questionsAsked: 0,
      location: null
    };
  }

  /**
   * Initialize with an API key
   */
  configure(apiKey) {
    this.apiKey = apiKey;
    this.isAvailable = !!apiKey;
  }

  /**
   * Set explicit knowledge level
   */
  setKnowledgeLevel(level) {
    if (['beginner', 'intermediate', 'advanced'].includes(level)) {
      this.userProfile.knowledgeLevel = level;
    }
  }

  /**
   * Update user profile based on interaction patterns
   */
  updateUserProfile(message) {
    this.userProfile.questionsAsked++;

    // Track interests
    const topics = {
      registration: /regist/i,
      voting: /vote|voting|ballot/i,
      documents: /document|id|identification/i,
      timeline: /date|deadline|when|timeline/i,
      results: /result|count|winner/i
    };

    for (const [topic, pattern] of Object.entries(topics)) {
      if (pattern.test(message) && !this.userProfile.interests.includes(topic)) {
        this.userProfile.interests.push(topic);
      }
    }
  }

  /**
   * Check for misinformation/claims in user message
   */
  detectMisinformationClaim(message) {
    const claims = [
      { pattern: /hack|rigged|stolen|manipulated|fake|hoax|scam|fraud/i, claim: "election security", fact: "Electronic voting machines are rigorously tested, not connected to the internet, and have multiple layers of physical and digital security. Paper trails exist for audits." },
      { pattern: /dead|ghost|deceased/i, claim: "voter rolls", fact: "Voter rolls are regularly maintained and updated. Instances of ballots cast by deceased individuals are extremely rare and caught by administrative checks." },
      { pattern: /double|multiple times/i, claim: "double voting", fact: "Registration systems across states prevent double voting. Attempting to vote twice is a serious felony and easily detectable through connected databases." },
      { pattern: /non-citizen|illegal|alien/i, claim: "non-citizen voting", fact: "It is a federal crime for non-citizens to vote in federal elections. Independent audits show non-citizen voting is statistically non-existent." }
    ];

    for (const c of claims) {
      if (c.pattern.test(message)) return c;
    }
    return null;
  }

  /**
   * Build context-enriched prompt with user profile
   */
  buildContextPrompt() {
    const level = this.userProfile.knowledgeLevel;
    const location = this.userProfile.location || 'India';
    let contextNote = `\n[LOCATION: ${location}]`;

    if (level === 'beginner') {
      contextNote += '\n[STYLE: BEGINNER. Use very simple language, 5th-grade reading level, focus on "How-To" basics.]';
    } else if (level === 'intermediate') {
      contextNote += '\n[STYLE: INTERMEDIATE. Balanced detail, explain standard terminology, focus on "Process" details.]';
    } else {
      contextNote += '\n[STYLE: ADVANCED. High technical detail, reference specific constitutional provisions or legal frameworks, focus on "Deep-Dive" analysis.]';
    }

    if (this.userProfile.interests.length > 0) {
      contextNote += `\n[USER INTERESTS: ${this.userProfile.interests.join(', ')}]`;
    }

    return SYSTEM_PROMPT + contextNote;
  }

  /**
   * Send message to Gemini API
   */
  async sendMessage(userMessage) {
    if (!this.isAvailable) {
      return null; // Fall back to local engine
    }

    // Update user profile
    this.updateUserProfile(userMessage);

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const requestBody = {
        contents: this.conversationHistory,
        systemInstruction: {
          parts: [{ text: this.buildContextPrompt() }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.warn('Gemini API error:', response.status);
        this.conversationHistory.pop(); // Remove failed user message
        return null;
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        this.conversationHistory.pop();
        return null;
      }

      // Add AI response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: aiText }]
      });

      return {
        text: this.formatGeminiResponse(aiText),
        raw: aiText,
        suggestions: this.extractSuggestions(aiText)
      };
    } catch (error) {
      console.warn('Gemini API call failed:', error);
      this.conversationHistory.pop();
      return null;
    }
  }

  /**
   * Format Gemini markdown response to HTML
   */
  formatGeminiResponse(text) {
    let html = text
      // Headers
      .replace(/^### (.+)$/gm, '<h4 style="color: var(--text-primary); margin: var(--space-md) 0 var(--space-sm);">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 style="margin: var(--space-base) 0 var(--space-sm);">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Bullet points
      .replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>')
      // Numbered steps with bold titles
      .replace(/^(\d+)\.\s+(.+)$/gm, (match, num, content) => {
        return `<div class="step-item"><div class="step-number">${num}</div><div class="step-text">${content}</div></div>`;
      })
      // Tip boxes
      .replace(/💡\s*\*?Tip\*?:?\s*(.+)/gi, '<div class="tip-box"><span class="tip-icon">💡</span><span>$1</span></div>')
      // Warning boxes
      .replace(/⚠️\s*\*?Warning\*?:?\s*(.+)/gi, '<div class="warning-box"><span class="tip-icon">⚠️</span><span>$1</span></div>')
      // Line breaks
      .replace(/\n\n/g, '</p><p style="margin: var(--space-sm) 0; color: var(--text-secondary);">')
      .replace(/\n/g, '<br/>');

    // Wrap bullet lists
    html = html.replace(/(<li>.*?<\/li>(\s*<br\/>)?)+/g, (match) => {
      return `<ul class="info-list">${match.replace(/<br\/>/g, '')}</ul>`;
    });

    // Wrap step items
    const hasSteps = html.includes('step-item');
    if (hasSteps) {
      html = html.replace(/(<div class="step-item">.*?<\/div><\/div>(\s*<br\/>)?)+/g, (match) => {
        return `<div class="step-list">${match.replace(/<br\/>/g, '')}</div>`;
      });
    }

    return `<div style="color: var(--text-secondary); line-height: 1.7;">${html}</div>`;
  }

  /**
   * Extract follow-up suggestions from response
   */
  extractSuggestions(text) {
    const defaults = ['Tell me more', 'What else should I know?', 'View timeline'];

    // Try to extract questions the AI suggested
    const questionPattern = /[""]([^""]+\?)[""]/g;
    const matches = [...text.matchAll(questionPattern)].map(m => m[1]);
    if (matches.length >= 2) return matches.slice(0, 4);

    // Detect topics mentioned and suggest related questions
    const suggestions = [];
    if (/regist/i.test(text)) suggestions.push('How do I register?');
    if (/document|ID/i.test(text)) suggestions.push('What ID do I need?');
    if (/deadline|date/i.test(text)) suggestions.push('Show me the timeline');
    if (/poll|station/i.test(text)) suggestions.push('Find my polling station');
    if (/mail|absentee/i.test(text)) suggestions.push('Absentee ballot guide');

    return suggestions.length >= 2 ? suggestions.slice(0, 4) : defaults;
  }

  /**
   * Reset conversation
   */
  reset() {
    this.conversationHistory = [];
    this.userProfile.questionsAsked = 0;
  }

  /**
   * Get user profile for display
   */
  getUserProfile() {
    return { ...this.userProfile };
  }
}

export const geminiEngine = new GeminiEngine();
