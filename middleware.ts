import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const auth = req.cookies.get('auth')?.value
  const isLoggedIn = auth === 'logged-in'

  const path = req.nextUrl.pathname
  const isPublic = path === '/' || path === '/login'

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isLoggedIn && path === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts|.*\\.css$).*)'],
}