import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['profile', 'admin', 'root', 'settings']
const authPaths = ['login', 'register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionToken = request.cookies.get('authjs.session-token')?.value

    // if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }

    if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}