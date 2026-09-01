import assert from 'node:assert/strict';

// Pure logic checks for the live truth gate. No network, DB, payment, or UI mutation.
const extractSha = (payload) => payload?.git_sha || payload?.commit_sha || payload?.sha || '';
const routePass = ({ status, location, body }) => status === 200 && !location && Boolean(body?.length);

assert.equal(extractSha({ git_sha: 'abc' }), 'abc');
assert.equal(extractSha({ commit_sha: 'def' }), 'def');
assert.equal(extractSha({ sha: 'ghi' }), 'ghi');
assert.equal(extractSha({}), '');
assert.equal(routePass({ status: 200, location: null, body: '<html>' }), true);
assert.equal(routePass({ status: 200, location: '/other', body: '<html>' }), false);
assert.equal(routePass({ status: 404, location: null, body: '<html>' }), false);
assert.equal(routePass({ status: 200, location: null, body: '' }), false);

console.log('LIVE_TRUTH_UNIT_LOGIC_PASS');
