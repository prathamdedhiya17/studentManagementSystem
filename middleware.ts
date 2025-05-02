import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const cookieValue = req.cookies.get('auth')?.value;

    let isLoggedIn = false;
    let isAdmin = false;

    if (cookieValue) {
        try {
            const parsed = JSON.parse(cookieValue);
            isLoggedIn = true;
            isAdmin = parsed.isAdmin === true;
        } catch (e) {
            console.error('Invalid auth cookie:', e);
        }
    }

    const path = req.nextUrl.pathname;

    // User not logged in: force them to "/"
    if (!isLoggedIn && path !== '/') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // User logged in and trying to access "/": redirect them properly
    if (isLoggedIn && path === '/') {
        const target = isAdmin ? '/admin' : '/student';
        return NextResponse.redirect(new URL(target, req.url));
    }

    // Everything else: allow
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts|.*\\.css$).*)',
    ],
};
