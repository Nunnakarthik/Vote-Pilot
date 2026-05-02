/* ==========================================
   Vote Pilot — Chat Component
   With voice, Gemini, Google services
   ========================================== */

import { responseEngine } from '../ai/response-engine.js';
import { geminiEngine } from '../ai/gemini-engine.js';
import { voiceEngine } from './voice.js';
import { renderSmartJourney } from './smart-journey.js';
import { sendMessageToBackend } from '../api/chatApi.js';

let chatMessagesEl = null;
let chatInputEl = null;
let sendBtnEl = null;
let quickActionsEl = null;
let voiceBtnEl = null;
let isProcessing = false;

/**
 * Sanitizes a string to prevent XSS attacks
 * @param {string} str - The raw input string
 * @returns {string} - The sanitized string
 */
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}


export function renderChatView(container) {
  container.innerHTML = `
    <div class="chat-view">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input-area">
        <div class="chat-input-container">
          <span class="chat-input-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <input type="text" class="chat-input" id="chat-input"
            placeholder="Ask about voting, registration, or elections..."
            autocomplete="off" />
          <button class="voice-btn" id="voice-btn" aria-label="Voice input" title="Talk to us">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  chatMessagesEl = document.getElementById('chat-messages');
  chatInputEl = document.getElementById('chat-input');
  sendBtnEl = document.getElementById('chat-send-btn');
  quickActionsEl = document.getElementById('quick-actions');
  voiceBtnEl = document.getElementById('voice-btn');

  sendBtnEl.addEventListener('click', handleSend);
  chatInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  // Voice
  if (voiceEngine.isSupported) {
    voiceBtnEl.addEventListener('click', () => voiceEngine.toggleListening());
    voiceEngine.onResult = (transcript, isFinal) => {
      chatInputEl.value = transcript;
      if (isFinal) handleSend();
    };
    voiceEngine.onListeningChange = (listening) => voiceBtnEl.classList.toggle('listening', listening);
  } else {
    voiceBtnEl.style.display = 'none';
  }


  showWelcomeMessage();
}

function updateGeminiStatus() {
  const dot = document.getElementById('gemini-dot');
  const label = document.getElementById('gemini-label');
  if (!dot || !label) return;
  if (geminiEngine.apiKey) {
    dot.style.background = 'var(--accent-success)';
    label.textContent = 'Gemini AI';
  } else {
    dot.style.background = 'var(--text-muted)';
    label.textContent = 'Local AI';
  }
}

function showGeminiModal() {
  const existing = document.getElementById('gemini-modal');
  if (existing) { existing.remove(); return; }

  const modal = document.createElement('div');
  modal.id = 'gemini-modal';
  modal.style.cssText = `position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);`;
  modal.innerHTML = `
    <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-xl);padding:var(--space-2xl);width:400px;max-width:90vw;">
      <h3 style="color:var(--text-primary);margin-bottom:var(--space-base);font-size:var(--font-lg);">🔑 Configure Google Gemini AI</h3>
      <p style="color:var(--text-secondary);font-size:var(--font-sm);margin-bottom:var(--space-lg);line-height:1.6;">Enter your Gemini API key for smarter responses. Get it free at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--accent-primary);">aistudio.google.com</a>.</p>
      <input type="password" id="gemini-key-input" placeholder="Paste your Gemini API key..."
        value="${geminiEngine.apiKey || ''}"
        style="width:100%;padding:var(--space-md);background:rgba(255,255,255,0.04);border:1px solid var(--border-default);border-radius:var(--radius-md);color:var(--text-primary);margin-bottom:var(--space-lg);" />
      <div style="display:flex;gap:var(--space-md);justify-content:flex-end;">
        <button id="gemini-cancel" style="padding:var(--space-md) var(--space-xl);background:rgba(255,255,255,0.05);border:none;border-radius:var(--radius-md);color:var(--text-secondary);cursor:pointer;">Cancel</button>
        <button id="gemini-save" style="padding:var(--space-md) var(--space-xl);background:var(--accent-primary);border:none;border-radius:var(--radius-md);color:var(--bg-primary);font-weight:700;cursor:pointer;">Activate</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('gemini-cancel').addEventListener('click', () => modal.remove());
  document.getElementById('gemini-save').addEventListener('click', () => {
    const key = document.getElementById('gemini-key-input').value.trim();
    geminiEngine.configure(key);
    updateGeminiStatus();
    modal.remove();
  });
}

