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
  const {
    signUp,
    signIn,
    loginWithGoogle,
    loginWithGitHub,
    isSigningUp,
    isSigningIn,
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

  const handleSignUp = (data: SignUpData) => {
    signUp(data);
  };

  const handleSignIn = (data: SignInData) => {
    signIn(data);
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
    onClose();
  };

  if (!isOpen) return null;

  const isLoading = isSigningUp || isSigningIn;

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

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-gray-600">
            {isSignUp
              ? 'Start your career journey today'
              : 'Sign in to continue your career journey'}
          </p>
        </div>

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
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
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
      </div>
    </div>
  );
};

export default SignInModal;
