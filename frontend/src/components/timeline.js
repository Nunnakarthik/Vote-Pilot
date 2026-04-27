/* ==========================================
   CivicAlly — Timeline Component
   Visual election timeline with interactive nodes
   ========================================== */

import { electionPhases } from '../ai/knowledge-base.js';

/**
 * Generates a Google Calendar link for an election phase
 * @param {Object} phase - The election phase object
 * @returns {string}
 */
function getGoogleCalendarLink(phase) {
  const title = encodeURIComponent(`Vote Pilot: ${phase.name}`);
  const details = encodeURIComponent(`Reminder for election phase: ${phase.name}. Stay informed with Vote Pilot!`);
  // Simplified date handling for demo purposes (setting to a default hour on the phase date)
  // Real app would parse the 'Oct 15, 2024' string properly
  const dateStr = phase.date.includes('2024') ? '20241105T090000Z/20241105T170000Z' : '20241105T090000Z/20241105T170000Z';
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}`;
}

export function renderTimelineView(container) {
  const activeIndex = electionPhases.findIndex(p => p.status === 'active');
  const progressPercent = ((activeIndex + 0.5) / electionPhases.length) * 100;

  container.innerHTML = `
    <div class="timeline-view view-transition-enter">
      <div class="view-header fade-in-up">
        <h1>Steps to Election Day <span class="live-badge">LIVE UPDATES</span></h1>
        <p>Follow the main dates for the election. Click any circle to see more.</p>
      </div>

      <!-- Horizontal Timeline Track -->
      <div class="timeline-track fade-in-up fade-in-up-2" style="--timeline-progress: ${progressPercent}%">
        ${electionPhases.map((phase, i) => `
          <div class="timeline-node ${phase.status === 'completed' ? 'completed' : ''} ${phase.status === 'active' ? 'active' : ''}" data-phase="${phase.id}">
            <span class="phase-label">${phase.phase}</span>
            <span class="phase-name">${phase.name}</span>
            <div class="node-circle ${phase.status === 'active' ? 'glow-ring' : ''}">${phase.icon}</div>
            <span class="phase-date">${phase.date}</span>
          </div>
        `).join('')}
      </div>

      <!-- Content Area -->
      <div class="timeline-content-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--space-xl);">
        ${renderActiveInsight(electionPhases[activeIndex])}
      </div>

      <!-- Footer -->
      <div class="timeline-footer fade-in-up fade-in-up-5">
        <div class="timeline-legend">
          <div class="legend-item">
            <span class="legend-dot current"></span>
            <span>Where we are now</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot future"></span>
            <span>Future dates</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind node click events
  container.querySelectorAll('.timeline-node').forEach(node => {
    node.addEventListener('click', () => {
      const phaseId = node.dataset.phase;
      const phase = electionPhases.find(p => p.id === phaseId);
      if (phase) {
        const contentArea = container.querySelector('.timeline-content-grid');
        contentArea.innerHTML = renderActiveInsight(phase);
        contentArea.className = 'timeline-content-grid view-transition-enter';
        contentArea.style.display = 'grid';
        contentArea.style.gridTemplateColumns = '1fr';
        contentArea.style.gap = 'var(--space-xl)';
      }
    });
  });
}

/**
 * Render the active insight card for a phase
 */
function renderActiveInsight(phase) {
  if (!phase) return '';

  const details = phase.details;
  const hasMilestone = details.keyMilestone;
  const hasSteps = details.steps;

  let bodyContent = '';

  if (hasMilestone) {
    bodyContent = `
      <div class="milestone-box">
        <div class="milestone-label">MAIN GOAL</div>
        <div class="milestone-text">${details.keyMilestone}</div>
      </div>
      <div class="insight-body">
        <p>${details.body || ''}</p>
      </div>
    `;
  } else if (hasSteps) {
    bodyContent = `
      <div class="insight-body">
        <p style="margin-bottom: var(--space-lg);">${phase.description}</p>
        ${details.steps.map((s, i) => `
          <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md); padding: var(--space-md); background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: var(--bg-primary); flex-shrink: 0;">${i + 1}</div>
            <div>
              <strong style="color: var(--text-primary); font-size: var(--font-sm);">${s.label}</strong>
              <p style="color: var(--text-secondary); font-size: var(--font-xs); margin-top: 2px;">${s.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let tipsContent = '';
  if (details.tips && details.tips.length > 0) {
    tipsContent = `
      <div style="margin-top: var(--space-lg); padding: var(--space-base); background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: var(--radius-md);">
        <div style="font-size: var(--font-xs); font-weight: 700; color: var(--accent-success); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--space-sm);">💡 Tips</div>
        ${details.tips.map(t => `<p style="font-size: var(--font-sm); color: var(--text-secondary); margin-bottom: var(--space-xs);">• ${t}</p>`).join('')}
      </div>
    `;
  }

  return `
    <div class="insight-card fade-in-up fade-in-up-3">
      <div style="display: flex; align-items: flex-start; justify-content: space-between;">
        <div>
          <div class="insight-label">CURRENT INFO</div>
          <h2>${details.title || phase.name}</h2>
        </div>
        <div style="display: flex; gap: var(--space-sm);">
          <a href="${getGoogleCalendarLink(phase)}" target="_blank" class="header-icon-btn" aria-label="Add to Google Calendar" title="Add to Google Calendar" style="display:flex; align-items:center; justify-content:center; text-decoration:none; color:inherit;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </a>
          <button class="header-icon-btn" aria-label="Share"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
        </div>
      </div>
      ${bodyContent}
      ${tipsContent}
      <div class="insight-meta">
      </div>
    </div>
  `;
}
