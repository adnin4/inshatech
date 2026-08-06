import os

app_js_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    code = f.read()

# Let's inspect if bindIBOSModuleListeners exists or if we should add it right after renderAdminModalCmsStudio
interactive_listeners_code = """
/* ============================================================
   IBOS MASTER ENTERPRISE ADMIN CONTROL PANEL — INTERACTIVE CRUD ENGINE
   Granular Control for Every Single Word, Service, Pricing & Credential
   ============================================================ */

function bindIBOSModuleListeners() {
    // 1. SAVE GLOBAL CMS WORDS & HEADLINES ("Every single word")
    const btnSaveWords = document.getElementById('ibos-btn-save-words');
    if (btnSaveWords) {
        btnSaveWords.addEventListener('click', () => {
            const words = getSiteWords();
            const heroTitle = document.getElementById('ibos-hero-title')?.value.trim();
            const heroSub = document.getElementById('ibos-hero-sub')?.value.trim();
            const whatsapp = document.getElementById('ibos-whatsapp-input')?.value.trim();
            const brandName = document.getElementById('ibos-brand-input')?.value.trim();
            const footerText = document.getElementById('ibos-footer-input')?.value.trim();

            if (heroTitle) words.heroTitle = heroTitle;
            if (heroSub) words.heroSub = heroSub;
            if (whatsapp) words.whatsapp = whatsapp;
            if (brandName) words.brandName = brandName;
            if (footerText) words.footerText = footerText;

            saveSiteWords(words);

            // Update live DOM elements immediately
            const heroTitleEl = document.querySelector('.hero-content h1') || document.querySelector('h1');
            const heroSubEl = document.querySelector('.hero-content p') || document.querySelector('.hero p');
            if (heroTitleEl && heroTitle) heroTitleEl.innerHTML = sanitize(heroTitle);
            if (heroSubEl && heroSub) heroSubEl.innerHTML = sanitize(heroSub);

            alert('✅ Global CMS Headlines & Words saved successfully!');
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    // 2. SAVE DYNAMIC BDT EXCHANGE RATE & PAYMENT CONFIG
    const btnUpdateRate = document.getElementById('ibos-btn-update-rate');
    if (btnUpdateRate) {
        btnUpdateRate.addEventListener('click', () => {
            const inputRate = parseFloat(document.getElementById('ibos-bdt-rate-input')?.value);
            if (isNaN(inputRate) || inputRate <= 0) {
                alert('⚠️ Please enter a valid exchange rate (e.g. 120)');
                return;
            }
            const words = getSiteWords();
            words.bdtRate = inputRate;
            saveSiteWords(words);

            // Update currency elements across page
            document.querySelectorAll('.currency-toggle-btn.active').forEach(b => b.click());

            alert(`✅ Exchange Rate saved! 1 USD = ৳${inputRate} BDT across all services.`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    // 3. SERVICE REGISTRY CRUD (Add, Edit, Delete Services & Packages)
    const btnAddService = document.getElementById('ibos-btn-add-service');
    if (btnAddService) {
        btnAddService.addEventListener('click', () => {
            const title = prompt('Enter Service Title:');
            if (!title) return;
            const category = prompt('Enter Category (e.g. AI Agents, Web Scraping, Automations):', 'AI Agents');
            const price = parseFloat(prompt('Enter Service Price ($ USD):', '499')) || 499;
            const commission = parseFloat(prompt('Enter Affiliate Commission Rate (%):', '20')) || 20;

            const registry = getServiceRegistry();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            registry.push({
                slug,
                title,
                category,
                price,
                commission_rate: commission,
                packages: [
                    { name: 'Starter Tier', price, delivery: '3 Days', features: ['Core System Setup', 'API Integration', '24/7 SLA Support'] },
                    { name: 'Enterprise Tier', price: price * 2, delivery: '7 Days', features: ['Full Swarm Deployment', 'Custom RAG Database', 'Dedicated Account Manager'] }
                ],
                features: ['Production Ready', 'Scalable Architecture', 'Full Source Code'],
                media_url: 'portfolio_hermes_ai_agent.jpg',
                status: 'published'
            });

            saveServiceRegistry(registry);
            alert(`🎉 New Service "${title}" ($${price}) added to Single Source Registry!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    document.querySelectorAll('.ibos-btn-edit-svc').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-svc-idx'));
            const registry = getServiceRegistry();
            const svc = registry[idx];
            if (!svc) return;

            const newTitle = prompt('Edit Service Title:', svc.title);
            if (newTitle === null) return;
            const newPrice = parseFloat(prompt('Edit Price ($ USD):', svc.price));
            if (isNaN(newPrice)) return;
            const newComm = parseFloat(prompt('Edit Commission (%):', svc.commission_rate));

            svc.title = newTitle || svc.title;
            svc.price = !isNaN(newPrice) ? newPrice : svc.price;
            svc.commission_rate = !isNaN(newComm) ? newComm : svc.commission_rate;

            saveServiceRegistry(registry);
            alert(`✅ Service "${svc.title}" updated successfully!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    });

    document.querySelectorAll('.ibos-btn-delete-svc').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-svc-idx'));
            const registry = getServiceRegistry();
            const svc = registry[idx];
            if (!svc) return;

            if (confirm(`⚠️ Are you sure you want to delete service "${svc.title}"?`)) {
                registry.splice(idx, 1);
                saveServiceRegistry(registry);
                alert(`🗑️ Service deleted from OS Registry.`);
                renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
            }
        });
    });

    // 4. RBAC ADMIN CREDENTIALS CRUD (Add/Edit Email & Password)
    const btnAddAdmin = document.getElementById('ibos-btn-add-admin');
    if (btnAddAdmin) {
        btnAddAdmin.addEventListener('click', () => {
            const email = prompt('Enter New Admin Email:');
            if (!email) return;
            const password = prompt('Enter New Password:');
            if (!password) return;
            const role = prompt('Enter Role (Super Admin / Manager / Editor):', 'Admin');

            const admins = getAdminUsers();
            admins.push({ email, password, name: email.split('@')[0], role });
            saveAdminUsers(admins);

            alert(`🛡️ New Admin User "${email}" created!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    document.querySelectorAll('.ibos-btn-edit-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-admin-idx'));
            const admins = getAdminUsers();
            const adm = admins[idx];
            if (!adm) return;

            const newEmail = prompt('Edit Admin Email:', adm.email);
            if (newEmail === null) return;
            const newPass = prompt('Edit Admin Password:', adm.password);
            if (newPass === null) return;

            adm.email = newEmail || adm.email;
            adm.password = newPass || adm.password;

            saveAdminUsers(admins);
            alert(`✅ Admin Credentials for "${adm.email}" updated successfully!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    });

    // 5. AFFILIATE & CLIENT CRM LISTENERS
    const btnAddAffiliate = document.getElementById('ibos-btn-add-affiliate');
    if (btnAddAffiliate) {
        btnAddAffiliate.addEventListener('click', () => {
            const name = prompt('Enter Affiliate Partner Name:');
            if (!name) return;
            const email = prompt('Enter Partner Email:');
            if (!email) return;
            const code = prompt('Enter Custom Ref Token Code (e.g. AFF10025):', 'AFF' + Math.floor(1000 + Math.random() * 9000));

            const data = getIBOSData();
            const affs = data.affiliates;
            affs.push({
                aff_id: code,
                name,
                email,
                tier: 'VIP',
                commission_rate: 20,
                earnings_total: 0,
                clicks_total: 0,
                sales_total: 0
            });
            localStorage.setItem('iinsha_ibos_affiliates', JSON.stringify(affs));
            alert(`🤝 Partner "${name}" (${code}) added to Affiliate BOS 5.0!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }
}
"""

# Let's check if bindIBOSModuleListeners is in app.js
if "function bindIBOSModuleListeners()" not in code:
    # Append bindIBOSModuleListeners right before openProtectedAdminPanel
    target = "function openProtectedAdminPanel()"
    code = code.replace(target, interactive_listeners_code + "\n\n" + target)
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully added bindIBOSModuleListeners to app.js!")
else:
    print("bindIBOSModuleListeners already exists!")
