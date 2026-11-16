import { NextResponse } from 'next/server';
import { adminCookie, isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, '', { ...adminCookie.options, maxAge: 0 });
  return response;
}
