import React from 'react';
import {
  ArrowRight, BarChart3, Zap, AlertTriangle, CheckCircle2, BrainCircuit,
  Target, Activity, Command, Hexagon, Box, Triangle, ShieldCheck,
  Globe, MessageCircle, Share2, BookOpen
} from 'lucide-react';

export default function LandingScreen({ onStart, onCatalog }) {
  return (
    <div className="bg-slate-50 flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="min-h-[85vh] w-full flex flex-col justify-center items-center p-6 pt-12 md:pt-20">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          {/* Left Column */}
          <div className="p-10 md:w-3/5 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold w-fit mb-6">
              <Zap size={16} />
              <span>ToasterAI Diagnostic Engine</span>
            </div>
            <h1 tabIndex={-1} className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 outline-none">
              Most Businesses Are Losing <span className="text-blue-600">20–30% Efficiency</span> Without Realizing It.
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Discover exactly where you stand with <span className="font-bold text-blue-600">AI</span>—and what to fix—in under 3 minutes.
            </p>
            <div className="flex flex-col items-center md:items-start w-full">
              <button
                onClick={onStart}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center w-full md:w-auto"
              >
                Start Free AI Diagnostic <ArrowRight className="ml-2" />
              </button>
              <p className="text-sm mt-4 text-slate-500 font-medium flex items-center">
                <CheckCircle2 size={16} className="text-green-500 mr-2" /> Get your personalized AI score instantly
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-slate-900 md:w-2/5 p-10 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none" aria-hidden="true"></div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 mb-8 border border-slate-700 shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative flex h-10 w-10 mr-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20" aria-hidden="true"></span>
                    <div className="relative inline-flex rounded-full h-10 w-10 bg-blue-600 items-center justify-center">
                      <Activity className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Live Scan</div>
                    <div className="text-sm font-semibold text-white">Analyzing Workflows...</div>
                  </div>
                </div>
                <div className="text-blue-400 font-bold bg-blue-900/50 px-2 py-1 rounded text-xs">AI-Ready</div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2" role="presentation">
                <div className="bg-blue-500 h-1.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
              <div className="text-xs text-slate-400 text-right">Detecting efficiency leaks</div>
            </div>

            <h3 className="text-lg font-bold mb-5 flex items-center text-slate-200 relative z-10">
              <AlertTriangle className="mr-2 text-yellow-400" size={20} /> The Hidden Costs
            </h3>
            <ul className="space-y-5 relative z-10">
              <li className="flex items-start">
                <div className="bg-white/10 p-1.5 rounded mr-3 mt-0.5"><BarChart3 size={16} className="text-blue-400" /></div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Manual Processes</h4>
                  <p className="text-xs text-slate-400">Burning team hours daily.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white/10 p-1.5 rounded mr-3 mt-0.5"><Target size={16} className="text-blue-400" /></div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Underutilized AI</h4>
                  <p className="text-xs text-slate-400">Missing scalable automations.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 w-full max-w-5xl text-center pb-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Used by 1,000+ professionals from forward-thinking companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center text-xl font-black text-slate-800"><Command className="mr-2 text-blue-600" /> Acme Corp</div>
            <div className="flex items-center text-xl font-black text-slate-800"><Hexagon className="mr-2 text-blue-600" /> Nexus</div>
            <div className="flex items-center text-xl font-black text-slate-800"><Box className="mr-2 text-blue-600" /> Globex</div>
            <div className="flex items-center text-xl font-black text-slate-800"><Triangle className="mr-2 text-blue-600" /> Vertex</div>
          </div>
        </div>
      </div>

      {/* Why Section */}
      <div className="w-full bg-white py-20 border-t border-slate-200 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why Take the ToasterAI Diagnostic?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">The AI landscape is moving too fast for guesswork. We analyze your specific operational setup to find exactly where you are losing money.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Target, title: 'Hyper-Personalized', desc: 'Questions adapt in real-time based on your role, industry, and company size to pinpoint your unique bottlenecks.' },
              { icon: BarChart3, title: 'Quantified Impact', desc: 'Stop guessing. Get an immediate estimate of exactly how much revenue your team is losing to inefficient processes.' },
              { icon: ShieldCheck, title: 'Actionable Playbook', desc: 'Receive a tailor-made curriculum and implementation strategy that you can deploy with your team on day one.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 py-12 md:py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 font-black text-2xl text-white mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg"><BrainCircuit className="text-white" size={24} /></div>
              <span>ToasterAI</span>
            </div>
            <p className="text-slate-300 font-medium mb-4 pr-4">
              Helping businesses and professionals move from manual inefficiency toward automated, scalable, and AI-driven growth.
            </p>
            <p className="text-slate-500 italic text-sm mb-6 pr-4">
              AI should amplify and accelerate your operations. It must never replace human strategy, empathy, or creativity in your business.
            </p>
            <div className="flex space-x-5">
              <a href="#" aria-label="Social media" className="text-slate-400 hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" aria-label="Community" className="text-slate-400 hover:text-white transition-colors"><MessageCircle size={20} /></a>
              <a href="#" aria-label="Share" className="text-slate-400 hover:text-white transition-colors"><Share2 size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="hover:text-blue-400 transition-colors">AI Diagnostic</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onCatalog(); }} className="hover:text-blue-400 transition-colors">Course Catalog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Enterprise Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">ToasterAI Doctrine</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          &copy; 2026 ToasterAI.org. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
