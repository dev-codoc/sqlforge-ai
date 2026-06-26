'use client';

import { motion } from 'framer-motion';
import { FileCode2, Sparkles, ShieldCheck, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: FileCode2,
    title: 'Paste your schema',
    desc: 'Drop in your SQL DDL — CREATE TABLE statements. SQLForge parses tables, columns, types, and foreign keys automatically.',
    color: '#7C3AED',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Describe in English',
    desc: 'Type what you want. "Show revenue by month for the last year" or "Find users who haven\'t ordered in 90 days." No SQL knowledge needed.',
    color: '#A78BFA',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'AI generates & validates',
    desc: 'The LLM generates a SELECT query using your exact schema. Three safety layers validate it before a single byte hits your database.',
    color: '#2DD4BF',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Run and explore',
    desc: 'One click executes the query. Browse results, read the clause-by-clause explanation, export as CSV.',
    color: '#22C55E',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 bg-[#0D0D14]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] text-[#7C3AED] font-semibold uppercase">
            How it works
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Four steps to your query
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-[#1E1E2E]">
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="h-full bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-[#2DD4BF]"
            />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center relative"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10 ring-4 ring-[#0D0D14]"
                  style={{ backgroundColor: `${step.color}18`, border: `1px solid ${step.color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color: step.color }} />
                </div>

                <span className="text-xs font-mono text-[#52525B] mb-2">{step.number}</span>
                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed max-w-55">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}