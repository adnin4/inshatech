import services from '../../../knowledge/services.json';
import faqs from '../../../knowledge/faqs.json';
import company from '../../../knowledge/company.json';

export async function onRequestGet(context) {
    try {
        const url = new URL(context.request.url);
        const query = url.searchParams.get('q');
        const category = url.searchParams.get('category');

        if (!query) {
            return new Response(JSON.stringify({ error: 'Missing search query ?q=' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const q = query.toLowerCase();
        let results = [];

        // Search services
        if (!category || category === 'services') {
            for (const s of services) {
                const textToSearch = `${s.name} ${s.description} ${s.category} ${s.features.join(' ')} ${s.technologies.join(' ')}`.toLowerCase();
                if (textToSearch.includes(q)) {
                    results.push({
                        content: s,
                        source: 'services.json',
                        relevance: 0.9 // naive scoring
                    });
                }
            }
        }

        // Search FAQs
        if (!category || category === 'faqs') {
            for (const f of faqs) {
                const textToSearch = `${f.question} ${f.answer}`.toLowerCase();
                if (textToSearch.includes(q)) {
                    results.push({
                        content: f,
                        source: 'faqs.json',
                        relevance: 0.8
                    });
                }
            }
        }

        // Search Company Info
        if (!category || category === 'company') {
            const companyStr = JSON.stringify(company).toLowerCase();
            if (companyStr.includes(q)) {
                results.push({
                    content: company,
                    source: 'company.json',
                    relevance: 1.0
                });
            }
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            results,
            total: results.length
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
