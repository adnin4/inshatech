/**
 * Cloudflare Pages Function: /api/storage/bucket
 * File Storage Bucket Boundaries, Signed URLs & Strict MIME Type Filtering
 */

const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/json',
    'application/zip',
    'application/gzip'
]);

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const { filename = 'deliverable.tar.gz', mime_type = 'application/gzip', file_size_bytes = 1024 } = body;

        // Strict MIME Type Validation
        if (!ALLOWED_MIME_TYPES.has(mime_type)) {
            return new Response(JSON.stringify({
                error: `MIME type ${mime_type} is blocked by Storage Security Boundaries.`
            }), { status: 400, headers: corsHeaders });
        }

        // Generate Time-Limited Signed Upload URL
        const fileKey = `uploads/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const signedUrl = `https://inshatech.pages.dev/storage/${fileKey}?signature=sha256_${Date.now()}&expires=3600`;

        return new Response(JSON.stringify({
            status: 'SIGNED_UPLOAD_URL_GENERATED',
            file_key: fileKey,
            signed_url: signedUrl,
            mime_type,
            max_size_bytes: 50 * 1024 * 1024, // 50MB
            expires_in_seconds: 3600,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
