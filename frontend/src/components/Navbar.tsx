'use client';
import { Menu, Sparkles, X, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-gray-100">
        <nav className="flex justify-between items-center py-4 max-w-[1377px] mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-slate-800 rounded-xl p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">CareerLab</h3>
          </Link>

          <ul className="hidden md:flex items-center gap-6">
            <li className="flex items-center">
              <Button
                onClick={() =>
                  window.open(
                    'https://github.com/igagandeep/careerlab',
                    '_blank'
                  )
                }
                className=" text-white flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Star on GitHub
              </Button>
            </li>
          </ul>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-[1377px] mx-auto px-4 py-4 space-y-4">
              <Button
                onClick={() => {
                  window.open(
                    'https://github.com/igagandeep/careerlab',
                    '_blank'
                  );
                  setIsMenuOpen(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Star on GitHub
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
