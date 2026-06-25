'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Loader2, RotateCcw, Rows } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

interface HistoryEntry {
  _id: string;
  prompt: string;
  sql: string;
  explanation?: string;
  breakdown?: { part: string; desc: string }[];
  warnings?: string[];
  rowCount?: number;
  executionTimeMs?: number;
  executedAt: string;
}

interface QueryHistoryPanelProps {
  schemaId: string;
  onSelect: (entry: HistoryEntry) => void;
}

export function QueryHistoryPanel({ schemaId, onSelect }: QueryHistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/history?schemaId=${schemaId}`)
      .then(r => r.json())
      .then(d => setHistory(d.history ?? []))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, [schemaId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(h => h._id !== id));
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E1E2E] shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-sm font-medium text-white">History</span>
          {history.length > 0 && (
            <span className="ml-auto text-xs text-[#52525B]">{history.length} queries</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-4 h-4 text-[#7C3AED] animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <RotateCcw className="w-6 h-6 text-[#52525B] mb-2" />
            <p className="text-xs text-[#52525B]">No queries yet</p>
            <p className="text-[11px] text-[#3A3A4E] mt-1">
              Run a query to see it here
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {history.map((entry, i) => (
                <motion.button
                  key={entry._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => onSelect(entry)}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#1E1E2E] transition-colors group border border-transparent hover:border-[#2A2A3E]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed flex-1 group-hover:text-white transition-colors">
                      {entry.prompt}
                    </p>
                    <button
                      onClick={e => handleDelete(entry._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-[#52525B] hover:text-red-400 transition-all shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-[#52525B]">
                      {formatRelativeTime(entry.executedAt)}
                    </span>
                    {entry.rowCount !== undefined && (
                      <>
                        <span className="text-[10px] text-[#3A3A4E]">·</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-[#52525B]">
                          <Rows className="w-2.5 h-2.5" />
                          {entry.rowCount}
                        </span>
                      </>
                    )}
                    {entry.executionTimeMs !== undefined && (
                      <>
                        <span className="text-[10px] text-[#3A3A4E]">·</span>
                        <span className="text-[10px] text-[#52525B]">
                          {entry.executionTimeMs}ms
                        </span>
                      </>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}