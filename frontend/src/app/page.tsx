import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleCheck, Sparkles } from 'lucide-react';

const features = [
  'AI-Powered Resume Analysis',
  'Smart Job Application Tracking',
  'Interactive Mock Interviews',
];

export default function Home() {
  return (
    <>
      <Navbar />
      <div className='h-[calc(100vh-80px)] flex items-center justify-center px-4'>
        <div className='w-full max-w-4xl text-center space-y-4 md:space-y-6'>
          <Badge
            variant='outline'
            className='text-primary border-primary/20 bg-primary/5 text-xs md:text-sm px-3 py-1 md:px-4 md:py-2'
          >
            <Sparkles className='w-3 h-3 md:w-4 md:h-4' /> Your AI Career Companion
          </Badge>

          <h1 className='text-3xl md:text-6xl font-bold leading-tight'>
            Land Your Dream Job with{' '}
            <span className='text-primary'>AI-Powered</span> Career Tools
          </h1>
          <h2 className='text-base md:text-xl text-gray-500 px-4 md:px-0'>
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
            <Button className='w-full md:w-60 h-12 md:h-14 rounded-[12px] bg-secondary text-base md:text-lg text-secondary-foreground hover:bg-secondary/90 transition-colors'>
              Start Free Trial
            </Button>
            <Button
              className='w-full md:w-60 h-12 md:h-14 rounded-[12px] text-base md:text-lg'
              variant='outline'
            >
              Analyze My Resume
            </Button>
          </div>
          <p className='text-sm md:text-base text-gray-500'>Trusted by 10,000+ job seekers worldwide</p>
        </div>
      </div>
    </>
  );
}
