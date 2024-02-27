import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;
  console.log(`middleware: ${pathname} from ${req.headers.get('referer')}`);

  return NextResponse.next();
}
