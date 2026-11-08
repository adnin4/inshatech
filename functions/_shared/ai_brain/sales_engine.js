/**
 * IINSHA AI Sales Engine
 * Progressive Qualification â†’ Pain Discovery â†’ Solution â†’ ROI â†’ Proposal â†’ Checkout
 */

export class SalesEngine {
  constructor() {
    this.qualificationStages = [
      { id: 'industry', question_en: 'What industry is your business in?', question_bn: 'à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦¬à¦¸à¦¾ à¦•à§‹à¦¨ à¦¶à¦¿à¦²à§à¦ªà§‡?', required: true },
      { id: 'pain', question_en: 'What is the biggest bottleneck or problem you\'re facing?', question_bn: 'à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¬à¦šà§‡à§Ÿà§‡ à¦¬à§œ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦•à§€?', required: true },
      { id: 'channel', question_en: 'Which channels do you use? (WhatsApp, Website, Email, Social)', question_bn: 'à¦†à¦ªà¦¨à¦¿ à¦•à§‹à¦¨ à¦šà§à¦¯à¦¾à¦¨à§‡à¦² à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡à¦¨?', required: false },
      { id: 'team_size', question_en: 'How many people are on your team?', question_bn: 'à¦†à¦ªà¦¨à¦¾à¦° à¦Ÿà¦¿à¦®à§‡ à¦•à¦¤à¦œà¦¨ à¦†à¦›à§‡à¦¨?', required: false },
      { id: 'budget', question_en: 'What\'s your approximate budget for automation?', question_bn: 'à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦Ÿà§‹à¦®à§‡à¦¶à¦¨à§‡à¦° à¦¬à¦¾à¦œà§‡à¦Ÿ à¦•à¦¤?', required: false },
      { id: 'timeline', question_en: 'When do you need this deployed?', question_bn: 'à¦•à¦¬à§‡ à¦¡à¦¿à¦ªà§à¦²à§Ÿ à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦¨?', required: false }
    ];

    this.objectionHandlers = {
      'too_expensive': {
        en: 'I understand budget is important. Consider this: our n8n setup costs $497 one-time vs Zapier\'s $100+/month. That\'s $1,200+/year savings. And our WhatsApp bot at $750 replaces a $1,500/month human agent. The ROI typically shows within 30 days.',
        bn: 'à¦†à¦®à¦¿ à¦¬à§à¦à¦¤à§‡ à¦ªà¦¾à¦°à¦›à¦¿ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦—à§à¦°à§à¦¤à§à¦¬à¦ªà§‚à¦°à§à¦£à¥¤ à¦­à¦¾à¦¬à§à¦¨: n8n à¦¸à§‡à¦Ÿà¦†à¦ª à¦à¦•à¦¬à¦¾à¦° $497 vs Zapier à¦®à¦¾à¦¸à¦¿à¦• $100+à¥¤ à¦¬à¦›à¦°à§‡ $1,200+ à¦¸à¦¾à¦¶à§à¦°à¦¯à¦¼!'
      },
      'not_ready': {
        en: 'No problem at all. I\'ll prepare a detailed proposal document you can review at your convenience. Would you like me to send it to your email or WhatsApp?',
        bn: 'à¦•à§‹à¦¨ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¨à§‡à¦‡à¥¤ à¦†à¦®à¦¿ à¦à¦•à¦Ÿà¦¾ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à§à¦¡ à¦ªà§à¦°à§‹à¦ªà§‹à¦œà¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡ à¦¦à¦¿à¦‡à¥¤ à¦‡à¦®à§‡à¦‡à¦² à¦¨à¦¾à¦•à¦¿ à¦¹à§‹à§Ÿà¦¾à¦Ÿà¦¸à¦…à§à¦¯à¦¾à¦ªà§‡ à¦ªà¦¾à¦ à¦¾à¦¬?'
      },
      'need_proof': {
        en: 'Great question! We have verified case studies: Stripe churn recovery saved $38,400/year, Playwright Pipeline scraper extracted 12,000 leads in 48 hours. I can walk you through the technical architecture if you\'d like.',
        bn: 'à¦­à¦¾à¦²à§‹ à¦ªà§à¦°à¦¶à§à¦¨! à¦†à¦®à¦¾à¦¦à§‡à¦° à¦­à§‡à¦°à¦¿à¦«à¦¾à¦‡à¦¡ à¦•à§‡à¦¸ à¦¸à§à¦Ÿà¦¾à¦¡à¦¿ à¦†à¦›à§‡à¥¤ à¦†à¦®à¦¿ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§à¦¯à¦¾à¦² à¦†à¦°à§à¦•à¦¿à¦Ÿà§‡à¦•à¦šà¦¾à¦° à¦¦à§‡à¦–à¦¾à¦¤à§‡ à¦ªà¦¾à¦°à¦¿à¥¤'
      },
      'competitor': {
        en: 'Fair point. The key difference: we use self-hosted n8n ($5.99/mo VPS) instead of expensive SaaS. Your data stays on YOUR server. No per-task fees. No vendor lock-in. And you get Bengali/Banglish AI support which no global competitor offers.',
        bn: 'à¦¸à¦ à¦¿à¦• à¦ªà§Ÿà§‡à¦¨à§à¦Ÿà¥¤ à¦ªà¦¾à¦°à§à¦¥à¦•à§à¦¯: à¦†à¦®à¦°à¦¾ self-hosted n8n à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¿ ($5.99/mo VPS)à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¾à¦°à§à¦­à¦¾à¦°à§‡ à¦¥à¦¾à¦•à§‡à¥¤ à¦•à§‹à¦¨ à¦ªà§à¦°à¦¤à¦¿-à¦Ÿà¦¾à¦¸à§à¦• à¦«à¦¿ à¦¨à§‡à¦‡à¥¤'
      }
    };
  }

