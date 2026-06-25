'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, ArrowRight, Sparkles, Play } from 'lucide-react';

const DEMO_LINES = [
  { prompt: 'Show top 10 customers by total order value', sql: 'SELECT u.name, u.email,\n  SUM(o.total) AS total_spent\nFROM users u\nJOIN orders o ON o.user_id = u.id\nGROUP BY u.id, u.name, u.email\nORDER BY total_spent DESC\nLIMIT 10;' },
  { prompt: 'Orders placed in the last 7 days', sql: 'SELECT o.id, u.name,\n  o.total, o.status,\n  o.created_at\nFROM orders o\nJOIN users u ON u.id = o.user_id\nWHERE o.created_at >= NOW() - INTERVAL \'7 days\'\nORDER BY o.created_at DESC;' },
];

const KEYWORDS = ['SELECT','FROM','JOIN','ON','WHERE','GROUP BY','ORDER BY','LIMIT','SUM','AS','INTERVAL'];

function highlightSQL(sql: string) {
  let result = sql;
  KEYWORDS.forEach(kw => {
    result = result.replace(
      new RegExp(`\\b(${kw})\\b`, 'g'),
      `<span style="color:#A78BFA;font-weight:500">$1</span>`
    );
  });
  result = result.replace(/'([^']*)'/g, `<span style="color:#2DD4BF">'$1'</span>`);
  result = result.replace(/\b(\d+)\b/g, `<span style="color:#F59E0B">$1</span>`);
  return result;
}

function AnimatedSQLCard() {
  const [demoIdx, setDemoIdx] = useState(0);
  const [typedSQL, setTypedSQL] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause'>('typing');
  const reduceMotion = useReducedMotion();
  const demo = DEMO_LINES[demoIdx];

  useEffect(() => {
    if (reduceMotion) { setTypedSQL(demo.sql); setPhase('pause'); return; }

    setTypedSQL('');
    setPhase('typing');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedSQL(demo.sql.slice(0, i));
      if (i >= demo.sql.length) {
        clearInterval(interval);
        setPhase('pause');
        setTimeout(() => {
          setDemoIdx(prev => (prev + 1) % DEMO_LINES.length);
        }, 3000);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [demoIdx, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg"
    >
      {/* Window chrome */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl shadow-[#7C3AED]/5">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1E1E2E]">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          <span className="ml-3 text-xs text-[#52525B] font-mono">querycraft — query builder</span>
        </div>

        {/* Prompt row */}
        <div className="px-4 py-3 border-b border-[#1E1E2E] flex items-center gap-3">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span className="text-sm text-[#A1A1AA] font-sans italic">"{demo.prompt}"</span>
        </div>

        {/* SQL output */}
        <div className="p-4">
          <pre className="text-sm font-mono leading-relaxed text-[#E2E8F0] min-h-30">
            <code dangerouslySetInnerHTML={{ __html: highlightSQL(typedSQL) }} />
            {phase === 'typing' && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-[#7C3AED] ml-0.5 align-middle"
              />
            )}
          </pre>
        </div>

        {/* Footer row */}
        <div className="px-4 py-2.5 border-t border-[#1E1E2E] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="text-xs text-[#52525B]">Safe · Read-only · 3 layers of validation</span>
          </div>
          <span className="text-xs text-[#2DD4BF] font-mono">42ms</span>
        </div>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/3 -left-48 w-125 h-125 bg-[#7C3AED] rounded-full opacity-[0.12] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-100 h-100 bg-[#2DD4BF] rounded-full opacity-[0.10] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="border-[#7C3AED]/30 text-[#A78BFA] bg-[#7C3AED]/5 px-3 py-1 text-xs tracking-wide">
              <Database className="w-3 h-3 mr-1.5" />
              Powered by OpenRouter · Three-layer SQL safety
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              <span className="block text-white">SQL in plain</span>
              <span className="block bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-[#2DD4BF] bg-clip-text text-transparent">
                English.
              </span>
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg text-[#71717A] max-w-md leading-relaxed">
            Paste your schema, describe what you need. Get validated, explained SQL — with safe read-only execution against your database.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Button asChild size="lg" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 gap-2">
                <Link href="/schema/new">
                  Start querying <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-[#1E1E2E] px-6 gap-2">
                <Link href="#how-it-works">
                  <Play className="w-4 h-4" /> See how it works
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-6 pt-2">
            {[
              { label: 'Safety layers', value: '3×' },
              { label: 'Row limit', value: '500' },
              { label: 'Query timeout', value: '5s' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-[#52525B]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex justify-center lg:justify-end">
          <AnimatedSQLCard />
        </div>
      </div>
    </section>
  );
}