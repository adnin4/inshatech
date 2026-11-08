/**
 * IINSHA Content Truth System
 * Every quantitative claim must have a verified source/status.
 * Claim types: VERIFIED, CASE_STUDY, LIVE_TELEMETRY, TARGET, ESTIMATE, DEMO, SIMULATED
 */

(function() {
    'use strict';

    const TRUTH_LABELS = {
        VERIFIED: { color: '#10b981', icon: '●', text: 'VERIFIED' },
        CASE_STUDY: { color: '#6366f1', icon: '●', text: 'CASE STUDY' },
        LIVE_TELEMETRY: { color: '#00f2fe', icon: '●', text: 'LIVE' },
        TARGET: { color: '#f59e0b', icon: '●', text: 'TARGET' },
        ESTIMATE: { color: '#f59e0b', icon: '●', text: 'ESTIMATE' },
        DEMO: { color: '#ef4444', icon: '●', text: 'DEMO' },
        SIMULATED: { color: '#ef4444', icon: '●', text: 'SIMULATED' },
        CONFIGURATION_REQUIRED: { color: '#94a3b8', icon: '●‹', text: 'CONFIG REQUIRED' }
    };

    function createBadge(type) {
        const config = TRUTH_LABELS[type] || TRUTH_LABELS.DEMO;
        const badge = document.createElement('span');
        badge.className = 'truth-badge';
        badge.setAttribute('data-truth-type', type);
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: ${config.color}22;
            color: ${config.color};
            font-size: 0.6rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid ${config.color}44;
            margin-left: 8px;
            letter-spacing: 0.5px;
            vertical-align: middle;
            white-space: nowrap;
        `;
        badge.textContent = `${config.icon} ${config.text}`;
        return badge;
    }

    function injectTruthLabels() {
        // Map of CSS selectors to their truth status
        const claimMap = [
            // Index page metrics
            { selector: '[data-metric="uptime"]', type: 'TARGET' },
            { selector: '[data-metric="tasks"]', type: 'TARGET' },
            { selector: '[data-metric="speed-to-lead"]', type: 'TARGET' },
            { selector: '[data-metric="data-sovereignty"]', type: 'VERIFIED' },
            { selector: '[data-metric="savings"]', type: 'CASE_STUDY' },
            { selector: '[data-metric="agents"]', type: 'VERIFIED' },
            // General patterns - look for common metric containers
        ];

        claimMap.forEach(({ selector, type }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.querySelector('.truth-badge')) {
                    el.appendChild(createBadge(type));
                }
            });
        });

        // Auto-detect demo/simulated sections
        document.querySelectorAll('[data-demo], [data-simulated]').forEach(el => {
            if (!el.querySelector('.truth-badge')) {
                const type = el.hasAttribute('data-simulated') ? 'SIMULATED' : 'DEMO';
                const header = el.querySelector('h2, h3, h4, .section-title');
                if (header) {
                    header.appendChild(createBadge(type));
                }
            }
        });
    }

    // Export for programmatic use
    window.IINSHATruthSystem = {
        LABELS: TRUTH_LABELS,
        createBadge,
        injectTruthLabels
    };

    // Auto-inject on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(injectTruthLabels, 500);
    });
})();

