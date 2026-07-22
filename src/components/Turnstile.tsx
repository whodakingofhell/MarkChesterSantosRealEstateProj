'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
}

export function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  
  if (!siteKey) {
    // Fail-open for development
    console.warn('TURNSTILE_SITE_KEY not configured');
    return null;
  }
  
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => onVerify(token)}
      onError={() => onError?.('turnstile-error')}
      onExpire={() => onExpire?.()}
      options={{
        appearance: 'execute',
        execution: 'render',
        theme: 'light',
      }}
    />
  );
}
