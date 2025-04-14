import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        const auth = req.cookies.get('auth')?.value;
        const isLoggedIn = auth === 'logged-in';
        const path = req.nextUrl.pathname;

        // Replace this with your actual DB/auth logic
        const validUser =
            email === 'test@example.com' && password === 'password123';

        if (!validUser) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        if (isLoggedIn && path === '/login') {
            // Redirect logged-in users away from login page
            return NextResponse.redirect(new URL('/', req.url)); // or dashboard page
        }

        const res = NextResponse.json(
            { message: 'Login successful' },
            { status: 200 }
        );

        res.cookies.set('auth', 'logged-in', {
            httpOnly: true,
            path: '/',
            // maxAge: 60 * 60 * 8, // 8 hour
        });

        return res;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation failed', errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
