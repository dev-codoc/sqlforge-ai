import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  throw new Error('Please define POSTGRES_URL in .env.local');
}

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

export const pool: Pool = global.pgPool ?? new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 5,              
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});