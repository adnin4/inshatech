/**
 * IINSHA AI Sales Engine
 * Progressive Qualification → Pain Discovery → Solution → ROI → Proposal → Checkout
 */

export class SalesEngine {
  constructor() {
    this.qualificationStages = [
      { id: 'industry', question_en: 'What industry is your business in?', question_bn: 'আপনার ব্যবসা কোন শিল্পে?', required: true },
      { id: 'pain', question_en: 'What is the biggest bottleneck or problem you\'re facing?', question_bn: 'আপনার সবচেয়ে বড় সমস্যা কী?', required: true },
      { id: 'channel', question_en: 'Which channels do you use? (WhatsApp, Website, Email, Social)', question_bn: 'আপনি কোন চ্যানেল ব্যবহার করেন?', required: false },
      { id: 'team_size', question_en: 'How many people are on your team?', question_bn: 'আপনার টিমে কতজন আছেন?', required: false },
      { id: 'budget', question_en: 'What\'s your approximate budget for automation?', question_bn: 'আপনার অটোমেশনের বাজেট কত?', required: false },
      { id: 'timeline', question_en: 'When do you need this deployed?', question_bn: 'কবে ডিপ্লয় করতে চান?', required: false }
    ];

    this.objectionHandlers = {
      'too_expensive': {
        en: 'I understand budget is important. Consider this: our n8n setup costs $497 one-time vs Zapier\'s $100+/month. That\'s $1,200+/year savings. And our WhatsApp bot at $750 replaces a $1,500/month human agent. The ROI typically shows within 30 days.',
        bn: 'আমি বুঝতে পারছি বাজেট গুরুত্বপূর্ণ। ভাবুন: n8n সেটআপ একবার $497 vs Zapier মাসিক $100+। বছরে $1,200+ সাশ্রয়!'
      },
      'not_ready': {
        en: 'No problem at all. I\'ll prepare a detailed proposal document you can review at your convenience. Would you like me to send it to your email or WhatsApp?',
        bn: 'কোন সমস্যা নেই। আমি একটা ডিটেইল্ড প্রোপোজাল তৈরি করে দিই। ইমেইল নাকি হোয়াটসঅ্যাপে পাঠাব?'
      },
      'need_proof': {
        en: 'Great question! We have verified case studies: Stripe churn recovery saved $38,400/year, Playwright Pipeline scraper extracted 12,000 leads in 48 hours. I can walk you through the technical architecture if you\'d like.',
        bn: 'ভালো প্রশ্ন! আমাদের ভেরিফাইড কেস স্টাডি আছে। আমি টেকনিক্যাল আর্কিটেকচার দেখাতে পারি।'
      },
      'competitor': {
        en: 'Fair point. The key difference: we use self-hosted n8n ($5.99/mo VPS) instead of expensive SaaS. Your data stays on YOUR server. No per-task fees. No vendor lock-in. And you get Bengali/Banglish AI support which no global competitor offers.',
        bn: 'সঠিক পয়েন্ট। পার্থক্য: আমরা self-hosted n8n ব্যবহার করি ($5.99/mo VPS)। আপনার ডাটা আপনার সার্ভারে থাকে। কোন প্রতি-টাস্ক ফি নেই।'
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
      ? 'আমি আপনার উদ্বেগ বুঝতে পারছি। আসুন আরেকটু বিস্তারিত আলোচনা করি।'
      : 'I understand your concern. Let\'s discuss this in more detail to find the right solution for you.';
  }

  // Generate proposal HTML
  generateProposal(service, knownFacts, roi) {
    return {
      title: `IINSHA AI Proposal: ${service.name}`,
      client: knownFacts.company || knownFacts.industry || 'Valued Client',
      service: service.name,
      investment: `$${service.priceUSD} USD / ৳${Math.round(service.priceUSD * 122.50)}`,
      delivery: `${service.deliveryDays} business days`,
      features: service.features,
      roi: roi,
      validDays: 7,
      createdAt: new Date().toISOString()
    };
  }
}
