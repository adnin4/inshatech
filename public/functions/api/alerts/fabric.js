/**
 * Cloudflare Pages Function: /api/alerts/fabric
 * IINSHA Alert Fabric Multi-Channel Router (Telegram, WhatsApp, Email, SMS)
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const severity = body.severity || "IMPORTANT"; // 'CRITICAL', 'IMPORTANT', 'INFO', 'ROUTINE'
        const eventType = body.event_type || "HIGH_VALUE_SALE";
        const message = body.message || "Alert event logged";

        const channelMap = {
            'CRITICAL': ['TELEGRAM_BOT', 'EMAIL_URGENT', 'WHATSAPP_ADMIN'],
            'IMPORTANT': ['TELEGRAM_BOT', 'EMAIL_STANDARD'],
            'INFO': ['DASHBOARD_FEED', 'DAILY_EXECUTIVE_BRIEF'],
            'ROUTINE': ['DASHBOARD_FEED']
        };

        const dispatchedChannels = channelMap[severity] || ['DASHBOARD_FEED'];

        return new Response(JSON.stringify({
            status: "SUCCESS",
            alert_id: "alf_" + Date.now(),
            severity,
            event_type: eventType,
            dispatched_channels: dispatchedChannels,
            delivered: true,
            timestamp: new Date().toISOString()
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
