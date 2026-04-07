import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();
    console.log('Synced to Xero:', invoiceData);
    return NextResponse.json({ success: true, message: 'Invoice synced to Xero (mock)' });
  } catch (error) {
    console.error('Xero sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}