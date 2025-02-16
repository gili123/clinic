import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

  const accessToken = request.cookies.get('access-token')
  if (request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname === '/admin') {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/api') && 
      !request.nextUrl.pathname.startsWith('/api/user')) {
    try {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('Authorization', `Bearer ${accessToken?.value}`)

      const response = await NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      
      return response
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],

}