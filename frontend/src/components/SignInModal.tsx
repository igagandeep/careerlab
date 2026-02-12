'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [isLoading, setIsLoading] = useState<string | false>(false);
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = () => {
    setIsLoading('google');
    loginWithGoogle();
    // Note: User will be redirected to backend OAuth flow
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={!!isLoading}
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
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to continue your career journey
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
            {isLoading === 'google' ? (
              <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <FcGoogle className="w-5 h-5 mr-3" />
            )}
            Continue with Google
          </Button>
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
