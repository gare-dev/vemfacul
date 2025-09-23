import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const RESERVED_ROUTES = [
    'adminn',
    'feed',
    'calendario',
    'cadastrarUsuario',
    'confirmarConta',
    'landingPage',
    '_next',
    'comunidade',
    'eventos',
    'correcaoRedacao',
    'exercicioDiario',
    'cursinho',
    'config',
    'notificacoes',
    'alterarSenha',
    'manifest.json'
];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const firstSegment = pathname.split('/')[1];

    // Se for reservado → continua normal
    if (RESERVED_ROUTES.includes(firstSegment)) {
        return NextResponse.next();
    }

    // Se não for reservado → redireciona para página de perfil
    // (ajuste a rota real da sua page [username].tsx)
    return NextResponse.rewrite(new URL(`/${firstSegment}`, request.url));
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)/assets/img/logo.png'],
};
