import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateSQL } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { prompt, schema } = await req.json();

  if (!prompt || typeof prompt !== 'string' || prompt.length < 5)
    return NextResponse.json({ error: 'Prompt too short' }, { status: 400 });

  if (!schema || typeof schema !== 'string')
    return NextResponse.json({ error: 'Schema is required' }, { status: 400 });

  try {
    const result = await generateSQL(prompt, schema);
    return NextResponse.json({ result });
  } catch (err) {
    console.error('[generate]', err);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}