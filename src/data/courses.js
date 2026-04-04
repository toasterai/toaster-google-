export const ALL_COURSES = [
  // Core
  {
    id: 'core_1', type: 'Core', target: 'All', title: 'Certified AI Operator (CAIO)', desc: 'Our flagship certification to upskill your core team and plug massive organizational efficiency leaks.', price: 59.99,
    features: ['Enterprise Framework & Security', 'No-Code Automation Architecture', '50-Question Certification Exam'],
    modules: [
      { title: 'The Enterprise Framework', desc: 'Moving from casual ChatGPT usage to structured, enterprise-grade LLM deployment.', lessons: 5, quizzes: 10 },
      { title: 'Data Privacy & Security', desc: 'How to build "walled gardens" and ensure SOC2/GDPR compliance when using AI agents.', lessons: 6, quizzes: 10 },
      { title: 'No-Code Automation Architecture', desc: 'Connecting LLMs to your existing tech stack (Slack, CRM, Email) via API.', lessons: 8, quizzes: 15 },
      { title: 'Team Training License & Capstone Prep', desc: 'Creating standard operating procedures (SOPs) for your team and passing the final certification exam.', lessons: 4, quizzes: 0 }
    ],
    finalAssessment: '50-question comprehensive certification exam (80% passing grade required) and a live, peer-reviewed Capstone Project demonstrating a deployed automated workflow.'
  },

  // Roles
  {
    id: 'role_ceo', type: 'Role', target: 'CEO / Founder', title: 'CEO AI Strategy Masterclass', desc: 'Executive playbook for deploying AI at scale without sacrificing security or culture.', price: 59.99,
    features: ['ROI Tracking Frameworks', 'Change Management Strategies', 'AI Vendor Selection & Rollout'],
    modules: [
      { title: 'ROI Tracking Frameworks', desc: 'How to measure the financial impact of AI deployment across departments.', lessons: 4, quizzes: 5 },
      { title: 'Change Management', desc: 'Overcoming employee fear and driving high adoption rates for new AI tools.', lessons: 5, quizzes: 5 },
      { title: 'AI Vendor Selection', desc: 'Build vs. Buy analysis to avoid getting locked into overpriced "AI-wrapper" software.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question strategic final exam and the submission of a customized 12-month AI Rollout Executive Deck.'
  },
  {
    id: 'role_sales', type: 'Role', target: 'Sales', title: 'Sales AI Masterclass', desc: 'A highly tactical, step-by-step program to automate the daily workflows of modern sales professionals.', price: 19.99,
    features: ['Automated Lead Scoring', 'Hyper-Personalization at Scale', 'AI-Assisted Discovery'],
    modules: [
      { title: 'Automated Lead Scoring', desc: 'Using AI to analyze CRM intent data and prioritize high-value prospects.', lessons: 4, quizzes: 5 },
      { title: 'Hyper-Personalization at Scale', desc: 'Scraping LinkedIn/Web data to generate custom cold emails instantly.', lessons: 6, quizzes: 10 },
      { title: 'AI-Assisted Discovery', desc: 'Using conversational intelligence to analyze calls, handle objections, and auto-update CRM notes.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '25-question final test and a practical exercise: generating 5 personalized outbound sequences using an automated AI prompt chain.'
  },
  {
    id: 'role_ops', type: 'Role', target: 'Operations', title: 'Autonomous Operations', desc: 'Build self-healing, automated operational pipelines using zero-code AI logic.', price: 19.99,
    features: ['Zapier/Make Advanced AI', 'Data Routing Agents', 'Error Handling Logic'],
    modules: [
      { title: 'Zapier/Make Advanced AI', desc: 'Building multi-step cognitive workflows that categorize and route incoming data.', lessons: 5, quizzes: 5 },
      { title: 'Data Routing Agents', desc: 'Creating autonomous agents that process invoices, forms, and contracts without human touch.', lessons: 5, quizzes: 10 },
      { title: 'Error Handling', desc: 'Designing self-correcting logic loops that alert humans only when the AI encounters an edge case.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question final exam and submission of a functional multi-step Zap/Make blueprint integrating an LLM.'
  },
  {
    id: 'role_marketing', type: 'Role', target: 'Marketing', title: 'Marketing AI Bootcamp', desc: 'Generate multi-channel campaigns, predictive analytics, and dynamic content at scale.', price: 19.99,
    features: ['Predictive Trend Analysis', 'AI Copywriting at Scale', 'Programmatic SEO'],
    modules: [
      { title: 'Predictive Trend Analysis', desc: 'Using AI to analyze social sentiment and forecast upcoming market trends.', lessons: 4, quizzes: 5 },
      { title: 'AI Copywriting at Scale', desc: 'Fine-tuning models on your brand voice to generate 100x the content output.', lessons: 6, quizzes: 10 },
      { title: 'Programmatic SEO', desc: 'Automating the generation of high-quality, SEO-optimized landing pages tailored to niche keywords.', lessons: 5, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and a portfolio submission of a fully AI-generated multi-channel campaign (copy, visuals, and scheduling logic).'
  },
  {
    id: 'role_hr', type: 'Role', target: 'HR / People', title: 'HR Talent AI', desc: 'Automate sourcing, screening, and onboarding while eliminating bias.', price: 19.99,
    features: ['AI Resume Screening', 'Automated Onboarding Flows', 'Predictive Retention'],
    modules: [
      { title: 'AI Resume Screening', desc: 'Setting up unbiased, automated systems to rank candidates based purely on skill alignment.', lessons: 4, quizzes: 5 },
      { title: 'Automated Onboarding Flows', desc: 'Creating conversational AI agents that guide new hires through paperwork, culture, and training.', lessons: 5, quizzes: 5 },
      { title: 'Predictive Retention', desc: 'Analyzing internal communication and engagement surveys to predict and prevent employee churn.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and an architecture map for an automated 30-day employee onboarding sequence.'
  },
  {
    id: 'role_finance', type: 'Role', target: 'Finance', title: 'Finance Automation', desc: 'Deploy AI agents for reconciliation, forecasting, and anomaly detection.', price: 19.99,
    features: ['Automated Invoicing', 'Fraud Detection Models', 'Real-Time Forecasting'],
    modules: [
      { title: 'Automated Invoicing', desc: 'Using intelligent OCR and LLMs to extract, categorize, and log expenses automatically.', lessons: 4, quizzes: 5 },
      { title: 'Fraud Detection Models', desc: 'Setting up lightweight machine learning algorithms to flag duplicate payments and anomalies.', lessons: 5, quizzes: 10 },
      { title: 'Real-Time Forecasting', desc: 'Using predictive AI to dynamically model cash flow and runway based on market inputs.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question analytical final exam and a case study resolving a simulated set of anomalous transaction data using AI tools.'
  },
  {
    id: 'role_eng', type: 'Role', target: 'Product / Engineering', title: 'Engineering AI Copilot', desc: 'Integrate LLMs directly into your CI/CD pipelines and product architecture.', price: 19.99,
    features: ['Code Generation Standards', 'Automated QA Agents', 'RAG Implementation'],
    modules: [
      { title: 'Code Generation Standards', desc: 'Best practices for adopting GitHub Copilot/Cursor across a full engineering team.', lessons: 5, quizzes: 5 },
      { title: 'Automated QA Agents', desc: 'Building AI scripts that autonomously write and execute unit and end-to-end tests.', lessons: 6, quizzes: 10 },
      { title: 'RAG Implementation', desc: 'A technical dive into building Retrieval-Augmented Generation systems for your own SaaS products.', lessons: 6, quizzes: 10 }
    ],
    finalAssessment: '35-question technical exam and a functional code snippet demonstrating a basic RAG implementation.'
  },
  {
    id: 'role_cs', type: 'Role', target: 'Customer Success', title: 'CS Support Workflows', desc: 'Resolve 40%+ of Tier-1 tickets autonomously while boosting CSAT.', price: 19.99,
    features: ['AI Support Agents', 'Sentiment Analysis', 'Churn Prediction'],
    modules: [
      { title: 'AI Support Agents', desc: 'Training customer-facing chatbots on your proprietary knowledge base for instant resolutions.', lessons: 5, quizzes: 5 },
      { title: 'Sentiment Analysis', desc: 'Automatically tagging incoming tickets by anger/frustration levels for priority routing.', lessons: 4, quizzes: 5 },
      { title: 'Churn Prediction', desc: 'Analyzing support interactions to flag accounts at risk of non-renewal.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and the deployment of a custom-prompted support agent tested against 5 dummy tickets.'
  },

  // Industries
  {
    id: 'ind_telecom', type: 'Industry', target: 'Telecom', title: 'Telecom AI Playbook', desc: 'Learn how top Telecom companies use AI to predict churn and optimize infrastructure.', price: 19.99,
    features: ['Predictive Churn Modeling', 'Network Load AI', 'Tier-1 CS Automation'],
    modules: [
      { title: 'Predictive Churn Modeling', desc: 'Flagging subscribers likely to switch carriers based on usage drops and billing friction.', lessons: 4, quizzes: 5 },
      { title: 'Network Load AI', desc: 'Using machine learning to predict bandwidth spikes and dynamically reroute network resources.', lessons: 4, quizzes: 5 },
      { title: 'Tier-1 CS Automation', desc: 'Resolving billing queries and simple technical resets autonomously.', lessons: 3, quizzes: 5 }
    ],
    finalAssessment: '25-question strategic final exam and submission of a 90-day AI churn-reduction roadmap.'
  },
  {
    id: 'ind_saas', type: 'Industry', target: 'SaaS / Tech', title: 'SaaS Scaling AI', desc: 'Embed AI into your core product offering to drastically increase NRR.', price: 19.99,
    features: ['Product-Led AI Growth', 'Engineering Velocity', 'Algorithmic Pricing'],
    modules: [
      { title: 'Product-Led AI Growth', desc: 'Designing "sticky" AI features that force users to upgrade to premium tiers.', lessons: 5, quizzes: 5 },
      { title: 'Engineering Velocity', desc: 'Accelerating your product roadmap by 30% using AI-assisted coding and testing frameworks.', lessons: 4, quizzes: 5 },
      { title: 'Algorithmic Pricing', desc: 'Dynamically adjusting subscription offers and discounts based on user engagement metrics.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question final exam and a product specification document outlining a new AI feature for a hypothetical SaaS product.'
  },
  {
    id: 'ind_ecom', type: 'Industry', target: 'E-commerce', title: 'E-commerce Predictive AI', desc: 'Optimize supply chains and deliver hyper-personalized shopping experiences.', price: 19.99,
    features: ['Inventory Forecasting', 'Dynamic Pricing Models', 'Personalized Merchandising'],
    modules: [
      { title: 'Inventory Forecasting', desc: 'Predicting seasonal demand and viral product spikes to optimize warehouse stocking.', lessons: 4, quizzes: 5 },
      { title: 'Dynamic Pricing Models', desc: 'Adjusting price points in real-time based on competitor stock levels and consumer demand.', lessons: 4, quizzes: 5 },
      { title: 'Personalized Merchandising', desc: 'Replacing static storefronts with AI algorithms that show unique products to every visitor.', lessons: 5, quizzes: 10 }
    ],
    finalAssessment: '25-question final exam and an inventory/pricing optimization scenario test.'
  },
  {
    id: 'ind_services', type: 'Industry', target: 'Services', title: 'Services & Agency AI', desc: 'Productize your agency services and drastically increase your profit margins.', price: 19.99,
    features: ['Automated Client Reporting', 'AI Proposal Generation', 'Service Delivery Pipelines'],
    modules: [
      { title: 'Automated Client Reporting', desc: 'Compiling data from Google Analytics, Meta, and CRM into beautiful, AI-narrated weekly reports.', lessons: 4, quizzes: 5 },
      { title: 'AI Proposal Generation', desc: 'Generating custom, high-converting service proposals from a single intake call transcript.', lessons: 4, quizzes: 5 },
      { title: 'Service Delivery Pipelines', desc: 'Using AI to automate the actual fulfillment of digital services (SEO, design, copywriting).', lessons: 5, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and the creation of an automated client reporting workflow blueprint.'
  },
  {
    id: 'ind_health', type: 'Industry', target: 'Healthcare / Medical', title: 'Healthcare AI Compliance', desc: 'Deploy HIPAA-compliant AI to automate patient intake and medical coding.', price: 19.99,
    features: ['Compliant LLM Deployment', 'Automated Medical Scribing', 'Predictive Patient Care'],
    modules: [
      { title: 'Compliant LLM Deployment', desc: 'Safely using localized or enterprise-grade models that protect Protected Health Information (PHI).', lessons: 5, quizzes: 10 },
      { title: 'Automated Medical Scribing', desc: 'Using ambient voice AI to transcribe doctor-patient interactions directly into structured EHR notes.', lessons: 4, quizzes: 5 },
      { title: 'Predictive Patient Care', desc: 'Analyzing patient histories to flag risks of readmission or missed appointments.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question compliance and technical final exam (requires 85% to pass due to PHI sensitivity).'
  },
  {
    id: 'ind_fintech', type: 'Industry', target: 'Finance / Fintech', title: 'Fintech Algorithmic AI', desc: 'Leverage machine learning for real-time fraud detection and algorithmic advising.', price: 19.99,
    features: ['Fraud Anomaly Detection', 'Robo-Advising Logic', 'Regulatory Compliance AI'],
    modules: [
      { title: 'Fraud Anomaly Detection', desc: 'Building real-time transaction monitors that flag suspicious behavior without false positives.', lessons: 5, quizzes: 10 },
      { title: 'Robo-Advising Logic', desc: 'Creating scalable, personalized investment algorithms based on user risk profiles.', lessons: 4, quizzes: 5 },
      { title: 'Regulatory Compliance AI', desc: 'Using LLMs to continuously audit internal processes against changing global financial regulations.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '30-question final exam and a risk-modeling scenario analysis.'
  },
  {
    id: 'ind_mfg', type: 'Industry', target: 'Manufacturing / Logistics', title: 'Manufacturing & Logistics AI', desc: 'Prevent machine failure and optimize global routing dynamically.', price: 19.99,
    features: ['Predictive Maintenance', 'Supply Chain Routing', 'IoT AI Integration'],
    modules: [
      { title: 'Predictive Maintenance', desc: 'Using acoustic and vibration IoT sensors paired with AI to predict equipment failure before it happens.', lessons: 5, quizzes: 5 },
      { title: 'Supply Chain Routing', desc: 'Optimizing global freight and last-mile delivery routes in real-time based on weather and traffic algorithms.', lessons: 4, quizzes: 5 },
      { title: 'IoT AI Integration', desc: 'Connecting factory-floor sensors directly to centralized AI dashboards for real-time yield analysis.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and an optimization matrix exercise for a simulated supply chain bottleneck.'
  },
  {
    id: 'ind_re', type: 'Industry', target: 'Real Estate / Construction', title: 'Real Estate PropTech AI', desc: 'Automate lead qualification and generate algorithmic property valuations.', price: 19.99,
    features: ['Algorithmic Comps', 'Virtual AI Staging', 'Automated Lead Nurturing'],
    modules: [
      { title: 'Algorithmic Comps', desc: 'Going beyond the MLS to predict property valuations based on hyper-local trends and alternative data.', lessons: 4, quizzes: 5 },
      { title: 'Virtual AI Staging', desc: 'Instantly generating high-end, photorealistic interior designs for empty listings to boost buyer engagement.', lessons: 3, quizzes: 5 },
      { title: 'Automated Lead Nurturing', desc: 'Setting up conversational SMS agents that qualify Zillow/realtor.com leads 24/7.', lessons: 4, quizzes: 5 }
    ],
    finalAssessment: '25-question final exam and the setup of an automated lead qualification sequence.'
  },
  {
    id: 'ind_edtech', type: 'Industry', target: 'Education / EdTech', title: 'EdTech Learning AI', desc: 'Build personalized, adaptive learning pathways and automated grading systems.', price: 19.99,
    features: ['Adaptive Learning Algorithms', 'AI Tutoring Agents', 'Automated Rubric Grading'],
    modules: [
      { title: 'Adaptive Learning Algorithms', desc: 'Designing curriculum logic that adjusts difficulty in real-time based on student performance.', lessons: 5, quizzes: 5 },
      { title: 'AI Tutoring Agents', desc: 'Deploying 24/7 conversational agents fine-tuned specifically on your course materials.', lessons: 4, quizzes: 5 },
      { title: 'Automated Rubric Grading', desc: 'Using AI to evaluate essays and code submissions, providing instant, constructive feedback to students at scale.', lessons: 4, quizzes: 10 }
    ],
    finalAssessment: '25-question final exam and the design of a specialized AI tutor prompt framework for a specific academic subject.'
  },
];

export const ROLES = ["CEO / Founder", "Sales", "Operations", "Marketing", "HR / People", "Finance", "Product / Engineering", "Customer Success"];

export const INDUSTRIES = ["Telecom", "SaaS / Tech", "E-commerce", "Services", "Healthcare / Medical", "Finance / Fintech", "Manufacturing / Logistics", "Real Estate / Construction", "Education / EdTech"];

export const COMPANY_SIZE_MULTIPLIERS = {
  '1\u201310': 1000000,
  '11\u201350': 5000000,
  '51\u2013200': 20000000,
  '200+': 100000000,
};
