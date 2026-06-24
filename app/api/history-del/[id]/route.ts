import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import QueryHistory from '@/models/QueryHistory';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const entry = await QueryHistory.findOneAndDelete({
    _id:    params.id,
    userId: session.user.id,
  });

  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}