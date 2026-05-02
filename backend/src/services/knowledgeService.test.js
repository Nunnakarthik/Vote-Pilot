import { describe, it, expect } from 'vitest';
import { getKnowledge } from './knowledgeService.js';

describe('knowledgeService', () => {
  it('should return correct data for the "voting" intent', () => {
    const result = getKnowledge('voting');
    expect(result).not.toBeNull();
    expect(result.title).toBe('Voting Process');
    expect(result.steps).toContain('Check eligibility (must be 18+)');
  });

  it('should return correct data for the "registration" intent', () => {
    const result = getKnowledge('registration');
    expect(result).not.toBeNull();
    expect(result.title).toBe('Voter Registration');
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should return correct data for the "documents" intent', () => {
    const result = getKnowledge('documents');
    expect(result).not.toBeNull();
    expect(result.title).toBe('Required Documents');
    expect(result.tip).toBe('Keep both original and copies');
  });

  it('should return correct data for the "timeline" intent', () => {
    const result = getKnowledge('timeline');
    expect(result).not.toBeNull();
    expect(result.title).toBe('Election Timeline');
  });

  it('should return null for an unknown intent', () => {
    const result = getKnowledge('unknown_intent_123');
    expect(result).toBeNull();
  });
});
