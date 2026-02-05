import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import { generateOTP } from '../utils/generateOTP.js';
import { Resend } from 'resend';

const sendVerificationEmail = async (email, verificationToken, isSignUp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: isSignUp
        ? 'Verify your CareerLab account'
        : 'Reset your password',
      html: `
        <h2>${isSignUp ? 'Email Verification' : 'Reset Password'}</h2>
        <p>Your verification code: <strong>${verificationToken}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
    });
  } catch (error) {
    throw error;
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateOTP();
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        tokenExpiry,
        isVerified: false,
      },
    });

    try {
      await sendVerificationEmail(email, verificationToken, true);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      await prisma.user.delete({
        where: { id: user.id },
      });
      throw new Error(
        'Failed to send verification email. Please try again or contact support.'
      );
    }

    res.status(201).json({
      status: 'success',
      message:
        'User registered successfully. Please check your email for verification code.',
      data: {
        user: {
          id: user.id,
          name: name,
          email: email,
          isVerified: user.isVerified,
        },
        otpSent: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Server error during registration',
      code: 'REGISTRATION_FAILED',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      error:
        'Please verify your email before logging in. Check your inbox for verification code.',
      requiresVerification: true,
      email: user.email,
    });
  }

  // Generate JWT Token
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = generateOTP();
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with new OTP
    await prisma.user.update({
      where: { email: email },
      data: {
        verificationToken,
        tokenExpiry,
      },
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      throw new Error(
        'Failed to send verification email. Please try again or contact support.'
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'New verification code sent to your email',
      otpSent: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || 'Server error while resending OTP' });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user with email and valid token
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Check if OTP matches and hasn't expired
    if (user.verificationToken !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Update user as verified and clear token
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        isVerified: true,
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    // Generate JWT token after successful verification
    const token = generateToken(updatedUser.id, res);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isVerified: updatedUser.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during verification' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      const verificationToken = generateOTP();
      const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { email: email },
        data: {
          verificationToken,
          tokenExpiry,
        },
      });

      try {
        await sendVerificationEmail(email, verificationToken, false);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
    }

    res.status(200).json({
      status: 'success',
      message:
        'If an account exists with this email, a password reset code has been sent.',
      otpSent: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Server error while processing forgot password',
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  try {
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateUser = await prisma.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
      data: {
        user: {
          id: updateUser.id,
          email: updateUser.email,
        },
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

export {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
};
