/**
 * IINSHA AI-BOS 2.0 — Unified Autonomous Company Operating System Client Engine
 * Orchestrates Visitor Journey: Visit -> Chat -> Price Authority -> Checkout -> Fulfillment -> Retention
 */

(function () {
    class AutonomousCompanyOS {
        constructor() {
            this.version = "2.1.0-enterprise";
            this.currencyRates = { USD: 1.0, BDT: 122.50 };
            this.activeTenantId = "default";
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            this.initialized = true;
            console.log(`[IINSHA AI-BOS 2.0] Autonomous Company OS initialized (v${this.version})`);
            this.bindGlobalActions();
        }

        bindGlobalActions() {
            // Global pricing and checkout modal trigger
            window.openAutonomousCheckout = (serviceId, packageName, priceUSD) => {
                this.handleServiceCheckout(serviceId, packageName, priceUSD);
            };

            // Global Copilot invocation with prefilled business objective
            window.consultAiCopilot = (objectiveText) => {
                if (window.UniversalAiCopilotInstance) {
                    window.UniversalAiCopilotInstance.toggleWindow(true);
                    const input = document.getElementById('copilot-text-input');
                    if (input && objectiveText) {
                        input.value = objectiveText;
                        window.UniversalAiCopilotInstance.handleSendMessage();
                    }
                }
            };
        }

        async handleServiceCheckout(serviceId, packageName, priceUSD) {
            console.log(`[IINSHA AI-BOS] Initiating server-authoritative checkout for ${serviceId} ($${priceUSD})`);
            if (typeof window.openPricingCheckoutModal === 'function') {
                window.openPricingCheckoutModal(packageName || serviceId, `$${priceUSD}`);
            } else if (window.UniversalAiCopilotInstance) {
                window.UniversalAiCopilotInstance.toggleWindow(true);
                window.UniversalAiCopilotInstance.addAssistantMessage(
                    `Would you like to deploy **${packageName || serviceId}** ($${priceUSD})? I can connect you directly to server-verified checkout or founder WhatsApp support.`,
                    `à¦†à¦ªà¦¨à¦¿ à¦•à¦¿ **${packageName || serviceId}** ($${priceUSD}) à¦¡à¦¿à¦ªà§à¦²à¦¯à¦¼ à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦¨? à¦†à¦®à¦¿ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¸à¦¿à¦•à¦¿à¦‰à¦° à¦šà§‡à¦•à¦†à¦‰à¦Ÿ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¿à¥¤`
                );
            }
        }
    }

    // Initialize globally
    window.IinshaAutonomousCompanyOS = new AutonomousCompanyOS();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.IinshaAutonomousCompanyOS.init());
    } else {
        window.IinshaAutonomousCompanyOS.init();
    }
})();

