'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Sparkles, Mail, Key, Shield } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetCodeSchema,
  setNewPasswordSchema,
  otpVerificationSchema,
  SignUpData,
  SignInData,
  ForgotPasswordData,
  ResetCodeData,
  SetNewPasswordData,
  OtpVerificationData,
} from '@/lib/validations/auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView =
  | 'signin'
  | 'signup'
  | 'otp'
  | 'forgotPassword'
  | 'checkEmail'
  | 'enterResetCode'
  | 'setNewPassword'
  | 'resetSuccess';

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [currentView, setCurrentView] = useState<ModalView>('signin');
  const [userEmail, setUserEmail] = useState('');
  const [resetCode, setResetCode] = useState('');

  const {
    signUp,
    signIn,
    verifyEmail,
    resendOTP,
    sendResetCode,
    verifyResetCode,
    setNewPassword,
    isSigningUp,
    isSigningIn,
    isVerifyingEmail,
    isResendingOTP,
    isSendingResetCode,
    isVerifyingResetCode,
  } = useAuth();

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const otpForm = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { otp: '' },
  });

  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetCodeForm = useForm<ResetCodeData>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const newPasswordForm = useForm<SetNewPasswordData>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const handleSignUp = (data: SignUpData) => {
    setUserEmail(data.email);
    signUp(data);
    setCurrentView('otp');
  };

  const handleSignIn = (data: SignInData) => {
    signIn(data);
    handleClose();
  };

  const handleVerifyOTP = (data: OtpVerificationData) => {
    if (data.otp.length === 6) {
      verifyEmail(userEmail, data.otp);
      handleClose();
    }
  };

  const handleForgotPassword = () => {
    setCurrentView('forgotPassword');
  };

  const handleSendResetCode = (data: ForgotPasswordData) => {
    setUserEmail(data.email);
    sendResetCode(data.email);
    setCurrentView('checkEmail');
  };

  const handleEnterResetCode = () => {
    setCurrentView('enterResetCode');
  };

  const handleVerifyResetCode = (data: ResetCodeData) => {
    setResetCode(data.code);
    verifyResetCode(userEmail, data.code, () => {
      setCurrentView('setNewPassword');
    });
  };

  const handleSetNewPassword = (data: SetNewPasswordData) => {
    const resetPasswordData = {
      email: userEmail,
      otp: resetCode,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
    setNewPassword(resetPasswordData);
    setCurrentView('resetSuccess');
  };

  const handleBackToSignIn = () => {
    setCurrentView('signin');
  };

  const handleBackToSignUp = () => {
    setCurrentView('otp');
  };

  const handleClose = () => {
    signUpForm.reset();
    signInForm.reset();
    otpForm.reset();
    forgotPasswordForm.reset();
    resetCodeForm.reset();
    newPasswordForm.reset();
    setCurrentView('signin');
    setUserEmail('');
    setResetCode('');
    onClose();
  };

  if (!isOpen) return null;

  const isLoading =
    isSigningUp ||
    isSigningIn ||
    isVerifyingEmail ||
    isResendingOTP ||
    isSendingResetCode ||
    isVerifyingResetCode;

  const renderHeader = () => {
    switch (currentView) {
      case 'signup':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">Start your career journey today</p>
          </>
        );
      case 'signin':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your career journey
            </p>
          </>
        );
      case 'otp':
        return (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify your email
            </h2>
            <p className="text-gray-600 mb-2">Enter the 6-digit code sent to</p>
            <p className="text-gray-900 font-medium">{userEmail}</p>
          </>
        );
      case 'forgotPassword':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot password?
            </h2>
            <p className="text-gray-600">
              No worries, we&apos;ll send you reset instructions
            </p>
          </>
        );
      case 'checkEmail':
        return (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 mb-2">
              We&apos;ve sent a password reset code to
            </p>
            <p className="text-gray-900 font-medium">{userEmail}</p>
          </>
        );
      case 'enterResetCode':
        return (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enter reset code
            </h2>
            <p className="text-gray-600 mb-2">Enter the 6-digit code sent to</p>
            <p className="text-gray-900 font-medium">{userEmail}</p>
          </>
        );
      case 'setNewPassword':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Set new password
            </h2>
            <p className="text-gray-600">
              Your new password must be different from previous passwords
            </p>
          </>
        );
      case 'resetSuccess':
        return (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password reset successful
            </h2>
            <p className="text-gray-600">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </>
        );
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'signin':
        return (
          <>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled
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

            {/* Sign In Form */}
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

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
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

            {/* Toggle to Sign Up */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        );

      case 'signup':
        return (
          <>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled
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

            {/* Sign Up Form */}
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

            {/* Toggle to Sign In */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setCurrentView('signin')}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        );

      case 'otp':
        return (
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
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
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

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Didn&apos;t receive the code?{' '}
                <button
                  onClick={() => resendOTP(userEmail)}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  {isResendingOTP ? 'Sending...' : 'Resend code'}
                </button>
              </p>
            </div>

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
        );

      case 'forgotPassword':
        return (
          <>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(handleSendResetCode)}
              className="space-y-6 mb-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  {...forgotPasswordForm.register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full"
                  disabled={isLoading}
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {forgotPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                {isSendingResetCode ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send Reset Code'
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={handleBackToSignIn}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                <span>←</span>
                Back to sign in
              </button>
            </div>
          </>
        );

      case 'checkEmail':
        return (
          <>
            <div className="space-y-6 mb-6">
              <Button
                onClick={handleEnterResetCode}
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                Enter Reset Code
              </Button>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Didn&apos;t receive the email?{' '}
                <button
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Click to resend
                </button>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={handleBackToSignIn}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                <span>←</span>
                Back to sign in
              </button>
            </div>
          </>
        );

      case 'enterResetCode':
        return (
          <>
            <form
              onSubmit={resetCodeForm.handleSubmit(handleVerifyResetCode)}
              className="space-y-6 mb-6"
            >
              <div>
                <Input
                  {...resetCodeForm.register('code')}
                  placeholder="000000"
                  className="w-full h-12 text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {resetCodeForm.formState.errors.code && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {resetCodeForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                {isVerifyingResetCode ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify Code'
                )}
              </Button>
            </form>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Didn&apos;t receive the code?{' '}
                <button
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Resend code
                </button>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={handleBackToSignIn}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                <span>←</span>
                Back
              </button>
            </div>
          </>
        );

      case 'setNewPassword':
        return (
          <>
            <form
              onSubmit={newPasswordForm.handleSubmit(handleSetNewPassword)}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  {...newPasswordForm.register('newPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  disabled={isLoading}
                />
                {newPasswordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {newPasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  {...newPasswordForm.register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  disabled={isLoading}
                />
                {newPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {newPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                Reset Password
              </Button>
            </form>
          </>
        );

      case 'resetSuccess':
        return (
          <>
            <div className="space-y-6 mb-6">
              <Button
                onClick={handleBackToSignIn}
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                disabled={isLoading}
              >
                Back to Sign In
              </Button>
            </div>
          </>
        );
    }
  };

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

          {renderHeader()}
        </div>

        {/* Content */}
        {renderContent()}

        {/* Security Notice - Only show on signin/signup views */}
        {(currentView === 'signin' || currentView === 'signup') && (
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
        )}
      </div>
    </div>
  );
};

export default SignInModal;
