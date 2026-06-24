const BLOCKED_STATEMENT_PATTERNS = [
  /^\s*(INSERT)\b/i,
  /^\s*(UPDATE)\b/i,
  /^\s*(DELETE)\b/i,
  /^\s*(DROP)\b/i,
  /^\s*(TRUNCATE)\b/i,
  /^\s*(ALTER)\b/i,
  /^\s*(CREATE)\b/i,
  /^\s*(GRANT)\b/i,
  /^\s*(REVOKE)\b/i,
  /^\s*(EXEC|EXECUTE)\b/i,
  /^\s*(CALL)\b/i,
  /^\s*(COPY)\b/i,
];

const BLOCKED_ANYWHERE = [
  /\bINSERT\s+INTO\b/i,
  /\bUPDATE\s+\w+\s+SET\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b/i,
  /\bTRUNCATE\s+TABLE\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bCREATE\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW|FUNCTION|PROCEDURE)\b/i,
  /\bGRANT\s+\w+/i,
  /\bREVOKE\s+\w+/i,
  /\bpg_sleep\b/i,          
  /\bpg_read_file\b/i,      
  /\bpg_ls_dir\b/i,
  /\blo_import\b/i,         
  /\bdblink\b/i,            
];

export interface SafetyResult {
  safe: boolean;
  reason?: string;
}

export function isSafeQuery(sql: string): SafetyResult {
  const trimmed = sql.trim();

  if (!trimmed) {
    return { safe: false, reason: 'Empty query' };
  }

  if (!/^\s*(SELECT|WITH)\b/i.test(trimmed)) {
    const firstWord = trimmed.split(/\s+/)[0].toUpperCase();
    return {
      safe: false,
      reason: `Only SELECT statements are permitted. Got: ${firstWord}`,
    };
  }

  for (const pattern of BLOCKED_STATEMENT_PATTERNS) {
    if (pattern.test(trimmed)) {
      const firstWord = trimmed.split(/\s+/)[0].toUpperCase();
      return {
        safe: false,
        reason: `Statement type not allowed: ${firstWord}`,
      };
    }
  }

  for (const pattern of BLOCKED_ANYWHERE) {
    if (pattern.test(trimmed)) {
      const match = trimmed.match(pattern)?.[0] ?? 'unknown';
      return {
        safe: false,
        reason: `Dangerous pattern detected: "${match}"`,
      };
    }
  }

  const withoutStrings = trimmed.replace(/'[^']*'/g, "''");
  const semicolonCount = (withoutStrings.match(/;/g) ?? []).length;
  if (semicolonCount > 1) {
    return {
      safe: false,
      reason: 'Multiple statements are not allowed',
    };
  }

  return { safe: true };
}