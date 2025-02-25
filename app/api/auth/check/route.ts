import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function getTokenFromCookie(request: NextRequest) {
    const cookie = request.headers.get('cookie');
    if (!cookie) return null;

    const match = cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
    const token = getTokenFromCookie(req);

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        jwt.verify(token, process.env.AUTH_SECRET!);

        return NextResponse.json({ authenticated: true });
    } catch (error) {

        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
