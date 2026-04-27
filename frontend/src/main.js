/* ==========================================
   Vote Pilot — Main Application
   Auth-gated, routing, event binding
   ========================================== */

import { showAuthPage, getCurrentUser, logoutUser } from './components/auth.js';
import './firebase.js';
import { renderChatView, resetChat, sendProgrammaticMessage } from './components/chat.js';
import { renderTimelineView } from './components/timeline.js';
import { renderGuideView } from './components/guide-cards.js';
import { renderFaqView } from './components/faq.js';
import { renderHomeInfoPanel, renderTimelineInfoPanel, renderEmptyInfoPanel } from './components/info-panel.js';

let currentView = 'home';
let currentUser = null;

const viewContainer = document.getElementById('view-container');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');
const searchInput = document.getElementById('search-input');
const newChatBtn = document.getElementById('new-chat-btn');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');

const viewConfig = {
  home: {
    title: 'VOTE PILOT', subtitle: 'YOUR ELECTION HELPER', searchPlaceholder: 'Search for info...',
    render: () => { renderChatView(viewContainer); }
  },
  timeline: {
    title: 'VOTE PILOT', subtitle: 'Election Dates 2024', searchPlaceholder: 'Search dates...',
    render: () => { renderTimelineView(viewContainer); }
  },
  guide: {
    title: 'VOTE PILOT', subtitle: 'How to Vote', searchPlaceholder: 'Search guides...',
    render: () => { renderGuideView(viewContainer, navigateToChatWithMessage); }
  },
  faq: {
    title: 'VOTE PILOT', subtitle: 'Common Questions', searchPlaceholder: 'Search questions...',
    render: () => { renderFaqView(viewContainer, navigateToChatWithMessage); }
  }
};

/**
 * Navigates to a specific view in the application
 * @param {string} view - The view ID to navigate to (home, timeline, guide, faq)
 */
function navigateTo(view) {
  if (!viewConfig[view]) return;
  currentView = view;
  const config = viewConfig[view];

  headerTitle.textContent = config.title;
  headerSubtitle.textContent = config.subtitle;
  headerSubtitle.style.display = config.subtitle ? '' : 'none';
  if (searchInput) searchInput.placeholder = config.searchPlaceholder;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });

  config.render();
  sidebar?.classList.remove('open');
}

/**
 * Navigates to the chat view and automatically sends a message
 * @param {string} message - The message to send
 */
function navigateToChatWithMessage(message) {
  navigateTo('home');
  setTimeout(() => sendProgrammaticMessage(message), 300);
}

function updateUserDisplay(user) {
  if (!user) return;
  const nameEl = document.querySelector('.user-name');
  const roleEl = document.querySelector('.user-role');
  if (nameEl) nameEl.textContent = user.name || 'Voter';
  if (roleEl) roleEl.textContent = user.state || 'Member';
}

function initEventListeners() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); navigateTo(item.dataset.view); });
  });

  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      currentView !== 'home' ? navigateTo('home') : resetChat();
    });
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => sidebar?.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  document.getElementById('logo-btn')?.addEventListener('click', () => navigateTo('home'));

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    if (confirm('Sign out of Vote Pilot?')) {
      logoutUser();
      location.reload();
    }
  });

  // Search Bar logic
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        const query = searchInput.value.trim();
        searchInput.value = '';
        navigateToChatWithMessage(query);
      }
    });
  }

  // Notifications logic
  const notificationsBtn = document.getElementById('notifications-btn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', () => {
      alert('You are all caught up! No new notifications.');
    });
  }

  // Share logic
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Vote Pilot',
          text: 'Check out Vote Pilot for easy election info!',
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput?.focus(); }
  });
}

/**
 * Verifies connectivity with the backend services
 * @returns {Promise<boolean>}
 */
async function checkBackendHealth() {
  try {
    const response = await fetch('http://localhost:8000/health', { method: 'GET' });
    if (response.ok) {
      console.log('✅ Backend services are online and responding.');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ Backend service appears to be offline. Local fallback enabled.');
  }
  return false;
}

async function init() {
  // Auth gate
  currentUser = await showAuthPage();
  updateUserDisplay(currentUser);

  // Show main app
  document.getElementById('app').style.visibility = 'visible';
  document.getElementById('app').style.opacity = '1';

  initEventListeners();
  navigateTo('home');
  document.getElementById('app')?.classList.add('app-loaded');

  // Diagnostics
  checkBackendHealth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
