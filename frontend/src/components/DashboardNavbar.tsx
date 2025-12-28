'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, LayoutDashboard, Briefcase, FileText, MessageSquare, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/job-tracker', label: 'Job Tracker', icon: Briefcase },
  { href: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { href: '/mock-interview', label: 'Mock Interview', icon: MessageSquare },
];

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <nav className="flex justify-between items-center py-4 max-w-[1377px] mx-auto px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-slate-800 rounded-xl p-2">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold">CareerLab</h3>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-[1377px] mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}