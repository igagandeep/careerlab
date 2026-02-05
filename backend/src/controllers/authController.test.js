import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  login,
  register,
  verifyEmail,
  resetPassword,
  logout,
  resendOTP,
  forgotPassword,
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
// Create a mock email send function that can be controlled in tests
const mockEmailSend = vi.fn().mockResolvedValue({ id: 'email-id' });

vi.mock('resend', () => ({
  Resend: class Resend {
    constructor() {
      this.emails = {
        send: mockEmailSend,
      };
    }
  },
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    // Mock bcrypt
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

describe('logout', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    };
  });

  it('should clear JWT cookie successfully', async () => {
    await logout(mockReq, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  });

  it('should return success status and message', async () => {
    await logout(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Logged out successfully',
    });
  });

  it('should set cookie expiry to past date (epoch)', async () => {
    await logout(mockReq, mockRes);

    const cookieCall = mockRes.cookie.mock.calls[0];
    expect(cookieCall[2].expires).toEqual(new Date(0));
  });
});

describe('resendOTP', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailSend.mockResolvedValue({ id: 'email-id' }); // Reset to default success

    mockReq = {
      body: {
        email: 'user@example.com',
      },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should resend OTP successfully for unverified user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: false,
      verificationToken: 'old-token',
      tokenExpiry: new Date(Date.now() - 1000),
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await resendOTP(mockReq, mockRes);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: {
        verificationToken: '123456',
        tokenExpiry: expect.any(Date),
      },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'New verification code sent to your email',
      otpSent: true,
    });
  });

  it('should fail when user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await resendOTP(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  it('should fail when email already verified', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: true,
    });

    await resendOTP(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Email already verified',
    });
  });

  it('should generate new OTP and update token expiry', async () => {
    const beforeTime = Date.now();

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: false,
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    await resendOTP(mockReq, mockRes);

    const updateCall = prisma.user.update.mock.calls[0][0];
    const tokenExpiry = updateCall.data.tokenExpiry;

    // Token expiry should be approximately 10 minutes from now
    const expectedExpiry = beforeTime + 10 * 60 * 1000;
    const timeDifference = Math.abs(tokenExpiry.getTime() - expectedExpiry);

    expect(timeDifference).toBeLessThan(1000); // Within 1 second
    expect(updateCall.data.verificationToken).toBe('123456');
  });

  it('should handle email sending failures', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: false,
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    // Mock the email sending to fail for this test
    mockEmailSend.mockRejectedValueOnce(new Error('Email service unavailable'));

    await resendOTP(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Failed to send verification email. Please try again or contact support.',
    });
  });

  it('should handle database errors gracefully', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    await resendOTP(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Database error',
    });
  });

  it('should handle database update errors', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: false,
    });

    prisma.user.update.mockRejectedValue(new Error('Update failed'));

    await resendOTP(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Update failed',
    });
  });
});

describe('forgotPassword', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailSend.mockResolvedValue({ id: 'email-id' }); // Reset to default success

    mockReq = {
      body: {
        email: 'user@example.com',
      },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should send reset code when user exists', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      isVerified: true,
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      verificationToken: '123456',
      tokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await forgotPassword(mockReq, mockRes);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: {
        verificationToken: '123456',
        tokenExpiry: expect.any(Date),
      },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message:
        'If an account exists with this email, a password reset code has been sent.',
      otpSent: true,
    });
  });

  it('should return success even when user does not exist (security best practice)', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await forgotPassword(mockReq, mockRes);

    // Should not attempt to update
    expect(prisma.user.update).not.toHaveBeenCalled();

    // Should still return success to prevent email enumeration
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message:
        'If an account exists with this email, a password reset code has been sent.',
      otpSent: true,
    });
  });

  it('should generate OTP and update user record', async () => {
    const beforeTime = Date.now();

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    await forgotPassword(mockReq, mockRes);

    const updateCall = prisma.user.update.mock.calls[0][0];
    const tokenExpiry = updateCall.data.tokenExpiry;

    // Token expiry should be approximately 10 minutes from now
    const expectedExpiry = beforeTime + 10 * 60 * 1000;
    const timeDifference = Math.abs(tokenExpiry.getTime() - expectedExpiry);

    expect(timeDifference).toBeLessThan(1000); // Within 1 second
    expect(updateCall.data.verificationToken).toBe('123456');
  });

  it('should handle email sending failures gracefully', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    // Mock the email sending to fail for this test
    mockEmailSend.mockRejectedValueOnce(new Error('Email service unavailable'));

    await forgotPassword(mockReq, mockRes);

    // Should still return success even if email fails
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message:
        'If an account exists with this email, a password reset code has been sent.',
      otpSent: true,
    });
  });

  it('should handle database errors', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    await forgotPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Database error',
    });
  });

  it('should handle database update errors', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    prisma.user.update.mockRejectedValue(new Error('Update failed'));

    await forgotPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Update failed',
    });
  });

  it('should set token expiry to 10 minutes from now', async () => {
    const beforeTime = Date.now();

    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
    });

    await forgotPassword(mockReq, mockRes);

    const updateCall = prisma.user.update.mock.calls[0][0];
    const tokenExpiry = updateCall.data.tokenExpiry;
    const afterTime = Date.now();

    const minExpectedExpiry = beforeTime + 10 * 60 * 1000;
    const maxExpectedExpiry = afterTime + 10 * 60 * 1000;

    expect(tokenExpiry.getTime()).toBeGreaterThanOrEqual(minExpectedExpiry);
    expect(tokenExpiry.getTime()).toBeLessThanOrEqual(maxExpectedExpiry);
  });
});

