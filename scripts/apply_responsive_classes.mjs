import fs from 'fs';

const replacements = [
  {
    target: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">',
    replacement: '<div class="hero-telemetry-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">',
    replacement: '<div class="hero-card-actions-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; text-align: center;">',
    replacement: '<div class="finder-metrics-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; text-align: center;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">',
    replacement: '<div class="roi-inputs-team-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">',
    replacement: '<div class="roi-inputs-invest-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">',
    replacement: '<div class="roi-results-metrics-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">',
    replacement: '<div class="blueprint-filter-grid" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">'
  },
  {
    target: '<div id="blueprint-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">',
    replacement: '<div id="blueprint-grid" class="blueprint-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; margin-bottom: 20px;">',
    replacement: '<div class="engineering-stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; margin-bottom: 20px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">',
    replacement: '<div class="hub-metrics-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">'
  },
  {
    target: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">',
    replacement: '<div class="hub-actions-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">'
  },
  {
    target: '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">',
    replacement: '<div class="partner-stats-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">'
  }
];

for (const file of ['index.html', 'live_index.html']) {
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const { target, replacement } of replacements) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      count++;
    } else {
      console.warn(`Target not found in ${file}: ${target.substring(0, 40)}...`);
    }
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}: ${count}/${replacements.length} replacements applied.`);
}
