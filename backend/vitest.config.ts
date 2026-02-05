import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRES_IN: '7d',
      NODE_ENV: 'test',
    },
  },
});
