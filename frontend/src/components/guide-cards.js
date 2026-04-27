/* ==========================================
   CivicAlly — Guide Cards Component
   Election Readiness Guide with step cards
   ========================================== */

import { guideSteps } from '../ai/knowledge-base.js';

/**
 * Render the Guide view
 */
export function renderGuideView(container, onNavigateToChat) {
  container.innerHTML = `
    <div class="guide-view view-transition-enter">

      <div class="view-header fade-in-up fade-in-up-1">
        <h1>Voting Help Guide</h1>
        <p>Voting is easier when you're ready. Follow these 6 steps to make sure your vote counts.</p>
      </div>

      <!-- Step Cards Grid -->
      <div class="steps-grid stagger-children" id="guide-steps-grid">
        ${guideSteps.map(step => `
          <div class="step-card clickable-card" data-step="${step.step}" data-action="${step.title}" style="cursor: pointer;">
            <div class="step-icon ${step.iconClass}">${step.icon}</div>
            <div class="step-label">
              ${step.step}
              ${step.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
            </div>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            <div class="step-action" data-action="${step.title}">
              <span>${step.action}</span>
              <span>${step.actionIcon}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Final Step Card -->
      <div class="final-step-card fade-in-up fade-in-up-6">
        <div class="final-icon">🗳️</div>
        <div class="final-content">
          <div class="final-label">FINAL STEP 06</div>
          <h3>Cast Your Vote</h3>
          <p>Whether early, by mail, or on Election Day, ensure your ballot is submitted. Join the millions of citizens shaping the future of the nation.</p>
        </div>
        <button class="btn-voted" id="btn-i-voted">I VOTED</button>
      </div>

      <!-- CTA Section -->
      <div class="guide-cta fade-in-up">
        <div class="cta-content">
          <h2>Still have questions?</h2>
          <p>Our AI helper knows all the voting rules and can give you quick answers.</p>
          <div class="cta-buttons">
            <button class="btn-primary" id="guide-ask-assistant">Ask Assistant</button>
            <button class="btn-secondary" id="guide-browse-help">Browse Help Center</button>
          </div>
        </div>
      </div>

    </div>
  `;


  // Bind entire step card clicks
  container.querySelectorAll('.step-card.clickable-card').forEach(card => {
    card.addEventListener('click', () => {
      const stepTitle = card.dataset.action;
      if (onNavigateToChat) {
        onNavigateToChat(`How do I ${stepTitle.toLowerCase()}?`);
      }
    });
  });

  // Bind "Ask Assistant" button
  const askBtn = document.getElementById('guide-ask-assistant');
  if (askBtn && onNavigateToChat) {
    askBtn.addEventListener('click', () => onNavigateToChat('Help me prepare to vote'));
  }

  // Bind "Browse Help Center"
  const helpBtn = document.getElementById('guide-browse-help');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      // Navigate to FAQ view
      document.querySelector('[data-view="faq"]')?.click();
    });
  }

  // "I VOTED" button animation
  const votedBtn = document.getElementById('btn-i-voted');
  if (votedBtn) {
    votedBtn.addEventListener('click', () => {
      votedBtn.textContent = '🎉 Thank You!';
      votedBtn.style.background = 'rgba(16, 185, 129, 0.2)';
      votedBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      votedBtn.style.color = 'var(--accent-success)';
    });
  }
}
