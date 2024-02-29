import { NextRequest, NextResponse } from 'next/server';
import { Entities, getEm, withORM } from '../../_utils';
import { cookies } from 'next/headers';
export const POST = withORM(async function Authorize(req: NextRequest) {
  const em = getEm();
  const formData = await req.formData();
  const email = formData.get('email');
  const authType = formData.get('submit');
  console.log('formData', email, authType, formData.get('onFail'));
  if (!email || !authType) {
    const url = new URL(req.nextUrl.href);
    url.pathname = `/redirect/${formData.get('onFail') ?? req.referrer}`;
    url.searchParams.set('message', 'Email and submit button required');
    console.log(`redirecting to ${url.href}`)
    return NextResponse.redirect(url);
  }
  const sessionId = cookies().get('sessionId')?.value ?? '';
  if (authType === 'login') {
    const url = new URL(req.nextUrl.href);
    url.pathname = '/api/session';
    const res = await fetch(url, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ email, sessionId }),
    });
    const data = await res.json();
    if (data.userType === 'guest') {
      return NextResponse.redirect(new URL('/login', req.nextUrl.href), { status: 401 });
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.href));
  } else if (authType === 'signup') {
    const username = formData.get('username');
    const userType = formData.get('userType') as Entities.User.UserType;
    if (!userType) {
      return new NextResponse('User type not specified', { status: 400 });
    }
    if (userType === Entities.User.UserType.COACH) {
      const url = new URL(req.nextUrl.href);
      url.pathname = '/api/coaches';
      const res = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, username }),
      });
      const data = await res.json();
      if (data.username) {
        const session = await em.findOne(Entities.UserSession.UserSession, { sessionId });
        if (session) {
          session.userType = userType as string as Entities.UserSession.UserSessionType;
          session.user = data;
          await em.flush();
          return NextResponse.redirect(new URL('/dashboard', req.nextUrl.href));
        }
        return new NextResponse('Session not found', { status: 500 });
      }
    }
  }
})
