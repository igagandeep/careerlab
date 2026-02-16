import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '@/api/auth';

// Mock the api client
vi.mock('@/api/client', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Import the mocked api after mocking
import { api } from '@/api/client';
const mockPost = vi.mocked(api.post);
const mockGet = vi.mocked(api.get);

describe('Auth API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      // Arrange - Set up test data and mock response
      const signUpData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          otpSent: true,
        },
      };

      // Mock the axios post method to return our fake response
      mockPost.mockResolvedValue(mockResponse);

      // Act - Call the function we're testing
      const result = await authApi.signUp(signUpData);

      // Assert - Check that everything worked correctly
      expect(mockPost).toHaveBeenCalledWith('/api/auth/register', signUpData);
      expect(result).toEqual({
        message: 'User registered successfully',
        otpSent: true,
      });
    });

    it('should handle registration errors', async () => {
      // Arrange - Set up error scenario
      const signUpData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockError = new Error('Email already exists');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert - Test that error is thrown
      await expect(authApi.signUp(signUpData)).rejects.toThrow(
        'Email already exists'
      );
      expect(mockPost).toHaveBeenCalledWith('/api/auth/register', signUpData);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      // Arrange
      const signInData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockResponse = {
        data: {
          data: {
            user: {
              id: '123',
              name: 'John Doe',
              email: 'test@example.com',
              image: 'https://example.com/avatar.jpg',
              createdAt: '2024-01-15T10:30:00Z',
            },
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.signIn(signInData);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/login', signInData);
      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-15T10:30:00Z',
      });
    });

    it('should handle sign in errors', async () => {
      // Arrange
      const signInData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = new Error('Invalid credentials');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.signIn(signInData)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(mockPost).toHaveBeenCalledWith('/api/auth/login', signInData);
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email', async () => {
      // Arrange
      const email = 'test@example.com';
      const otp = '123456';

      const mockResponse = {
        data: {
          data: {
            user: {
              id: '123',
              name: 'John Doe',
              email: 'test@example.com',
              createdAt: '2024-01-15T10:30:00Z',
            },
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.verifyEmail(email, otp);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/verify-email', {
        email,
        otp,
      });
      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'test@example.com',
        createdAt: '2024-01-15T10:30:00Z',
      });
    });

    it('should handle invalid OTP', async () => {
      // Arrange
      const email = 'test@example.com';
      const otp = '000000';

      const mockError = new Error('Invalid OTP');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.verifyEmail(email, otp)).rejects.toThrow(
        'Invalid OTP'
      );
      expect(mockPost).toHaveBeenCalledWith('/api/auth/verify-email', {
        email,
        otp,
      });
    });
  });

  describe('resendOTP', () => {
    it('should successfully resend OTP', async () => {
      // Arrange
      const email = 'test@example.com';

      const mockResponse = {
        data: {
          message: 'OTP sent successfully',
          otpSent: true,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.resendOTP(email);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/resend-otp', { email });
      expect(result).toEqual({
        message: 'OTP sent successfully',
        otpSent: true,
      });
    });

    it('should handle resend OTP errors', async () => {
      // Arrange
      const email = 'invalid@example.com';

      const mockError = new Error('User not found');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.resendOTP(email)).rejects.toThrow('User not found');
      expect(mockPost).toHaveBeenCalledWith('/api/auth/resend-otp', { email });
    });
  });

  describe('sendResetCode', () => {
    it('should successfully send reset code', async () => {
      // Arrange
      const email = 'test@example.com';

      const mockResponse = {
        data: {
          message: 'Reset code sent successfully',
          codeSent: true,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.sendResetCode(email);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email,
      });
      expect(result).toEqual({
        message: 'Reset code sent successfully',
        codeSent: true,
      });
    });

    it('should handle send reset code errors', async () => {
      // Arrange
      const email = 'nonexistent@example.com';

      const mockError = new Error('Email not found');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.sendResetCode(email)).rejects.toThrow(
        'Email not found'
      );
      expect(mockPost).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email,
      });
    });
  });

  describe('verifyResetCode', () => {
    it('should successfully verify reset code', async () => {
      // Arrange
      const email = 'test@example.com';
      const code = '123456';

      const mockResponse = {
        data: {
          message: 'Reset code is valid',
          isValid: true,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.verifyResetCode(email, code);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/verify-reset-code', {
        email,
        code,
      });
      expect(result).toEqual({
        message: 'Reset code is valid',
        isValid: true,
      });
    });

    it('should handle invalid reset code', async () => {
      // Arrange
      const email = 'test@example.com';
      const code = '000000';

      const mockError = new Error('Invalid reset code');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.verifyResetCode(email, code)).rejects.toThrow(
        'Invalid reset code'
      );
      expect(mockPost).toHaveBeenCalledWith('/api/auth/verify-reset-code', {
        email,
        code,
      });
    });
  });

  describe('setNewPassword', () => {
    it('should successfully set new password', async () => {
      // Arrange
      const resetData = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      const mockResponse = {
        data: {
          message: 'Password reset successfully',
          user: {
            id: '123',
            email: 'test@example.com',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      // Act
      const result = await authApi.setNewPassword(resetData);

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        '/api/auth/reset-password',
        resetData
      );
      expect(result).toEqual({
        message: 'Password reset successfully',
        user: {
          id: '123',
          email: 'test@example.com',
        },
      });
    });

    it('should handle set new password errors', async () => {
      // Arrange
      const resetData = {
        email: 'test@example.com',
        otp: '000000',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      const mockError = new Error('Invalid or expired reset code');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.setNewPassword(resetData)).rejects.toThrow(
        'Invalid or expired reset code'
      );
      expect(mockPost).toHaveBeenCalledWith(
        '/api/auth/reset-password',
        resetData
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      // Arrange
      const mockResponse = { data: {} };
      mockPost.mockResolvedValue(mockResponse);

      // Act
      await authApi.logout();

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/api/auth/logout');
    });

    it('should handle logout errors', async () => {
      // Arrange
      const mockError = new Error('Logout failed');
      mockPost.mockRejectedValue(mockError);

      // Act & Assert
      await expect(authApi.logout()).rejects.toThrow('Logout failed');
      expect(mockPost).toHaveBeenCalledWith('/api/auth/logout');
    });
  });
});
