/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrainCircuit,
  ChevronRight,
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
import { auth, signUp, logIn, logOut, signInWithGoogle, onAuthStateChanged, type User } from './firebase';
import { collectData, sendReportViaAppsScript } from './dataCollection';

// --- Types & Constants ---

type Screen = 'landing' | 'segmentation' | 'assessment' | 'results' | 'catalog' | 'tos' | 'privacy' | 'auth';

const ROLES = ['CEO', 'Sales', 'Operations', 'Marketing', 'HR', 'Finance', 'Engineering', 'Customer Success'];
const INDUSTRIES = ['Telecom', 'SaaS', 'E-commerce', 'Services', 'Healthcare', 'Fintech', 'Manufacturing', 'Real Estate', 'EdTech'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '200+'];

const QUESTIONS = {
  core: [
    {
      id: 'core1',
      text: "Last week, how many hours did your team spend on tasks that could have been handled by AI — data entry, report formatting, scheduling, or copy-paste workflows?",
      options: [
        { text: "20+ hours — we're drowning in manual work", score: 1 },
        { text: "10-20 hours — significant time lost to repetitive tasks", score: 2 },
        { text: "5-10 hours — some tasks are automated but gaps remain", score: 3 },
        { text: "Under 5 hours — most routine work runs on autopilot", score: 4 }
      ]
    },
    {
      id: 'core2',
      text: "When a key decision needs to be made, how long does it take to pull the right data from all your tools (CRM, analytics, finance, etc.)?",
      options: [
        { text: "Hours or days — someone has to manually export and merge spreadsheets", score: 1 },
        { text: "30-60 min — we can get it, but it requires multiple logins and tabs", score: 2 },
        { text: "Under 30 min — most data feeds into a central dashboard", score: 3 },
        { text: "Instant — all our data flows into one real-time source of truth", score: 4 }
      ]
    }
  ],
  role: {
    'CEO': [
      {
        text: "If your board asked you today: 'What's the exact dollar ROI of our AI investments this quarter?' — could you answer confidently?",
        options: [
          { text: "No — we don't have any AI investments to measure yet", score: 1 },
          { text: "Vaguely — we have anecdotal wins but no hard numbers", score: 2 },
          { text: "Roughly — we track cost savings but not revenue impact", score: 3 },
          { text: "Precisely — we have a live dashboard showing AI-driven ROI", score: 4 }
        ]
      },
      {
        text: "How confident are you that your competitors aren't already using AI to undercut your pricing, speed, or customer experience?",
        options: [
          { text: "Not at all — we haven't assessed the competitive AI landscape", score: 1 },
          { text: "Somewhat worried — we've seen competitors launch AI features", score: 2 },
          { text: "Cautiously confident — AI is in our 12-month roadmap", score: 3 },
          { text: "Very confident — AI is already a core competitive advantage for us", score: 4 }
        ]
      },
      {
        text: "If a major AI-related compliance issue hit tomorrow (bias in hiring, data leak, hallucinated output to a client), how prepared is your organization?",
        options: [
          { text: "Unprepared — we'd be scrambling to figure out who's responsible", score: 1 },
          { text: "Ad-hoc — a few people would handle it, but no formal process exists", score: 2 },
          { text: "Partially ready — we have guidelines but haven't stress-tested them", score: 3 },
          { text: "Fully prepared — dedicated AI governance team with incident playbooks", score: 4 }
        ]
      }
    ],
    'Sales': [
      {
        text: "Out of every 100 inbound leads, how many does your team actually follow up with within the first hour?",
        options: [
          { text: "Under 10 — most leads sit for hours or days before first touch", score: 1 },
          { text: "10-30 — we try, but reps are too busy with manual tasks", score: 2 },
          { text: "30-60 — we have some automation but still miss warm leads", score: 3 },
          { text: "80+ — AI instantly qualifies and routes every lead in real time", score: 4 }
        ]
      },
      {
        text: "How much revenue do you estimate you lose each quarter because reps send generic outreach instead of hyper-personalized messages?",
        options: [
          { text: "Significant — our reply rates are under 5% and we rely on volume", score: 1 },
          { text: "Noticeable — reps personalize when they can, but it doesn't scale", score: 2 },
          { text: "Moderate — AI helps draft messages, but reps still edit each one", score: 3 },
          { text: "Minimal — every prospect gets a uniquely tailored sequence automatically", score: 4 }
        ]
      },
      {
        text: "How often are your quarterly revenue forecasts off by more than 15%?",
        options: [
          { text: "Almost always — forecasting feels like guessing", score: 1 },
          { text: "Frequently — we rely on rep gut-feel and CRM snapshots", score: 2 },
          { text: "Sometimes — AI assists but we still get surprised by slipped deals", score: 3 },
          { text: "Rarely — predictive models flag at-risk deals weeks in advance", score: 4 }
        ]
      }
    ],
    'Operations': [
      {
        text: "In the last quarter, how many times did an unexpected bottleneck or outage disrupt your operations that AI could have predicted?",
        options: [
          { text: "5+ times — we're constantly firefighting surprises", score: 1 },
          { text: "3-5 times — disruptions happen regularly despite manual checks", score: 2 },
          { text: "1-2 times — we catch most issues but some still slip through", score: 3 },
          { text: "Zero — AI flags potential issues before they become problems", score: 4 }
        ]
      },
      {
        text: "How many FTEs (full-time equivalents) are currently dedicated to tasks that an AI agent could handle — dispatching, data routing, status updates, approvals?",
        options: [
          { text: "5+ people — entire roles exist just to move information around", score: 1 },
          { text: "3-5 people — several team members spend most of their day on coordination", score: 2 },
          { text: "1-2 people — we've automated some flows but key bottlenecks remain", score: 3 },
          { text: "Nearly zero — AI agents handle routing, approvals, and status updates", score: 4 }
        ]
      },
      {
        text: "When demand spikes unexpectedly (rush order, seasonal peak, staff shortage), how long does it take to reallocate resources?",
        options: [
          { text: "Days — manual rescheduling causes delays and overtime costs", score: 1 },
          { text: "Several hours — managers scramble to reassign manually", score: 2 },
          { text: "Under an hour — software helps but still needs human approval", score: 3 },
          { text: "Minutes — AI dynamically reallocates resources in real time", score: 4 }
        ]
      }
    ],
    'Marketing': [
      {
        text: "What percentage of your content (emails, ads, social posts) is still created from scratch by your team rather than generated or optimized by AI?",
        options: [
          { text: "90%+ — every piece is manually written and designed", score: 1 },
          { text: "60-90% — we use templates but customization is manual", score: 2 },
          { text: "30-60% — AI generates first drafts, humans refine", score: 3 },
          { text: "Under 30% — AI handles creation, humans curate and approve", score: 4 }
        ]
      },
      {
        text: "If you had to prove right now which specific ad, email, or touchpoint actually caused your last 10 conversions — could you?",
        options: [
          { text: "No — we credit the last click and hope for the best", score: 1 },
          { text: "Partially — we have multi-touch data but can't trust the models", score: 2 },
          { text: "Mostly — AI attribution gives us directional confidence", score: 3 },
          { text: "Yes — AI maps the full journey and reallocates budget autonomously", score: 4 }
        ]
      },
      {
        text: "How many potential customers drop off your funnel each month because they hit a generic experience instead of a personalized next step?",
        options: [
          { text: "We don't know — we can't track individual journeys", score: 1 },
          { text: "A lot — we see high drop-off but can only send batch emails", score: 2 },
          { text: "Some — we trigger actions based on events but it's not real-time", score: 3 },
          { text: "Very few — AI serves the right message at the right moment", score: 4 }
        ]
      }
    ],
    'HR': [
      {
        text: "How many qualified candidates do you estimate your team misses each month because resumes pile up faster than humans can review them?",
        options: [
          { text: "Many — we know great candidates slip through the cracks", score: 1 },
          { text: "Some — keyword filters catch obvious matches but miss nuance", score: 2 },
          { text: "A few — AI ranks applicants but recruiters still review top 50+", score: 3 },
          { text: "Almost none — AI surfaces the best fits instantly with high accuracy", score: 4 }
        ]
      },
      {
        text: "When was the last time a high-performer resigned and your team said 'we didn't see it coming'?",
        options: [
          { text: "Recently — surprise departures are a recurring problem", score: 1 },
          { text: "A few months ago — we only find out during exit interviews", score: 2 },
          { text: "Rare — we run engagement surveys but can't predict individual risk", score: 3 },
          { text: "Almost never — AI flags at-risk employees weeks before resignation", score: 4 }
        ]
      },
      {
        text: "How many hours per week does your HR team spend answering the same employee questions — PTO balance, benefits, policy lookups?",
        options: [
          { text: "10+ hours — HR is buried in repetitive tickets", score: 1 },
          { text: "5-10 hours — we have a FAQ page but people still email HR", score: 2 },
          { text: "2-5 hours — a chatbot handles basics but escalates too often", score: 3 },
          { text: "Under 1 hour — AI resolves 90%+ of employee queries instantly", score: 4 }
        ]
      }
    ],
    'Finance': [
      {
        text: "In the past year, how much money did your company lose to expense fraud, duplicate payments, or billing errors that weren't caught in time?",
        options: [
          { text: "We don't know — we only audit a small random sample", score: 1 },
          { text: "Some — rule-based checks catch obvious issues but miss subtle ones", score: 2 },
          { text: "Minimal — AI flags anomalies but still needs human verification", score: 3 },
          { text: "Near zero — AI audits every transaction in real time", score: 4 }
        ]
      },
      {
        text: "How confident is your CFO in next quarter's cash flow forecast — would they bet their bonus on it?",
        options: [
          { text: "Not confident — we're updating spreadsheets manually every week", score: 1 },
          { text: "Somewhat — our models are decent but miss macro shifts", score: 2 },
          { text: "Fairly confident — AI-assisted forecasting reduces surprises", score: 3 },
          { text: "Very confident — real-time AI models update continuously with live data", score: 4 }
        ]
      },
      {
        text: "How many person-hours does your team spend each month on tax prep, regulatory filings, and compliance checks?",
        options: [
          { text: "40+ hours — it's a manual, error-prone grind every cycle", score: 1 },
          { text: "20-40 hours — software helps but prep and review are still manual", score: 2 },
          { text: "10-20 hours — AI handles first-pass checks, humans verify", score: 3 },
          { text: "Under 10 hours — AI automates filings and flags issues proactively", score: 4 }
        ]
      }
    ],
    'Engineering': [
      {
        text: "How many hours per week does your average developer spend writing boilerplate, documentation, or repetitive code that AI could generate?",
        options: [
          { text: "10+ hours — most coding is still fully manual", score: 1 },
          { text: "5-10 hours — we use autocomplete but nothing more advanced", score: 2 },
          { text: "2-5 hours — copilot tools handle scaffolding and docs", score: 3 },
          { text: "Under 2 hours — AI generates code, tests, and docs; devs review", score: 4 }
        ]
      },
      {
        text: "When was the last time a bug reached production that automated AI testing could have caught?",
        options: [
          { text: "This month — we rely on manual QA and things slip through often", score: 1 },
          { text: "Last quarter — our test suite has gaps we know about but can't fill fast enough", score: 2 },
          { text: "Rarely — AI helps generate test cases but coverage isn't complete", score: 3 },
          { text: "Almost never — AI generates edge-case tests and self-heals flaky tests", score: 4 }
        ]
      },
      {
        text: "When your system has an incident at 2 AM, what happens in the first 15 minutes?",
        options: [
          { text: "Someone's phone rings and they start debugging from scratch", score: 1 },
          { text: "PagerDuty fires, but the on-call engineer has to manually investigate", score: 2 },
          { text: "AI detects the anomaly and provides a probable root cause for the engineer", score: 3 },
          { text: "AI detects, diagnoses, and auto-remediates most incidents before humans wake up", score: 4 }
        ]
      }
    ],
    'Customer Success': [
      {
        text: "How many support tickets per day could be resolved instantly by AI but instead wait in a human queue?",
        options: [
          { text: "50+ — password resets, status checks, and FAQ questions all wait for a human", score: 1 },
          { text: "20-50 — a basic chatbot deflects some, but most escalate immediately", score: 2 },
          { text: "10-20 — AI handles simple queries well, but anything nuanced goes to a rep", score: 3 },
          { text: "Under 10 — AI resolves 80%+ of Tier 1 tickets without human involvement", score: 4 }
        ]
      },
      {
        text: "How many customers churned last quarter that you only realized were at risk AFTER they cancelled?",
        options: [
          { text: "Many — churn feels like it comes out of nowhere", score: 1 },
          { text: "Several — we track usage but don't act on the data fast enough", score: 2 },
          { text: "A few — AI scores account health, but intervention is still manual", score: 3 },
          { text: "Almost none — AI predicts churn risk 30+ days out and triggers proactive outreach", score: 4 }
        ]
      },
      {
        text: "What percentage of your new customers fully adopt your product within the first 30 days?",
        options: [
          { text: "Under 20% — onboarding is a manual, high-touch process that doesn't scale", score: 1 },
          { text: "20-40% — we send email sequences but can't personalize the journey", score: 2 },
          { text: "40-60% — AI nudges users toward key actions based on behavior", score: 3 },
          { text: "60%+ — AI orchestrates a fully personalized onboarding path for each user", score: 4 }
        ]
      }
    ]
  },
  industry: {
    'Telecom': [
      {
        text: "How much unplanned network downtime did you experience last quarter that AI-driven predictive maintenance could have prevented?",
        options: [
          { text: "Multiple outages — we only find problems after customers complain", score: 1 },
          { text: "A few — static thresholds catch some issues but miss slow degradation", score: 2 },
          { text: "Rare — AI flags likely failures, but engineers still respond manually", score: 3 },
          { text: "Near zero — AI predicts and auto-mitigates issues before users notice", score: 4 }
        ]
      },
      {
        text: "What percentage of customers who call to cancel are you actually saving with your current retention process?",
        options: [
          { text: "Under 10% — by the time they call, it's too late", score: 1 },
          { text: "10-25% — we offer generic discounts but most still leave", score: 2 },
          { text: "25-40% — AI identifies at-risk subscribers, but outreach is slow", score: 3 },
          { text: "40%+ — AI intervenes with personalized offers before they even think of leaving", score: 4 }
        ]
      },
      {
        text: "How much spectrum and infrastructure capacity are you wasting because allocation isn't dynamically optimized?",
        options: [
          { text: "A lot — fixed allocation means some areas are congested while others sit idle", score: 1 },
          { text: "Some — we adjust manually based on usage reports", score: 2 },
          { text: "Moderate — AI helps optimize but changes require manual approval", score: 3 },
          { text: "Minimal — AI dynamically allocates spectrum in real time based on demand", score: 4 }
        ]
      },
      {
        text: "How much revenue do you lose annually to billing fraud, SIM-swap scams, or roaming abuse?",
        options: [
          { text: "We don't know the real number — audits are periodic and manual", score: 1 },
          { text: "Significant — pattern-matching catches known schemes but not new ones", score: 2 },
          { text: "Moderate — ML models detect most fraud but false positives slow us down", score: 3 },
          { text: "Minimal — real-time AI blocks fraud as it happens with high precision", score: 4 }
        ]
      },
      {
        text: "How much ARPU (average revenue per user) are you leaving on the table because plan recommendations aren't personalized?",
        options: [
          { text: "A lot — every customer sees the same offers on our website", score: 1 },
          { text: "Some — we segment by plan tier but don't personalize within segments", score: 2 },
          { text: "Moderate — AI suggests upgrades but conversion rates are still low", score: 3 },
          { text: "Minimal — AI delivers the right offer to the right user at the right moment", score: 4 }
        ]
      }
    ],
    'SaaS': [
      {
        text: "How many of your users have asked 'why doesn't your product have AI features?' in the last 6 months — and what did you tell them?",
        options: [
          { text: "Frequently — we're losing deals to AI-native competitors", score: 1 },
          { text: "Sometimes — we have it on the roadmap but nothing shipped yet", score: 2 },
          { text: "Occasionally — we've added some AI features but they're not core", score: 3 },
          { text: "Rarely — AI is deeply embedded and users love it", score: 4 }
        ]
      },
      {
        text: "What percentage of your free-trial users convert to paid — and how many drop off because nobody nudged them at the right moment?",
        options: [
          { text: "Under 5% — we send the same email drip to everyone and hope", score: 1 },
          { text: "5-10% — basic automation triggers emails but timing is generic", score: 2 },
          { text: "10-20% — AI identifies drop-off signals and triggers targeted nudges", score: 3 },
          { text: "20%+ — AI orchestrates the full trial-to-paid journey per user", score: 4 }
        ]
      },
      {
        text: "How many engineering sprints have you wasted building features that users barely adopted?",
        options: [
          { text: "Too many — we build based on gut feel and loud customer requests", score: 1 },
          { text: "Several — we look at basic analytics but can't predict adoption", score: 2 },
          { text: "A few — AI-driven usage analysis informs our roadmap", score: 3 },
          { text: "Almost none — predictive models show feature impact before we build", score: 4 }
        ]
      },
      {
        text: "How many new users give up during onboarding because the experience doesn't adapt to their specific use case?",
        options: [
          { text: "Many — everyone gets the same 5-step tutorial regardless of role", score: 1 },
          { text: "Some — we have role-based paths but they're still fairly generic", score: 2 },
          { text: "A few — AI adjusts the flow based on user actions", score: 3 },
          { text: "Almost none — AI creates a unique onboarding path for every user", score: 4 }
        ]
      },
      {
        text: "How quickly can you detect and patch a critical vulnerability across your entire codebase?",
        options: [
          { text: "Days to weeks — we rely on periodic manual security audits", score: 1 },
          { text: "Hours — static analysis tools flag known patterns", score: 2 },
          { text: "Under an hour — AI scans continuously and alerts the team", score: 3 },
          { text: "Minutes — AI detects, patches, and deploys fixes autonomously", score: 4 }
        ]
      }
    ],
    'E-commerce': [
      {
        text: "How much additional revenue per customer are you missing because your 'Recommended for You' section isn't truly personalized?",
        options: [
          { text: "A lot — we show 'bestsellers' and 'people also bought' to everyone", score: 1 },
          { text: "Some — we have basic rules but they don't adapt to behavior", score: 2 },
          { text: "Moderate — AI-driven recs work but AOV hasn't moved much", score: 3 },
          { text: "Minimal — deep personalization drives measurable uplift in AOV", score: 4 }
        ]
      },
      {
        text: "How much margin are you losing because your prices aren't adjusting in real time to competitor moves, demand shifts, and inventory levels?",
        options: [
          { text: "Significant — we set prices manually and review them monthly", score: 1 },
          { text: "Some — we run seasonal sales but competitors react faster", score: 2 },
          { text: "Moderate — rule-based pricing adjusts but misses real-time signals", score: 3 },
          { text: "Minimal — AI optimizes prices in real time across every SKU", score: 4 }
        ]
      },
      {
        text: "How many stockouts or overstock situations did you have last quarter that better demand forecasting could have prevented?",
        options: [
          { text: "Frequent — we regularly miss sales due to stockouts or eat costs on excess", score: 1 },
          { text: "Several — software tracks inventory but can't predict demand spikes", score: 2 },
          { text: "A few — AI forecasting helps but seasonal patterns still surprise us", score: 3 },
          { text: "Almost none — AI predicts demand shifts weeks in advance", score: 4 }
        ]
      },
      {
        text: "What percentage of shoppers who search your site leave without finding what they wanted — because search doesn't understand intent?",
        options: [
          { text: "High — text-only search returns irrelevant results constantly", score: 1 },
          { text: "Moderate — search works for exact terms but fails on vague queries", score: 2 },
          { text: "Low — visual search and AI help, but complex queries still fail", score: 3 },
          { text: "Very low — AI understands natural language, images, and context seamlessly", score: 4 }
        ]
      },
      {
        text: "How much do you lose annually to chargebacks and checkout fraud that slipped past your current defenses?",
        options: [
          { text: "We don't know — manual review can't keep up with transaction volume", score: 1 },
          { text: "Noticeable — address verification blocks obvious fraud but not sophisticated attacks", score: 2 },
          { text: "Manageable — AI scoring catches most fraud but still flags too many false positives", score: 3 },
          { text: "Minimal — AI blocks fraud in real time with high accuracy and low false-positive rates", score: 4 }
        ]
      }
    ],
    'Services': [
      {
        text: "How often do your projects go over budget because the initial estimate was based on gut feel rather than data?",
        options: [
          { text: "Frequently — scope creep and bad estimates eat into margins regularly", score: 1 },
          { text: "Sometimes — we use past projects as reference but each one feels unique", score: 2 },
          { text: "Occasionally — AI analyzes historical data to improve estimates", score: 3 },
          { text: "Rarely — AI predicts timelines and costs with high accuracy", score: 4 }
        ]
      },
      {
        text: "When a senior consultant leaves, how much institutional knowledge walks out the door with them?",
        options: [
          { text: "A lot — critical knowledge lives in people's heads and email threads", score: 1 },
          { text: "Some — we have a wiki but it's outdated and nobody maintains it", score: 2 },
          { text: "Moderate — AI-powered knowledge base captures and surfaces expertise", score: 3 },
          { text: "Minimal — AI continuously captures, indexes, and serves institutional knowledge", score: 4 }
        ]
      },
      {
        text: "How many hours does your team spend each month building client reports and dashboards that could be auto-generated?",
        options: [
          { text: "40+ hours — analysts manually build decks and PDFs every reporting cycle", score: 1 },
          { text: "20-40 hours — dashboards exist but custom reports still require manual work", score: 2 },
          { text: "10-20 hours — AI generates draft reports, humans refine and add commentary", score: 3 },
          { text: "Under 10 hours — AI delivers real-time client portals with narrative insights", score: 4 }
        ]
      },
      {
        text: "How often do you staff the wrong consultant on a project because you couldn't quickly match skills to requirements?",
        options: [
          { text: "Regularly — staffing is based on availability, not fit", score: 1 },
          { text: "Sometimes — managers know their teams but can't see across the org", score: 2 },
          { text: "Occasionally — AI suggests matches but final decisions are manual", score: 3 },
          { text: "Rarely — AI predicts the best consultant-project fit with high accuracy", score: 4 }
        ]
      },
      {
        text: "How many hours per month does your legal or compliance team spend reviewing contracts for risk clauses?",
        options: [
          { text: "40+ hours — every contract is reviewed line-by-line manually", score: 1 },
          { text: "20-40 hours — templates help but redlines and custom terms need full review", score: 2 },
          { text: "10-20 hours — AI highlights risky clauses, humans make the call", score: 3 },
          { text: "Under 10 hours — AI handles full contract analysis and flags exceptions only", score: 4 }
        ]
      }
    ],
    'Healthcare': [
      {
        text: "How many patient cases per month could benefit from AI-assisted pattern recognition that your clinicians don't have time to perform manually?",
        options: [
          { text: "Hundreds — clinicians rely solely on their experience and available test results", score: 1 },
          { text: "Many — we have digital records but no AI layer analyzing patterns", score: 2 },
          { text: "Some — AI assists with screening but isn't integrated into daily workflows", score: 3 },
          { text: "Few — AI proactively surfaces insights and risk patterns for every patient", score: 4 }
        ]
      },
      {
        text: "How many preventable ER visits or readmissions happen each quarter because remote patients aren't monitored between appointments?",
        options: [
          { text: "Many — we have no remote monitoring; patients come back only when symptoms worsen", score: 1 },
          { text: "Some — wearables collect data but nobody reviews it until the next visit", score: 2 },
          { text: "A few — AI flags critical readings, but response time is still slow", score: 3 },
          { text: "Very few — AI detects anomalies in real time and triggers immediate intervention", score: 4 }
        ]
      },
      {
        text: "How many months does it take your research team to identify promising compounds or analyze trial data that AI could accelerate?",
        options: [
          { text: "12+ months — traditional methods with no computational acceleration", score: 1 },
          { text: "6-12 months — data management software helps organize but doesn't predict", score: 2 },
          { text: "3-6 months — AI assists with molecular modeling and data analysis", score: 3 },
          { text: "Under 3 months — end-to-end AI platform accelerates the entire pipeline", score: 4 }
        ]
      },
      {
        text: "What percentage of your insurance claims get denied on first submission due to coding errors that AI could have caught?",
        options: [
          { text: "15%+ — manual coding leads to frequent denials and revenue delays", score: 1 },
          { text: "10-15% — rule-based software catches some errors but not all", score: 2 },
          { text: "5-10% — AI-assisted coding reduces errors significantly", score: 3 },
          { text: "Under 5% — AI validates every claim before submission with near-perfect accuracy", score: 4 }
        ]
      },
      {
        text: "How many patients fall through the cracks on follow-up care because treatment plans aren't personalized and tracked automatically?",
        options: [
          { text: "Many — patients get standard protocols and manual follow-up calls", score: 1 },
          { text: "Some — doctors customize plans but tracking compliance is manual", score: 2 },
          { text: "A few — AI helps tailor recommendations and sends reminders", score: 3 },
          { text: "Very few — AI creates and dynamically adjusts personalized care plans", score: 4 }
        ]
      }
    ],
    'Fintech': [
      {
        text: "How much money did your platform lose to fraudulent transactions last quarter that faster, smarter risk models could have blocked?",
        options: [
          { text: "Significant — standard credit scoring misses sophisticated fraud patterns", score: 1 },
          { text: "Noticeable — enhanced rules catch known schemes but not novel ones", score: 2 },
          { text: "Moderate — ML models detect most fraud but latency allows some through", score: 3 },
          { text: "Minimal — real-time behavioral AI blocks fraud before transactions complete", score: 4 }
        ]
      },
      {
        text: "How much alpha (excess returns) are you leaving on the table because your trading strategies can't process market signals fast enough?",
        options: [
          { text: "A lot — human analysts can't compete with AI-driven trading desks", score: 1 },
          { text: "Some — basic quant models work but miss complex multi-factor patterns", score: 2 },
          { text: "Moderate — AI assists strategy development but execution is partly manual", score: 3 },
          { text: "Minimal — fully autonomous AI processes thousands of signals in real time", score: 4 }
        ]
      },
      {
        text: "How many hours does your compliance team spend each week on AML checks and regulatory reporting that AI could handle?",
        options: [
          { text: "40+ hours — manual transaction review and report generation", score: 1 },
          { text: "20-40 hours — rule-based flagging creates too many false positives to review", score: 2 },
          { text: "10-20 hours — AI reduces false positives but humans still verify", score: 3 },
          { text: "Under 10 hours — AI handles monitoring and generates reports autonomously", score: 4 }
        ]
      },
      {
        text: "How many users leave your platform for competitors that offer smarter, more personalized financial guidance?",
        options: [
          { text: "Many — our advice is generic and users don't feel understood", score: 1 },
          { text: "Some — segment-based tips help but feel impersonal", score: 2 },
          { text: "A few — AI coaching is improving but not yet a differentiator", score: 3 },
          { text: "Very few — hyper-personalized AI advisor keeps users engaged and loyal", score: 4 }
        ]
      },
      {
        text: "How many creditworthy customers are you rejecting — or risky ones approving — because lending decisions aren't using real-time data?",
        options: [
          { text: "Many — fixed rules mean we're too conservative or too lenient depending on the case", score: 1 },
          { text: "Some — manual reviews add nuance but can't scale", score: 2 },
          { text: "A few — AI scoring improves accuracy but doesn't update in real time", score: 3 },
          { text: "Very few — real-time AI adjusts credit decisions dynamically with live data", score: 4 }
        ]
      }
    ],
    'Manufacturing': [
      {
        text: "How many defective units shipped last quarter that AI-powered visual inspection could have caught on the line?",
        options: [
          { text: "Too many — human inspectors miss defects, especially during long shifts", score: 1 },
          { text: "Some — basic sensors catch major flaws but miss cosmetic or micro-defects", score: 2 },
          { text: "A few — computer vision AI catches most defects but isn't on every line", score: 3 },
          { text: "Near zero — AI inspects 100% of output and auto-rejects defective units", score: 4 }
        ]
      },
      {
        text: "How much did unplanned machine downtime cost you last quarter in lost production and emergency repairs?",
        options: [
          { text: "Hundreds of thousands — we fix machines after they break", score: 1 },
          { text: "Tens of thousands — scheduled maintenance helps but breakdowns still happen", score: 2 },
          { text: "Moderate — sensor alerts give some warning but not enough lead time", score: 3 },
          { text: "Minimal — AI predicts failures days in advance and schedules optimal maintenance", score: 4 }
        ]
      },
      {
        text: "What percentage of your energy bill do you estimate is wasted due to inefficient equipment scheduling and facility management?",
        options: [
          { text: "15%+ — we don't actively monitor or optimize energy usage", score: 1 },
          { text: "10-15% — smart meters track usage but don't make recommendations", score: 2 },
          { text: "5-10% — AI suggests optimizations that operators implement manually", score: 3 },
          { text: "Under 5% — AI autonomously manages energy consumption in real time", score: 4 }
        ]
      },
      {
        text: "How many design iterations does your team go through before reaching an optimal product design?",
        options: [
          { text: "10+ — traditional CAD means slow trial-and-error cycles", score: 1 },
          { text: "5-10 — parametric tools speed things up but exploration is still manual", score: 2 },
          { text: "3-5 — AI suggests optimizations that engineers evaluate", score: 3 },
          { text: "1-3 — generative AI explores thousands of options and recommends the best", score: 4 }
        ]
      },
      {
        text: "How much do late deliveries and misrouted shipments cost you in penalties, rush fees, and lost customer trust?",
        options: [
          { text: "Significant — manual coordination leads to frequent delays", score: 1 },
          { text: "Noticeable — tracking software helps but routing isn't optimized", score: 2 },
          { text: "Moderate — AI optimizes routes but can't adapt to real-time disruptions", score: 3 },
          { text: "Minimal — AI orchestrates the full supply chain with real-time adjustments", score: 4 }
        ]
      }
    ],
    'Real Estate': [
      {
        text: "How many investment opportunities has your team missed because you couldn't analyze market trends and property values fast enough?",
        options: [
          { text: "Many — we rely on manual comps and local knowledge", score: 1 },
          { text: "Some — online estimators help but don't capture micro-market trends", score: 2 },
          { text: "A few — AI market analysis informs decisions but isn't real-time", score: 3 },
          { text: "Almost none — AI surfaces undervalued properties and predicts appreciation", score: 4 }
        ]
      },
      {
        text: "How many potential buyers disengage because they can't visualize a property's potential from static photos?",
        options: [
          { text: "Many — we lose out-of-town buyers who can't visit in person", score: 1 },
          { text: "Some — 360 tours help but empty properties still don't sell themselves", score: 2 },
          { text: "A few — AI virtual staging brings spaces to life for most listings", score: 3 },
          { text: "Very few — full VR/AI immersive experiences convert remote buyers regularly", score: 4 }
        ]
      },
      {
        text: "How many hours per week do your agents spend following up with leads that were never going to convert?",
        options: [
          { text: "10+ hours — every lead gets the same manual follow-up sequence", score: 1 },
          { text: "5-10 hours — CRM filters help but agents still chase cold leads", score: 2 },
          { text: "2-5 hours — AI scores leads but agents still decide who to call", score: 3 },
          { text: "Under 2 hours — AI auto-matches buyers to properties and prioritizes hot leads", score: 4 }
        ]
      },
      {
        text: "How much are you overspending on building operations (HVAC, lighting, security) because systems aren't intelligently managed?",
        options: [
          { text: "15%+ — manual controls and fixed schedules waste energy daily", score: 1 },
          { text: "10-15% — smart thermostats help but don't coordinate across systems", score: 2 },
          { text: "5-10% — AI optimizes some systems but building-wide coordination is limited", score: 3 },
          { text: "Under 5% — fully autonomous building management optimizes everything in real time", score: 4 }
        ]
      },
      {
        text: "How many bad tenants have cost you money because screening missed red flags that AI could have caught?",
        options: [
          { text: "Several — manual background checks miss patterns across applications", score: 1 },
          { text: "A few — software-assisted screening helps but doesn't predict risk well", score: 2 },
          { text: "Rare — AI risk assessment flags most high-risk applicants", score: 3 },
          { text: "Almost none — AI evaluates every data point and predicts tenant quality accurately", score: 4 }
        ]
      }
    ],
    'EdTech': [
      {
        text: "How many students are falling behind right now because they're stuck on a one-size-fits-all curriculum that doesn't match their learning pace?",
        options: [
          { text: "Many — everyone follows the same linear path regardless of ability", score: 1 },
          { text: "Some — branching paths exist but don't truly adapt to individual progress", score: 2 },
          { text: "A few — AI recommends content adjustments but teachers make all decisions", score: 3 },
          { text: "Very few — AI continuously adapts difficulty, pace, and content for each learner", score: 4 }
        ]
      },
      {
        text: "How many hours per week do your instructors spend grading assignments that AI could evaluate with detailed, personalized feedback?",
        options: [
          { text: "15+ hours — all grading is manual, eating into teaching and content time", score: 1 },
          { text: "8-15 hours — auto-grading handles MCQs but essays and projects are manual", score: 2 },
          { text: "3-8 hours — AI provides feedback drafts that instructors review", score: 3 },
          { text: "Under 3 hours — AI grades and gives personalized feedback autonomously", score: 4 }
        ]
      },
      {
        text: "What percentage of your enrolled students complete their courses — and how many drop off silently because nobody noticed they were struggling?",
        options: [
          { text: "Under 30% completion — students disappear and we don't know why until it's too late", score: 1 },
          { text: "30-50% — we track attendance but can't predict who's about to drop off", score: 2 },
          { text: "50-70% — AI flags at-risk students, but intervention is still manual", score: 3 },
          { text: "70%+ — AI predicts drop-off risk early and triggers personalized re-engagement", score: 4 }
        ]
      },
      {
        text: "How quickly can you create or update a course module when new information, tools, or regulations emerge in your subject area?",
        options: [
          { text: "Months — content creation is entirely manual and slow", score: 1 },
          { text: "Weeks — AI helps draft but review cycles are long", score: 2 },
          { text: "Days — AI generates lesson plans and materials, humans curate", score: 3 },
          { text: "Hours — AI autonomously updates content and flags changes for approval", score: 4 }
        ]
      },
      {
        text: "How many student questions go unanswered outside of business hours — losing engagement during peak study time?",
        options: [
          { text: "Most — students email questions and wait 24-48 hours for a response", score: 1 },
          { text: "Many — support is limited to office hours; evenings and weekends are dead", score: 2 },
          { text: "Some — a chatbot handles FAQs but can't help with course-specific questions", score: 3 },
          { text: "Very few — an AI tutor provides instant, contextual help 24/7", score: 4 }
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

const Header = ({ onNavigate, currentScreen, user, onLogout }: { onNavigate: (s: Screen) => void, currentScreen: Screen, user: User | null, onLogout: () => void }) => (
  <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <img src="/toasterailogo.png" alt="ToasterAI" className="h-12 object-contain" />
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
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-slate-500 truncate max-w-[150px]">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Sign In
            </button>
          )}
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
            <img src="/toasterailogo.png" alt="ToasterAI" className="h-14 object-contain" />
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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Firebase Auth listener
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
  const handleLogout = async () => {
    await logOut();
    setScreen('landing');
  };

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
      // Collect diagnostic completion data
      const sum = newScores.reduce((a, b) => a + b, 0);
      const finalScore = Math.round((sum / (newScores.length * 4)) * 100);
      const classLabel = finalScore < 25 ? 'At Risk' : finalScore < 50 ? 'Inefficient' : finalScore < 75 ? 'Emerging' : 'Optimized';
      collectData({
        email: user?.email || '',
        role: userData.role,
        industry: userData.industry,
        companySize: userData.companySize,
        score: finalScore,
        classification: classLabel,
        source: 'diagnostic_complete',
        userId: user?.uid || '',
      });
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
              <form onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.target as HTMLFormElement).reportEmail.value;
                setReportStatus('sending');
                const success = await sendReportViaAppsScript({
                  email,
                  score: totalScore,
                  classification: classification.label,
                  revenueLeak,
                  role: userData.role,
                  industry: userData.industry,
                  companySize: userData.companySize,
                  userId: user?.uid || '',
                });
                setReportStatus(success ? 'sent' : 'error');
                setTimeout(() => setReportStatus('idle'), 4000);
              }} className="space-y-3">
                <input
                  name="reportEmail"
                  type="email"
                  placeholder="Enter your work email"
                  defaultValue={user?.email || ''}
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={reportStatus === 'sending'}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {reportStatus === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                  {reportStatus === 'idle' && 'Send My Report'}
                  {reportStatus === 'sending' && 'Sending...'}
                  {reportStatus === 'sent' && 'Report Sent!'}
                  {reportStatus === 'error' && 'Failed - Try Again'}
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

  const AuthScreen = () => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
        if (mode === 'signup') {
          await signUp(email, password);
          collectData({ email, source: 'signup' });
        } else {
          await logIn(email, password);
        }
        setScreen('landing');
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') setError('This email is already registered. Try logging in.');
        else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Invalid email or password.');
        else if (code === 'auth/user-not-found') setError('No account found. Try signing up.');
        else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.');
        else if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
        else setError(err?.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleGoogleAuth = async () => {
      setError('');
      setLoading(true);
      try {
        const result = await signInWithGoogle();
        collectData({ email: result.user.email || '', source: 'google_signup', userId: result.user.uid });
        setScreen('landing');
      } catch (err: any) {
        if (err?.code !== 'auth/popup-closed-by-user') {
          setError(err?.message || 'Google sign-in failed.');
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {mode === 'login' ? 'Sign in to access your dashboard' : 'Join 1,000+ professionals using ToasterAI'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all mb-6 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-semibold">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter your password'}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

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
      <Header onNavigate={setScreen} currentScreen={screen} user={user} onLogout={handleLogout} />

      <main>
        <AnimatePresence mode="wait">
          {screen === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LandingScreen /></motion.div>}
          {screen === 'auth' && <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AuthScreen /></motion.div>}
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
