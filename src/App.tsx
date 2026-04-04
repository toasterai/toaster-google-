/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrainCircuit, 
  ChevronRight, 
  Command, 
  Hexagon, 
  Box, 
  Triangle, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Search, 
  Mail, 
  CreditCard, 
  X, 
  Loader2,
  Users,
  Briefcase,
  Building2,
  TrendingDown,
  BookOpen,
  Star,
  PlayCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

type Screen = 'landing' | 'segmentation' | 'assessment' | 'results' | 'catalog' | 'tos' | 'privacy';

const ROLES = ['CEO', 'Sales', 'Operations', 'Marketing', 'HR', 'Finance', 'Engineering', 'Customer Success'];
const INDUSTRIES = ['Telecom', 'SaaS', 'E-commerce', 'Services', 'Healthcare', 'Fintech', 'Manufacturing', 'Real Estate', 'EdTech'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '200+'];

const QUESTIONS = {
  core: [
    {
      id: 'core1',
      text: "How much of your daily repetitive workflow is currently handled by AI agents or automation?",
      options: [
        { text: "Less than 5% - Mostly manual", score: 1 },
        { text: "5-20% - Some basic automations", score: 2 },
        { text: "20-50% - Significant AI integration", score: 3 },
        { text: "Over 50% - AI-first operations", score: 4 }
      ]
    },
    {
      id: 'core2',
      text: "How integrated is your company data across different platforms for AI analysis?",
      options: [
        { text: "Siloed - Data lives in separate apps", score: 1 },
        { text: "Partial - Some APIs connected", score: 2 },
        { text: "Mostly - Centralized data warehouse", score: 3 },
        { text: "Fully - Unified real-time data stream", score: 4 }
      ]
    }
  ],
  role: {
    'CEO': [
      {
        text: "How do you currently track AI-driven ROI across your entire organization?",
        options: [
          { text: "We don't track it specifically", score: 1 },
          { text: "Qualitative feedback only", score: 2 },
          { text: "Basic cost-saving metrics", score: 3 },
          { text: "Advanced predictive ROI modeling", score: 4 }
        ]
      },
      {
        text: "How integrated is AI into your long-term strategic business roadmap?",
        options: [
          { text: "Not mentioned in strategy", score: 1 },
          { text: "Mentioned as a future goal", score: 2 },
          { text: "Core pillar of current strategy", score: 3 },
          { text: "Strategy is built around AI-first principles", score: 4 }
        ]
      },
      {
        text: "How do you manage AI governance and ethical risk at the board level?",
        options: [
          { text: "No formal governance", score: 1 },
          { text: "Ad-hoc discussions", score: 2 },
          { text: "Established AI ethics committee", score: 3 },
          { text: "Fully integrated AI risk framework", score: 4 }
        ]
      }
    ],
    'Sales': [
      {
        text: "What percentage of your lead qualification is automated using AI?",
        options: [
          { text: "0% - All manual outreach", score: 1 },
          { text: "10-30% - Basic email sequences", score: 2 },
          { text: "30-70% - AI-scored leads", score: 3 },
          { text: "70%+ - Autonomous lead gen", score: 4 }
        ]
      },
      {
        text: "How do you handle personalized outreach at scale?",
        options: [
          { text: "Generic templates only", score: 1 },
          { text: "Manual personalization per lead", score: 2 },
          { text: "AI-assisted drafting", score: 3 },
          { text: "Fully autonomous hyper-personalization", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your sales forecasting and pipeline management?",
        options: [
          { text: "Manual estimates", score: 1 },
          { text: "CRM-based linear projections", score: 2 },
          { text: "AI-driven predictive forecasting", score: 3 },
          { text: "Real-time autonomous pipeline optimization", score: 4 }
        ]
      }
    ],
    'Operations': [
      {
        text: "How often do you use AI to predict supply chain or process bottlenecks?",
        options: [
          { text: "Never - Reactive approach", score: 1 },
          { text: "Rarely - Occasional audits", score: 2 },
          { text: "Regularly - Monthly forecasting", score: 3 },
          { text: "Constantly - Real-time AI monitoring", score: 4 }
        ]
      },
      {
        text: "What is the density of automated agents in your core operational processes?",
        options: [
          { text: "Zero - All human-driven", score: 1 },
          { text: "Low - Isolated task automation", score: 2 },
          { text: "Medium - Integrated process flows", score: 3 },
          { text: "High - End-to-end agentic orchestration", score: 4 }
        ]
      },
      {
        text: "How do you use AI for real-time resource allocation and scheduling?",
        options: [
          { text: "Manual scheduling", score: 1 },
          { text: "Software-assisted (static)", score: 2 },
          { text: "AI-optimized dynamic scheduling", score: 3 },
          { text: "Fully autonomous resource orchestration", score: 4 }
        ]
      }
    ],
    'Marketing': [
      {
        text: "How personalized is your AI-driven content generation for different segments?",
        options: [
          { text: "Generic - One size fits all", score: 1 },
          { text: "Basic - Template-based personalization", score: 2 },
          { text: "Advanced - Dynamic content blocks", score: 3 },
          { text: "Hyper - Individualized 1:1 experiences", score: 4 }
        ]
      },
      {
        text: "How do you use AI for marketing attribution and spend optimization?",
        options: [
          { text: "Last-click attribution only", score: 1 },
          { text: "Basic multi-touch models", score: 2 },
          { text: "AI-driven predictive attribution", score: 3 },
          { text: "Autonomous real-time budget reallocation", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your customer journey mapping and next-best-action logic?",
        options: [
          { text: "Static journey maps", score: 1 },
          { text: "Trigger-based automation", score: 2 },
          { text: "AI-driven behavioral triggers", score: 3 },
          { text: "Real-time autonomous journey orchestration", score: 4 }
        ]
      }
    ],
    'HR': [
      {
        text: "How much of your initial resume screening is performed by AI?",
        options: [
          { text: "None - Manual review", score: 1 },
          { text: "Keyword matching only", score: 2 },
          { text: "AI-assisted ranking", score: 3 },
          { text: "Fully autonomous screening", score: 4 }
        ]
      },
      {
        text: "How do you use AI to predict and prevent employee churn?",
        options: [
          { text: "No predictive measures", score: 1 },
          { text: "Exit interviews only", score: 2 },
          { text: "Basic sentiment analysis", score: 3 },
          { text: "Predictive behavioral modeling", score: 4 }
        ]
      },
      {
        text: "How automated is your internal employee support and knowledge management?",
        options: [
          { text: "Manual HR support", score: 1 },
          { text: "Static FAQ/Wiki", score: 2 },
          { text: "AI Chatbot for basic queries", score: 3 },
          { text: "Autonomous AI HR Assistant", score: 4 }
        ]
      }
    ],
    'Finance': [
      {
        text: "To what extent is AI used for your company's expense auditing and fraud detection?",
        options: [
          { text: "Manual sampling only", score: 1 },
          { text: "Rule-based software", score: 2 },
          { text: "AI-assisted flagging", score: 3 },
          { text: "Autonomous real-time auditing", score: 4 }
        ]
      },
      {
        text: "How automated is your cash flow forecasting and financial modeling?",
        options: [
          { text: "Manual spreadsheets", score: 1 },
          { text: "Software with basic formulas", score: 2 },
          { text: "AI-assisted forecasting", score: 3 },
          { text: "Real-time autonomous modeling", score: 4 }
        ]
      },
      {
        text: "How do you use AI for tax compliance and regulatory reporting?",
        options: [
          { text: "Manual preparation", score: 1 },
          { text: "Software-assisted filing", score: 2 },
          { text: "AI-driven compliance checks", score: 3 },
          { text: "Autonomous real-time reporting", score: 4 }
        ]
      }
    ],
    'Engineering': [
      {
        text: "What percentage of your codebase is generated or optimized by AI tools?",
        options: [
          { text: "0% - Traditional coding only", score: 1 },
          { text: "1-10% - Basic autocomplete", score: 2 },
          { text: "10-40% - Significant copilot usage", score: 3 },
          { text: "40%+ - AI-driven architecture", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your automated testing and QA pipelines?",
        options: [
          { text: "Manual testing only", score: 1 },
          { text: "Basic unit test scripts", score: 2 },
          { text: "AI-generated test cases", score: 3 },
          { text: "Self-healing autonomous QA", score: 4 }
        ]
      },
      {
        text: "How do you use AI for system monitoring and incident response (AIOps)?",
        options: [
          { text: "Manual alerts", score: 1 },
          { text: "Threshold-based monitoring", score: 2 },
          { text: "AI-driven anomaly detection", score: 3 },
          { text: "Autonomous self-healing infrastructure", score: 4 }
        ]
      }
    ],
    'Customer Success': [
      {
        text: "How much of your Tier 1 support is handled by autonomous AI agents?",
        options: [
          { text: "None - Human-only support", score: 1 },
          { text: "Basic Chatbots (Rule-based)", score: 2 },
          { text: "AI-assisted human support", score: 3 },
          { text: "Full AI resolution for Tier 1", score: 4 }
        ]
      },
      {
        text: "How do you use AI to identify and act on customer health signals?",
        options: [
          { text: "Manual health checks", score: 1 },
          { text: "Basic usage alerts", score: 2 },
          { text: "AI-scored health metrics", score: 3 },
          { text: "Predictive proactive intervention", score: 4 }
        ]
      },
      {
        text: "How automated is your customer onboarding and product adoption tracking?",
        options: [
          { text: "Manual onboarding", score: 1 },
          { text: "Email-based automation", score: 2 },
          { text: "AI-driven nudge engine", score: 3 },
          { text: "Fully autonomous onboarding orchestration", score: 4 }
        ]
      }
    ]
  },
  industry: {
    'Telecom': [
      {
        text: "How is AI used in your network optimization and predictive maintenance?",
        options: [
          { text: "Manual monitoring", score: 1 },
          { text: "Threshold alerts", score: 2 },
          { text: "AI-assisted diagnostics", score: 3 },
          { text: "Self-healing AI networks", score: 4 }
        ]
      },
      {
        text: "How do you manage customer churn in high-volume mobile/broadband segments?",
        options: [
          { text: "Reactive retention offers", score: 1 },
          { text: "Basic segment analysis", score: 2 },
          { text: "AI churn prediction", score: 3 },
          { text: "Autonomous personalized retention", score: 4 }
        ]
      },
      {
        text: "To what extent is AI managing your 5G infrastructure and spectrum allocation?",
        options: [
          { text: "Fixed allocation", score: 1 },
          { text: "Dynamic rule-based", score: 2 },
          { text: "AI-assisted optimization", score: 3 },
          { text: "Fully autonomous spectrum management", score: 4 }
        ]
      },
      {
        text: "How advanced is your AI-driven fraud detection in billing and roaming?",
        options: [
          { text: "Manual audit", score: 1 },
          { text: "Pattern matching", score: 2 },
          { text: "Machine learning detection", score: 3 },
          { text: "Real-time autonomous prevention", score: 4 }
        ]
      },
      {
        text: "How do you use AI for personalized plan recommendations and upselling?",
        options: [
          { text: "Generic offers", score: 1 },
          { text: "Segment-based bundles", score: 2 },
          { text: "AI-driven propensity modeling", score: 3 },
          { text: "Hyper-personalized autonomous offers", score: 4 }
        ]
      }
    ],
    'SaaS': [
      {
        text: "How integrated is AI in your product's core user experience?",
        options: [
          { text: "No AI features", score: 1 },
          { text: "AI as a side-car/add-on", score: 2 },
          { text: "AI-enhanced core features", score: 3 },
          { text: "AI-native / Agent-first UX", score: 4 }
        ]
      },
      {
        text: "How automated is your product-led growth (PLG) and conversion funnel?",
        options: [
          { text: "Manual sales touch", score: 1 },
          { text: "Basic email automation", score: 2 },
          { text: "AI-driven nudge engine", score: 3 },
          { text: "Fully autonomous PLG orchestration", score: 4 }
        ]
      },
      {
        text: "How do you use AI to predict feature usage and guide product development?",
        options: [
          { text: "Survey data only", score: 1 },
          { text: "Basic analytics", score: 2 },
          { text: "AI-driven trend analysis", score: 3 },
          { text: "Predictive feature impact modeling", score: 4 }
        ]
      },
      {
        text: "How personalized is your automated user onboarding experience?",
        options: [
          { text: "Static tutorial", score: 1 },
          { text: "Role-based paths", score: 2 },
          { text: "AI-assisted onboarding", score: 3 },
          { text: "Fully adaptive real-time onboarding", score: 4 }
        ]
      },
      {
        text: "How do you use AI for automated security patching and vulnerability detection?",
        options: [
          { text: "Manual audits", score: 1 },
          { text: "Static code analysis", score: 2 },
          { text: "AI-driven vulnerability scanning", score: 3 },
          { text: "Autonomous self-patching systems", score: 4 }
        ]
      }
    ],
    'E-commerce': [
      {
        text: "How advanced is your AI recommendation engine for cross-selling?",
        options: [
          { text: "Basic 'People also bought'", score: 1 },
          { text: "Rule-based suggestions", score: 2 },
          { text: "Collaborative filtering AI", score: 3 },
          { text: "Deep learning personalized feed", score: 4 }
        ]
      },
      {
        text: "How do you handle dynamic pricing and discount optimization?",
        options: [
          { text: "Fixed pricing", score: 1 },
          { text: "Manual seasonal sales", score: 2 },
          { text: "Rule-based dynamic pricing", score: 3 },
          { text: "AI-driven real-time price optimization", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your inventory management and demand forecasting?",
        options: [
          { text: "Manual counting", score: 1 },
          { text: "Basic software tracking", score: 2 },
          { text: "AI-assisted forecasting", score: 3 },
          { text: "Autonomous supply chain orchestration", score: 4 }
        ]
      },
      {
        text: "Do you offer AI-powered visual search or virtual try-on features?",
        options: [
          { text: "No visual AI", score: 1 },
          { text: "Basic image tagging", score: 2 },
          { text: "Visual search enabled", score: 3 },
          { text: "Full AR/AI virtual experience", score: 4 }
        ]
      },
      {
        text: "How do you use AI for real-time fraud prevention in checkout?",
        options: [
          { text: "Manual review", score: 1 },
          { text: "Address verification only", score: 2 },
          { text: "AI-driven risk scoring", score: 3 },
          { text: "Autonomous real-time blocking", score: 4 }
        ]
      }
    ],
    'Services': [
      {
        text: "How much of your project estimation and resource allocation is AI-driven?",
        options: [
          { text: "Manual spreadsheets", score: 1 },
          { text: "Software-assisted", score: 2 },
          { text: "AI-predicted timelines", score: 3 },
          { text: "Autonomous resource optimization", score: 4 }
        ]
      },
      {
        text: "How do you manage institutional knowledge and internal expertise?",
        options: [
          { text: "Unstructured folders", score: 1 },
          { text: "Internal Wiki", score: 2 },
          { text: "AI-powered knowledge base", score: 3 },
          { text: "Autonomous expert-matching agent", score: 4 }
        ]
      },
      {
        text: "How automated is your client reporting and data visualization?",
        options: [
          { text: "Manual PDF creation", score: 1 },
          { text: "Static dashboards", score: 2 },
          { text: "AI-generated insights", score: 3 },
          { text: "Real-time autonomous client portals", score: 4 }
        ]
      },
      {
        text: "How do you use AI to match consultant skills with project requirements?",
        options: [
          { text: "Manual resume review", score: 1 },
          { text: "Keyword search", score: 2 },
          { text: "AI-assisted matching", score: 3 },
          { text: "Predictive resource fit modeling", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your contract review and legal compliance processes?",
        options: [
          { text: "Manual review", score: 1 },
          { text: "Template-based drafting", score: 2 },
          { text: "AI-assisted contract analysis", score: 3 },
          { text: "Autonomous legal review agent", score: 4 }
        ]
      }
    ],
    'Healthcare': [
      {
        text: "To what extent is AI used in your patient data analysis or diagnostic support?",
        options: [
          { text: "Digital records only", score: 1 },
          { text: "Basic data visualization", score: 2 },
          { text: "AI-assisted screening", score: 3 },
          { text: "Predictive health modeling", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your remote patient monitoring (RPM) systems?",
        options: [
          { text: "No RPM", score: 1 },
          { text: "Basic data collection", score: 2 },
          { text: "AI-flagged anomalies", score: 3 },
          { text: "Autonomous proactive intervention", score: 4 }
        ]
      },
      {
        text: "How do you use AI in clinical research or drug discovery processes?",
        options: [
          { text: "Traditional methods only", score: 1 },
          { text: "Data management software", score: 2 },
          { text: "AI-assisted molecule modeling", score: 3 },
          { text: "End-to-end AI discovery platform", score: 4 }
        ]
      },
      {
        text: "How automated is your medical billing and insurance claim processing?",
        options: [
          { text: "Manual entry", score: 1 },
          { text: "Rule-based software", score: 2 },
          { text: "AI-assisted coding", score: 3 },
          { text: "Autonomous claim resolution", score: 4 }
        ]
      },
      {
        text: "How do you use AI for personalized patient treatment plans and follow-up?",
        options: [
          { text: "Standard protocols", score: 1 },
          { text: "Doctor-led customization", score: 2 },
          { text: "AI-assisted recommendations", score: 3 },
          { text: "Hyper-personalized autonomous care plans", score: 4 }
        ]
      }
    ],
    'Fintech': [
      {
        text: "How advanced is your AI-driven risk assessment for transactions?",
        options: [
          { text: "Standard credit scoring", score: 1 },
          { text: "Enhanced rule-sets", score: 2 },
          { text: "Machine learning models", score: 3 },
          { text: "Real-time behavioral AI", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your algorithmic trading or investment strategies?",
        options: [
          { text: "Human-led only", score: 1 },
          { text: "Basic quant models", score: 2 },
          { text: "AI-assisted strategies", score: 3 },
          { text: "Fully autonomous AI trading", score: 4 }
        ]
      },
      {
        text: "How do you use AI for regulatory compliance and AML (Anti-Money Laundering)?",
        options: [
          { text: "Manual audit", score: 1 },
          { text: "Rule-based flagging", score: 2 },
          { text: "AI-driven anomaly detection", score: 3 },
          { text: "Autonomous compliance monitoring", score: 4 }
        ]
      },
      {
        text: "How personalized is your AI-driven financial advice for retail users?",
        options: [
          { text: "Generic advice", score: 1 },
          { text: "Segment-based tips", score: 2 },
          { text: "AI-assisted coaching", score: 3 },
          { text: "Hyper-personalized autonomous advisor", score: 4 }
        ]
      },
      {
        text: "How do you use AI for real-time credit limit adjustments and lending decisions?",
        options: [
          { text: "Fixed limits", score: 1 },
          { text: "Manual review for increases", score: 2 },
          { text: "AI-assisted scoring", score: 3 },
          { text: "Autonomous real-time credit orchestration", score: 4 }
        ]
      }
    ],
    'Manufacturing': [
      {
        text: "How integrated is AI in your quality control and defect detection?",
        options: [
          { text: "Human visual inspection", score: 1 },
          { text: "Basic sensor alerts", score: 2 },
          { text: "Computer vision AI", score: 3 },
          { text: "Autonomous closed-loop QC", score: 4 }
        ]
      },
      {
        text: "How advanced is your predictive maintenance for factory floor machinery?",
        options: [
          { text: "Reactive repairs", score: 1 },
          { text: "Scheduled maintenance", score: 2 },
          { text: "Sensor-based alerts", score: 3 },
          { text: "AI-driven predictive failure modeling", score: 4 }
        ]
      },
      {
        text: "How do you use AI to optimize energy consumption in your facilities?",
        options: [
          { text: "Manual monitoring", score: 1 },
          { text: "Basic smart meters", score: 2 },
          { text: "AI-assisted optimization", score: 3 },
          { text: "Autonomous energy management systems", score: 4 }
        ]
      },
      {
        text: "Are you using generative AI for product design and engineering?",
        options: [
          { text: "Traditional CAD only", score: 1 },
          { text: "Parametric design", score: 2 },
          { text: "AI-assisted design", score: 3 },
          { text: "Generative AI-driven design", score: 4 }
        ]
      },
      {
        text: "How automated is your supply chain logistics and warehouse management?",
        options: [
          { text: "Manual coordination", score: 1 },
          { text: "Software-assisted tracking", score: 2 },
          { text: "AI-optimized routing", score: 3 },
          { text: "Fully autonomous logistics orchestration", score: 4 }
        ]
      }
    ],
    'Real Estate': [
      {
        text: "How much do you rely on AI for property valuation and market trend prediction?",
        options: [
          { text: "Manual comps only", score: 1 },
          { text: "Basic online estimators", score: 2 },
          { text: "AI-driven market analysis", score: 3 },
          { text: "Predictive investment modeling", score: 4 }
        ]
      },
      {
        text: "Do you use AI for virtual property tours or automated staging?",
        options: [
          { text: "Photos only", score: 1 },
          { text: "360-degree tours", score: 2 },
          { text: "AI-enhanced virtual staging", score: 3 },
          { text: "Full VR/AI immersive experience", score: 4 }
        ]
      },
      {
        text: "How automated is your lead scoring and matching for potential buyers?",
        options: [
          { text: "Manual follow-up", score: 1 },
          { text: "Basic CRM filters", score: 2 },
          { text: "AI-assisted scoring", score: 3 },
          { text: "Autonomous buyer-property matching", score: 4 }
        ]
      },
      {
        text: "How integrated is AI in your building management systems (PropTech)?",
        options: [
          { text: "Manual controls", score: 1 },
          { text: "Smart thermostats", score: 2 },
          { text: "AI-assisted energy/security", score: 3 },
          { text: "Fully autonomous smart buildings", score: 4 }
        ]
      },
      {
        text: "How do you use AI for automated lease management and tenant screening?",
        options: [
          { text: "Manual paperwork", score: 1 },
          { text: "Software-assisted screening", score: 2 },
          { text: "AI-driven risk assessment", score: 3 },
          { text: "Autonomous property management agent", score: 4 }
        ]
      }
    ],
    'EdTech': [
      {
        text: "How personalized is the learning path for your students using AI?",
        options: [
          { text: "Linear curriculum", score: 1 },
          { text: "Branching logic paths", score: 2 },
          { text: "AI-assisted recommendations", score: 3 },
          { text: "Fully adaptive AI learning", score: 4 }
        ]
      },
      {
        text: "How much of your grading and feedback is automated using AI?",
        options: [
          { text: "Manual grading only", score: 1 },
          { text: "Multiple choice auto-grading", score: 2 },
          { text: "AI-assisted essay feedback", score: 3 },
          { text: "Fully autonomous grading & feedback", score: 4 }
        ]
      },
      {
        text: "How do you use AI to predict student engagement and dropout risk?",
        options: [
          { text: "No predictive measures", score: 1 },
          { text: "Attendance tracking", score: 2 },
          { text: "AI-scored engagement metrics", score: 3 },
          { text: "Predictive intervention modeling", score: 4 }
        ]
      },
      {
        text: "Is AI used to generate or update your educational content?",
        options: [
          { text: "Manual creation only", score: 1 },
          { text: "AI-assisted drafting", score: 2 },
          { text: "AI-generated lesson plans", score: 3 },
          { text: "Fully autonomous content engine", score: 4 }
        ]
      },
      {
        text: "How do you use AI for real-time student support and tutoring (AI Tutors)?",
        options: [
          { text: "No real-time support", score: 1 },
          { text: "Email-based support", score: 2 },
          { text: "AI Chatbot for FAQ", score: 3 },
          { text: "Autonomous 24/7 AI Tutor", score: 4 }
        ]
      }
    ]
  }
};

const COURSES = [
  {
    id: 'core-cert-beginner',
    title: "AI Transformation: Foundations",
    category: "Core",
    level: "Beginner",
    price: 49.99,
    features: ["AI Audit Framework", "Basic Automation Guide", "Industry Benchmarks"],
    description: "Start your journey into AI transformation. Learn the basics of identifying efficiency gaps and setting up your first AI agents.",
    modules: [
      { title: "Introduction to AI Strategy", lessons: 4, quizzes: 1, description: "A deep dive into the current AI landscape, exploring how generative AI and agentic workflows are fundamentally reshaping modern business models and competitive advantages." },
      { title: "Basic Automation Tools", lessons: 6, quizzes: 2, description: "Practical, hands-on training with the most effective and accessible AI tools available today, focusing on immediate implementation to drive productivity gains." }
    ]
  },
  {
    id: 'core-cert-advanced',
    title: "AI Transformation: Professional Certification",
    category: "Core",
    level: "Advanced",
    price: 99.99,
    features: ["Full AI Audit Framework", "24/7 AI Mentor Access", "Industry-Recognized Badge"],
    description: "The definitive guide to restructuring your business for the AI era. Learn how to implement complex agentic workflows and scale AI across your organization.",
    modules: [
      { title: "Foundations of AI Strategy", lessons: 5, quizzes: 2, description: "Master the core principles of AI implementation and strategic alignment to ensure your organization is built for long-term scalability in an AI-first world." },
      { title: "Identifying Revenue Leaks", lessons: 8, quizzes: 3, description: "Learn to conduct a comprehensive audit of your business processes to pinpoint exactly where manual work and data silos are costing you revenue." },
      { title: "Building Agentic Workflows", lessons: 12, quizzes: 5, description: "A step-by-step technical and strategic guide to deploying autonomous agents that can handle end-to-end operational tasks with minimal human intervention." }
    ]
  },
  ...ROLES.flatMap(role => [
    {
      id: `role-${role.toLowerCase()}-beginner`,
      title: `${role} AI: Essentials`,
      category: "Role",
      role: role,
      level: "Beginner",
      price: 19.99,
      features: [`${role}-Specific Prompt Library`, "Basic Workflow Templates", "Tool Guide"],
      description: `Get started with AI in your role as a ${role}. Learn the essential tools and prompts to boost your daily productivity.`,
      modules: [
        { title: `AI for ${role} Basics`, lessons: 4, quizzes: 1, description: `A comprehensive introduction to the specialized AI tools and platforms that are essential for modern ${role} professionals to stay competitive and efficient.` },
        { title: "Daily Workflow Hacks", lessons: 5, quizzes: 2, description: "Discover simple yet powerful AI-driven automations you can implement today to save hours every week on repetitive administrative and creative tasks." }
      ]
    },
    {
      id: `role-${role.toLowerCase()}-advanced`,
      title: `${role} AI: Masterclass`,
      category: "Role",
      role: role,
      level: "Advanced",
      price: 39.99,
      features: ["Advanced Agentic Workflows", "Custom AI Model Training", "Live Case Studies"],
      description: `Master the advanced AI techniques that empower ${role} professionals to lead their departments and drive massive strategic impact.`,
      modules: [
        { title: "Advanced Tool Integration", lessons: 6, quizzes: 2, description: "Learn the technical skills to connect your AI stack directly to your existing software ecosystem for seamless, end-to-end process automation." },
        { title: "Measuring Impact & ROI", lessons: 3, quizzes: 1, description: "Develop a framework for quantifying the direct ROI and strategic impact of your AI-driven workflow improvements to justify further investment." },
        { title: "Leading AI Transformation", lessons: 5, quizzes: 2, description: "Master the soft skills and strategic frameworks needed to champion AI adoption within your team and lead your organization through cultural change." }
      ]
    }
  ]),
  ...INDUSTRIES.flatMap(industry => [
    {
      id: `industry-${industry.toLowerCase()}-beginner`,
      title: `${industry} AI: Foundations`,
      category: "Industry",
      industry: industry,
      level: "Beginner",
      price: 24.99,
      features: ["Sector Benchmarks", "Intro to Industry AI", "Case Studies"],
      description: `Understand how AI is starting to change the ${industry} landscape and what you need to know to stay relevant.`,
      modules: [
        { title: `${industry} Landscape Analysis`, lessons: 4, quizzes: 1, description: `An in-depth analysis of the current state of AI adoption, major disruptors, and emerging opportunities specifically within the ${industry} market.` },
        { title: "Early Adoption Wins", lessons: 5, quizzes: 2, description: "Identify the 'low-hanging fruit' for AI implementation in your specific sector to achieve quick wins and demonstrate immediate value." }
      ]
    },
    {
      id: `industry-${industry.toLowerCase()}-advanced`,
      title: `${industry} AI: Strategic Playbook`,
      category: "Industry",
      industry: industry,
      level: "Advanced",
      price: 49.99,
      features: ["Advanced Implementation Roadmap", "Compliance & Ethics Guide", "Future Trends"],
      description: `A comprehensive strategic playbook for leading AI transformation in the ${industry} sector.`,
      modules: [
        { title: "Sector-Specific AI Use Cases", lessons: 7, quizzes: 3, description: `Examine detailed, real-world case studies of successful AI implementations across various sub-sectors of the ${industry} industry.` },
        { title: "Future Trends & Predictions", lessons: 3, quizzes: 1, description: `Explore expert predictions and emerging trends that will shape the next 18-36 months of AI evolution within your specific industry.` },
        { title: "Regulatory & Ethical Frameworks", lessons: 4, quizzes: 2, description: `Navigate the complex and rapidly evolving legal, regulatory, and ethical landscape of AI implementation within the ${industry} sector.` }
      ]
    }
  ])
];

// --- Components ---

const Header = ({ onNavigate, currentScreen }: { onNavigate: (s: Screen) => void, currentScreen: Screen }) => (
  <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ToasterAI</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('segmentation')}
            className={`text-sm font-medium transition-colors ${currentScreen === 'segmentation' || currentScreen === 'assessment' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Diagnostic
          </button>
          <button 
            onClick={() => onNavigate('catalog')}
            className={`text-sm font-medium transition-colors ${currentScreen === 'catalog' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Course Catalog
          </button>
          <button 
            onClick={() => onNavigate('segmentation')}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Get Started
          </button>
        </nav>
      </div>
    </div>
  </header>
);

const Footer = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
  <footer className="bg-slate-900 text-slate-300 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
            <BrainCircuit className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white tracking-tight">ToasterAI</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Empowering businesses to bridge the AI efficiency gap through adaptive diagnostics and premium sector-specific education.
          </p>
          <div className="flex gap-4">
            <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 hover:text-pink-500 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-blue-500 cursor-pointer transition-colors" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('segmentation')}>AI Diagnostic</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('catalog')}>Course Catalog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Enterprise Solutions</li>
            <li className="hover:text-white cursor-pointer transition-colors">API Access</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Press Kit</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('tos')}>Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('privacy')}>Privacy Policy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Security</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 ToasterAI. All rights reserved.</p>
        <p>Built with precision for the AI-first economy.</p>
      </div>
    </div>
  </footer>
);

const LiveScanUI = () => {
  const [scanIndex, setScanIndex] = useState(0);
  const scanItems = [
    "Analyzing Lead Gen Workflows...",
    "Detecting Data Silos...",
    "Scanning Customer Support Latency...",
    "Evaluating Engineering Velocity...",
    "Calculating Efficiency Leakage..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setScanIndex((prev) => (prev + 1) % scanItems.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Live Diagnostic</span>
        </div>
        <BarChart3 className="w-4 h-4 text-blue-500" />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>{scanItems[scanIndex]}</span>
            <span>{Math.floor(Math.random() * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="block text-[10px] text-slate-500 mb-1">Efficiency Gap</span>
            <span className="text-xl font-bold text-red-400">-24.8%</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="block text-[10px] text-slate-500 mb-1">AI Readiness</span>
            <span className="text-xl font-bold text-blue-400">Low</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300">The Hidden Costs:</h4>
          <ul className="space-y-2">
            {[
              "Manual Data Entry Overhead",
              "Delayed Response Times",
              "Sub-optimal Resource Allocation"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                <TrendingDown className="w-3 h-3 text-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [userData, setUserData] = useState({
    role: '',
    industry: '',
    companySize: ''
  });
  const [assessmentScores, setAssessmentScores] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'processing' | 'success'>('idle');

  // Derived Data
  const totalScore = useMemo(() => {
    if (assessmentScores.length === 0) return 0;
    const sum = assessmentScores.reduce((a, b) => a + b, 0);
    return Math.round((sum / (assessmentScores.length * 4)) * 100);
  }, [assessmentScores]);

  const classification = useMemo(() => {
    if (totalScore < 25) return { label: 'At Risk', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
    if (totalScore < 50) return { label: 'Inefficient', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
    if (totalScore < 75) return { label: 'Emerging', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    return { label: 'Optimized', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
  }, [totalScore]);

  const revenueLeak = useMemo(() => {
    const sizeMultipliers: Record<string, number> = {
      '1-10': 500000,
      '11-50': 2500000,
      '51-200': 10000000,
      '200+': 50000000
    };
    const baseRev = sizeMultipliers[userData.companySize] || 1000000;
    const leakPercent = (100 - totalScore) / 100 * 0.3; // Up to 30% leak
    return Math.round(baseRev * leakPercent);
  }, [userData.companySize, totalScore]);

  const lowestCategory = useMemo(() => {
    if (assessmentScores.length < 10) return 'Core';
    const coreScore = Math.round(((assessmentScores[0] + assessmentScores[1]) / 8) * 100);
    const roleScore = Math.round(((assessmentScores[2] + assessmentScores[3] + assessmentScores[4]) / 12) * 100);
    const industryScore = Math.round(((assessmentScores[5] + assessmentScores[6] + assessmentScores[7] + assessmentScores[8] + assessmentScores[9]) / 20) * 100);
    
    const scores = [coreScore, roleScore, industryScore];
    const categories = ['Core', 'Role', 'Industry'];
    let minIdx = 0;
    let minVal = scores[0];
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] < minVal) {
        minVal = scores[i];
        minIdx = i;
      }
    }
    return categories[minIdx];
  }, [assessmentScores]);

  // Handlers
  const handleStartDiagnostic = () => setScreen('segmentation');
  
  const handleSegmentationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.role && userData.industry && userData.companySize) {
      setAssessmentScores([]);
      setCurrentQuestionIndex(0);
      setScreen('assessment');
    }
  };

  const handleAnswer = (score: number) => {
    const newScores = [...assessmentScores, score];
    setAssessmentScores(newScores);
    if (newScores.length < 10) {
      setCurrentQuestionIndex(newScores.length);
    } else {
      setScreen('results');
    }
  };

  const handleEnroll = (course: any) => {
    setSelectedCourse(course);
    setIsCheckoutOpen(true);
    setCheckoutState('idle');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutState('processing');
    setTimeout(() => {
      setCheckoutState('success');
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setCheckoutState('idle');
      }, 2000);
    }, 2000);
  };

  // --- Screen Components ---

  const LandingScreen = () => (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" />
                The Future of B2B Efficiency
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                Most Businesses Are Losing <span className="text-blue-600">20–30% Efficiency</span> Without Realizing It.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                Our AI Diagnostic Engine identifies hidden revenue leaks and provides a personalized playbook to optimize your operations.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-auto">
                  <button 
                    onClick={handleStartDiagnostic}
                    className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
                  >
                    Start Free AI Diagnostic
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="mt-3 text-xs text-slate-400 text-center sm:text-left">
                    Get your personalized AI score instantly • No credit card required
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <LiveScanUI />
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full -z-10 blur-3xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Used by 1,000+ professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
            <div className="flex items-center gap-2"><Command className="w-6 h-6" /><span className="font-bold text-xl">Command</span></div>
            <div className="flex items-center gap-2"><Hexagon className="w-6 h-6" /><span className="font-bold text-xl">Hexagon</span></div>
            <div className="flex items-center gap-2"><Box className="w-6 h-6" /><span className="font-bold text-xl">BoxCorp</span></div>
            <div className="flex items-center gap-2"><Triangle className="w-6 h-6" /><span className="font-bold text-xl">Delta</span></div>
          </div>
        </div>
      </section>

      {/* Why ToasterAI */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why ToasterAI?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We don't just give you generic advice. We quantify your impact and provide the exact education you need to excel.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: "Hyper-Personalized",
                desc: "Every diagnostic is tailored to your specific role, industry, and company scale."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
                title: "Quantified Impact",
                desc: "See exactly how much revenue is leaking due to manual workflows and data silos."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
                title: "Actionable Playbook",
                desc: "Get a curated list of courses and tools to bridge your efficiency gap immediately."
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer onNavigate={setScreen} />
    </div>
  );

  const SegmentationScreen = () => (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 w-full max-w-xl border border-white"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Define Your Context</h2>
          <p className="text-slate-500">We'll tailor the diagnostic to your specific professional environment.</p>
        </div>

        <form onSubmit={handleSegmentationSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Your Professional Role
            </label>
            <select 
              required
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Select your role...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Industry Sector
            </label>
            <select 
              required
              value={userData.industry}
              onChange={(e) => setUserData({ ...userData, industry: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Select your industry...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4" /> Company Size
            </label>
            <select 
              required
              value={userData.companySize}
              onChange={(e) => setUserData({ ...userData, companySize: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Select company size...</option>
              {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
          >
            Continue to Assessment
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );

  const AssessmentScreen = () => {
    const currentQuestion = useMemo(() => {
      if (currentQuestionIndex < 2) return QUESTIONS.core[currentQuestionIndex];
      if (currentQuestionIndex < 5) {
        const roleQs = QUESTIONS.role[userData.role as keyof typeof QUESTIONS.role];
        return { ...roleQs[currentQuestionIndex - 2], id: `role-${currentQuestionIndex - 2}` };
      }
      const industryQs = QUESTIONS.industry[userData.industry as keyof typeof QUESTIONS.industry];
      return { ...industryQs[currentQuestionIndex - 5], id: `industry-${currentQuestionIndex - 5}` };
    }, [currentQuestionIndex, userData.role, userData.industry]);

    const progress = ((currentQuestionIndex + 1) / 10) * 100;

    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentQuestionIndex + 1} of 10</span>
              <span className="text-xs font-bold text-slate-400">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-tight">
                {currentQuestion.text}
              </h3>

              <div className="space-y-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.score)}
                    className="w-full p-6 text-left border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-slate-700 group-hover:text-blue-700">{opt.text}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-500 flex items-center justify-center transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const coreScore = Math.round(((assessmentScores[0] + assessmentScores[1]) / 8) * 100);
    const roleScore = Math.round(((assessmentScores[2] + assessmentScores[3] + assessmentScores[4]) / 12) * 100);
    const industryScore = Math.round(((assessmentScores[5] + assessmentScores[6] + assessmentScores[7] + assessmentScores[8] + assessmentScores[9]) / 20) * 100);

    const advice = {
      'Core': "Your foundational AI infrastructure needs attention. Focus on centralizing data and implementing basic automation agents.",
      'Role': `As a ${userData.role}, you're missing out on key role-specific AI efficiencies. Mastering specialized tools could save you 10+ hours weekly.`,
      'Industry': `The ${userData.industry} sector is evolving rapidly. Your current AI adoption lags behind top-tier competitors in your space.`
    };

    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left Column: Main Score */}
              <div className="lg:col-span-2 bg-slate-900 p-12 text-white flex flex-col justify-center items-center text-center">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Your AI Efficiency Score</span>
                <div className="relative mb-6">
                  <svg className="w-48 h-48">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <motion.circle 
                      cx="96" cy="96" r="88" fill="none" stroke="#3b82f6" strokeWidth="12" 
                      strokeDasharray={552.92}
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 552.92 - (552.92 * totalScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      transform="rotate(-90 96 96)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black">{totalScore}</span>
                    <span className="text-slate-400 font-bold">/ 100</span>
                  </div>
                </div>
                <div className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${classification.bg} ${classification.color}`}>
                  Status: {classification.label}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="lg:col-span-3 p-12">
                <div className="mb-12">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" /> Estimated Annual Revenue Leak
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">${revenueLeak.toLocaleString()}</span>
                    <span className="text-slate-400 font-medium">USD / year</span>
                  </div>
                  <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                    Based on your company size ({userData.companySize} employees) and efficiency gaps in {userData.role} workflows within the {userData.industry} sector.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Core Infrastructure", score: coreScore },
                    { label: `${userData.role} Specifics`, score: roleScore },
                    { label: `${userData.industry} Playbook`, score: industryScore }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-700">{item.label}</span>
                        <span className="font-mono text-slate-500">{item.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900 text-sm">AI Agent Advice</span>
                  </div>
                  <p className="text-blue-800 text-sm leading-relaxed italic">
                    "{advice[lowestCategory as keyof typeof advice]}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col">
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Adaptive Course Catalog</h4>
              <p className="text-slate-600 text-sm mb-8 flex-grow">We've curated a list of courses specifically to fix your {lowestCategory.toLowerCase()} efficiency gaps.</p>
              <button 
                onClick={() => setScreen('catalog')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                View Recommended Courses
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Get Your Free Report</h4>
              <p className="text-slate-600 text-sm mb-6">Receive a detailed 12-page PDF breakdown of your diagnostic results and implementation roadmap.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Report sent to your email!'); }} className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                >
                  Send My Report
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CatalogScreen = () => {
    const { coreScore, roleScore, industryScore } = useMemo(() => {
      const core = assessmentScores.length >= 2 ? Math.round(((assessmentScores[0] + assessmentScores[1]) / 8) * 100) : 0;
      const role = assessmentScores.length >= 5 ? Math.round(((assessmentScores[2] + assessmentScores[3] + assessmentScores[4]) / 12) * 100) : 0;
      const industry = assessmentScores.length >= 10 ? Math.round(((assessmentScores[5] + assessmentScores[6] + assessmentScores[7] + assessmentScores[8] + assessmentScores[9]) / 20) * 100) : 0;
      return { coreScore: core, roleScore: role, industryScore: industry };
    }, [assessmentScores]);

    const filteredCourses = useMemo(() => {
      if (!userData.role) return COURSES;

      const coreLevel = coreScore < 60 ? 'Beginner' : 'Advanced';
      const roleLevel = roleScore < 60 ? 'Beginner' : 'Advanced';
      const industryLevel = industryScore < 60 ? 'Beginner' : 'Advanced';

      const core = COURSES.filter(c => c.category === 'Core');
      const role = COURSES.filter(c => c.category === 'Role' && (c as any).role === userData.role);
      const industry = COURSES.filter(c => c.category === 'Industry' && (c as any).industry === userData.industry);
      
      const allRelevant = [...core, ...role, ...industry];

      // Sort: Recommended level first, then by category priority (lowestCategory first)
      return allRelevant.sort((a, b) => {
        const aLevel = a.category === 'Core' ? coreLevel : a.category === 'Role' ? roleLevel : industryLevel;
        const bLevel = b.category === 'Core' ? coreLevel : b.category === 'Role' ? roleLevel : industryLevel;
        
        const aIsRecommendedLevel = a.level === aLevel;
        const bIsRecommendedLevel = b.level === bLevel;

        if (aIsRecommendedLevel && !bIsRecommendedLevel) return -1;
        if (!aIsRecommendedLevel && bIsRecommendedLevel) return 1;

        // If both are recommended level (or both not), prioritize lowestCategory
        if (a.category === lowestCategory && b.category !== lowestCategory) return -1;
        if (a.category !== lowestCategory && b.category === lowestCategory) return 1;

        return 0;
      });
    }, [userData.role, userData.industry, coreScore, roleScore, industryScore, lowestCategory]);

    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Adaptive Course Catalog</h2>
              <p className="text-slate-500 max-w-xl">Premium education tailored to your diagnostic results. Bridge your efficiency gap with sector-specific playbooks.</p>
            </div>
            {userData.role && (
              <div className="flex flex-col items-end gap-2">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-lg shadow-blue-200">
                  <Users className="w-4 h-4" />
                  Filtered for {userData.role} in {userData.industry}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Recommendation Level: {lowestCategory} Focus
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const recLevel = course.category === 'Core' ? (coreScore < 60 ? 'Beginner' : 'Advanced') : 
                               course.category === 'Role' ? (roleScore < 60 ? 'Beginner' : 'Advanced') : 
                               (industryScore < 60 ? 'Beginner' : 'Advanced');
              const isRecommended = course.level === recLevel;
              const isTopPriority = isRecommended && course.category === lowestCategory;
              return (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all flex flex-col relative ${isTopPriority ? 'border-blue-500 shadow-xl shadow-blue-100' : isRecommended ? 'border-indigo-400 shadow-lg shadow-indigo-50' : 'border-white shadow-lg shadow-slate-200/50 hover:border-slate-200'}`}
                >
                  {isTopPriority && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                      Top Recommendation
                    </div>
                  )}
                  {!isTopPriority && isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                      Recommended Level
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {course.level}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-slate-900">${course.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">{course.title}</h3>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {course.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setSelectedCourse(course); setIsSyllabusOpen(true); }}
                      className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Preview Syllabus
                    </button>
                    <button 
                      onClick={() => handleEnroll(course)}
                      className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- Legal Screens ---

  const TosScreen = () => (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p className="text-sm text-slate-400">Last Updated: April 4, 2026</p>
            
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using ToasterAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p>ToasterAI provides an AI Revenue Diagnostic Engine and a Course Catalog designed to help businesses identify efficiency gaps and provide educational resources for AI transformation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. User Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when using our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Intellectual Property</h2>
              <p>All content, features, and functionality on ToasterAI, including but not limited to text, graphics, logos, and software, are the exclusive property of ToasterAI and are protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Limitation of Liability</h2>
              <p>ToasterAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of any significant changes by posting the new terms on this page.</p>
            </section>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100">
            <button 
              onClick={() => setScreen('landing')}
              className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PrivacyScreen = () => (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p className="text-sm text-slate-400">Last Updated: April 4, 2026</p>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you complete our diagnostic assessment, purchase a course, or contact us for support. This may include your name, email address, role, industry, and company size.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, to personalize your experience, and to communicate with you about our products and services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Data Security</h2>
              <p>We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Sharing of Information</h2>
              <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Your Choices</h2>
              <p>You may update or correct your account information at any time by contacting us. You may also opt out of receiving promotional communications from us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@toasterai.org.</p>
            </section>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100">
            <button 
              onClick={() => setScreen('landing')}
              className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header onNavigate={setScreen} currentScreen={screen} />
      
      <main>
        <AnimatePresence mode="wait">
          {screen === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LandingScreen /></motion.div>}
          {screen === 'segmentation' && <motion.div key="segmentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SegmentationScreen /></motion.div>}
          {screen === 'assessment' && <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AssessmentScreen /></motion.div>}
          {screen === 'results' && <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ResultsScreen /></motion.div>}
          {screen === 'catalog' && <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CatalogScreen /></motion.div>}
          {screen === 'tos' && <motion.div key="tos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TosScreen /></motion.div>}
          {screen === 'privacy' && <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PrivacyScreen /></motion.div>}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <Modal isOpen={isSyllabusOpen} onClose={() => setIsSyllabusOpen(false)}>
        {selectedCourse && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Course Syllabus</h3>
            </div>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">{selectedCourse.description}</p>
            <div className="space-y-6 mb-8">
              {selectedCourse.modules.map((m: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-500 mb-2 leading-relaxed">{m.description}</p>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>{m.lessons} Lessons</span>
                      <span>{m.quizzes} Quizzes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Final Assessment Required for Certification</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
        <div className="p-8">
          {checkoutState === 'idle' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Secure Checkout</h3>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SSL Encrypted</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Selected Course</p>
                  <p className="text-sm font-bold text-slate-800">{selectedCourse?.title}</p>
                </div>
                <p className="text-xl font-black text-slate-900">${selectedCourse?.price}</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
                  <input type="email" required placeholder="name@company.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Card Information</label>
                  <div className="relative">
                    <input type="text" required placeholder="0000 0000 0000 0000" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="MM / YY" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  <input type="text" required placeholder="CVC" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all mt-4 shadow-lg shadow-blue-100">
                  Pay ${selectedCourse?.price}
                </button>
              </form>
            </>
          )}

          {checkoutState === 'processing' && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
              <p className="text-slate-500">Securing your spot in the masterclass...</p>
            </div>
          )}

          {checkoutState === 'success' && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enrollment Successful!</h3>
              <p className="text-slate-500">Welcome to ToasterAI. Check your email for access details.</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
