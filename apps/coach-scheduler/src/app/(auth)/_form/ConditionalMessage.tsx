'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

export function ConditionalMessage() {
  const params = useSearchParams();
  const [message, setMessage] = useState(params.get('message'));
  const router = useRouter();
  useLayoutEffect(() => {
    if (params.has('message')) {
      if (message !== params.get('message')) {
        setMessage(params.get('message'));
      }
      router.replace(location.pathname);
    }
  }, [message, params, router]);
  if (!message) {
    return null;
  }
  return <p>{message}</p>;
}
