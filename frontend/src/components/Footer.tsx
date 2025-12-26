import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='border-t border-gray-200 bg-white'>
      <div className='max-w-[1377px] mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='bg-slate-800 rounded-xl p-2'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-xl font-bold'>CareerLab</h3>
          </Link>

          {/* Navigation Links - Horizontal on desktop, 2x2 grid on mobile */}
          <nav className='grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 text-center md:text-left'>
            <Link 
              href='/dashboard' 
              className='text-gray-600 hover:text-gray-900 transition-colors py-2'
            >
              Dashboard
            </Link>
            <Link 
              href='/job-tracker' 
              className='text-gray-600 hover:text-gray-900 transition-colors py-2'
            >
              Job Tracker
            </Link>
            <Link 
              href='/resume-analyzer' 
              className='text-gray-600 hover:text-gray-900 transition-colors py-2'
            >
              Resume Analyzer
            </Link>
            <Link 
              href='/mock-interview' 
              className='text-gray-600 hover:text-gray-900 transition-colors py-2'
            >
              Mock Interview
            </Link>
          </nav>

          {/* Copyright */}
          <div className='text-gray-500 text-sm text-center md:text-right'>
            © 2025 CareerLab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;