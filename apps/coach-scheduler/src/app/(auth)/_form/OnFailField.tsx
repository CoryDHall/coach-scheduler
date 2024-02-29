'use client';
import { usePathname } from 'next/navigation';

export function OnFailField() {
  const pathname = usePathname();
  return (<input type="hidden" name="onFail" value={pathname} />);
}
