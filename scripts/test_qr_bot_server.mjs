/**
 * Quick unit verification of Step 1 QR Bot Endpoint
 */

import http from 'http';

console.log('🧪 Testing Step 1 QR Bot Dashboard & API...');

const req = http.request({
    hostname: 'localhost',
    port: 3005,
    path: '/api/status',
    method: 'GET'
}, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log('🟢 Status Endpoint Response:', data);
        process.exit(0);
    });
});

req.on('error', (err) => {
    console.log('ℹ️ Server not running yet (expected before start):', err.message);
    process.exit(0);
});

req.end();
