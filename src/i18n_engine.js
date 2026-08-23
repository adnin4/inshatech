/**
 * IINSHA AI-BOS — Multi-Language i18n Real-Time Switcher Engine
 * Dynamically translates DOM nodes between English & Bengali in real-time
 */

(function() {
    const DICTIONARY = {
        en: {
            nav_store: "Turnkey Store",
            nav_marketplace: "AI Marketplace",
            nav_portal: "Customer Portal",
            nav_admin: "Executive Cockpit",
            hero_badge: "Enterprise Autonomous AI Company OS",
            hero_title: "Autonomous AI Company Operating System",
            hero_sub: "Self-hosted, bounded multi-agent systems delivering production automations with zero vendor lock-in.",
            btn_explore: "Explore Store",
            btn_wa: "WhatsApp Now"
        },
        bn: {
            nav_store: "টার্নকি স্টোর",
            nav_marketplace: "এআই মার্কেটপ্লেস",
            nav_portal: "কাস্টমার পোর্টাল",
            nav_admin: "এক্সিকিউটিভ ককপিট",
            hero_badge: "এন্টারপ্রাইজ অটোনোমাস এআই কোম্পানি ওএস",
            hero_title: "অটোনোমাস এআই কোম্পানি অপারেটিং সিস্টেম",
            hero_sub: "সেলফ-হোস্টেড বাউন্ডেড মাল্টি-এজেন্ট সিস্টেম—জিরো ভেন্ডর লক-ইন সহ সম্পূর্ণ অটোমেশন।",
            btn_explore: "স্টোর দেখুন",
            btn_wa: "হোয়াটসঅ্যাপে যোগাযোগ"
        }
    };

    class I18nEngine {
        constructor() {
            this.currentLang = localStorage.getItem('iinsha_lang') || 'en';
        }

        setLanguage(lang) {
            if (!DICTIONARY[lang]) return;
            this.currentLang = lang;
            localStorage.setItem('iinsha_lang', lang);
            this.translatePage();
        }

        translatePage() {
            const dict = DICTIONARY[this.currentLang];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    el.textContent = dict[key];
                }
            });
        }
    }

    window.IINSHA_I18N = new I18nEngine();
})();
