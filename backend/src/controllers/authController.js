import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/generateToken.js';
import { Resend } from 'resend';

const sendVerificationEmail = async (email, verificationToken) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your CareerLab account',
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code: <strong>${verificationToken}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
    });
  } catch (error) {
    throw error;
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: 'User already exists with this email' });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate 6-digit OTP
  const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
  };

  const verificationToken = generateOTP();
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Create User with OTP
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
    await sendVerificationEmail(email, verificationToken);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
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
      // Don't send the actual OTP in response for security
      otpSent: true,
    },
  });
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

    // Generate new OTP
    const generateOTP = () => {
      return crypto.randomInt(100000, 999999).toString();
    };

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
    }

    res.status(200).json({
      status: 'success',
      message: 'New verification code sent to your email',
      otpSent: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while resending OTP' });
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

export { register, login, logout, verifyEmail, resendOTP };
