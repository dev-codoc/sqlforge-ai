'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#features',     label: 'Features'     },
  { href: '#how-it-works', label: 'How it works' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'backdrop-blur-md bg-[#0A0A0F]/80 border-[#1E1E2E]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <Database className="w-5 h-5 text-[#7C3AED]" />
          <span>QueryCraft</span>
          <span className="text-[#7C3AED]">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#71717A] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[#A1A1AA] hover:text-white transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/schema/new"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            >
              <Database className="w-3.5 h-3.5" />
              Start querying
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}