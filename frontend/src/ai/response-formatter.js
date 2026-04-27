/* ==========================================
   CivicAlly — Response Formatter
   Converts structured data → rich HTML
   ========================================== */

/**
 * Format a list of steps into styled HTML
 */
export function formatSteps(steps) {
  const items = steps.map((s, i) => `
    <div class="step-item">
      <div class="step-number">${i + 1}</div>
      <div class="step-text">
        <strong>${s.label}</strong>
        <span>${s.desc}</span>
      </div>
    </div>
  `).join('');

  return `<div class="step-list">${items}</div>`;
}

/**
 * Format date cards
 */
export function formatDateCards(dates) {
  const cards = dates.map(d => `
    <div class="date-card">
      <div class="date-label">${d.label}</div>
      <div class="date-value">${d.date}</div>
    </div>
  `).join('');

  return `<div class="date-cards">${cards}</div>`;
}

/**
 * Format a tip box
 */
export function formatTip(text) {
  return `
    <div class="tip-box">
      <span class="tip-icon">💡</span>
      <span>${text}</span>
    </div>
  `;
}

/**
 * Format a warning box
 */
export function formatWarning(text) {
  return `
    <div class="warning-box">
      <span class="tip-icon">⚠️</span>
      <span>${text}</span>
    </div>
  `;
}

/**
 * Format a bullet list
 */
export function formatList(items) {
  const lis = items.map(item => `<li>${item}</li>`).join('');
  return `<ul class="info-list">${lis}</ul>`;
}

/**
 * Format a mini timeline
 */
export function formatMiniTimeline(items) {
  const nodes = items.map((item, i) => `
    <div class="mini-timeline-item">
      <div class="mini-timeline-dot ${item.active ? '' : 'inactive'}"></div>
      <div class="mini-timeline-text">
        <strong>${item.label}</strong>
        <span>${item.date || ''}</span>
      </div>
    </div>
  `).join('');

  return `<div class="mini-timeline">${nodes}</div>`;
}

/**
 * Format suggestion chips
 */
export function formatSuggestions(suggestions) {
  const chips = suggestions.map(s => `
    <button class="suggestion-chip" data-query="${s}">${s}</button>
  `).join('');

  return `<div class="suggestion-chips">${chips}</div>`;
}

/**
 * Format a note
 */
export function formatNote(text) {
  return `<p class="note-text">${text}</p>`;
}

/**
 * Format a section heading
 */
export function formatHeading(emoji, text) {
  return `<h3>${emoji} ${text}</h3>`;
}

/**
 * Format voting methods
 */
export function formatVotingMethods(methods) {
  const items = methods.map(m => `
    <div class="step-item">
      <div class="step-number">•</div>
      <div class="step-text">
        <strong>${m.method}</strong>
        <span>${m.desc}</span>
      </div>
    </div>
  `).join('');

  return `<div class="step-list">${items}</div>`;
}

/**
 * Format a misinformation correction
 */
export function formatCorrection(claim, correction, source) {
  return `
    <div class="warning-box">
      <span class="tip-icon">🔍</span>
      <span><strong>Fact Check:</strong> ${correction}</span>
    </div>
    ${formatNote(`Source: ${source}`)}
  `;
}
