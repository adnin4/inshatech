/**
 * Cloudflare Pages Function: /api/affiliate/track
 * Server-Side Affiliate Click Tracking & Attribution Engine
 */

export async function onRequestPost(context) {
    const { request } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json().catch(() => ({}));
        const {
            affiliate_id,
            campaign_id = 'organic',
            sub_id = '',
            landing_page = '/',
        } = body;

        if (!affiliate_id || affiliate_id.length < 3 || affiliate_id.length > 64) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Invalid affiliate_id'
            }), { headers: corsHeaders, status: 400 });
        }

        // Self-referral prevention
        const ownerAffIds = ['OWNER', 'ADMIN', 'ADNIN', 'IINSHA'];
        if (ownerAffIds.includes(affiliate_id.toUpperCase())) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Self-referral is not permitted'
            }), { headers: corsHeaders, status: 403 });
        }

        // Generate hashed identifiers for privacy
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || 'unknown';
        const ipHash = await hashString(ip);
        const uaHash = await hashString(userAgent);

        // Duplicate click prevention (same IP + UA within 1 hour)
        const sessionId = `${ipHash}_${uaHash}_${Math.floor(Date.now() / 3600000)}`;

        const clickRecord = {
            click_id: 'click_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            affiliate_id,
            campaign_id,
            sub_id,
            landing_page,
            ip_hash: ipHash.substring(0, 16),
            user_agent_hash: uaHash.substring(0, 16),
            session_id: sessionId,
            country: request.headers.get('CF-IPCountry') || 'XX',
            created_at: new Date().toISOString()
        };

        // Set attribution cookie (30-day window)
        const attributionCookie = `iinsha_aff=${affiliate_id}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`;

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Click tracked successfully',
            click: clickRecord,
            attribution_window_days: 30
        }), {
            headers: {
                ...corsHeaders,
                'Set-Cookie': attributionCookie
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers: corsHeaders, status: 500 });
    }
}

async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        status: 204
    });
}
