/**
 * Cloudflare Pages Function for Google Search Console Verification
 * Route: /google050e48ae270ce622
 */

export async function onRequestGet(context) {
    return new Response("google-site-verification: google050e48ae270ce622.html", {
        status: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=86400"
        }
    });
}
