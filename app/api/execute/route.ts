import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isSafeQuery } from '@/lib/sql-guard';
import { pool } from '@/lib/postgres';
import { connectDB } from '@/lib/mongodb';
import QueryHistory from '@/models/QueryHistory';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sql, prompt, schemaId, explanation, breakdown, warnings } = await req.json();

  if (!sql || typeof sql !== 'string')
    return NextResponse.json({ error: 'SQL is required' }, { status: 400 });

  const { safe, reason } = isSafeQuery(sql);
  if (!safe)
    return NextResponse.json({ error: `Query blocked: ${reason}` }, { status: 403 });

  const client = await pool.connect();
  const start = Date.now();

  try {
    await client.query('SET statement_timeout = 5000');
    await client.query('BEGIN TRANSACTION READ ONLY');

    const result = await client.query(
      `SELECT * FROM (${sql}) AS q LIMIT 500`
    );

    await client.query('ROLLBACK');

    const executionTimeMs = Date.now() - start;

    // Save to history
    if (schemaId && prompt) {
      await connectDB();
      await QueryHistory.create({
        schemaId,
        prompt,
        sql,
        explanation,
        breakdown,
        warnings,
        rowCount:        result.rowCount,
        executionTimeMs,
        userId:          session.user.id,
      });
    }

    return NextResponse.json({
      rows:            result.rows,
      fields:          result.fields.map(f => ({ name: f.name, dataTypeID: f.dataTypeID })),
      rowCount:        result.rowCount,
      executionTimeMs,
    });
  } catch (err: any) {
    await client.query('ROLLBACK').catch(() => {});
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}