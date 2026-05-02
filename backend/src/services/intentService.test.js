import { describe, it, expect } from 'vitest';
import { detectIntent } from './intentService.js';

describe('intentService', () => {
  it('should detect voting intent with high confidence', () => {
    const result = detectIntent('how do i cast my vote at the booth');
    expect(result.intent).toBe('voting');
    expect(result.confidence).toBeGreaterThan(0.6);
  });

  it('should detect registration intent', () => {
    const result = detectIntent('i need to fill form 6 to sign up');
    expect(result.intent).toBe('registration');
    expect(result.confidence).toBeGreaterThan(0.6);
  });

  it('should default to general intent for unrelated queries', () => {
    const result = detectIntent('tell me a story about a dog');
    expect(result.intent).toBe('general');
    expect(result.confidence).toBeLessThan(0.5);
  });
});
