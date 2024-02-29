import { headers } from 'next/headers';

export function getXHeaderUrl() {
  return new URL(headers().get('x-href') ?? '');
}
