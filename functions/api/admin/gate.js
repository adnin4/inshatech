export async function onRequestGet(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ authenticated: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    return new Response(JSON.stringify({ authenticated: false, error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const secret = env.SESSION_SECRET || 'fallback-secret-for-dev';
    const enc = new TextEncoder();
    
    const dataToVerify = `${parts[0]}.${parts[1]}`;
    const signatureToVerify = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    const sigBytes = Uint8Array.from(atob(signatureToVerify), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false, ["verify"]
    );
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(dataToVerify));

    if (isValid) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (Date.now() > payload.exp) {
        return new Response(JSON.stringify({ authenticated: false, error: 'Token expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ authenticated: true, role: payload.role }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ authenticated: false, error: 'Invalid signature' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ authenticated: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
