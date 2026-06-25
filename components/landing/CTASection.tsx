'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-200 h-100 bg-[#7C3AED] rounded-full opacity-[0.12] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
            <Database className="w-7 h-7 text-[#A78BFA]" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-2xl">
            Stop writing SQL
            <br />
            <span className="bg-linear-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent">
              by hand.
            </span>
          </h2>

          <p className="text-[#71717A] text-lg max-w-md leading-relaxed">
            Paste your schema once. Query in plain English forever.
          </p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 text-base gap-2"
            >
              <Link href="/schema/new">
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <p className="text-xs text-[#52525B]">
            Free to use · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}