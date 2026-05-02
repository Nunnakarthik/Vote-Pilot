import { describe, it, expect } from 'vitest';
import { formatLocalResponse } from './formatterService.js';

describe('formatterService', () => {
  it('should format a valid knowledge object correctly', () => {
    const data = {
      title: 'Test Title',
      steps: ['Step 1', 'Step 2'],
      tip: 'This is a test tip.'
    };

    const expected = `### Test Title\n\n1. Step 1\n2. Step 2\n\n**💡 Tip:** This is a test tip.`;
    const result = formatLocalResponse(data);
    expect(result).toBe(expected);
  });

  it('should format correctly without steps', () => {
    const data = {
      title: 'No Steps Title',
      tip: 'Just a tip.'
    };

    const expected = `### No Steps Title\n\n\n\n**💡 Tip:** Just a tip.`;
    const result = formatLocalResponse(data);
    expect(result).toBe(expected);
  });

  it('should format correctly without a tip', () => {
    const data = {
      title: 'No Tip Title',
      steps: ['Only one step']
    };

    const expected = `### No Tip Title\n\n1. Only one step`;
    const result = formatLocalResponse(data);
    expect(result).toBe(expected);
  });

  it('should return a fallback message if data is null or undefined', () => {
    const fallback = "I don't have specific data on that yet, but I can check for you!";
    expect(formatLocalResponse(null)).toBe(fallback);
    expect(formatLocalResponse(undefined)).toBe(fallback);
  });
});
