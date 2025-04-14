import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ message: 'Logged out' });
    res.cookies.set('auth', '', { maxAge: 0 }); // Clear the cookie
    return res;
}
