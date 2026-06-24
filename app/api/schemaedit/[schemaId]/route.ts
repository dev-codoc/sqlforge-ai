import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import SchemaModel from '@/models/Schema';
import { parseDDL } from '@/lib/parse-ddl';

export async function GET(
  req: NextRequest,
  { params }: { params: { schemaId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const schema = await SchemaModel.findOne({
    _id: params.schemaId,
    userId: session.user.id,
  });

  if (!schema) return NextResponse.json({ error: 'Schema not found' }, { status: 404 });

  return NextResponse.json({ schema });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { schemaId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, ddl } = await req.json();

  await connectDB();
  const schema = await SchemaModel.findOne({
    _id: params.schemaId,
    userId: session.user.id,
  });

  if (!schema) return NextResponse.json({ error: 'Schema not found' }, { status: 404 });

  if (name !== undefined) schema.name = name;
  if (ddl  !== undefined) {
    schema.ddl    = ddl;
    schema.tables = parseDDL(ddl);
  }

  await schema.save();
  return NextResponse.json({ schema });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { schemaId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const schema = await SchemaModel.findOneAndDelete({
    _id: params.schemaId,
    userId: session.user.id,
  });

  if (!schema) return NextResponse.json({ error: 'Schema not found' }, { status: 404 });

  // Clean up associated history
  await (await import('@/models/QueryHistory')).default.deleteMany({
    schemaId: params.schemaId,
  });

  return NextResponse.json({ success: true });
}