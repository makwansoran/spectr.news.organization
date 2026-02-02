// Web Crypto API (works in Edge runtime and Node)
const COOKIE_NAME = 'editor_session';
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.EDITOR_PASSWORD;
  if (!secret) return 'fallback-change-in-production';
  return secret;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createEditorSession(): Promise<{ value: string; maxAge: number }> {
  const secret = getSecret();
  const payload = `${Date.now()}`;
  const hmac = await hmacSha256Hex(secret, payload);
  const value = `${payload}.${hmac}`;
  return { value, maxAge: MAX_AGE_SEC };
}

export async function verifyEditorSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue || !cookieValue.includes('.')) return false;
  const [payload, hmac] = cookieValue.split('.');
  if (!payload || !hmac) return false;
  const secret = getSecret();
  const expected = await hmacSha256Hex(secret, payload);
  if (expected.length !== hmac.length) return false;
  if (!timingSafeEqualHex(expected, hmac)) return false;
  const ts = parseInt(payload, 10);
  if (Number.isNaN(ts)) return false;
  const ageSec = (Date.now() - ts) / 1000;
  return ageSec >= 0 && ageSec < MAX_AGE_SEC;
}

export function getEditorSessionCookie(request: Request): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  const match = header.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1].trim()) : undefined;
}

export const EDITOR_COOKIE_NAME = COOKIE_NAME;
export const EDITOR_SESSION_MAX_AGE = MAX_AGE_SEC;
