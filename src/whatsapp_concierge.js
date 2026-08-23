/**
 * IINSHA AI-BOS — Intelligent WhatsApp Concierge Widget
 * Direct high-conversion lead channel connected to Founder Adnin Sadat Mahin (+8801629286887)
 */

(function() {
    const OWNER_PHONE = '8801629286887';
    
    function injectWhatsAppWidget() {
        if (document.getElementById('iinsha-whatsapp-widget')) return;

        // 1. Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .wa-floating-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #25D366, #128C7E);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 30px;
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(255, 255, 255, 0.2);
            }
            .wa-floating-btn:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 12px 35px rgba(37, 211, 102, 0.6);
            }
            .wa-badge-pulse {
                position: absolute;
                top: -2px;
                right: -2px;
                width: 14px;
                height: 14px;
                background: #10B981;
                border-radius: 50%;
                border: 2px solid #040812;
                animation: waPulse 2s infinite;
            }
            @keyframes waPulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            .wa-modal-overlay {
                display: none;
                position: fixed;
                bottom: 95px;
                right: 24px;
                width: 360px;
                max-width: calc(100vw - 40px);
                background: rgba(7, 13, 26, 0.95);
                border: 1px solid rgba(37, 211, 102, 0.3);
                border-radius: 18px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(15px);
                z-index: 9999;
                overflow: hidden;
                animation: waSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .wa-modal-overlay.active { display: block; }
            @keyframes waSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .wa-modal-header {
                background: linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.3));
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .wa-modal-body {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .wa-pill-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #e2e8f0;
                padding: 8px 12px;
                border-radius: 10px;
                font-size: 0.82rem;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .wa-pill-btn:hover {
                background: rgba(37, 211, 102, 0.15);
                border-color: #25D366;
                color: #fff;
                transform: translateX(4px);
            }
            .wa-input-box {
                width: 100%;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 10px;
                padding: 10px 12px;
                color: #fff;
                font-size: 0.85rem;
                outline: none;
                resize: none;
            }
            .wa-input-box:focus { border-color: #25D366; }
            .wa-send-btn {
                background: linear-gradient(135deg, #25D366, #128C7E);
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 12px;
                font-weight: 700;
                font-size: 0.9rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
            }
            .wa-send-btn:hover {
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        // 2. Inject HTML Structure
        const container = document.createElement('div');
        container.id = 'iinsha-whatsapp-widget';
        container.innerHTML = `
            <div class="wa-floating-btn" id="wa-toggle-btn" title="Chat on WhatsApp with Founder">
                <span>💬</span>
                <span class="wa-badge-pulse"></span>
            </div>

            <div class="wa-modal-overlay" id="wa-modal">
                <div class="wa-modal-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            👨‍💻
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #fff; font-size: 0.95rem; font-weight: 700;">Adnin Sadat Mahin</h4>
                            <span style="font-size: 0.72rem; color: #10B981; display: flex; align-items: center; gap: 4px;">
                                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span> Online • Founder & Lead AI Engineer
                            </span>
                        </div>
                    </div>
                    <button id="wa-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
                </div>

                <div class="wa-modal-body">
                    <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">Select a solution or send a direct inquiry:</p>
                    
                    <button class="wa-pill-btn" data-msg="Hi Adnin! I am interested in deploying the B2B SaaS 5-Agent Hunter Swarm ($850). Can you share details?">
                        <span>🤖</span> B2B Lead Hunter Swarm ($850)
                    </button>
                    <button class="wa-pill-btn" data-msg="Hi Adnin! I want to set up the 24/7 E-Commerce WhatsApp & Messenger Sales Bot ($750) for my business.">
                        <span>💬</span> E-Commerce WhatsApp Bot ($750)
                    </button>
                    <button class="wa-pill-btn" data-msg="Hi Adnin! I need an AI Voice Receptionist ($1,800) with Twilio integration.">
                        <span>🎙️</span> AI Voice Receptionist ($1,800)
                    </button>
                    <button class="wa-pill-btn" data-msg="Hi Adnin! I want to migrate my workflows to a Self-Hosted n8n VPS Cluster ($497).">
                        <span>⚡</span> Self-Hosted n8n Cluster ($497)
                    </button>

                    <textarea id="wa-custom-msg" class="wa-input-box" rows="2" placeholder="Or type your custom project question..."></textarea>

                    <button id="wa-submit-btn" class="wa-send-btn">
                        <span>Send to WhatsApp</span> <span>➔</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // 3. Event Listeners
        const toggleBtn = document.getElementById('wa-toggle-btn');
        const modal = document.getElementById('wa-modal');
        const closeBtn = document.getElementById('wa-close-btn');
        const submitBtn = document.getElementById('wa-submit-btn');
        const customInput = document.getElementById('wa-custom-msg');

        toggleBtn.addEventListener('click', () => {
            modal.classList.toggle('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.querySelectorAll('.wa-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const msg = btn.getAttribute('data-msg');
                const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
                modal.classList.remove('active');
            });
        });

        submitBtn.addEventListener('click', () => {
            const text = customInput.value.trim() || 'Hi Adnin! I am visiting IINSHA AI-BOS and would like to discuss an AI automation project.';
            const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            customInput.value = '';
            modal.classList.remove('active');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWhatsAppWidget);
    } else {
        injectWhatsAppWidget();
    }
})();
