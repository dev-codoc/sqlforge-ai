'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, Clock, Rows, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExecuteResult {
  rows: Record<string, unknown>[];
  fields: { name: string; dataTypeID: number }[];
  rowCount: number;
  executionTimeMs: number;
}

interface ResultsTableProps {
  execResult: ExecuteResult | null;
  executing: boolean;
}

const PAGE_SIZE = 20;

function renderCell(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function ResultsTable({ execResult, executing }: ResultsTableProps) {
  const [page, setPage] = useState(0);

  if (executing) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <Loader2 className="w-5 h-5 text-[#7C3AED] animate-spin" />
        <p className="text-sm text-[#71717A]">Running query against database...</p>
      </div>
    );
  }

  if (!execResult) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center px-8">
        <div className="w-10 h-10 rounded-xl bg-[#1E1E2E] flex items-center justify-center mb-3">
          <Rows className="w-5 h-5 text-[#52525B]" />
        </div>
        <p className="text-sm text-[#52525B]">
          Click "Run query" to execute against your database
        </p>
      </div>
    );
  }

  if (execResult.rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <p className="text-sm text-white font-medium">Query returned 0 rows</p>
        <p className="text-xs text-[#52525B]">Executed in {execResult.executionTimeMs}ms</p>
      </div>
    );
  }

  const totalPages = Math.ceil(execResult.rows.length / PAGE_SIZE);
  const pageRows   = execResult.rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Meta row */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1E1E2E] shrink-0 bg-[#111118]/50">
        <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <Rows className="w-3.5 h-3.5" />
          <span>
            {execResult.rowCount} row{execResult.rowCount !== 1 ? 's' : ''}
          </span>
          {execResult.rowCount === 500 && (
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <AlertTriangle className="w-3 h-3" /> limit reached
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <Clock className="w-3.5 h-3.5" />
          {execResult.executionTimeMs}ms
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-[#0F0F16] z-10">
            <tr>
              {execResult.fields.map(f => (
                <th
                  key={f.name}
                  className="text-left text-xs text-[#71717A] font-medium px-4 py-2.5 border-b border-[#1E1E2E] whitespace-nowrap font-mono"
                >
                  {f.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-[#1E1E2E] hover:bg-[#1A1A27] transition-colors"
              >
                {execResult.fields.map(f => (
                  <td
                    key={f.name}
                    className="px-4 py-2.5 font-mono text-xs max-w-60 truncate"
                    title={renderCell(row[f.name])}
                  >
                    {row[f.name] === null
                      ? <span className="text-[#52525B] italic">NULL</span>
                      : <span className="text-[#A1A1AA]">{renderCell(row[f.name])}</span>
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1E1E2E] shrink-0">
          <span className="text-xs text-[#71717A]">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <Button
              variant="outline" size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="border-[#1E1E2E] bg-transparent hover:bg-[#1E1E2E] text-white h-7 w-7 p-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="border-[#1E1E2E] bg-transparent hover:bg-[#1E1E2E] text-white h-7 w-7 p-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}