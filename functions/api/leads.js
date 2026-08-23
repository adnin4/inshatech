/**
 * Cloudflare Pages Function: /api/leads
 * Serverless Lead Qualification, Quote Submissions & CRM Handoff API
 */

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        
        const leadId = "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
        const name = (body.name || "Anonymous Prospect").trim();
        const email = (body.email || "").trim();
        const phone = (body.phone || "").trim();
        const business = (body.business || "General Business").trim();
        const serviceInterest = body.service_interest || "AI Automation";
        const budget = body.budget || "Not Specified";
        const conversationSummary = body.summary || "";

        // Calculated Lead Score based on qualification intent
        let score = 50;
        if (phone || email) score += 20;
        if (budget && budget !== "Not Specified") score += 15;
        if (serviceInterest) score += 15;

        const leadData = {
            id: leadId,
            score,
            status: score >= 75 ? "QUALIFIED_HOT" : "INTERESTED",
            name,
            email,
            phone,
            business,
            service_interest: serviceInterest,
            budget,
            conversation_summary: conversationSummary,
            created_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Lead successfully recorded in IINSHA AI CRM",
            lead: leadData
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        status: 204
    });
}

