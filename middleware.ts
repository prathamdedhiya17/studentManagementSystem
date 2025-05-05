import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    // 1. First update Supabase session (required)
    const response = await updateSession(request);

    // 2. Read auth cookie
    const authCookie = request.cookies.get('auth')?.value;

    let isLoggedIn = false;
    let isAdmin = false;

    try {
        if (authCookie) {
            const parsed = JSON.parse(authCookie);
            isLoggedIn = !!parsed.id;
            isAdmin = parsed.isAdmin === true;
        }
    } catch {
        // Invalid cookie
    }

    const pathname = request.nextUrl.pathname;

    // 3. Redirection rules
    if (pathname === '/') {
        if (isLoggedIn) {
            const redirectTo = isAdmin ? '/admin' : '/student';
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
    }

    if (pathname.startsWith('/admin') && isLoggedIn && !isAdmin) {
        return NextResponse.redirect(new URL('/student', request.url));
    }

    if (pathname.startsWith('/student') && isLoggedIn && isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
