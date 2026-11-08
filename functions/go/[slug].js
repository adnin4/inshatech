/**
 * Cloudflare Pages Function: /go/[slug]
 * Dynamic Affiliate Link Redirect & 60-Day Cookie Tracking Engine
 * URL Format: /go/:slug?ref=AFF123&campaign=facebook&subid=ad1
 */

export async function onRequestGet(context) {
    const { request, params } = context;
    const slug = params.slug || 'marketplace';
    const url = new URL(request.url);

    const ref = url.searchParams.get('ref') || url.searchParams.get('aff') || 'DIRECT';
    const campaign = url.searchParams.get('campaign') || 'organic';
    const subid = url.searchParams.get('subid') || '';

    // Route mapping for service slugs to destination pages
    const slugRoutes = {
        'lead-swarm': '/marketplace.html?service=b2b-lead-swarm',
        'b2b-lead-swarm': '/marketplace.html?service=b2b-lead-swarm',
        'ecommerce-bot': '/marketplace.html?service=ecommerce-ai-whatsapp',
        'ecommerce-ai-whatsapp': '/marketplace.html?service=ecommerce-ai-whatsapp',
        'voice-ai': '/marketplace.html?service=voice-ai-receptionist',
        'voice-ai-receptionist': '/marketplace.html?service=voice-ai-receptionist',
        'n8n-cluster': '/marketplace.html?service=n8n-docker-cluster',
        'n8n-docker-cluster': '/marketplace.html?service=n8n-docker-cluster',
        'invoice-ocr': '/marketplace.html?service=invoice-ocr-pipeline',
        'invoice-ocr-pipeline': '/marketplace.html?service=invoice-ocr-pipeline',
        'store': '/store.html',
        'portal': '/portal.html',
        'affiliate': '/affiliate.html',
        'marketplace': '/marketplace.html'
    };

    const destination = slugRoutes[slug] || `/marketplace.html?service=${encodeURIComponent(slug)}`;
    const destinationUrl = new URL(destination, url.origin);
    if (ref !== 'DIRECT') destinationUrl.searchParams.set('aff', ref);
    if (campaign !== 'organic') destinationUrl.searchParams.set('campaign', campaign);
    if (subid) destinationUrl.searchParams.set('subid', subid);

    // 60-day attribution cookie (2592000 * 2 = 5184000 seconds)
    const cookieHeader = `iinsha_aff=${encodeURIComponent(ref)}; Path=/; Max-Age=5184000; SameSite=Lax; Secure`;

    // Log the click asynchronously via internal ping if ref exists
    if (ref !== 'DIRECT') {
        const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        console.log(`[AFFILIATE REDIRECT] Slug: ${slug} | Ref: ${ref} | Campaign: ${campaign} | IP: ${ip.substring(0, 7)}...`);
    }

    return new Response(null, {
        status: 302,
        headers: {
            'Location': destinationUrl.toString(),
            'Set-Cookie': cookieHeader,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
}
