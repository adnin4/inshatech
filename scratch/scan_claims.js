const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));
const queries = [
  'LIVE API TEST',
  'Playwright Pipeline',
  '100% Data Security',
  'HIPAA',
  'Netlify',
  'iinsha.netlify.app',
  '50,000+',
  '0% block',
  '99.8% Success',
  '100% Security',
  'GDPR Guarantee',
  '100% Data',
  'Real production systems with verified metrics',
  'simulate Playwright Pipeline',
  '12,850+'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    queries.forEach(q => {
      if (line.toLowerCase().includes(q.toLowerCase())) {
        console.log(`${f}:${idx + 1} -> [Query: ${q}] ${line.trim().substring(0, 120)}`);
      }
    });
  });
});

