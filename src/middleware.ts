import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session && req.nextUrl.pathname.startsWith('/auth')) {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = '/';
		return NextResponse.redirect(redirectUrl);
	}

	if (!session && req.nextUrl.pathname === '/') {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = '/auth/login';
		return NextResponse.redirect(redirectUrl);
	}

	return res;
}
