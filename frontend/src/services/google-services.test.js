import { describe, it, expect } from 'vitest';
import { 
  createCalendarLink, 
  getAllCalendarLinks, 
  getPollingStationMapUrl, 
  getMapEmbedUrl, 
  getElectionSearchUrl 
} from './google-services.js';

describe('google-services', () => {
  describe('createCalendarLink', () => {
    it('should generate a valid Google Calendar template link', () => {
      const url = createCalendarLink('Test Election', 'October 15, 2024', 'Test desc');
      expect(url).toContain('https://calendar.google.com/calendar/render');
      expect(url).toContain('action=TEMPLATE');
      expect(url).toContain('text=%F0%9F%97%B3%EF%B8%8F+Test+Election');
      expect(url).toContain('dates=20241015%2F20241015');
      expect(url).toContain('details=Test+desc');
    });

    it('should default to Nov 5, 2024 if date is unknown', () => {
      const url = createCalendarLink('Unknown Date Election', 'Unknown Date', '');
      expect(url).toContain('dates=20241105%2F20241105');
    });
  });

  describe('getPollingStationMapUrl', () => {
    it('should generate a map search url based on address', () => {
      const url = getPollingStationMapUrl('123 Main St');
      expect(url).toBe('https://www.google.com/maps/search/123%20Main%20St');
    });

    it('should fallback to default query if address is empty', () => {
      const url = getPollingStationMapUrl('');
      expect(url).toBe('https://www.google.com/maps/search/polling%20station%20near%20me');
    });
  });

  describe('getMapEmbedUrl', () => {
    it('should generate a valid embed url', () => {
      const url = getMapEmbedUrl('library');
      expect(url).toBe('https://maps.google.com/maps?q=library&output=embed&z=14');
    });
  });

  describe('getElectionSearchUrl', () => {
    it('should append election info to the query', () => {
      const url = getElectionSearchUrl('California');
      expect(url).toBe('https://www.google.com/search?q=California%20election%20info');
    });
  });
});
