export function generateAdaptiveQuestions(role, industry) {
  const questions = [];

  questions.push({
    id: 'core_1', category: 'core',
    text: 'How many hours per week does your team spend on repetitive, manual tasks?',
    options: [
      { text: 'More than 20 hours (Highly manual)', score: 1 },
      { text: '10\u201320 hours (Some automation, but disjointed)', score: 2 },
      { text: '5\u201310 hours (Basic AI/automation in place)', score: 3 },
      { text: 'Under 5 hours (Highly automated & AI-leveraged)', score: 4 },
    ]
  });

  questions.push({
    id: 'core_2', category: 'core',
    text: "How centralized is your company's current AI adoption strategy?",
    options: [
      { text: 'No strategy; individuals might use ChatGPT randomly', score: 1 },
      { text: 'Discussed by leadership, but no formal rollout', score: 2 },
      { text: 'Specific teams have mandated AI tools and workflows', score: 3 },
      { text: 'Company-wide AI roadmap with tracked ROI metrics', score: 4 },
    ]
  });

  let roleQ = { id: 'role_1', category: 'role', text: '', options: [] };
  switch (role) {
    case 'CEO / Founder':
      roleQ.text = 'As a founder, how are you tracking the ROI of AI implementation across departments?';
      roleQ.options = [
        { text: "We aren't tracking it at all", score: 1 },
        { text: 'We look at generic SaaS usage metrics', score: 2 },
        { text: 'Department heads report anecdotal efficiency gains', score: 3 },
        { text: 'We have hard metrics linking AI to cost savings or revenue', score: 4 }
      ]; break;
    case 'Sales':
      roleQ.text = 'Do you currently use AI for lead scoring and automated follow-ups?';
      roleQ.options = [
        { text: 'No, completely manual prioritization', score: 1 },
        { text: 'We use basic CRM rules, but no actual AI', score: 2 },
        { text: 'AI helps draft emails, but scoring is manual', score: 3 },
        { text: 'Fully automated AI lead scoring and initial outreach', score: 4 }
      ]; break;
    case 'Operations':
      roleQ.text = 'What percentage of your operational workflows (data entry, routing) are AI-automated?';
      roleQ.options = [
        { text: '0\u201310% (Almost entirely manual)', score: 1 },
        { text: '11\u201330% (A few Zapier/Make automations)', score: 2 },
        { text: '31\u201360% (Solid automation base)', score: 3 },
        { text: '60%+ (AI agents handle routing and processing)', score: 4 }
      ]; break;
    case 'Marketing':
      roleQ.text = 'How is AI utilized in your campaign creation and data analysis?';
      roleQ.options = [
        { text: "We don't use AI for marketing yet", score: 1 },
        { text: 'Only for basic copywriting (ChatGPT)', score: 2 },
        { text: 'For copy, image generation, and A/B test ideation', score: 3 },
        { text: 'Predictive analytics, dynamic content, and automated scale', score: 4 }
      ]; break;
    case 'HR / People':
      roleQ.text = 'How are you using AI to streamline recruiting and employee onboarding?';
      roleQ.options = [
        { text: '100% manual sourcing and onboarding', score: 1 },
        { text: 'We use basic ATS filters, but no generative AI', score: 2 },
        { text: 'AI helps draft job posts and initial candidate screening', score: 3 },
        { text: 'End-to-end AI sourcing, screening, and automated onboarding', score: 4 }
      ]; break;
    case 'Finance':
      roleQ.text = 'To what extent is AI automating your financial reporting and invoice processing?';
      roleQ.options = [
        { text: 'Fully manual data entry and Excel crunching', score: 1 },
        { text: 'Standard accounting software defaults only', score: 2 },
        { text: 'OCR tools extract invoice data with some manual review', score: 3 },
        { text: 'AI handles real-time predictive forecasting and automated reconciliation', score: 4 }
      ]; break;
    case 'Product / Engineering':
      roleQ.text = 'How integrated are AI coding assistants and automated testing in your dev cycle?';
      roleQ.options = [
        { text: 'No AI tools used in development', score: 1 },
        { text: 'Individual devs use Copilot occasionally', score: 2 },
        { text: 'AI is standard for code generation and PR reviews', score: 3 },
        { text: 'Autonomous agents handle testing, debugging, and minor feature deployment', score: 4 }
      ]; break;
    case 'Customer Success':
      roleQ.text = 'How is AI handling your inbound support ticket volume?';
      roleQ.options = [
        { text: '100% human-answered tickets, slow response times', score: 1 },
        { text: 'Basic keyword-based chatbots and macro templates', score: 2 },
        { text: 'AI drafts human-approved responses and auto-tags tickets', score: 3 },
        { text: 'AI autonomously resolves 40%+ of Tier 1 support inquiries', score: 4 }
      ]; break;
    default:
      roleQ.text = 'How integrated is AI into your daily responsibilities?';
      roleQ.options = [
        { text: 'Not at all', score: 1 }, { text: 'Occasionally used for basic tasks', score: 2 },
        { text: 'Used daily as an assistant', score: 3 }, { text: 'Core to my output and fully integrated', score: 4 }
      ];
  }
  questions.push(roleQ);

  let indQ = { id: 'ind_1', category: 'industry', text: '', options: [] };
  switch (industry) {
    case 'Telecom':
      indQ.text = 'In the Telecom space, are you leveraging AI to predict customer churn or optimize infrastructure?';
      indQ.options = [
        { text: 'No, we rely on historical reports and manual analysis', score: 1 },
        { text: 'We use basic trigger alerts for churn', score: 2 },
        { text: 'AI is used in pockets for customer service/chatbots', score: 3 },
        { text: 'Predictive AI actively flags churn and optimizes network loads', score: 4 }
      ]; break;
    case 'SaaS / Tech':
      indQ.text = 'How deeply is AI integrated into your actual software product and engineering workflows?';
      indQ.options = [
        { text: 'No AI features or AI coding assistants used', score: 1 },
        { text: 'Devs use Copilot, but no AI in our actual product', score: 2 },
        { text: 'We have a basic AI wrapper feature in our app', score: 3 },
        { text: 'AI is a core product differentiator and engineering multiplier', score: 4 }
      ]; break;
    case 'E-commerce':
      indQ.text = 'Are you using AI for dynamic inventory forecasting and hyper-personalized recommendations?';
      indQ.options = [
        { text: 'No, standard Shopify/platform defaults only', score: 1 },
        { text: 'Basic "frequently bought together" algorithms', score: 2 },
        { text: 'AI generated product descriptions and basic forecasting', score: 3 },
        { text: 'End-to-end AI personalization and inventory prediction', score: 4 }
      ]; break;
    case 'Services':
      indQ.text = 'How does AI assist in client onboarding and service delivery automation?';
      indQ.options = [
        { text: 'Highly manual, custom proposals and onboarding', score: 1 },
        { text: 'We use templates, but customization is manual', score: 2 },
        { text: 'AI drafts proposals and helps summarize client calls', score: 3 },
        { text: 'Service delivery is heavily productized via AI workflows', score: 4 }
      ]; break;
    case 'Healthcare / Medical':
      indQ.text = 'Are you leveraging AI for patient triage or medical record summarization?';
      indQ.options = [
        { text: 'Completely manual charting and patient intake', score: 1 },
        { text: 'Basic digital forms, but staff manually reviews everything', score: 2 },
        { text: 'AI assists in transcribing notes or basic scheduling', score: 3 },
        { text: 'AI autonomously summarizes patient histories and predicts no-shows', score: 4 }
      ]; break;
    case 'Finance / Fintech':
      indQ.text = 'How are you using AI for fraud detection or personalized financial advising?';
      indQ.options = [
        { text: 'Manual review of flagged transactions', score: 1 },
        { text: 'Standard rule-based alerts provided by vendors', score: 2 },
        { text: 'Machine learning models flag anomalies for human review', score: 3 },
        { text: 'Real-time AI fraud prevention and hyper-personalized automated wealth insights', score: 4 }
      ]; break;
    case 'Manufacturing / Logistics':
      indQ.text = 'Is AI optimizing your supply chain routing or predictive maintenance?';
      indQ.options = [
        { text: 'Break-fix maintenance and manual logistics planning', score: 1 },
        { text: 'Basic software for routing, but no predictive capabilities', score: 2 },
        { text: 'IoT sensors provide alerts, but human analysis is required', score: 3 },
        { text: 'AI predicts machine failures before they happen and auto-reroutes shipments dynamically', score: 4 }
      ]; break;
    case 'Real Estate / Construction':
      indQ.text = 'How is AI accelerating your property valuations or project management?';
      indQ.options = [
        { text: 'Manual comp analysis and spreadsheet tracking', score: 1 },
        { text: 'Using standard MLS/Zillow data with no custom AI layer', score: 2 },
        { text: 'AI helps generate property descriptions and virtual tours', score: 3 },
        { text: 'AI models predict market trends and fully automate lead qualification', score: 4 }
      ]; break;
    case 'Education / EdTech':
      indQ.text = 'How is AI enabling personalized learning or automated grading for your students?';
      indQ.options = [
        { text: '100% manual grading and standardized lesson plans', score: 1 },
        { text: 'Digital quizzes with auto-scoring, but no adaptive learning', score: 2 },
        { text: 'AI helps teachers draft lesson plans and rubrics', score: 3 },
        { text: 'AI tutors provide real-time, personalized feedback to every student', score: 4 }
      ]; break;
    default:
      indQ.text = 'How is AI transforming your core service delivery?';
      indQ.options = [
        { text: "It isn't yet", score: 1 }, { text: 'Exploring use cases', score: 2 },
        { text: 'Active pilot programs running', score: 3 }, { text: 'Fully integrated into our value proposition', score: 4 }
      ];
  }
  questions.push(indQ);

  questions.push({
    id: 'core_3', category: 'core',
    text: 'Based on your operational bottlenecks, what is the biggest barrier preventing you from scaling AI today?',
    options: [
      { text: 'Lack of knowledge or internal talent', score: 1 },
      { text: 'Fear of security risks or data privacy', score: 2 },
      { text: 'No time to implement; stuck working "in" the business', score: 3 },
      { text: 'Just need strategic alignment; we are ready to execute', score: 4 },
    ]
  });

  return questions;
}
