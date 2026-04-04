import React from 'react';
import {
  AlertTriangle, BarChart3, BrainCircuit, CheckCircle2,
  GraduationCap, Zap, ArrowRight, Mail, Target
} from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function ResultsScreen({ profile, finalScore, classification, revenueLeak, categoryScores, onOpenCatalog }) {
  let statusColor = 'text-red-500';
  let bgStatus = 'bg-red-50 border-red-200';
  if (finalScore > 25) { statusColor = 'text-orange-500'; bgStatus = 'bg-orange-50 border-orange-200'; }
  if (finalScore > 50) { statusColor = 'text-blue-500'; bgStatus = 'bg-blue-50 border-blue-200'; }
  if (finalScore > 75) { statusColor = 'text-green-500'; bgStatus = 'bg-green-50 border-green-200'; }

  let worstCategory = 'core';
  let lowestScore = categoryScores.core;
  if (categoryScores.role < lowestScore) { worstCategory = 'role'; lowestScore = categoryScores.role; }
  if (categoryScores.industry < lowestScore) { worstCategory = 'industry'; lowestScore = categoryScores.industry; }

  const aiAdvice = worstCategory === 'core'
    ? 'Your foundational systems are highly manual. Immediate action: Automate admin workflows to buy back time.'
    : worstCategory === 'role'
    ? `As a ${profile.role}, you are underutilizing AI for your specific tasks. Immediate action: Map your daily workflows and integrate AI agents.`
    : `You are falling behind AI adoption standards in the ${profile.industry} sector. Immediate action: Implement industry-specific predictive models.`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 tabIndex={-1} className="text-3xl md:text-5xl font-extrabold mb-4 text-white outline-none">Your AI Readiness Report</h1>
          <p className="text-slate-400 text-lg">Prepared for {profile.role} in {profile.industry}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-2xl p-8 border ${bgStatus} flex flex-col items-center justify-center text-center`}>
            <div className="text-6xl md:text-8xl font-black mb-2">
              <span className={statusColor}>{finalScore}</span><span className="text-3xl text-slate-400/50">/100</span>
            </div>
            <div className={`text-xl font-bold uppercase tracking-widest ${statusColor} mb-2`}>{classification}</div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col justify-center">
            <div className="flex items-center text-red-400 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Estimated Revenue Leak</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-2">~ {formatCurrency(revenueLeak)} <span className="text-lg text-slate-400 font-normal">/ year</span></p>
            <p className="text-sm text-slate-400">Based on inefficiency drag for a company of size {profile.companySize}.</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center border-b border-slate-700 pb-4">
            <BarChart3 className="mr-3 text-blue-400" /> Score Breakdown & AI Diagnosis
          </h3>
          <div className="space-y-6 mb-8">
            {[
              { label: 'Core Infrastructure', score: categoryScores.core, color: 'bg-blue-500' },
              { label: `${profile.role} Efficacy`, score: categoryScores.role, color: 'bg-purple-500' },
              { label: `${profile.industry} Benchmarks`, score: categoryScores.industry, color: 'bg-teal-500' },
            ].map(({ label, score, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-300">{label}</span>
                  <span>{score}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
                  <div className={`${color} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/30 border border-blue-800/50 p-6 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-2 flex items-center"><BrainCircuit size={18} className="mr-2" /> AI Agent Analysis</h4>
            <p className="text-slate-300">{aiAdvice}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all flex flex-col">
            <div className="flex items-center text-blue-400 mb-4">
              <GraduationCap size={28} className="mr-3" />
              <h3 className="text-2xl font-bold text-white">Upskill Your Team</h3>
            </div>
            <p className="text-slate-400 mb-6 flex-grow">
              Close the knowledge gap internally. Enroll in our industry-recognized AI certification programs and actionable courses designed for {profile.industry} professionals.
            </p>
            <button onClick={onOpenCatalog} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-blue-500 flex items-center justify-center">
              View Adaptive Course Catalog <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 border border-blue-500 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true"><Target size={100} /></div>
            <div className="flex items-center text-blue-200 mb-4 relative z-10">
              <Zap size={28} className="mr-3 text-white" />
              <h3 className="text-2xl font-bold text-white">Get Your Free Report</h3>
            </div>
            <p className="text-blue-100 mb-6 flex-grow relative z-10">
              Want the full breakdown? We'll send you a detailed, personalized PDF report outlining the exact steps to fix your {profile.industry} efficiency leaks.
            </p>
            <form className="flex flex-col gap-4 relative z-10" onSubmit={(e) => { e.preventDefault(); alert('Email captured! Report will be sent shortly.'); }}>
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter work email for full report"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm"
                />
              </div>
              <button type="submit" className="w-full bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors shadow-lg flex justify-center items-center">
                Send Free Report <CheckCircle2 size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
