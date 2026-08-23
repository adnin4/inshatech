/**
 * Cloudflare Pages Function: /api/currency/exchange
 * Dual-Currency Real-Time Exchange & Parity Lock Engine ($1.00 USD = ৳122.50 BDT)
 */

const BASE_USD_TO_BDT = 122.50;

export async function onRequestGet(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        base_currency: "USD",
        target_currency: "BDT",
        rate: BASE_USD_TO_BDT,
        parity_lock: "SERVER_LOCKED_AUTHORITATIVE",
        effective_date: "2026-08-23",
        supported_pairs: ["USD/BDT", "BDT/USD"],
        timestamp: new Date().toISOString()
    }), { status: 200, headers: corsHeaders });
}
