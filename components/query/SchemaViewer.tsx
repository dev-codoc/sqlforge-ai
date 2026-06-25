'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Key, Table } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

interface TableDef {
  name: string;
  columns: Column[];
}

export function SchemaViewer({ tables }: { tables: TableDef[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    { [tables[0]?.name]: true }
  );

  const toggle = (name: string) =>
    setOpen(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="space-y-1">
      <p className="text-xs text-[#52525B] uppercase tracking-wider mb-3 px-1">
        Schema
      </p>
      {tables.map(table => (
        <div key={table.name}>
          <button
            onClick={() => toggle(table.name)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1E1E2E] transition-colors text-left"
          >
            <Table className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="text-sm text-white font-mono flex-1">{table.name}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[#52525B] transition-transform duration-200 shrink-0',
                open[table.name] && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {open[table.name] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="ml-4 border-l border-[#1E1E2E] pl-3 py-1 space-y-0.5">
                  {table.columns.map(col => (
                    <div key={col.name} className="flex items-center gap-2 py-0.5 group">
                      {col.primaryKey
                        ? <Key className="w-3 h-3 text-[#F59E0B] shrink-0" />
                        : <div className="w-3 h-3 shrink-0" />
                      }
                      <span className="text-xs text-[#A1A1AA] font-mono group-hover:text-white transition-colors">
                        {col.name}
                      </span>
                      <span className="text-xs text-[#52525B] ml-auto font-mono">
                        {col.type}
                      </span>
                      {!col.nullable && !col.primaryKey && (
                        <span className="text-[10px] text-[#7C3AED] font-bold">*</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}