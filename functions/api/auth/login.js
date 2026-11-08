/**
 * Cloudflare Pages Function: /api/auth/login
 * Full-Stack JWT OAuth & Session Login Handler
 */
import { onRequestPost as handleSessionPost } from "./session.js";

export async function onRequestPost(context) {
    return handleSessionPost(context);
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
