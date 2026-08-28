#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const failures = [];
const findings = [];

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const forms = [...source.matchAll(/<form\b([\s\S]*?)>([\s\S]*?)<\/form>/gi)];
  if (!forms.length) continue;

  forms.forEach(([_, attrs, body], index) => {
    const formLabel = `${file} form#${index + 1}`;
    const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1] || '';
    const method = (attrs.match(/\bmethod\s*=\s*["']([^"']+)["']/i)?.[1] || 'get').toLowerCase();
    const action = attrs.match(/\baction\s*=\s*["']([^"']*)["']/i)?.[1] || '';
    const hasOnSubmit = /\bonsubmit\s*=\s*["']/i.test(attrs);
    const hasSubmitControl = /<(?:button|input)\b[^>]*\b(?:type\s*=\s*["']submit["']|type\s*=\s*["']image["'])/i.test(body);
    const hasJsFormHook = /(?:addEventListener\s*\(\s*["']submit["']|\.onsubmit\s*=|requestSubmit\s*\(|submit\s*\()/i.test(source);

    if (!id && !action && !hasOnSubmit && !hasJsFormHook) {
      failures.push(`${formLabel}: no id, action, onsubmit, or detectable JS submit hook`);
    }
    if (!hasSubmitControl && method !== 'get') {
      failures.push(`${formLabel}: non-GET form has no submit control`);
    }

    const fields = [...body.matchAll(/<(input|select|textarea)\b([\s\S]*?)(?:>|\/>)/gi)];
    for (const [, tag, fieldAttrs] of fields) {
      const type = (fieldAttrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1] || (tag === 'input' ? 'text' : '')).toLowerCase();
      if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;
      const name = fieldAttrs.match(/\bname\s*=\s*["']([^"']*)["']/i)?.[1] || '';
      const aria = /\baria-label\s*=\s*["'][^"']+["']/i.test(fieldAttrs);
      const idAttr = fieldAttrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1] || '';
      const required = /\brequired(?:\s|=|\/?>)/i.test(fieldAttrs);
      if (!name && !aria && !idAttr) failures.push(`${formLabel}: field <${tag}> missing name/id/aria-label`);
      if (type === 'email' && !/\bautocomplete\s*=\s*["']email["']/i.test(fieldAttrs)) {
        findings.push(`${formLabel}: email field missing autocomplete=email`);
      }
      if (required && !/\b(?:minlength|pattern|required|maxlength|type\s*=)/i.test(fieldAttrs)) {
        findings.push(`${formLabel}: required field has limited client-side constraint metadata`);
      }
    }
  });
}

console.log(`FORM_CONTRACT_AUDIT: ${htmlFiles.length} HTML files inspected`);
if (findings.length) {
  console.log('NON_BLOCKING_FINDINGS');
  for (const item of findings.slice(0, 200)) console.log(`- ${item}`);
}
if (failures.length) {
  console.error('FORM_CONTRACT_AUDIT_FAIL');
  for (const item of failures.slice(0, 200)) console.error(`- ${item}`);
  process.exit(1);
}
console.log('FORM_CONTRACT_AUDIT_PASS');
