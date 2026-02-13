'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Sparkles } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  signUpSchema,
  signInSchema,
  SignUpData,
  SignInData,
} from '@/lib/validations/auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showOTPView, setShowOTPView] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const {
    signUp,
    signIn,
    verifyEmail,
    resendOTP,
    loginWithGoogle,
    loginWithGitHub,
    isSigningUp,
    isSigningIn,
    isVerifyingEmail,
    isResendingOTP,
  } = useAuth();

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm({
    defaultValues: {
      otp: '',
    },
  });

  const handleSignUp = (data: SignUpData) => {
    setUserEmail(data.email);
    signUp(data);
    setShowOTPView(true);
  };

  const handleSignIn = (data: SignInData) => {
    signIn(data);
  };

  const handleVerifyOTP = (data: { otp: string }) => {
    if (data.otp.length === 6) {
      verifyEmail(userEmail, data.otp);
      // Close modal after verification (success/error handled by useAuth)
      handleClose();
    }
  };

  const handleResendOTP = () => {
    resendOTP(userEmail);
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleGitHubSignIn = () => {
    loginWithGitHub();
  };

  const handleClose = () => {
    signUpForm.reset();
    signInForm.reset();
    otpForm.reset();
    setShowOTPView(false);
    setUserEmail('');
    onClose();
  };

  const handleBackToSignUp = () => {
    setShowOTPView(false);
    otpForm.reset();
  };

  if (!isOpen) return null;

  const isLoading =
    isSigningUp || isSigningIn || isVerifyingEmail || isResendingOTP;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-slate-800 rounded-xl p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">CareerLab</h3>
          </div>

          {showOTPView ? (
            <>
              {/* OTP View Header */}
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify your email
              </h2>
              <p className="text-gray-600 mb-2">
                Enter the 6-digit code sent to
              </p>
              <p className="text-gray-900 font-medium">{userEmail}</p>
            </>
          ) : (
            <>
              {/* Sign In/Up View Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp
                  ? 'Start your career journey today'
                  : 'Sign in to continue your career journey'}
              </p>
            </>
          )}
        </div>

        {showOTPView ? (
          /* OTP Verification View */
          <>
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOTP)}
              className="space-y-6 mb-6"
            >
              <div>
                <Input
                  {...otpForm.register('otp')}
                  placeholder="000000"
                  className="w-full h-12 text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                {isVerifyingEmail ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify & Continue'
                )}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Didn&apos;t receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  {isResendingOTP ? 'Sending...' : 'Resend code'}
                </button>
              </p>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={handleBackToSignUp}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                <span>←</span>
                Back
              </button>
            </div>
          </>
        ) : (
          /* Sign In/Up View */
          <>
            {/* Social Sign In Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled={true}
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <Button
                onClick={handleGitHubSignIn}
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled={true}
              >
                <FaGithub className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            {/* Manual Form */}
            {isSignUp ? (
              <form
                onSubmit={signUpForm.handleSubmit(handleSignUp)}
                className="space-y-4 mb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    {...signUpForm.register('name')}
                    placeholder="John Doe"
                    className="w-full"
                    disabled={isLoading}
                  />
                  {signUpForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    {...signUpForm.register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full"
                    disabled={isLoading}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    {...signUpForm.register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    disabled={isLoading}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                  disabled={isLoading}
                >
                  {isSigningUp ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signInForm.handleSubmit(handleSignIn)}
                className="space-y-4 mb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    {...signInForm.register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full"
                    disabled={isLoading}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    {...signInForm.register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    disabled={isLoading}
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                  disabled={isLoading}
                >
                  {isSigningIn ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            )}

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {isSignUp
                  ? 'Already have an account?'
                  : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium mb-2">
                SECURE AUTHENTICATION
              </p>
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
