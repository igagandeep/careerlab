'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LocalWelcome() {
  const [username, setUsername] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleContinue = async () => {
    if (!username.trim()) return;

    setIsStarting(true);

    localStorage.setItem('career_lab_user', username);
    localStorage.setItem('career_lab_setup_complete', 'true');

    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-slate-700 rounded-lg p-3 mr-3">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-700">CareerLab</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Welcome to CareerLab
          </h2>
          <p className="text-gray-500 text-sm">
            Let&apos;s get you set up. What should we call you?
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <label className="text-sm font-medium text-gray-700">
                Your Name
              </label>
            </div>
            <Input
              type="text"
              placeholder="e.g. John Doe"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleContinue()}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!username.trim() || isStarting}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white"
          >
            {isStarting ? 'Starting...' : 'Continue →'}
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 flex items-center text-gray-500 text-sm">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Star on GitHub
      </div>
    </div>
  );
}
