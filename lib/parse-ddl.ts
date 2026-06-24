import type { ParsedTable, TableColumn } from '@/models/Schema';

export function parseDDL(ddl: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s*\(([^;]+?)\);/gim;

  let tableMatch: RegExpExecArray | null;
  while ((tableMatch = tableRegex.exec(ddl)) !== null) {
    const tableName = tableMatch[1];
    const body      = tableMatch[2];
    const columns: TableColumn[] = [];

    const lines = body.split(',').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^\s*(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|CONSTRAINT|INDEX)\b/i.test(line)) continue;

      const colMatch = line.match(/^["']?(\w+)["']?\s+(\w+(?:\s*\([^)]+\))?)/i);
      if (!colMatch) continue;

      columns.push({
        name:       colMatch[1],
        type:       colMatch[2].toUpperCase(),
        nullable:   !/\bNOT\s+NULL\b/i.test(line),
        primaryKey: /\bPRIMARY\s+KEY\b/i.test(line),
        foreignKey: undefined,
      });
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}