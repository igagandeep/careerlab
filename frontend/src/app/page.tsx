'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className='border-b border-gray-100'>
        <nav className='flex justify-between items-center py-4 max-w-[1377px] mx-auto px-4'>
          {/* Logo */}
          <Link href="/" className='flex items-center gap-2'>
            <div className='bg-slate-800 rounded-xl p-2'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-xl font-bold'>CareerLab</h3>
          </Link>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex items-center gap-6'>
            <li>
              <Link href="/signin" className='text-sm flex items-center font-semibold gap-1'>
                Sign In
              </Link>
            </li>
            <li className='flex items-center'>
              <Link href="/register">
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                  Get Started Free
                </Button>
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button 
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-100 bg-white'>
            <div className='max-w-[1377px] mx-auto px-4 py-4 space-y-4'>
              <Link href="/signin" className='text-sm font-semibold block'>
                Sign In
              </Link>
              <Link href="/register" className='block'>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground w-full'>
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <div className='max-w-[1300px] mx-auto px-4'>
        <h1>Hello World</h1>
      </div>
    </>
  );
}
