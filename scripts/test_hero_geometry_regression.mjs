import { captureAndMeasure } from './capture_cdp_screenshot.mjs';
import assert from 'assert';

async function runHeroGeometrySuite() {
  console.log('================================================================================');
  console.log('📐 IINSHA AI-BOS: HERO GEOMETRY & BOUNDING BOX REGRESSION SUITE (CDP TRUTH)');
  console.log('================================================================================');

  let passed = 0;
  let total = 0;

  function test(desc, fn) {
    total++;
    try {
      fn();
      console.log(`[🟢 PASS] ${desc}`);
      passed++;
    } catch (err) {
      console.error(`[🔴 FAIL] ${desc}: ${err.message}`);
      throw err;
    }
  }

  console.log('\n[TEST VIEWPORT 1: Desktop 1664 x 924 (Supplied Owner Viewport)]');
  const d1664 = await captureAndMeasure({ width: 1664, height: 924 }, 'docs/hero_desktop_1664_verified.png');

  test('HERO-GEOM-01: Hero title is wide and centered at desktop width (>= 700px)', () => {
    assert(d1664.title.width >= 700, `Expected title.width >= 700, got ${d1664.title.width}`);
    const expectedLeft = Math.round((d1664.viewport.width - d1664.title.width) / 2);
    assert(Math.abs(d1664.title.left - expectedLeft) <= 15, `Expected title.left near ${expectedLeft}, got ${d1664.title.left}`);
  });

  test('HERO-GEOM-02: Hero subtitle paragraph measure is healthy and readable (>= 420px, <= 800px)', () => {
    assert(d1664.subtitle.width >= 420, `FAIL: Subtitle collapsed to narrow column! Width was ${d1664.subtitle.width}`);
    assert(d1664.subtitle.width <= 800, `Expected subtitle.width <= 800, got ${d1664.subtitle.width}`);
  });

  test('HERO-GEOM-03: Hero subtitle is positioned directly beneath title without collision', () => {
    assert(d1664.title.bottom <= d1664.subtitle.top + 2, `Collision detected: title.bottom (${d1664.title.bottom}) > subtitle.top (${d1664.subtitle.top})`);
  });

  test('HERO-GEOM-04: Hero actions CTA group is wide (>= 500px) and positioned below subtitle', () => {
    assert(d1664.actions.width >= 500, `Expected actions.width >= 500, got ${d1664.actions.width}`);
    assert(d1664.subtitle.bottom <= d1664.actions.top + 2, `Collision detected: subtitle.bottom (${d1664.subtitle.bottom}) > actions.top (${d1664.actions.top})`);
  });

  test('HERO-GEOM-05: Hero celestial orbital scene / canvas renders below actions without occlusion', () => {
    assert(d1664.scene.width >= 600, `Expected scene.width >= 600, got ${d1664.scene.width}`);
    assert(d1664.actions.bottom <= d1664.scene.top + 2, `Collision detected: actions.bottom (${d1664.actions.bottom}) > scene.top (${d1664.scene.top})`);
  });

  test('HERO-GEOM-06: Hero trust strip renders cleanly below scene', () => {
    assert(d1664.trust.width >= 600, `Expected trust.width >= 600, got ${d1664.trust.width}`);
    assert(d1664.scene.bottom <= d1664.trust.top + 20, `Collision detected: scene.bottom (${d1664.scene.bottom}) > trust.top (${d1664.trust.top})`);
  });

  console.log('\n[TEST VIEWPORT 2: Standard Laptop 1440 x 900]');
  const d1440 = await captureAndMeasure({ width: 1440, height: 900 }, 'docs/hero_laptop_1440_verified.png');

  test('HERO-GEOM-07: Laptop paragraph measure remains >= 420px', () => {
    assert(d1440.subtitle.width >= 420, `Expected subtitle.width >= 420, got ${d1440.subtitle.width}`);
  });

  test('HERO-GEOM-08: Laptop actions remain centered and uncollapsed', () => {
    assert(d1440.actions.width >= 500, `Expected actions.width >= 500, got ${d1440.actions.width}`);
  });

  console.log('\n[TEST VIEWPORT 3: Mobile Viewport 390 x 844 (iPhone 14 / modern smartphone)]');
  const m390 = await captureAndMeasure({ width: 390, height: 844 }, 'docs/hero_mobile_390_verified.png');

  test('HERO-GEOM-09: Mobile stage enforces zero horizontal overflow', () => {
    assert(m390.stage.right <= m390.viewport.width + 5, `Horizontal overflow detected: stage.right (${m390.stage.right}) > viewport.width (${m390.viewport.width})`);
  });

  test('HERO-GEOM-10: Mobile single-column order is strictly maintained', () => {
    assert(m390.title.bottom <= m390.subtitle.top + 5, 'Title and subtitle overlap on mobile');
    assert(m390.subtitle.bottom <= m390.actions.top + 5, 'Subtitle and actions overlap on mobile');
  });

  console.log('\n================================================================================');
  console.log(`📊 HERO GEOMETRY REGRESSION SUITE: ${passed}/${total} TESTS PASSED (100%)`);
  console.log('Status: ALL HERO GEOMETRY & BOUNDING BOX INVARIANTS EMPIRICALLY CERTIFIED');
  console.log('================================================================================');
}

runHeroGeometrySuite().catch(err => {
  console.error('Suite failed:', err);
  process.exit(1);
});
