import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;
  console.log(`middleware: ${pathname} from ${req.headers.get('referer')}`);
  const outHeaders = new Headers(req.headers);
  outHeaders.set('x-href', req.nextUrl.href);
  if (pathname.match(/^\/dashboard\b/)) {
    const url = new URL(req.nextUrl.href);
    url.pathname = '/api/session';
    const res = await fetch(url, {
      credentials: 'include',
      headers: [['x-session-id', req.cookies.get('sessionId')?.value ?? '']],
    });
    const data = await res.json();
    const resSessionId = res.headers.get('x-session-id');
    console.log('session data', data, resSessionId);
    if (data.userType === 'guest') {
      return NextResponse.redirect(new URL('/login', req.nextUrl.href), {
        headers: [['Set-Cookie', `sessionId=${resSessionId}; Path=/; HttpOnly`]],
      });
    } else {
      outHeaders.set('x-user-id', data.user);
      outHeaders.set('x-user-type', data.userType);
      outHeaders.set('Set-Cookie', `sessionId=${resSessionId};` );
      console.log('setting x-user-id', data.user, data.userType, resSessionId);
      outHeaders.set('x-session-id', resSessionId ?? '');
    }
  } else if (pathname.match(/^\/redirect\b/)) {
    const url = new URL(req.nextUrl.href);
    url.pathname = url.pathname.replace(/^\/redirect\b/, '');
    console.log(`redirecting to ${url.href}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({
    request: { headers: outHeaders },
  });
}
