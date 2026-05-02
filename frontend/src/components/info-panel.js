/* ==========================================
   Vote Pilot — Info Panel Component
   Google Maps, Calendar, Translate integrated
   ========================================== */

import { civicTips } from '../ai/knowledge-base.js';
import { renderCalendarButtons, getPollingStationMapUrl, initGoogleTranslate } from '../services/google-services.js';

export function renderHomeInfoPanel(panelEl) {
  const currentTip = civicTips[Math.floor(Math.random() * civicTips.length)];

  panelEl.innerHTML = `
    <!-- Voter Journey Tracker -->
    <div class="info-card status-card fade-in-up">
      <div class="card-header">
        <span class="card-title">My Voting Steps</span>
        <span class="status-badge active">Good to go</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 50%"></div>
      </div>
      <div class="status-checks">
        <div class="status-check">
          <div class="check-icon success pulse-glow">✓</div>
          <div class="check-label">
            <strong>Registered</strong>
            <span>ID connected</span>
          </div>
        </div>
        <div class="status-check">
          <div class="check-icon success pulse-glow">✓</div>
          <div class="check-label">
            <strong>Verified</strong>
            <span>Checking the voter list</span>
          </div>
        </div>
        <div class="status-check">
          <div class="check-icon pending"></div>
          <div class="check-label">
            <span style="color:var(--text-muted)">Voted</span>
            <span style="font-size:0.65rem">Election Day 2024</span>
          </div>
        </div>
        <div class="status-check">
          <div class="check-icon pending"></div>
          <div class="check-label">
            <span style="color:var(--text-muted)">Results</span>
            <span style="font-size:0.65rem">Counting Phase</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-card checklist-card fade-in-up fade-in-up-2">
      <div class="card-title">THINGS TO DO</div>
      <div class="checklist-items">
        <div class="checklist-item">
          <div class="checklist-checkbox checked" data-check="0"></div>
          <div class="checklist-text"><strong>Your voting place</strong><span>Based on where you live</span></div>
        </div>
        <div class="checklist-item">
          <div class="checklist-checkbox" data-check="1"></div>
          <div class="checklist-text"><strong>See who to vote for</strong><span>List available soon</span></div>
        </div>
        <div class="checklist-item">
          <div class="checklist-checkbox" data-check="2"></div>
          <div class="checklist-text"><strong>Show your ID</strong><span>ID card or bill</span></div>
        </div>
      </div>
      <button class="btn-full-guide" id="btn-full-guide-panel">FULL GUIDE</button>
    </div>

    <!-- Google Calendar — Key Dates -->
    <div class="info-card fade-in-up fade-in-up-3" style="border-color: rgba(0,229,255,0.15);">
      <div class="card-title" style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-base);">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>KEY DATES</span>
        <span style="font-size:0.55rem;color:var(--accent-primary);margin-left:auto;">Google Calendar</span>
      </div>
      ${renderCalendarButtons()}
    </div>

    <div class="info-card tip-card fade-in-up fade-in-up-4">
      <div class="tip-header"><span class="tip-emoji">💡</span><span>VOTING TIP</span></div>
      <p>${currentTip}</p>
    </div>

    <!-- Google Maps — Polling Station -->
    <div class="info-card polling-card fade-in-up fade-in-up-5" style="padding:0;overflow:hidden;">
      <div style="padding:var(--space-base) var(--space-lg);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="polling-name" style="text-align:left;font-size:var(--font-sm);">Where you vote</div>
            <div class="polling-distance" style="text-align:left;">📍 2.4 miles away</div>
          </div>
          <a href="${getPollingStationMapUrl()}" target="_blank" rel="noopener"
            style="font-size:var(--font-xs);color:var(--accent-primary);text-decoration:none;display:flex;align-items:center;gap:4px;">
            Open in Google Maps
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
      <iframe
        src="https://maps.google.com/maps?q=polling+station+near+me&output=embed&z=13"
        style="width:100%;height:120px;border:0;border-top:1px solid var(--border-subtle);filter:invert(90%) hue-rotate(180deg);"
        loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"
        title="Google Maps - Polling Station"></iframe>
    </div>

    <!-- Google Translate -->
    <div class="info-card fade-in-up fade-in-up-6" style="padding:var(--space-base) var(--space-lg);">
      <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm);">
        <span style="font-size:1rem;">🌐</span>
        <span style="font-size:var(--font-xs);font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:0.08em;">Language</span>
      </div>
      <div id="google_translate_element"></div>
    </div>
  `;

  // Bind checklist
  panelEl.querySelectorAll('.checklist-checkbox').forEach(cb => {
    cb.addEventListener('click', () => { cb.classList.toggle('checked'); updateProgress(panelEl); });
  });

  const guideBtn = document.getElementById('btn-full-guide-panel');
  if (guideBtn) guideBtn.addEventListener('click', () => document.querySelector('[data-view="guide"]')?.click());

  // Init Google Translate
  initGoogleTranslate();
}

export function renderTimelineInfoPanel(panelEl) {
  panelEl.innerHTML = `
    <div class="info-card checklist-card fade-in-up">
      <div class="card-title" style="display:flex;align-items:center;gap:var(--space-sm);">
        <span style="color:var(--accent-success);">✅</span> Your Checklist
      </div>
      <div class="checklist-items">
        <div class="checklist-item"><div class="checklist-checkbox checked"></div><div class="checklist-text"><strong>Verify Voter Status</strong><span>Completed on Aug 12</span></div></div>
        <div class="checklist-item"><div class="checklist-checkbox"></div><div class="checklist-text"><strong>Review Local Ballot</strong><span>Available Oct 1</span></div></div>
        <div class="checklist-item"><div class="checklist-checkbox"></div><div class="checklist-text"><strong>Locate Polling Station</strong><span>Map view available</span></div></div>
      </div>
    </div>
  `;
  panelEl.querySelectorAll('.checklist-checkbox').forEach(cb => {
    cb.addEventListener('click', () => cb.classList.toggle('checked'));
  });
}

export function renderEmptyInfoPanel(panelEl) { panelEl.innerHTML = ''; }

function updateProgress(panelEl) {
  const checkboxes = panelEl.querySelectorAll('.checklist-checkbox');
  const checked = panelEl.querySelectorAll('.checklist-checkbox.checked');
  const total = 2 + checkboxes.length;
  const completed = 2 + checked.length;
  const percent = Math.round((completed / total) * 100);
  const progressFill = panelEl.querySelector('.progress-fill');
  const statusDesc = panelEl.querySelector('.status-desc');
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (statusDesc) statusDesc.innerHTML = `Your profile is <strong>${percent}% complete</strong> for the 2024 Election cycle.`;
}
