import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderFaqView } from './faq.js';

describe('faq component', () => {
  let container;

  beforeEach(() => {
    // Setup a simple DOM element
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('should render the FAQ container, header, and search', () => {
    renderFaqView(container, vi.fn());
    
    expect(container.querySelector('.faq-view')).not.toBeNull();
    expect(container.querySelector('.faq-header h1').textContent).toBe('How can we help you?');
    expect(container.querySelector('#faq-search-input')).not.toBeNull();
    expect(container.querySelectorAll('.faq-category').length).toBe(3);
    expect(container.querySelectorAll('.faq-item').length).toBeGreaterThan(0);
  });

  it('should filter items when typing in search box', () => {
    renderFaqView(container, vi.fn());
    
    const searchInput = container.querySelector('#faq-search-input');
    const items = container.querySelectorAll('.faq-item');
    
    // Simulate typing a specific keyword unlikely to match all
    searchInput.value = 'eligibility';
    searchInput.dispatchEvent(new Event('input'));
    
    const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
    expect(visibleItems.length).toBeLessThan(items.length);
    expect(visibleItems.length).toBeGreaterThan(0); // Assuming eligibility is in the data
  });

  it('should toggle accordion open class on click', () => {
    renderFaqView(container, vi.fn());
    
    const firstItem = container.querySelector('.faq-item[data-index="0"]');
    const firstQuestion = firstItem.querySelector('.faq-question');
    
    // First item is open by default
    expect(firstItem.classList.contains('open')).toBe(true);
    
    // Click to close
    firstQuestion.dispatchEvent(new Event('click'));
    expect(firstItem.classList.contains('open')).toBe(false);
    
    // Click to open
    firstQuestion.dispatchEvent(new Event('click'));
    expect(firstItem.classList.contains('open')).toBe(true);
  });
});
