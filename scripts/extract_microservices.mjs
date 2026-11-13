import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const regex = /data-service-id="(svc-\d+)"\s+data-service-slug="([^"]+)"\s+data-service-category="([^"]+)"><div class="service-item-title"><span>[^<]+<\/span>\s*([^<]+)<\/div><div class="service-item-desc">([^<]+)<\/div>/g;
let match;
const services = [];
while ((match = regex.exec(html)) !== null) {
  services.push({
    id: match[1],
    slug: match[2],
    category: match[3],
    title: match[4].trim(),
    desc: match[5].trim()
  });
}
console.log('Found services:', services.length);
if (services.length > 0) {
  console.log('First:', services[0]);
  console.log('Last:', services[services.length - 1]);
}
fs.writeFileSync('scripts/extracted_microservices.json', JSON.stringify(services, null, 2));
