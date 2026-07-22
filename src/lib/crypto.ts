import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// HMAC signing for request integrity
export function signPayload(
  payload: Record<string, unknown>,
  secret: string
): string {
  const message = JSON.stringify(payload);
  const hmac = createHmac('sha256', secret);
  hmac.update(message);
  return hmac.digest('base64');
}

// Verify HMAC signature with constant-time comparison
export function verifyHMAC(
  payload: Record<string, unknown>,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signPayload(payload, secret);
  
  const sigBuffer = Buffer.from(signature, 'base64');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64');
  
  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }
  
  return timingSafeEqual(sigBuffer, expectedBuffer);
}

// Generate random nonce
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

// Generate API key
export function generateApiKey(): string {
  return randomBytes(32).toString('hex');
}

// Hash data with SHA-256
export function hashData(data: string): string {
  return createHmac('sha256', 'hash-salt').update(data).digest('hex');
}

// Verify timestamp freshness (5 minutes window)
export function verifyTimestamp(
  clientTimestamp: number,
  maxAgeMs: number = 5 * 60 * 1000,
  futureToleranceMs: number = 10 * 1000
): boolean {
  const now = Date.now();
  const age = now - clientTimestamp;
  
  return age >= -futureToleranceMs && age <= maxAgeMs;
}
