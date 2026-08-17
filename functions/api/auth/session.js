export async function onRequestPost(context) {
  const { request, env } = context;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  
  // Rate limiting map (in-memory for simple worker, ideally use KV/Durable Objects)
  if (!globalThis.rateLimitMap) globalThis.rateLimitMap = new Map();
  const now = Date.now();
  const minute = 60 * 1000;
  const limit = 5;
  
  let record = globalThis.rateLimitMap.get(ip) || { count: 0, resetTime: now + minute };
  
  if (now > record.resetTime) {
    record = { count: 1, resetTime: now + minute };
  } else {
    record.count++;
  }
  globalThis.rateLimitMap.set(ip, record);

  if (record.count > limit) {
    return new Response(JSON.stringify({ error: 'Too many attempts. Please try again later.' }), { 
      status: 429, 
      headers: { 'Content-Type': 'application/json', 'Retry-After': Math.ceil((record.resetTime - now)/1000).toString() } 
    });
  }

  try {
    const data = await request.json();
    const { username, password } = data;

    // VERY basic hardcoded credential check for now
    // In a real app, use Supabase Auth or a secure DB lookup
    if (username === 'admin' && password === env.ADMIN_PASSWORD) {
      
      // Simple HMAC-based token (use Web Crypto API)
      const secret = env.SESSION_SECRET || 'fallback-secret-for-dev';
      const enc = new TextEncoder();
      const header = { alg: "HS256", typ: "JWT" };
      const payload = { role: 'super_admin', exp: now + 86400000 }; // 24h
      
      const base64UrlEncode = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const dataToSign = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
      
      const key = await crypto.subtle.importKey(
        "raw", enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false, ["sign"]
      );
      
      const signature = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
      const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      const token = `${dataToSign}.${sigBase64}`;

      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
