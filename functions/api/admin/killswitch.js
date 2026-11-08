import { verifyAdminSession, adminJson, adminOptions, rejectAdminRequest } from '../../_shared/admin_session.js';

/**
 * The previous implementation used an isolate-local boolean and did not verify
 * x-admin-token. It was neither persistent nor capable of stopping all workers.
 * Keep the control unavailable until durable storage and enforcement are wired
 * into every governed agent/tool execution path.
 */
export async function onRequestGet({ request, env = {} }) {
  const auth = await verifyAdminSession(request, env);
  if (!auth.ok) return rejectAdminRequest(request, auth);
  return adminJson(request, {
    status: 'NOT_CONFIGURED',
    code: 'KILLSWITCH_ENFORCEMENT_NOT_READY',
    message: 'No persistent, system-wide kill-switch is configured. No state change was made.'
  }, 503);
}

export async function onRequestPost({ request, env = {} }) {
  const auth = await verifyAdminSession(request, env);
  if (!auth.ok) return rejectAdminRequest(request, auth);
  const body = await request.json().catch(() => ({}));
  const action = body.action || 'STATUS';
  if (!['STATUS', 'ENGAGE_KILL_SWITCH', 'DISENGAGE_KILL_SWITCH'].includes(action)) {
    return adminJson(request, { status: 'INVALID_ACTION' }, 400);
  }
  return adminJson(request, {
    status: 'NOT_CONFIGURED',
    code: 'KILLSWITCH_ENFORCEMENT_NOT_READY',
    requested_action: action,
    message: 'No persistent, system-wide kill-switch is configured. No agent or worker state was changed.'
  }, 503);
}

export function onRequestOptions({ request }) {
  return adminOptions(request);
}
