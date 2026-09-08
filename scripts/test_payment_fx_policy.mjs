import { resolveFxRate, convertUsdToBdt, FX_CONFIG } from '../functions/_shared/payments/fx_policy.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

console.log('================================================================================');
console.log('IINSHA AI-BOS: AUTHORITATIVE FX POLICY ENGINE TEST SUITE');
console.log('================================================================================\n');

// 1. Default policy configuration
{
    const fx = resolveFxRate({});
    assert(fx.rate === 122.50 && fx.source === 'DEFAULT_POLICY' && fx.policy === 'IINSHA_STABLE_PEG_V1',
        'Default FX policy resolves 122.50 rate and stable peg metadata');
    assert(typeof fx.timestamp === 'string' && fx.currency_pair === 'USD_BDT',
        'FX metadata includes ISO timestamp and USD_BDT currency pair');
}

// 2. Conversion accuracy
{
    const bdt = convertUsdToBdt(850, 122.50);
    assert(bdt === 104125, 'Converts  USD to 104,125 BDT accurately');
}

// 3. Rounding behavior
{
    //  * 122.50 = 30502.5 -> Math.round -> 30503
    const bdt = convertUsdToBdt(249, 122.50);
    assert(bdt === 30503, 'Enforces half-up integer rounding ( * 122.50 = 30502.5 -> 30503 BDT)');
}

// 4. Environment override with bounds checking
{
    const fxCustom = resolveFxRate({ BDT_CONVERSION_RATE: '125.00' });
    assert(fxCustom.rate === 125.00 && fxCustom.source === 'ENV_CONFIGURATION',
        'Valid env BDT_CONVERSION_RATE safely overrides default rate');

    const fxOutOfBounds = resolveFxRate({ BDT_CONVERSION_RATE: '500.00' });
    assert(fxOutOfBounds.rate === 122.50 && fxOutOfBounds.source === 'DEFAULT_POLICY',
        'Out-of-bounds env BDT_CONVERSION_RATE (>200) ignored; falls back to default');
}

// 5. Invalid USD amount error rejection
{
    let caught = false;
    try {
        convertUsdToBdt(-10);
    } catch (e) {
        caught = true;
    }
    assert(caught, 'Negative USD amount strictly rejected with Error');
}

console.log(`\nFX POLICY SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
if (passed === total) {
    console.log('PAYMENT_FX_POLICY=PASS\n');
}
