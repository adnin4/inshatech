/**
 * IINSHA AI-BOS — Universal UX Interactions Engine
 * Enhances smooth navigation, keyboard navigation (Escape, Ctrl+K), backdrop dismissal,
 * clipboard feedback, and mobile touch usability.
 */

(function () {
    'use strict';

    // 1. Universal Toast Notification Element
    function ensureToastElement() {
        if (!document.getElementById('iinsha-ux-toast')) {
            const toast = document.createElement('div');
            toast.id = 'iinsha-ux-toast';
            toast.innerHTML = '<span id="iinsha-toast-icon">✨</span><span id="iinsha-toast-msg">Notification</span>';
            document.body.appendChild(toast);
        }
    }

    window.showToast = function (msg, type = 'success', duration = 3000) {
        ensureToastElement();
        const toast = document.getElementById('iinsha-ux-toast');
        const msgEl = document.getElementById('iinsha-toast-msg');
        const iconEl = document.getElementById('iinsha-toast-icon');
        if (!toast || !msgEl) return;

        msgEl.textContent = msg;
        if (type === 'success') {
            iconEl.textContent = '✅';
            toast.style.borderColor = 'rgba(16, 185, 129, 0.5)';
        } else if (type === 'error') {
            iconEl.textContent = '⚠️';
            toast.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            iconEl.textContent = 'ℹ️';
            toast.style.borderColor = 'rgba(56, 189, 248, 0.5)';
        }

        toast.classList.add('show');
        if (window._toastTimeout) clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // 2. Universal Escape Key & Command Palette (Ctrl + K) Listener
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes any open modal/popup
            if (e.key === 'Escape' || e.keyCode === 27) {
                closeAllModals();
            }

            // Ctrl + K or Cmd + K opens Command Palette
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const cmdModal = document.getElementById('cmd-palette-modal');
                if (cmdModal) {
                    if (cmdModal.style.display === 'flex' || cmdModal.style.display === 'block') {
                        cmdModal.style.display = 'none';
                    } else {
                        cmdModal.style.display = 'flex';
                        const input = document.getElementById('cmd-search-input');
                        if (input) setTimeout(() => input.focus(), 50);
                    }
                }
            }
        });
    }

    // 3. Close All Modals Helper
    function closeAllModals() {
        // Modal selectors
        const modals = document.querySelectorAll(
            '.toast-modal, .exit-popup-overlay, .pkg-modal-overlay, .admin-modal-overlay, .lead-modal-overlay, .cmd-palette-overlay, #cmd-palette-modal, #lead-magnet-modal, #admin-control-modal, #intake-modal, #exit-popup, #package-compare-modal, #checkout-modal, #ai-readiness-modal, #ai-playground-modal'
        );
        modals.forEach((m) => {
            m.classList.add('hidden');
            m.style.display = 'none';
        });

        // Floating chat boxes
        const chatBox = document.getElementById('floating-chat-box');
        if (chatBox) chatBox.style.display = 'none';

        const chatbotWin = document.getElementById('chatbot-window');
        if (chatbotWin) chatbotWin.style.display = 'none';
    }

    // 4. Universal Backdrop Click to Dismiss Modals
    function initBackdropDismissal() {
        document.addEventListener('click', (e) => {
            // Check if clicking directly on an overlay container (not its inner modal content)
            const target = e.target;
            if (
                target.classList.contains('exit-popup-overlay') ||
                target.classList.contains('pkg-modal-overlay') ||
                target.classList.contains('admin-modal-overlay') ||
                target.classList.contains('lead-modal-overlay') ||
                target.classList.contains('cmd-palette-overlay') ||
                target.id === 'cmd-palette-modal' ||
                target.id === 'lead-magnet-modal' ||
                target.id === 'admin-control-modal' ||
                target.id === 'intake-modal' ||
                target.id === 'exit-popup' ||
                target.id === 'package-compare-modal'
            ) {
                target.classList.add('hidden');
                target.style.display = 'none';
            }
        });
    }

    // 5. Universal Copy to Clipboard Helper
    function initClipboardCopy() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-copy], .copy-btn');
            if (btn) {
                const textToCopy = btn.getAttribute('data-copy') || btn.textContent.trim();
                if (textToCopy && navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        window.showToast(`Copied to Clipboard! ✓`, 'success');
                    }).catch(() => {
                        window.showToast(`Copied: ${textToCopy}`, 'info');
                    });
                }
            }
        });
    }

    // 6. Mobile Navigation Auto-Close on Link Click
    function initMobileNavAutoClose() {
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                const mobileMenu = document.querySelector('.mobile-menu, .nav-links.active, #mobile-nav');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active', 'open', 'show');
                }
            });
        });
    }

    // 7. Lead Magnet Download Form Feedback Handler
    function initLeadMagnetHandler() {
        const magnetBtn = document.getElementById('magnet-download-btn');
        const magnetInput = document.getElementById('magnet-contact-input');

        if (magnetBtn && magnetInput) {
            magnetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = magnetInput.value.trim();
                if (!val) {
                    magnetInput.focus();
                    magnetInput.style.borderColor = '#ef4444';
                    window.showToast('Please enter your work email or WhatsApp number', 'error');
                    return;
                }

                magnetBtn.disabled = true;
                magnetBtn.innerHTML = 'Sending Blueprint... ⏳';
                setTimeout(() => {
                    magnetBtn.innerHTML = '✅ Starter Kit Sent!';
                    magnetBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    window.showToast('AI Automation Starter Kit sent to your inbox!', 'success');
                    magnetInput.value = '';
                }, 800);
            });
        }
    }

    
    // 8. Ponder & Chronicle Dynamic Cursor Spotlight Tracking
    function initSpotlightTracking() {
        const updateSpotlight = (card, e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        };

        document.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.glass-card, .ipc-card, .blueprint-card, .store-card, .tmpl-card, .solution-card, .hero-studio-card, .pkg-card, .trust-principle-card, .premium-card, .lead-magnet-card, .newsletter-card');
            if (card) {
                updateSpotlight(card, e);
            }
        }, { passive: true });
    }

    // 9. Interactive Ponder 4-Step Pipeline Workflow Simulator
    let simulatedDealRevenue = 850;
    window.simulatePipelineStep = function(stepIdx) {
        const steps = document.querySelectorAll('.pipeline-step-item');
        if (!steps || steps.length === 0) return;

        steps.forEach((s, idx) => {
            if (idx === stepIdx) {
                s.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                s.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                s.style.transform = 'scale(1.02) translateX(4px)';
                s.style.background = 'rgba(255, 255, 255, 0.08)';
            } else {
                s.style.boxShadow = 'none';
                s.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                s.style.transform = 'scale(1) translateX(0)';
                s.style.background = 'rgba(255, 255, 255, 0.03)';
            }
        });

        const msgs = [
            '⚡ 01 // Inbound WhatsApp Lead Captured & Validated via Webhook',
            '🤖 02 // Gemini 3.0 Vision OCR Extracted Intent & Specifications',
            '🧠 03 // 18-Agent Autonomous Swarm Formulated Architecture Proposal',
            '💰 04 // Deal Auto-Closed & Synced to PostgreSQL 17 + Cloudflare R2'
        ];

        if (window.showToast) {
            window.showToast(msgs[stepIdx] || 'Pipeline Step Activated', 'info', 2500);
        }

        // Increment live simulated revenue badge if step 4
        if (stepIdx === 3) {
            simulatedDealRevenue += 850;
            const revBadge = document.getElementById('hero-live-deal-metric');
            if (revBadge) {
                revBadge.textContent = '+$' + simulatedDealRevenue.toLocaleString() + ' USD';
                revBadge.style.color = '#10b981';
            }
        }
    };

    // Initialize all on DOM ready
    
    // Live Real-Time Service Search & Filter across all 80+ Micro-Services
    function initServiceLiveSearch() {
        const searchInput = document.getElementById('service-live-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const panels = document.querySelectorAll('.service-panel');
            const tabs = document.querySelectorAll('.service-tab-btn');

            if (!query) {
                // Restore currently selected tab view
                const activeTab = document.querySelector('.service-tab-btn.active') || tabs[0];
                const targetId = activeTab ? activeTab.getAttribute('data-target') : 'cat-agents';
                panels.forEach(p => {
                    p.classList.toggle('active', p.id === targetId);
                    p.querySelectorAll('.service-item-card').forEach(c => {
                        c.style.display = '';
                        c.style.opacity = '1';
                    });
                });
                return;
            }

            // Search active: Reveal matching cards across all categories
            panels.forEach(p => {
                let hasMatchInPanel = false;
                p.querySelectorAll('.service-item-card').forEach(c => {
                    const text = c.textContent.toLowerCase();
                    const isMatch = text.includes(query);
                    c.style.display = isMatch ? 'flex' : 'none';
                    if (isMatch) hasMatchInPanel = true;
                });
                p.classList.toggle('active', hasMatchInPanel);
            });
        });
    }

    function initUX() {
        initServiceLiveSearch();
        ensureToastElement();
        initKeyboardShortcuts();
        initBackdropDismissal();
        initClipboardCopy();
        initMobileNavAutoClose();
        initLeadMagnetHandler();
        initSpotlightTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUX);
    } else {
        initUX();
    }
})();
