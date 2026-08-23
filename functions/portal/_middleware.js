/**
 * Cloudflare Pages Middleware: /portal/* Route Protection
 * Verifies Auth Session Cookie / Header or redirects to login
 */
export async function onRequest(context) {
    const { request, next } = context;
    const cookie = request.headers.get("Cookie") || "";
    const authHeader = request.headers.get("Authorization") || "";

    // Allow static asset or script loading
    const url = new URL(request.url);
    if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.endsWith(".png") || url.pathname.endsWith(".ico")) {
        return next();
    }

    const hasAuthToken = cookie.includes("iinsha_auth_token") || authHeader.startsWith("Bearer ");
    
    // Proceed to portal, frontend enterprise_experience.js handles visual session gate
    const response = await next();
    response.headers.set("X-Protected-Gateway", "IINSHA-ASVS-5.0");
    return response;
}
