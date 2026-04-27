/* ==========================================
   Vote Pilot — Google Services Integration
   Calendar links, Maps, Translate helpers
   ========================================== */

import { electionDates } from '../ai/knowledge-base.js';

/**
 * Generate a Google Calendar event URL for an election date
 */
export function createCalendarLink(title, dateStr, description = '') {
  // Parse date string into a date (approximate)
  const dateMap = {
    'October 10, 2024': '20241010',
    'October 15, 2024': '20241015',
    'October 21, 2024': '20241021',
    'November 5, 2024': '20241105',
    'November 6-10, 2024': '20241106'
  };

  const startDate = dateMap[dateStr] || '20241105';
  const endDate = startDate; // All-day event

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🗳️ ${title}`,
    dates: `${startDate}/${endDate}`,
    details: description || `Election reminder from Vote Pilot: ${title}. Make sure you're prepared!`,
    sf: 'true'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Google Calendar links for all election dates
 */
export function getAllCalendarLinks() {
  return Object.values(electionDates).map(d => ({
    label: d.label,
    date: d.date,
    calendarUrl: createCalendarLink(d.label, d.date, `Reminder: ${d.label} — ${d.date}. Stay informed with Vote Pilot.`)
  }));
}

/**
 * Generate a Google Maps search URL for polling stations
 */
export function getPollingStationMapUrl(address = '') {
  const query = address || 'polling station near me';
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

/**
 * Generate a Google Maps embed URL for the info panel
 */
export function getMapEmbedUrl(query = 'polling station near me') {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=14`;
}

/**
 * Create a Google Search link for election info
 */
export function getElectionSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query + ' election info')}`;
}

/**
 * Render the Add to Calendar buttons as HTML
 */
export function renderCalendarButtons() {
  const links = getAllCalendarLinks();
  return links.map(link => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md); background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
      <div>
        <div style="font-size: var(--font-xs); font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.08em;">${link.label}</div>
        <div style="font-size: var(--font-sm); color: var(--text-primary); font-weight: 600;">${link.date}</div>
      </div>
      <a href="${link.calendarUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; background: rgba(0, 229, 255, 0.1); border: 1px solid var(--border-accent); border-radius: var(--radius-full); font-size: var(--font-xs); font-weight: 600; color: var(--accent-primary); text-decoration: none; white-space: nowrap; transition: all 0.25s ease;" onmouseover="this.style.background='rgba(0,229,255,0.2)'" onmouseout="this.style.background='rgba(0,229,255,0.1)'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Add to Calendar
      </a>
    </div>
  `).join('');
}

/**
 * Initialize or re-initialize Google Translate widget safely
 */
export function initGoogleTranslate() {
  const elementId = 'google_translate_element';
  const container = document.getElementById(elementId);

  if (!container) return;

  // If already has content, Google might have already init it
  if (container.innerHTML.trim() !== '' && window.google?.translate?.TranslateElement) {
    return;
  }

  if (window.google && window.google.translate) {
    try {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,hi,bn,te,mr,ta,gu,kn,ml,pa,ur,as,or,sd,sa', // Focusing on Indian languages
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, elementId);
    } catch (e) {
      console.warn('Google Translate init failed:', e);
    }
  }
}

// Make it globally accessible for the script callback
window.initGoogleTranslate = initGoogleTranslate;
window.addEventListener('load', () => {
  if (window._googleTranslateReady) {
    initGoogleTranslate();
  }
});
