'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/lib/config';
import { getDemoUsage, DEMO_LIMITS, canUseDemoFeature } from '@/lib/demoLimits';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoUsage, setDemoUsage] = useState(getDemoUsage());

  useEffect(() => {
    let mounted = true;

    const initializeUser = () => {
      if (appConfig.isLocal) {
        const storedUser = localStorage.getItem('career_lab_user');
        const setupComplete = localStorage.getItem('career_lab_setup_complete');

        if (!storedUser || !setupComplete) {
          router.push('/');
          return;
        }

        if (mounted) {
          setUser(storedUser);
          setIsLoading(false);
        }
      } else {
        const demoSession = localStorage.getItem('demo_session');

        if (!demoSession) {
          router.push('/');
          return;
        }

        if (mounted) {
          setUser('Demo User');
          setDemoUsage(getDemoUsage());
          setIsLoading(false);
        }
      }
    };

    initializeUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.split(' ')[0] || 'User';

  return (
    <>
      <DashboardNavbar />
      <div className="max-w-[1377px] mx-auto px-4 py-12">
        {appConfig.isDemo && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">
                  Demo Mode - Limited Features
                </h3>
                <p className="text-sm text-orange-600">
                  Download the full version for unlimited access to all features
                </p>
              </div>
              <Button
                onClick={() =>
                  window.open(
                    'https://github.com/igagandeep/careerlab',
                    '_blank'
                  )
                }
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Download Full Version
              </Button>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {firstName}! 👋
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Resume Analysis
                {appConfig.isDemo && (
                  <Badge
                    variant={
                      canUseDemoFeature('resumeAnalysis')
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {demoUsage.resumeAnalysis}/{DEMO_LIMITS.resumeAnalysis}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {appConfig.isDemo
                  ? 'Analyze your resume against job descriptions'
                  : 'Unlimited resume analysis with AI feedback'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={
                  appConfig.isDemo && !canUseDemoFeature('resumeAnalysis')
                }
              >
                {appConfig.isDemo && !canUseDemoFeature('resumeAnalysis')
                  ? 'Demo Limit Reached'
                  : 'Analyze Resume'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mock Interview
                {appConfig.isDemo && (
                  <Badge
                    variant={
                      canUseDemoFeature('mockInterviews')
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {demoUsage.mockInterviews}/{DEMO_LIMITS.mockInterviews}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {appConfig.isDemo
                  ? 'Practice with AI-powered mock interviews'
                  : 'Unlimited mock interviews with detailed feedback'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={
                  appConfig.isDemo && !canUseDemoFeature('mockInterviews')
                }
              >
                {appConfig.isDemo && !canUseDemoFeature('mockInterviews')
                  ? 'Demo Limit Reached'
                  : 'Start Interview'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Job Tracker
                {appConfig.isDemo && (
                  <Badge variant="secondary">View Only</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {appConfig.isDemo
                  ? 'View sample job applications (read-only)'
                  : 'Track your job applications and interviews'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                {appConfig.isDemo ? 'View Sample Jobs' : 'Manage Jobs'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {appConfig.isDemo && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Want unlimited access?
            </h3>
            <p className="text-sm text-blue-600 mb-3">
              Download Career Lab to your computer for unlimited resume
              analysis, mock interviews, and full job tracking capabilities.
            </p>
            <Button
              onClick={() =>
                window.open('https://github.com/igagandeep/careerlab', '_blank')
              }
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Get Full Version
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
