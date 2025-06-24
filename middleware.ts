import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESERVED_ROUTES = [
    'adminn',
    'feed',
    'calendario',
    'cadastrarUsuario',
    'confirmarConta',
    'landingPage',
    '_next',
    'comunidade'
];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const firstSegment = pathname.split('/')[1];

    if (RESERVED_ROUTES.includes(firstSegment)) {
        return NextResponse.next();
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
