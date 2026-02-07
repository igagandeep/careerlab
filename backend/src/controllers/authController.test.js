import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  login,
  register,
  verifyEmail,
  resetPassword,
} from './authController.js';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('../config/db.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    genSalt: vi.fn(),
    hash: vi.fn(),
  },
}));
vi.mock('../utils/generateToken.js', () => ({
  generateToken: vi.fn(() => 'fake-jwt-token'),
}));

vi.mock('../utils/generateOTP.js', () => ({
  generateOTP: vi.fn(() => '123456'),
}));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'email-id' }),
    },
  })),
}));

// Import mocked modules
import { prisma } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';

describe('login', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock request object
    mockReq = {
      body: {
        email: 'user@example.com',
        password: 'password123',
      },
    };

    // Mock response object
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    };
  });

  it('should login successfully with valid credentials', async () => {
    // Mock user in database
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed-password',
      isVerified: true,
    });

    // Mock bcrypt password comparison
    bcrypt.compare.mockResolvedValue(true);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        user: {
          id: 1,
          email: 'user@example.com',
        },
        token: 'fake-jwt-token',
      },
    });
  });

  it('should fail with invalid email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid email or password',
    });
  });

  it('should fail with invalid password', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed-password',
      isVerified: true,
    });

    bcrypt.compare.mockResolvedValue(false);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid email or password',
    });
  });

  it('should fail if email not verified', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed-password',
      isVerified: false,
    });

    bcrypt.compare.mockResolvedValue(true);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error:
        'Please verify your email before logging in. Check your inbox for verification code.',
      requiresVerification: true,
      email: 'user@example.com',
    });
  });
});

describe('register', () => {
  it('should register a new user successfully', async () => {
    const mockReq = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-password');

    prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: false,
    });

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: expect.stringContaining('registered successfully'),
        data: expect.objectContaining({
          otpSent: true,
        }),
      })
    );
  });

  it('should fail if user already exists', async () => {
    const mockReq = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'john@example.com',
    });

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User already exists with this email',
    });
  });
});

describe('verifyEmail', () => {
  it('should verify email successfully', async () => {
    const mockReq = {
      body: {
        email: 'john@example.com',
        otp: '123456',
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: false,
      verificationToken: '123456',
      tokenExpiry: futureDate,
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: true,
    });

    await verifyEmail(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Email verified successfully',
      })
    );
  });

  it('should fail with invalid OTP', async () => {
    const mockReq = {
      body: {
        email: 'john@example.com',
        otp: 'wrong-otp',
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'john@example.com',
      isVerified: false,
      verificationToken: '123456',
    });

    await verifyEmail(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid verification code',
    });
  });

  it('should fail if OTP expired', async () => {
    const mockReq = {
      body: {
        email: 'john@example.com',
        otp: '123456',
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const expiredDate = new Date(Date.now() - 1000); // 1 second ago

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'john@example.com',
      isVerified: false,
      verificationToken: '123456',
      tokenExpiry: expiredDate,
    });

    await verifyEmail(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Verification code has expired',
    });
  });
});

describe('resetPassword', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      body: {
        email: 'user@example.com',
        otp: '123456',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should reset password successfully with valid data', async () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: futureDate,
    });

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-new-password');

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    await resetPassword(mockReq, mockRes);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: {
        password: 'hashed-new-password',
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Password reset successfully',
      data: {
        user: {
          id: 1,
          email: 'user@example.com',
        },
      },
    });
  });

  it('should fail when required fields are missing', async () => {
    mockReq.body = {
      email: 'user@example.com',
      // Missing otp, newPassword, confirmPassword
    };

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'All fields are required',
    });
  });

  it('should fail when passwords do not match', async () => {
    mockReq.body.confirmPassword = 'differentPassword';

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Passwords do not match',
    });
  });

  it('should fail when user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  it('should fail with invalid reset code', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: 'different-token',
      tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid reset code',
    });
  });

  it('should fail when reset code has expired', async () => {
    const expiredDate = new Date(Date.now() - 1000); // 1 second ago

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: expiredDate,
    });

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Reset code has expired',
    });
  });

  it('should handle server errors gracefully', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Server error during password reset',
    });
  });

  it('should handle bcrypt errors gracefully', async () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: futureDate,
    });

    bcrypt.genSalt.mockRejectedValue(new Error('Bcrypt error'));

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Server error during password reset',
    });
  });

  it('should handle database update errors gracefully', async () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: futureDate,
    });

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-new-password');
    prisma.user.update.mockRejectedValue(new Error('Update failed'));

    await resetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Server error during password reset',
    });
  });

  it('should clear verification token and expiry after successful reset', async () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: futureDate,
    });

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-new-password');

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    await resetPassword(mockReq, mockRes);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: {
        password: 'hashed-new-password',
        verificationToken: null,
        tokenExpiry: null,
      },
    });
  });
});
