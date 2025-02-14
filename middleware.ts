import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api') && 
      !request.nextUrl.pathname.startsWith('/api/user')) {
    try {
      const accessToken = request.cookies.get('access-token')
      if (!accessToken) {
        return NextResponse.redirect(new URL('/', request.url))
      }
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
  
}