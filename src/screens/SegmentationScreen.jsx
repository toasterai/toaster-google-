import React from 'react';
import { BrainCircuit, Briefcase, Building, Users, ChevronRight } from 'lucide-react';
import { ROLES, INDUSTRIES, COMPANY_SIZE_MULTIPLIERS } from '../data/courses';

export default function SegmentationScreen({ profile, setProfile, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (profile.role && profile.industry && profile.companySize) {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 py-16">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="mb-8 text-center">
          <BrainCircuit className="mx-auto text-blue-600 mb-4" size={48} />
          <h2 tabIndex={-1} className="text-2xl font-bold text-slate-900 outline-none">Let's Personalize Your Diagnostic</h2>
          <p className="text-slate-500 mt-2">We adapt our analysis based on your specific operational context.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="seg-role" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Briefcase size={16} className="mr-2 text-slate-400" /> Your Role
            </label>
            <select
              id="seg-role"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            >
              <option value="" disabled>Select your role...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="seg-industry" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Building size={16} className="mr-2 text-slate-400" /> Industry
            </label>
            <select
              id="seg-industry"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
            >
              <option value="" disabled>Select your industry...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="seg-size" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Users size={16} className="mr-2 text-slate-400" /> Company Size
            </label>
            <select
              id="seg-size"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={profile.companySize}
              onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
            >
              <option value="" disabled>Select company size...</option>
              {Object.keys(COMPANY_SIZE_MULTIPLIERS).map(size => <option key={size} value={size}>{size} Employees</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 rounded-lg shadow transition-all mt-4 flex items-center justify-center"
          >
            Continue to Assessment <ChevronRight className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}
