"use client"
import { Menu, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';
import SignInModal from './SignInModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <header className='border-b border-gray-100'>
        <nav className='flex justify-between items-center py-4 max-w-[1377px] mx-auto px-4'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='bg-slate-800 rounded-xl p-2'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-xl font-bold'>CareerLab</h3>
          </Link>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex items-center gap-6'>
            <li>
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className='text-sm flex items-center font-semibold gap-1 hover:text-gray-600 transition-colors'
              >
                Sign In
              </button>
            </li>
            <li className='flex items-center'>
              <Button 
                onClick={() => setIsSignInModalOpen(true)}
                className='bg-primary hover:bg-primary/90 text-primary-foreground'
              >
                Get Started Free
              </Button>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-100 bg-white'>
            <div className='max-w-[1377px] mx-auto px-4 py-4 space-y-4'>
              <button
                onClick={() => {
                  setIsSignInModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className='text-sm font-semibold block w-full text-left hover:text-gray-600 transition-colors'
              >
                Sign In
              </button>
              <Button 
                onClick={() => {
                  setIsSignInModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className='bg-primary hover:bg-primary/90 text-primary-foreground w-full'
              >
                Get Started Free
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
