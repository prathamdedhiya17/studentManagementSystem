import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set('auth', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    // secure: process.env.NODE_ENV === 'production',
  });

  return response;
}