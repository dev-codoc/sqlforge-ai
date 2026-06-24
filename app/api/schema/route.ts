import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import SchemaModel from '@/models/Schema';
import { parseDDL } from '@/lib/parse-ddl';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const schemas = await SchemaModel
    .find({ userId: session.user.id })
    .select('name tables createdAt')
    .sort({ createdAt: -1 });

  return NextResponse.json({ schemas });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, ddl } = await req.json();

  if (!name || !ddl)
    return NextResponse.json({ error: 'Name and DDL are required' }, { status: 400 });

  await connectDB();

  const tables = parseDDL(ddl);

  const schema = await SchemaModel.create({
    name,
    ddl,
    tables,
    userId: session.user.id,
  });

  return NextResponse.json({ schema }, { status: 201 });
}