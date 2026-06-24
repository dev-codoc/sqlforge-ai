import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import QueryHistory from '@/models/QueryHistory';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const schemaId = searchParams.get('schemaId');
  const limit    = Math.min(Number(searchParams.get('limit') ?? 20), 100);

  await connectDB();

  const filter: Record<string, unknown> = { userId: session.user.id };
  if (schemaId) filter.schemaId = schemaId;

  const history = await QueryHistory
    .find(filter)
    .sort({ executedAt: -1 })
    .limit(limit)
    .select('prompt sql rowCount executionTimeMs executedAt schemaId warnings');

  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { schemaId, prompt, sql, explanation, breakdown, warnings, rowCount, executionTimeMs } = body;

  if (!schemaId || !prompt || !sql)
    return NextResponse.json({ error: 'schemaId, prompt, and sql are required' }, { status: 400 });

  await connectDB();

  const entry = await QueryHistory.create({
    schemaId,
    prompt,
    sql,
    explanation,
    breakdown,
    warnings,
    rowCount,
    executionTimeMs,
    userId: session.user.id,
  });

  return NextResponse.json({ entry }, { status: 201 });
}