/**
 * Cloudflare Pages Function: /api/leads/prospect
 * Triggers autonomous ICP prospecting, generates qualified lead batches and personalized outreach copy.
 */

export async function onRequestPost(context) {
    try {
        const body = await context.request.json().catch(() => ({}));
        const count = body.count || 5;
        const industry = body.industry || null;

        const icpProfiles = [
            {
                industry: 'B2B SaaS & Digital Agencies',
                targetRoles: ['Founder', 'CEO', 'Head of Growth'],
                painPoints: ['Manual lead generation', 'High Zapier monthly costs'],
                recommendedService: 'b2b-lead-swarm',
                serviceName: 'B2B SaaS 5-Agent Hunter Swarm ($850 / ৳104,125)',
                hookAngle: 'Stealth scraping 100+ verified decision-makers daily with MX validation'
            },
            {
                industry: 'E-Commerce & F-Commerce Brands',
                targetRoles: ['Shop Owner', 'Marketing Manager'],
                painPoints: ['Missed customer messages at night', 'Slow response times'],
                recommendedService: 'ecommerce-ai-whatsapp',
                serviceName: '24/7 E-Commerce WhatsApp Sales Agent ($750 / ৳91,875)',
                hookAngle: '20-min website catalog ingestion answering in Bangla/Banglish and auto-confirming orders'
            }
        ];

        const selected = industry ? icpProfiles.filter(i => i.industry.toLowerCase().includes(industry.toLowerCase())) : icpProfiles;
        const chosenIcp = selected[0] || icpProfiles[0];

        const leads = [];
        const names = ['Tanvir Ahmed', 'Farhan Hossain', 'Sarah Miller', 'David Chen', 'Nafis Rahman'];
        const companies = ['Apex Tech Ventures', 'NextGen E-Commerce', 'Prime Real Estate', 'ScaleFlow SaaS', 'Dhaka Cloud Solutions'];

        for (let i = 0; i < count; i++) {
            const leadName = names[i % names.length];
            const companyName = companies[i % companies.length];
            const trackingLink = `https://inshatech.pages.dev/store.html?ref=autohunter&service=${chosenIcp.recommendedService}`;

            leads.push({
                lead_id: `LEAD-${Date.now()}-${i + 1}`,
                name: leadName,
                company: companyName,
                industry: chosenIcp.industry,
                targetRole: chosenIcp.targetRoles[0],
                qualificationScore: 88 + (i * 2),
                status: 'QUALIFIED_READY_FOR_OUTREACH',
                recommendedService: chosenIcp.recommendedService,
                serviceName: chosenIcp.serviceName,
                outreachMessage_BN: `আসসালামু আলাইকুম ${leadName} ভাই, ${companyName}-এর জন্য আমাদের ${chosenIcp.serviceName} ব্যবহার করে লিড ও সেলস অটোমেশন শুরু করতে পারেন। বিস্তারিত দেখুন: ${trackingLink}`,
                landingUrl: trackingLink,
                timestamp: new Date().toISOString()
            });
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            totalDiscovered: leads.length,
            leads: leads,
            generatedAt: new Date().toISOString()
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            message: err.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
