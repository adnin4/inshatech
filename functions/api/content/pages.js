/**
 * Cloudflare Pages Function: /api/content/pages
 * CMS Dynamic Pages & Version History API
 */

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const dynamicPages = [
        { slug: "home", title: "IINSHA AI-BOS Home", status: "PUBLISHED", version: 14 },
        { slug: "store", title: "Enterprise AI Solutions Store", status: "PUBLISHED", version: 8 },
        { slug: "marketplace", title: "AI Ecosystem Marketplace", status: "PUBLISHED", version: 6 },
        { slug: "blog", title: "Engineering & Architecture Journal", status: "PUBLISHED", version: 12 }
    ];

    return new Response(JSON.stringify({
        status: "SUCCESS",
        pages: dynamicPages
    }), { headers, status: 200 });
}

