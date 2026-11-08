/**
 * Shared owner-session verifier for privileged IINSHA API routes.
 * Tokens are HMAC-SHA256 signed by /api/auth/session and contain a one-hour expiry.
 * This verifies identity/role only; it does not imply database or provider readiness.
 */
const ALLOWED_ORIGINS = new Set([
  'https://inshatech.pages.dev',
  'https://inshatech.com',
  'https://www.inshatech.com',
  'https://admin.inshatech.com'
]);

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function isAllowedAdminOrigin(request) {
  const origin = request.headers.get('Origin');
  return !origin || ALLOWED_ORIGINS.has(origin);
}

export async function verifyAdminSession(request, env = {}) {
  if (!env.JWT_SECRET) return { ok: false, status: 'CONFIGURATION_ERROR', httpStatus: 503 };
  if (!isAllowedAdminOrigin(request)) return { ok: false, status: 'ORIGIN_REJECTED', httpStatus: 403 };

  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return { ok: false, status: 'UNAUTHORIZED', httpStatus: 401 };

  const parts = authorization.slice(7).split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, status: 'INVALID_TOKEN', httpStatus: 401 };
  }

  try {
    const [encodedPayload, suppliedSignature] = parts;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBytes = new Uint8Array(await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(encodedPayload)
    ));
    const expectedSignature = btoa(String.fromCharCode(...signatureBytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (expectedSignature.length !== suppliedSignature.length) {
      return { ok: false, status: 'FORGERY_REJECTED', httpStatus: 401 };
    }
    let difference = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      difference |= expectedSignature.charCodeAt(i) ^ suppliedSignature.charCodeAt(i);
    }
    if (difference !== 0) return { ok: false, status: 'FORGERY_REJECTED', httpStatus: 401 };

    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isInteger(payload.exp) || now >= payload.exp) {
      return { ok: false, status: 'TOKEN_EXPIRED', httpStatus: 401 };
    }
    if (!Number.isInteger(payload.iat) || payload.iat > now + 30 || now - payload.iat > 3600) {
      return { ok: false, status: 'TOKEN_TIME_INVALID', httpStatus: 401 };
    }
    if (!payload.jti || payload.role !== 'owner' || payload.hierarchy_level !== 1 || payload.mfa_verified !== true || !payload.sub) {
      return { ok: false, status: 'PRIVILEGE_REJECTED', httpStatus: 403 };
    }
    return {
      ok: true,
      user: {
        email: payload.sub,
        role: payload.role,
        hierarchy_level: payload.hierarchy_level,
        mfa_verified: true
      },
      expiresAt: payload.exp
    };
  } catch {
    return { ok: false, status: 'INVALID_TOKEN', httpStatus: 401 };
  }
}

export function adminJson(request, payload, status = 200, extraHeaders = {}) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
    ...extraHeaders
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(payload), { status, headers });
}

export function adminOptions(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(null, { status: 204, headers });
}

export function rejectAdminRequest(request, result) {
  return adminJson(request, { authenticated: false, status: result.status }, result.httpStatus || 401);
}