function showWelcomeMessage() {
  const welcomeHTML = `
    <div class="welcome-box fade-in-up">
      <div class="welcome-header">
        <span class="welcome-badge">HOW THIS HELPS</span>
        <h1>Welcome to Vote Pilot</h1>
        <p>We help you vote and answer your questions. Click a button below to start.</p>
      </div>
      
      <div class="welcome-grid">
        <button class="welcome-card journey-trigger pulse-primary" id="btn-journey-start">
          <div class="card-icon">🧭</div>
          <div class="card-content">
            <h3>Help me vote</h3>
            <p>Easy steps to help you get registered and vote.</p>
          </div>
        </button>


        <button class="welcome-card first-time-trigger" id="btn-first-time">
          <div class="card-icon">🎓</div>
          <div class="card-content">
            <h3>I'm new to voting</h3>
            <p>If this is your first time, start here.</p>
          </div>
        </button>
      </div>

      <div class="welcome-footer">
        <p>Or just start typing below to ask our <strong>Gemini AI</strong> anything.</p>
      </div>
    </div>
  `;
  addMessage('ai', welcomeHTML, ['How do I register?', 'Key deadlines?', 'Am I eligible?']);
  
  document.getElementById('btn-journey-start')?.addEventListener('click', () => {
    chatMessagesEl.innerHTML = '';
    renderSmartJourney(chatMessagesEl);
  });

  
  document.getElementById('btn-first-time')?.addEventListener('click', () => {
    chatInputEl.value = "I am a first-time voter, help me get started!";
    handleSend();
  });
}

/**
 * Handles the sending of a user message.
 */
async function handleSend() {
  const message = chatInputEl.value.trim();
  if (!message || isProcessing) return;

  const safeMessage = sanitizeHTML(message);
  
  isProcessing = true;
  chatInputEl.value = '';
  sendBtnEl.disabled = true;

  addMessage('user', safeMessage);
  showTypingIndicator();

  const userLevel = 'beginner';

  try {
    // 🌍 Call the Backend API instead of local engine
    const response = await sendMessageToBackend(message, userLevel);
    removeTypingIndicator();

    const sourceTag = response.source === 'antigravity'
      ? '<div style="font-size:0.65rem;color:var(--accent-success);margin-top:var(--space-sm);opacity:0.7;">⚡ AI Answer</div>'
      : '<div style="font-size:0.65rem;color:var(--accent-primary);margin-top:var(--space-sm);opacity:0.7;">🏛️ From our records</div>';

    addMessage('ai', response.reply + sourceTag, response.suggestions);
  } catch (error) {
    removeTypingIndicator();
    addMessage('ai', `
      <div style="padding:12px; border:1px solid var(--accent-danger); border-radius:8px; background:rgba(239,68,68,0.05);">
        <h4 style="color:var(--accent-danger); margin-bottom:4px;">⚠️ Connection Error</h4>
        <p style="font-size:0.85rem;">Is the backend server running at localhost:5000?</p>
      </div>
    `);
  }

  isProcessing = false;
  sendBtnEl.disabled = false;
  chatInputEl.focus();
}

function addMessage(type, content, suggestions = null) {
  // Simple markdown-to-html conversion for headers and bold text
  let processedContent = content;
  if (type === 'ai') {
    processedContent = processedContent
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    if (processedContent.includes('<li>')) {
      processedContent = processedContent.replace(/(<li>.*<\/li>)/gms, '<ol class="step-list">$1</ol>');
    }
  }

  const messageEl = document.createElement('div');
  messageEl.className = `message ${type} fade-in-up`;
  const avatar = type === 'ai' ? '<div class="message-avatar">🧭</div>' : '<div class="message-avatar">👤</div>';
  let suggestionsHTML = suggestions && type === 'ai' ? `<div class="suggestion-chips">${suggestions.map(s => `<button class="suggestion-chip">${s}</button>`).join('')}</div>` : '';

  messageEl.innerHTML = `${avatar}<div class="message-content">${processedContent}${suggestionsHTML}</div>`;
  chatMessagesEl.appendChild(messageEl);

  messageEl.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => { chatInputEl.value = chip.textContent; handleSend(); });
  });


  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'message ai';
  indicator.id = 'typing-indicator';
  indicator.innerHTML = `<div class="message-avatar">🧭</div><div class="message-content typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  chatMessagesEl.appendChild(indicator);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('typing-indicator')?.remove();
}


async function runDemoMode() {
  const chatInput = document.getElementById('chat-input');
  
  const demoSteps = [
    { text: "Help me start my voting journey!", delay: 500 },
    { text: "I'm a first-time voter in India, how do I register?", delay: 3500 },
    { text: "What documents do I need to bring?", delay: 3500 },
    { text: "I heard voting machines are fake and rigged, is that true?", delay: 4000 },
    { text: "Show me the election timeline", delay: 3000, action: () => document.getElementById('nav-timeline').click() }
  ];

  chatMessagesEl.innerHTML = '';
  showWelcomeMessage();

  for (const step of demoSteps) {
    await new Promise(r => setTimeout(r, 1000));
    chatInput.value = step.text;
    await handleSend();
    if (step.action) step.action();
    await new Promise(r => setTimeout(r, step.delay));
  }
}

export function resetChat() {
  responseEngine.resetConversation();
  if (chatMessagesEl) { chatMessagesEl.innerHTML = ''; showWelcomeMessage(); }
}

export function sendProgrammaticMessage(message) {
  if (chatInputEl) { chatInputEl.value = message; handleSend(); }
}