  // Get next qualification question based on what's already known
  getNextQuestion(knownFacts, isBengali = false) {
    for (const stage of this.qualificationStages) {
      if (!knownFacts[stage.id]) {
        return {
          stage_id: stage.id,
          question: isBengali ? stage.question_bn : stage.question_en,
          required: stage.required
        };
      }
    }
    return null; // All questions answered
  }

  // Calculate qualification score (0-100)
  calculateLeadScore(knownFacts) {
    let score = 30; // Base score for engagement
    if (knownFacts.industry) score += 15;
    if (knownFacts.pain) score += 20;
    if (knownFacts.channel) score += 10;
    if (knownFacts.budget) score += 15;
    if (knownFacts.timeline) score += 10;
    return Math.min(score, 100);
  }

  // Recommend services based on qualification data
  recommendServices(knownFacts, servicesCatalog) {
    const recommendations = [];
    const pain = (knownFacts.pain || '').toLowerCase();
    const industry = (knownFacts.industry || '').toLowerCase();
    const channel = (knownFacts.channel || '').toLowerCase();

    for (const service of servicesCatalog) {
      let relevance = 0;
      const desc = (service.description || '').toLowerCase();
      const idealFor = (service.idealFor || []).join(' ').toLowerCase();

      if (pain.includes('lead') || pain.includes('sales')) {
        if (service.category === 'Lead Generation') relevance += 40;
      }
      if (pain.includes('whatsapp') || pain.includes('bot') || pain.includes('customer')) {
        if (service.category === 'E-Commerce Bot') relevance += 40;
      }
      if (pain.includes('automation') || pain.includes('zapier') || pain.includes('workflow')) {
        if (service.category === 'Infrastructure') relevance += 40;
      }
      if (pain.includes('voice') || pain.includes('call') || pain.includes('phone')) {
        if (service.category === 'Voice AI') relevance += 40;
      }
      if (pain.includes('invoice') || pain.includes('document') || pain.includes('ocr')) {
        if (service.category === 'Document Automation') relevance += 40;
      }

      if (idealFor.includes(industry)) relevance += 20;
      if (channel && desc.includes(channel)) relevance += 10;

      if (relevance > 0) {
        recommendations.push({ ...service, relevance });
      }
    }

    recommendations.sort((a, b) => b.relevance - a.relevance);
    return recommendations.slice(0, 3);
  }

  // Calculate ROI for a service
  calculateROI(service, knownFacts) {
    const monthlySavings = service.priceUSD * 0.15; // Conservative 15% monthly return
    const breakEvenMonths = Math.ceil(service.priceUSD / monthlySavings);
    const yearOneSavings = (monthlySavings * 12) - service.priceUSD;
    const yearTwoSavings = monthlySavings * 12;

    return {
      investment: service.priceUSD,
      investmentBDT: Math.round(service.priceUSD * 122.50),
      monthlySavings: Math.round(monthlySavings),
      breakEvenMonths,
      yearOneSavings: Math.round(yearOneSavings),
      yearTwoSavings: Math.round(yearTwoSavings),
      roiPercent: Math.round(((yearOneSavings + yearTwoSavings) / service.priceUSD) * 100)
    };
  }

  // Handle objection
  handleObjection(objectionType, isBengali = false) {
    const handler = this.objectionHandlers[objectionType];
    if (handler) {
      return isBengali ? handler.bn : handler.en;
    }
    return isBengali
      ? 'à¦†à¦®à¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦‰à¦¦à§à¦¬à§‡à¦— à¦¬à§à¦à¦¤à§‡ à¦ªà¦¾à¦°à¦›à¦¿à¥¤ à¦†à¦¸à§à¦¨ à¦†à¦°à§‡à¦•à¦Ÿà§ à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦•à¦°à¦¿à¥¤'
      : 'I understand your concern. Let\'s discuss this in more detail to find the right solution for you.';
  }

  // Generate proposal HTML
  generateProposal(service, knownFacts, roi) {
    return {
      title: `IINSHA AI Proposal: ${service.name}`,
      client: knownFacts.company || knownFacts.industry || 'Valued Client',
      service: service.name,
      investment: `$${service.priceUSD} USD / à§³${Math.round(service.priceUSD * 122.50)}`,
      delivery: `${service.deliveryDays} business days`,
      features: service.features,
      roi: roi,
      validDays: 7,
      createdAt: new Date().toISOString()
    };
  }
}

