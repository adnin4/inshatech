import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const file='app.js';
const source=fs.readFileSync(file,'utf8');
let s=source;
const fixes=[
[/const company = \(\(document\.getElementById\('audit-company'\) \? document\.getElementById\('audit-company'\)\?\.value \|\| ''\) : \"\"\);/g,"const company = document.getElementById('audit-company')?.value || '';"],
[/const industry = \(\(document\.getElementById\('audit-industry'\) \? document\.getElementById\('audit-industry'\)\?\.value \|\| ''\) : \"\"\);/g,"const industry = document.getElementById('audit-industry')?.value || '';"],
[/const bottleneck = \(\(document\.getElementById\('audit-bottleneck'\) \? document\.getElementById\('audit-bottleneck'\)\?\.value \|\| ''\) : \"\"\);/g,"const bottleneck = document.getElementById('audit-bottleneck')?.value || '';"],
[/const name = \(\(document\.getElementById\('chk-name'\) \? document\.getElementById\('chk-name'\)\?\.value \|\| ''\) : \"\"\);/g,"const name = document.getElementById('chk-name')?.value || '';"],
[/const email = \(\(document\.getElementById\('chk-email'\) \? document\.getElementById\('chk-email'\)\?\.value \|\| ''\) : \"\"\);/g,"const email = document.getElementById('chk-email')?.value || '';"],
[/const method = \(\(document\.getElementById\('chk-method'\) \? document\.getElementById\('chk-method'\)\?\.value \|\| ''\) : \"\"\);/g,"const method = document.getElementById('chk-method')?.value || '';"],
[/const industry = \(\(document\.getElementById\('finder-industry-select'\) \? document\.getElementById\('finder-industry-select'\)\?\.value \|\| ''\) : \"\"\);/g,"const industry = document.getElementById('finder-industry-select')?.value || '';"],
[/const bottleneck = \(\(document\.getElementById\('finder-bottleneck-select'\) \? document\.getElementById\('finder-bottleneck-select'\)\?\.value \|\| ''\) : \"\"\);/g,"const bottleneck = document.getElementById('finder-bottleneck-select')?.value || '';"],
[/const amount = parseFloat\(\(\(document\.getElementById\('withdraw-amount-input'\) \? document\.getElementById\('withdraw-amount-input'\)\?\.value \|\| ''\) : \"\"\)\);/g,"const amount = parseFloat(document.getElementById('withdraw-amount-input')?.value || '');"],
[/const method = \(\(document\.getElementById\('withdraw-method-select'\) \? document\.getElementById\('withdraw-method-select'\)\?\.value \|\| ''\) : \"\"\);/g,"const method = document.getElementById('withdraw-method-select')?.value || '';"],
[/const account = \(\(document\.getElementById\('withdraw-account-input'\) \? document\.getElementById\('withdraw-account-input'\)\?\.value \|\| ''\) : \"\"\);/g,"const account = document.getElementById('withdraw-account-input')?.value || '';"],
[/const name = \(\(document\.getElementById\('partner-reg-name'\) \? document\.getElementById\('partner-reg-name'\)\?\.value \|\| ''\) : \"\"\);/g,"const name = document.getElementById('partner-reg-name')?.value || '';"],
[/const email = \(\(document\.getElementById\('partner-reg-email'\) \? document\.getElementById\('partner-reg-email'\)\?\.value \|\| ''\) : \"\"\);/g,"const email = document.getElementById('partner-reg-email')?.value || '';"],
[/const slug = \(\(document\.getElementById\('partner-reg-slug'\) \? document\.getElementById\('partner-reg-slug'\)\?\.value \|\| ''\) : \"\"\)\.trim\(\)\.replace\(\/\[\^a-zA-Z0-9-_\]\/g, ''\) \|\| 'partner';/g,"const slug = (document.getElementById('partner-reg-slug')?.value || '').trim().replace(/[^a-zA-Z0-9-_]/g, '') || 'partner';"],
[/const payout = \(\(document\.getElementById\('partner-reg-payout'\) \? document\.getElementById\('partner-reg-payout'\)\?\.value \|\| ''\) : \"\"\);/g,"const payout = document.getElementById('partner-reg-payout')?.value || '';"],
];
for(const [a,b] of fixes)s=s.replace(a,b);
s=s.replace(/\nwidget\.style\.cssText = [\s\S]*?\n    `;\n}\n/g,'\n');
fs.writeFileSync(file,s,'utf8');
const c=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
if(c.status!==0){console.error(c.stderr||c.stdout);process.exit(1);}
console.log('PUBLIC_SITE_HOTFIX: app.js syntax PASS');
