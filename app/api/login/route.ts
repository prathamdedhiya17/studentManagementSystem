import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const body = await req.json();
    const { email, password } = body;

    // 1. First Checking if user exists in Admin Table
    const { data: admin } = await supabase
        .from('admins')
        .select('id, name, email, password')
        .eq('email', email)
        .single();

    if (admin) {
        if (admin.password !== password) {
            return new Response(
                JSON.stringify({ success: false, error: 'Incorrect password' }),
                { status: 401 }
            );
        }

        const res = NextResponse.json({ success: true, isAdmin: true });

        res.cookies.set(
            'auth',
            JSON.stringify({
                id: admin.id,
                name: admin.name,
                isAdmin: true,
            }),
            {
                httpOnly: true,
                path: '/',
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            }
        );

        return res;
    }

    // 2. Checking if user exists in student table
    const { data: student } = await supabase
        .from('students')
        .select('id, name, email, password')
        .eq('email', email)
        .single();

    if (student) {
        if (student.password !== password) {
            return new Response(
                JSON.stringify({ success: false, error: 'Incorrect password' }),
                { status: 401 }
            );
        }

        const res = NextResponse.json({ success: true, isAdmin: false });

        res.cookies.set(
            'auth',
            JSON.stringify({
                id: student.id,
                name: student.name,
                isAdmin: false,
            }),
            {
                httpOnly: true,
                path: '/',
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            }
        );

        return res;
    }

    return new Response(
        JSON.stringify({ success: false, error: 'No account found with this email' }),
        { status: 404 }
    );
}
