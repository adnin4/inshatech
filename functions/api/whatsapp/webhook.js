/**
 * Cloudflare Pages Function: /api/whatsapp/webhook
 * Meta WhatsApp Cloud API Webhook Handler
 * 
 * Supports:
 * - GET: Webhook verification challenge (hub.verify_token & hub.challenge)
 * - POST: Inbound customer message processing, intent detection, trilingual AI response
 */

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const VERIFY_TOKEN = env.WHATSAPP_VERIFY_TOKEN || 'iinsha_whatsapp_verify_token_2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    } else {
        return new Response(JSON.stringify({ status: 'ERROR', error: 'Verification token mismatch' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json().catch(() => ({}));

        // Meta WhatsApp Payload parsing
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0]?.value;
        const message = changes?.messages?.[0];

        if (!message) {
            return new Response(JSON.stringify({ status: 'SUCCESS', message: 'No actionable message payload' }), {
                headers: corsHeaders,
                status: 200
            });
        }

        const senderPhone = message.from;
        const messageText = message.text?.body || message.interactive?.button_reply?.title || '';
        const messageId = message.id;

        // Trilingual AI Intent Router
        let replyText = '';
        const lowerMsg = messageText.toLowerCase();

        if (lowerMsg.includes('dam') || lowerMsg.includes('price') || lowerMsg.includes('koto') || lowerMsg.includes('cost')) {
            replyText = `স্বাগতম IINSHA AI-BOS-এ! 🤖✨\n\nআমাদের জনপ্রিয় অটোমেশন প্যাকেজসমূহ:\n1. 🛒 WhatsApp E-Commerce Sales Bot: $750 USD (৳91,875)\n2. 🎯 B2B SaaS 5-Agent Hunter Swarm: $850 USD (৳104,125)\n3. ⚡ Self-Hosted n8n Enterprise Cluster: $497 USD (৳60,882)\n\nবিস্তারিত জানতে বা অর্ডার করতে ওয়েবসাইট ভিজিট করুন: https://inshatech.pages.dev/store`;
        } else if (lowerMsg.includes('order') || lowerMsg.includes('buy') || lowerMsg.includes('kinbo')) {
            replyText = `আপনার অর্ডারের আগ্রহের জন্য ধন্যবাদ! 🚀\n\nআমাদের অফিসিয়াল চেকআউট লিংক:\n👉 https://inshatech.lemonsqueezy.com/checkout/custom/45a2dceb-c63b-49c2-9684-12ef6d576c58\n\nবিকাশ/নগদে পেমেন্টের জন্য পাঠান 01629286887 নম্বরে। কোনো প্রশ্ন থাকলে জানান!`;
        } else if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('problem')) {
            replyText = `আমাদের ২৪/৭ এআই সাপোর্ট সক্রিয় আছে। আপনার সমস্যা বা অর্ডার আইডিটি লিখুন, আমাদের সিস্টেম তাৎক্ষণিক ডায়াগনস্টিক ট্রায়াজ শুরু করবে।`;
        } else {
            replyText = `ধন্যবাদ মেসেজ দেওয়ার জন্য! আমি IINSHA AI Business Concierge। আমি কীভাবে আপনার ব্যবসার অটোমেশনে সাহায্য করতে পারি? (English / বাংলা / Banglish সমর্থিত)`;
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            action: 'processed',
            sender: senderPhone,
            message_id: messageId,
            inbound_text: messageText,
            automated_reply: replyText,
            timestamp: new Date().toISOString()
        }), { headers: corsHeaders, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ status: 'ERROR', error: err.message }), {
            headers: corsHeaders,
            status: 500
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
