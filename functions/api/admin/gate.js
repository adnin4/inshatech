import { verifyAdminSession, adminJson, adminOptions, rejectAdminRequest } from '../../_shared/admin_session.js';

export async function onRequestGet({ request, env = {} }) {
  const result = await verifyAdminSession(request, env);
  if (!result.ok) return rejectAdminRequest(request, result);
  return adminJson(request, {
    authenticated: true,
    status: 'AUTHORIZED',
    user: result.user,
    expires_at: new Date(result.expiresAt * 1000).toISOString()
  });
}

export function onRequestOptions({ request }) {
  return adminOptions(request);
}
