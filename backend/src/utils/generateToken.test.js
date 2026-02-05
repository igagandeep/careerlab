import { describe, it, expect, vi } from 'vitest';
import { generateToken } from './generateToken.js';

describe('generateToken', () => {
  it('should generate a valid token', () => {
    // Mock the response object
    const mockRes = {
      cookie: vi.fn(),
    };

    // Ensure JWT secret is present for signing during tests
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = generateToken(123, mockRes);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(mockRes.cookie).toHaveBeenCalled();
  });
});
