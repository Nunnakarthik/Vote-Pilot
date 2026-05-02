import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderTimelineView } from './timeline.js';

describe('Timeline Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the election timeline', () => {
    renderTimelineView(container);
    
    const timelineContainer = container.querySelector('.timeline-container');
    expect(timelineContainer).not.toBeNull();
    
    // Check if phases are rendered
    const phases = container.querySelectorAll('.timeline-phase');
    expect(phases.length).toBeGreaterThan(0);
  });
});
