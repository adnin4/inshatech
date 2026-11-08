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
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = '<span id="iinsha-toast-icon" aria-hidden="true">✨</span><span id="iinsha-toast-msg">Notification</span><button id="iinsha-toast-close" type="button" aria-label="Dismiss notification">×</button>';
            const closeButton = toast.querySelector('#iinsha-toast-close');
            if (closeButton) closeButton.addEventListener('click', () => toast.classList.remove('show'));
            document.body.appendChild(toast);
        }
    }

    window.showToast = function (msg, type = 'success', duration = 3000) {
        ensureToastElement();
        const toast = document.getElementById('iinsha-ux-toast');
        const msgEl = document.getElementById('iinsha-toast-msg');
        const iconEl = document.getElementById('iinsha-toast-icon');
        if (!toast || !msgEl) return;

        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
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
                const toast = document.getElementById('iinsha-ux-toast');
                if (toast) toast.classList.remove('show');
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
                        window.showToast('Clipboard access was blocked. Select the text and copy it manually.', 'error');
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

    // 7. Dismissible mobile contact bar
    function initStickyCtaDismissal() {
        const cta = document.querySelector('.sticky-mobile-cta');
        const closeButton = document.getElementById('sticky-mobile-cta-close');
        if (!cta || !closeButton) return;

        try {
            if (sessionStorage.getItem('iinsha_mobile_cta_dismissed') === '1') {
                cta.classList.add('is-dismissed');
            }
        } catch (error) {
            // The close button remains usable when browser storage is unavailable.
        }

        closeButton.addEventListener('click', () => {
            cta.classList.add('is-dismissed');
            try { sessionStorage.setItem('iinsha_mobile_cta_dismissed', '1'); } catch (error) {}
        });
    }

    // Initialize all on DOM ready
    function initUX() {
        ensureToastElement();
        initKeyboardShortcuts();
        initBackdropDismissal();
        initClipboardCopy();
        initMobileNavAutoClose();
        initStickyCtaDismissal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUX);
    } else {
        initUX();
    }
})();
