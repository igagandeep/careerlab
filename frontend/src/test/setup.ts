import { vi } from 'vitest';

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Setup global test environment
global.process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://localhost:5000',
};
