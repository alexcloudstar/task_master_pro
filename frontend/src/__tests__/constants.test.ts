import { describe, it, expect } from 'vitest';
import { routes } from '../lib/constants';
import { validate as uuidValidate } from 'uuid';

describe('constants.ts', () => {
  describe('routes', () => {
    it('should have three routes', () => {
      expect(routes).toHaveLength(3);
    });

    it('each route should have an id, to, label, and Icon', () => {
      routes.forEach((route) => {
        expect(route).toHaveProperty('id');
        expect(route).toHaveProperty('to');
        expect(route).toHaveProperty('label');
        expect(route).toHaveProperty('Icon');
      });
    });

    it('each route id should be a valid UUID', () => {
      routes.forEach((route) => {
        expect(uuidValidate(route.id)).toBe(true);
      });
    });
  });
});
