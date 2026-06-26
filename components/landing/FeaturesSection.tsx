'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, BookOpen, Clock, Database, Download } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Natural language to SQL',
    desc: 'Describe what you want in plain English. The LLM reads your exact schema and generates accurate, production-ready queries.',
    color: '#7C3AED',
  },
  {
    icon: ShieldCheck,
    title: 'Three-layer safety system',
    desc: 'AST pattern matching blocks write statements. A read-only DB user prevents physical writes. READ ONLY transactions as final guarantee.',
    color: '#2DD4BF',
  },
  {
    icon: BookOpen,
    title: 'Clause-by-clause explanation',
    desc: 'Every query comes with a plain-English breakdown of each SQL clause — what it does and why it was written that way.',
    color: '#A78BFA',
  },
  {
    icon: Database,
    title: 'Schema-aware generation',
    desc: 'Paste your DDL once. SQLForge parses your tables, columns, types, and relationships so queries always use your exact field names.',
    color: '#F59E0B',
  },
  {
    icon: Clock,
    title: 'Query history',
    desc: 'Every query you run is saved. Re-run, tweak, or revisit past queries instantly — with full results and explanations preserved.',
    color: '#EC4899',
  },
  {
    icon: Download,
    title: 'One-click CSV export',
    desc: 'Download any result set as a CSV file. Clean column headers, proper escaping for all value types.',
    color: '#22C55E',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] text-[#7C3AED] font-semibold uppercase">
            Why SQLForge
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Not just generation.{' '}
            <span className="bg-linear-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent">
              Understanding.
            </span>
          </h2>
          <p className="mt-4 text-[#71717A] max-w-xl mx-auto text-lg leading-relaxed">
            Most tools stop at generating SQL. SQLForge explains it, validates it, and runs it safely.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, borderColor: f.color }}
                className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 transition-colors duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}