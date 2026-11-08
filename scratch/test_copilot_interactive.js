const fs = require('fs');
const path = require('path');

const testQueries = [
    'i want website',
    'i need help',
    'hi',
    'koto taka lagbe',
    'why are you repeating',
    'affiliate marketing account kivabe create korbo?',
    'website e affiliate marketing ache naki nai?',
    'how to become affiliate',
    'partner program',
    'referral link kivabe pabo',
    'b2b leads dorkar',
    'whatsapp bot price',
    'n8n vs zapier'
];

const patterns = [
    { name: 'repetition_complaint', regex: /\b(why are you repeating|repeating|repeat|same answer|same reply|ekoi answer|ekoi uttor|diccho keno|mia|bar bar|repetitive)\b/i },
    { name: 'affiliate_inquiry', regex: /\b(affiliate|partner|commission|earn money|referral|refer|affiliates)\b/i },
    { name: 'website_inquiry', regex: /\b(website|web site|web development|landing page|build site|create website|web design|web app|frontend|portfolio|ecommerce site)\b/i },
    { name: 'help_inquiry', regex: /\b(help|need help|help me|sahajjo|sahajjo lagbe|how to start|kivabe shuru|what can you do|ki korte paro|kivabe help korba)\b/i },
    { name: 'greeting', regex: /\b(hi|hello|hey|kamne|kemon|halo|assalamu|slm|greetings|bro|bhai|vai)\b/i },
    { name: 'pricing_quote', regex: /\b(quote|proposal|cost for my|how much for|pricing|price|dam koto|koto taka|cost|package price|rates)\b/i },
    { name: 'lead_swarm', regex: /\b(lead|scraping|b2b|extract|prospects|hunter|apollo|linkedin)\b/i },
    { name: 'ecommerce_bot', regex: /\b(whatsapp|messenger|bot|ecommerce|e-commerce|shop|store|order|cod)\b/i },
    { name: 'n8n_inquiry', regex: /\b(n8n|zapier|make|automation|cluster|docker|vps|workflow)\b/i }
];

testQueries.forEach(q => {
    let matched = 'general_business_query';
    for (const p of patterns) {
        if (p.regex.test(q)) {
            matched = p.name;
            break;
        }
    }
    console.log(`ðŸ’¬ User: "${q}" â”€â”€> Intent: ðŸŽ¯ [${matched}]`);
});

