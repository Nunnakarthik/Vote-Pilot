/* ==========================================
   Vote Pilot — Smart Journey Component
   Guided wizard for voter readiness
   ========================================== */

import { sendProgrammaticMessage } from './chat.js';

let journeyState = {
  step: 'start',
  data: {}
};

const steps = {
  start: {
    question: "Welcome to your <strong>Guided Voting Journey</strong>! Let's get you ready to cast your ballot. Where should we start?",
    options: [
      { id: 'eligibility', label: 'Step 1: Check Eligibility', next: 'age' },
      { id: 'registration', label: 'Step 2: Voter Registration', next: 'id_check' },
      { id: 'voting', label: 'Step 3: Voting Process', next: 'voting_flow' }
    ]
  },
  age: {
    question: "<strong>Step 1: Eligibility</strong><br/>Are you 18 years or older (or will be by Election Day)?",
    options: [
      { id: 'yes', label: 'Yes', next: 'citizenship' },
      { id: 'no', label: 'No, not yet', next: 'not_eligible' }
    ]
  },
  citizenship: {
    question: "<strong>Step 1: Eligibility</strong><br/>Are you a citizen of India?",
    options: [
      { id: 'yes', label: 'Yes', next: 'id_check' },
      { id: 'no', label: 'No', next: 'not_eligible' }
    ]
  },
  id_check: {
    question: "<strong>Step 2: Registration</strong><br/>Do you have a valid Voter ID (EPIC Card)?",
    options: [
      { id: 'yes', label: 'Yes, I have it', next: 'verify_status' },
      { id: 'no', label: 'No, I need one', next: 'apply_id' }
    ]
  },
  voting_flow: {
    question: "<strong>Step 3: Voting Process</strong><br/>How do you plan to vote?",
    options: [
      { id: 'in_person', label: 'In-person at Polling Booth', next: 'success', action: 'view_map' },
      { id: 'postal', label: 'Postal Ballot (if eligible)', next: 'success', action: 'view_docs' }
    ]
  },
  verify_status: {
    question: "Great! Have you verified your name in the official Voter List recently?",
    options: [
      { id: 'yes', label: 'Yes, I am there', next: 'success' },
      { id: 'no', label: 'No, how do I check?', next: 'check_list' }
    ]
  },
  apply_id: {
    question: "You'll need to apply for Form 6. Would you like the direct link and step-by-step guide?",
    options: [
      { id: 'yes', label: 'Yes, show me', next: 'success', action: 'guide_reg' },
      { id: 'later', label: 'Maybe later', next: 'start' }
    ]
  },
  check_list: {
    question: "You can check on the Voter Helpline app or NVSP portal. Want me to explain how?",
    options: [
      { id: 'yes', label: 'Explain steps', next: 'success', action: 'guide_verify' },
      { id: 'no', label: 'I will find it', next: 'success' }
    ]
  },
  success: {
    question: "You're on the right track! What would you like to explore next?",
    options: [
      { id: 'timeline', label: '📅 View Timeline', action: 'view_timeline' },
      { id: 'polling', label: '📍 Find Polling Station', action: 'view_map' },
      { id: 'docs', label: '📋 Required Documents', action: 'view_docs' }
    ]
  },
  not_eligible: {
    question: "It seems you might not be eligible to vote just yet. But you can still be a civic leader! Would you like to learn how to help others vote?",
    options: [
      { id: 'yes', label: 'Yes, tell me', action: 'guide_help' },
      { id: 'restart', label: 'Restart Journey', next: 'start' }
    ]
  }
};

export function renderSmartJourney(containerEl) {
  journeyState = { step: 'start', data: {} };
  renderStep(containerEl);
}

function renderStep(containerEl) {
  const stepConfig = steps[journeyState.step];
  
  containerEl.innerHTML = `
    <div class="smart-journey-card fade-in">
      <div class="journey-header">
        <span class="journey-badge">SMART JOURNEY</span>
        <div class="journey-progress">
          <div class="journey-progress-bar" style="width: ${getProgress()}%"></div>
        </div>
      </div>
      <div class="journey-content">
        <h3 class="journey-question">${stepConfig.question}</h3>
        <div class="journey-options">
          ${stepConfig.options.map(opt => `
            <button class="btn-journey-opt" data-next="${opt.next || ''}" data-action="${opt.action || ''}" data-id="${opt.id}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="journey-footer">
        <button class="btn-journey-reset" id="btn-journey-reset">Restart</button>
      </div>
    </div>
  `;

  containerEl.querySelectorAll('.btn-journey-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = btn.dataset.next;
      const action = btn.dataset.action;

      if (action) {
        handleAction(action);
      }

      if (nextStep) {
        journeyState.step = nextStep;
        renderStep(containerEl);
      }
    });
  });

  containerEl.querySelector('#btn-journey-reset').addEventListener('click', () => {
    journeyState.step = 'start';
    renderStep(containerEl);
  });
}

function getProgress() {
  const stepMap = { start: 10, age: 30, citizenship: 50, id_check: 70, verify_status: 85, success: 100 };
  return stepMap[journeyState.step] || 50;
}

function handleAction(action) {
  switch (action) {
    case 'guide_reg': sendProgrammaticMessage("How do I apply for a new voter ID?"); break;
    case 'guide_verify': sendProgrammaticMessage("How do I check my name in the electoral roll?"); break;
    case 'view_timeline': document.getElementById('nav-timeline')?.click(); break;
    case 'view_map': sendProgrammaticMessage("Where is my polling station?"); break;
    case 'view_docs': sendProgrammaticMessage("What documents are required for voting?"); break;
    case 'guide_help': sendProgrammaticMessage("How can I help others in the election process?"); break;
  }
}
