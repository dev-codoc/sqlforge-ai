'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

interface Breakdown {
  part: string;
  desc: string;
}

interface ExplanationPanelProps {
  explanation: string;
  breakdown: Breakdown[];
}

export function ExplanationPanel({ explanation, breakdown }: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* Summary card */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-md bg-[#7C3AED]/10 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <span className="text-sm font-medium text-white">Summary</span>
        </div>
        <p className="text-sm text-[#A1A1AA] leading-relaxed">{explanation}</p>
      </div>

      {/* Clause breakdown */}
      {breakdown.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[#52525B] uppercase tracking-wider px-1">
            Clause breakdown
          </p>
          {breakdown.map((item, i) => (
            <motion.div
              key={item.part}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4 hover:border-[#7C3AED]/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                <span className="text-xs font-mono font-semibold text-[#A78BFA] tracking-wide">
                  {item.part}
                </span>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed pl-5">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}