/* ==========================================
   CivicAlly — FAQ Component
   Searchable FAQ with accordion, categories
   ========================================== */

import { faqData } from '../ai/knowledge-base.js';

/**
 * Render the FAQ view
 */
export function renderFaqView(container, onNavigateToChat) {
  container.innerHTML = `
    <div class="faq-view view-transition-enter">
      <!-- Header -->
      <div class="faq-header fade-in-up">
        <h1>How can we help you?</h1>
        <p>Find clear answers to common questions about the voting process.</p>
      </div>

      <!-- Search -->
      <div class="faq-search fade-in-up fade-in-up-1">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="faq-search-input" placeholder="Search for questions, keywords, or topics..." />
      </div>

      <!-- Categories -->
      <div class="faq-categories stagger-children">
        <div class="faq-category" data-cat="voting">
          <div class="cat-icon">🗳️</div>
          <h3>Voting Info</h3>
          <p>Eligibility, locations, and deadlines.</p>
        </div>
        <div class="faq-category" data-cat="legislation">
          <div class="cat-icon">📜</div>
          <h3>Legislation</h3>
          <p>Understanding bills and proposals.</p>
        </div>
        <div class="faq-category" data-cat="privacy">
          <div class="cat-icon">🔒</div>
          <h3>Privacy & Security</h3>
          <p>Data handling and user protection.</p>
        </div>
      </div>

      <!-- FAQ Accordion -->
      <div class="faq-accordion stagger-children" id="faq-accordion">
        ${faqData.map((faq, i) => `
          <div class="faq-item" data-category="${faq.category}" data-index="${i}">
            <div class="faq-question" data-index="${i}">
              <span>${faq.question}</span>
              <svg aria-hidden="true" class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="faq-answer">
              <p>${faq.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- CTA -->
      <div class="faq-cta fade-in-up">
        <div class="cta-icon">💬</div>
        <h2>Can't find what you need?</h2>
        <p>Our AI helper is ready to answer your specific questions about voting 24/7.</p>
        <button class="btn-cta" id="faq-start-chat">Ask a Question →</button>
      </div>

    </div>
  `;

  // Bind accordion
  container.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const index = question.dataset.index;
      const item = container.querySelector(`.faq-item[data-index="${index}"]`);

      // Close others
      container.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) openItem.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open');
    });
  });

  // Open first item by default
  const firstItem = container.querySelector('.faq-item');
  if (firstItem) firstItem.classList.add('open');

  // Bind search
  const searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      container.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        const match = question.includes(query) || answer.includes(query);
        item.style.display = match ? '' : 'none';
      });
    });
  }

  // Bind category clicks
  container.querySelectorAll('.faq-category').forEach(cat => {
    cat.addEventListener('click', () => {
      const category = cat.dataset.cat;
      container.querySelectorAll('.faq-item').forEach(item => {
        item.style.display = item.dataset.category === category ? '' : 'none';
      });
      // Scroll to accordion
      document.getElementById('faq-accordion')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Bind CTA
  const chatBtn = document.getElementById('faq-start-chat');
  if (chatBtn && onNavigateToChat) {
    chatBtn.addEventListener('click', () => onNavigateToChat('I have a question about voting...'));
  }
}
