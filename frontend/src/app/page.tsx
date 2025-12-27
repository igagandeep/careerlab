'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInModal from '@/components/SignInModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CircleCheck,
  Sparkles,
  FileText,
  Briefcase,
  MessageSquare,
  Globe,
} from 'lucide-react';

const features = [
  'AI-Powered Resume Analysis',
  'Smart Job Application Tracking',
  'Interactive Mock Interviews',
];

const services = [
  {
    icon: FileText,
    title: 'Resume Analyzer',
    desc: 'Upload your resume and get an instant ATS compatibility score with AI-powered suggestions to improve each section.',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Briefcase,
    title: 'Job Tracker',
    desc: 'Organize all your job applications in one place. Track status, deadlines, and never miss a follow-up.',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: MessageSquare,
    title: 'AI Mock Interview',
    desc: 'Practice with our AI interviewer. Get real-time feedback on your answers and improve your interview skills.',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Globe,
    title: 'Browser Extension',
    desc: 'Save jobs directly from LinkedIn, Indeed, and more with our browser extension. Auto-fill applications effortlessly.',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
];

export default function Home() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <Navbar />

      <div className='w-full flex flex-col items-center justify-center my-30'>
        <div className='w-full max-w-[1377px] mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center space-y-4 md:space-y-10'>
            <Badge
              variant='outline'
              className='text-primary border-primary/20 bg-primary/5 text-xs md:text-sm px-3 py-1 md:px-4 md:py-2'
            >
              <Sparkles className='w-3 h-3 md:w-4 md:h-4' /> Your AI Career
              Companion
            </Badge>

            <h1 className='text-3xl md:text-6xl font-bold leading-tight'>
              Land Your Dream Job with{' '}
              <span className='text-primary'>AI-Powered</span> Career Tools
            </h1>
            <h2 className='text-base md:text-xl text-gray-500 max-w-2xl mx-auto'>
              Optimize your resume, track applications, and ace interviews — all
              in one powerful platform designed to accelerate your job search.
            </h2>
            <div className='flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 flex-wrap'>
              {features.map((feature, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2 text-gray-600 text-xs md:text-sm'
                >
                  <CircleCheck className='w-3 h-3 md:w-4 md:h-4 text-green-500' />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex flex-col md:flex-row justify-center gap-3 md:gap-4 pt-2 px-4 md:px-0'>
              <Button 
                onClick={() => setIsSignInModalOpen(true)}
                className='w-full md:w-60 h-12 md:h-14 rounded-[12px] bg-secondary text-base md:text-lg text-secondary-foreground hover:bg-secondary/90 transition-colors'
              >
                Start Free Trial
              </Button>
              <Button
                onClick={() => setIsSignInModalOpen(true)}
                className='w-full md:w-60 h-12 md:h-14 rounded-[12px] text-base md:text-lg'
                variant='outline'
              >
                Analyze My Resume
              </Button>
            </div>
            <p className='text-sm md:text-base text-gray-500'>
              Trusted by 10,000+ job seekers worldwide
            </p>
          </div>

          <div className='flex flex-col justify-center items-center text-center space-y-4 md:space-y-6 mt-30'>
            <h2 className='text-2xl md:text-4xl font-bold'>
              Everything You Need to{' '}
              <span className='text-primary'>Land the Job</span>
            </h2>
            <p className='text-gray-500 text-base md:text-xl w-full md:w-[50%] text-center px-4 md:px-0'>
              A complete toolkit designed to streamline your job search and
              maximize your success rate.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 mt-12'>
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={i}
                  className='bg-white p-8 rounded-lg border border-gray-200 text-center space-y-4'
                >
                  <div
                    className={`w-16 h-16 mx-auto ${service.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <h3 className='text-xl font-semibold'>{service.title}</h3>
                  <p className='text-gray-600 text-base leading-relaxed'>{service.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className='bg-secondary rounded-2xl p-8 md:p-16 mt-20 text-center text-white'>
            <div className='max-w-4xl mx-auto space-y-8'>
              <div className='flex items-center justify-center gap-2 text-sm text-gray-300 mb-6'>
                <Sparkles className='w-4 h-4' />
                <span>Start Your Journey Today</span>
              </div>
              
              <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold leading-tight'>
                Ready to Accelerate Your Career?
              </h2>
              
              <p className='text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl mx-auto'>
                Join thousands of professionals who&apos;ve transformed their job search with CareerLab.<br />
                Get started for free — no credit card required.
              </p>
              
              <div className='flex flex-col md:flex-row justify-center gap-4 pt-6'>
                <Button 
                  onClick={() => setIsSignInModalOpen(true)}
                  className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-lg font-semibold'
                >
                  Get Started Free →
                </Button>
                <Button 
                  onClick={() => setIsSignInModalOpen(true)}
                  variant='secondary' 
                  className='bg-white text-slate-800 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg font-semibold'
                >
                  Try Resume Analyzer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}
