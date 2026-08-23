/**
 * IINSHA AI-BOS â€” MASTER BRAIN RUNTIME LOADER
 * Initializes the unified Commander instance for client-side and server-side execution.
 */

(function() {
    if (typeof window !== 'undefined') {
        window.initIinshaBrainRuntime = function() {
            if (typeof Commander !== 'undefined' && !window.iinshaCommander) {
                window.iinshaCommander = new Commander();
                console.log("ðŸš€ [IINSHA AI-BOS] Stateful Commander Brain Engine Online!");
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.initIinshaBrainRuntime);
        } else {
            window.initIinshaBrainRuntime();
        }
    }
})();

