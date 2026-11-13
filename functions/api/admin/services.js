/**
 * IINSHA Admin Services Management API
 * Serves /api/admin/services
 * Supports GET (fetch services), POST/PUT (upsert service), DELETE (remove service)
 * Enforces fail-closed server-side session authentication via verifyServerSession.
 */

import { getCorsHeaders, httpStatusForAuthError, verifyServerSession } from '../../_shared/auth_gate.js';
import { CANONICAL_SERVICES } from '../services.js';

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: false
        });

        if (!auth.authorized) {
            return new Response(JSON.stringify({
                ok: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatusForAuthError(auth.status), headers });
        }

        // Attempt to fetch from Supabase if configured
        const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const res = await fetch(`${supabaseUrl}/rest/v1/ibos_services?select=*&order=created_at.asc`, {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`
                    }
                });
                if (res.ok) {
                    const dbServices = await res.json();
                    if (Array.isArray(dbServices) && dbServices.length > 0) {
                        return new Response(JSON.stringify({
                            ok: true,
                            source: 'database',
                            count: dbServices.length,
                            services: dbServices
                        }), { status: 200, headers });
                    }
                }
            } catch (err) {
                // Fall through to canonical fallback
            }
        }

        // Return canonical catalog
        return new Response(JSON.stringify({
            ok: true,
            source: 'canonical',
            count: CANONICAL_SERVICES.length,
            services: CANONICAL_SERVICES
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            ok: false,
            error: e.message || 'Internal server error'
        }), { status: 500, headers });
    }
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: false
        });

        if (!auth.authorized) {
            return new Response(JSON.stringify({
                ok: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatusForAuthError(auth.status), headers });
        }

        let body = {};
        try {
            body = await request.json();
        } catch (_) {
            return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400, headers });
        }

        const { id, slug, title, category, priceUSD, price, deliveryDays, description, packages } = body;
        const serviceSlug = (slug || id || '').trim().toLowerCase();
        const serviceTitle = (title || '').trim();

        if (!serviceSlug || !serviceTitle) {
            return new Response(JSON.stringify({ ok: false, error: 'Missing service slug or title' }), { status: 400, headers });
        }

        const serviceRecord = {
            id: serviceSlug,
            slug: serviceSlug,
            title: serviceTitle,
            name: serviceTitle,
            category: category || 'AI Engineering',
            price_usd: Number(priceUSD || price || 499),
            priceUSD: Number(priceUSD || price || 499),
            delivery_days: Number(deliveryDays || 3),
            deliveryDays: Number(deliveryDays || 3),
            description: description || '',
            packages: packages || [
                { id: 'pilot', name: 'Pilot Scope', priceUSD: Number(priceUSD || price || 499) }
            ],
            updated_at: new Date().toISOString()
        };

        // If Supabase is available, persist record
        const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

        let persistedToDb = false;
        if (supabaseUrl && supabaseKey) {
            try {
                const res = await fetch(`${supabaseUrl}/rest/v1/ibos_services`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify([serviceRecord])
                });
                if (res.ok) {
                    persistedToDb = true;
                }
            } catch (_) {}
        }

        return new Response(JSON.stringify({
            ok: true,
            persistedToDb,
            message: `Service ${serviceTitle} saved successfully`,
            service: serviceRecord
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            ok: false,
            error: e.message || 'Internal server error'
        }), { status: 500, headers });
    }
}

export async function onRequestDelete(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: false
        });

        if (!auth.authorized) {
            return new Response(JSON.stringify({
                ok: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatusForAuthError(auth.status), headers });
        }

        const url = new URL(request.url);
        const serviceId = url.searchParams.get('id') || url.searchParams.get('slug');

        if (!serviceId) {
            return new Response(JSON.stringify({ ok: false, error: 'Missing service id query parameter' }), { status: 400, headers });
        }

        // If Supabase is available, remove or deactivate record
        const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

        let removedFromDb = false;
        if (supabaseUrl && supabaseKey) {
            try {
                const res = await fetch(`${supabaseUrl}/rest/v1/ibos_services?id=eq.${encodeURIComponent(serviceId)}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`
                    }
                });
                if (res.ok) {
                    removedFromDb = true;
                }
            } catch (_) {}
        }

        return new Response(JSON.stringify({
            ok: true,
            removedFromDb,
            message: `Service ${serviceId} deleted successfully`
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            ok: false,
            error: e.message || 'Internal server error'
        }), { status: 500, headers });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
