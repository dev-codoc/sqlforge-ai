'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface SqlOutputProps {
  sql: string;
  warnings?: string[];
}

function highlightSQL(sql: string): string {
  const keywords = [
    'SELECT','FROM','WHERE','JOIN','LEFT','RIGHT','INNER','OUTER','FULL',
    'ON','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','AS','AND','OR',
    'NOT','IN','IS','NULL','LIKE','BETWEEN','EXISTS','DISTINCT','COUNT',
    'SUM','AVG','MIN','MAX','WITH','UNION','ALL','CASE','WHEN','THEN',
    'ELSE','END','DESC','ASC','COALESCE','CAST','INTERVAL','NOW','DATE',
  ];

  let result = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  keywords.forEach(kw => {
    result = result.replace(
      new RegExp(`\\b(${kw})\\b`, 'gi'),
      `<span style="color:#A78BFA;font-weight:500">$1</span>`
    );
  });

  result = result.replace(/'([^']*)'/g, `<span style="color:#2DD4BF">'$1'</span>`);
  result = result.replace(/\b(\d+)\b/g, `<span style="color:#F59E0B">$1</span>`);
  result = result.replace(/--.*/g, `<span style="color:#52525B;font-style:italic">$&</span>`);

  return result;
}

export function SqlOutput({ sql, warnings = [] }: SqlOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sql) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-[#52525B] italic">
        No SQL generated — try rephrasing your prompt
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-lg px-3 py-2.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
              <p className="text-xs text-[#FCD34D] leading-relaxed">{w}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-[#1E1E2E] text-[#71717A] hover:text-white hover:bg-[#2A2A3E] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Copy SQL"
        >
          {copied
            ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
            : <Copy className="w-3.5 h-3.5" />
          }
        </button>

        <pre className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-5 overflow-x-auto text-sm font-mono leading-[1.8] scrollbar-thin">
          <code dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }} />
        </pre>
      </div>
    </motion.div>
  );
}