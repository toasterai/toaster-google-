import React, { useState, useCallback } from 'react';
import { BrainCircuit, BookOpen } from 'lucide-react';
import { useScreenNavigation } from './hooks/useScreenNavigation';
import { usePaddle } from './hooks/usePaddle';
import { generateAdaptiveQuestions } from './data/questions';
import { COMPANY_SIZE_MULTIPLIERS } from './data/courses';

import LandingScreen from './screens/LandingScreen';
import SegmentationScreen from './screens/SegmentationScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ResultsScreen from './screens/ResultsScreen';
import CatalogScreen from './screens/CatalogScreen';

export default function App() {
  const { screen, navigateTo, mainRef } = useScreenNavigation('landing');
  // Initialize Paddle SDK on app mount
  usePaddle();

  const [profile, setProfile] = useState({ role: '', industry: '', companySize: '' });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [finalScore, setFinalScore] = useState(0);
  const [classification, setClassification] = useState('');
  const [revenueLeak, setRevenueLeak] = useState(0);
  const [categoryScores, setCategoryScores] = useState({ core: 0, role: 0, industry: 0 });

  const handleStart = useCallback(() => navigateTo('segmentation'), [navigateTo]);

  const handleCatalogDirect = useCallback(() => navigateTo('catalog'), [navigateTo]);

  const handleProfileSubmit = useCallback(() => {
    const generated = generateAdaptiveQuestions(profile.role, profile.industry);
    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setAnswers({});
    navigateTo('assessment');
  }, [profile.role, profile.industry, navigateTo]);

  const calculateResults = useCallback((finalAnswers, qs) => {
    let coreSum = 0, coreCount = 0;
    let roleSum = 0, roleCount = 0;
    let indSum = 0, indCount = 0;

    qs.forEach(q => {
      const score = finalAnswers[q.id];
      if (q.category === 'core') { coreSum += score; coreCount++; }
      if (q.category === 'role') { roleSum += score; roleCount++; }
      if (q.category === 'industry') { indSum += score; indCount++; }
    });

    const coreAvg = coreSum / coreCount;
    const roleAvg = roleSum / roleCount;
    const indAvg = indSum / indCount;

    const weightedScore = (((coreAvg / 4) * 0.40) + ((roleAvg / 4) * 0.35) + ((indAvg / 4) * 0.25)) * 100;
    const roundedScore = Math.round(weightedScore);

    setFinalScore(roundedScore);
    setCategoryScores({
      core: Math.round((coreAvg / 4) * 100),
      role: Math.round((roleAvg / 4) * 100),
      industry: Math.round((indAvg / 4) * 100)
    });

    if (roundedScore <= 25) setClassification('At Risk');
    else if (roundedScore <= 50) setClassification('Inefficient Operator');
    else if (roundedScore <= 75) setClassification('AI-Enabled');
    else setClassification('AI-Leveraged');

    const baseRevenue = COMPANY_SIZE_MULTIPLIERS[profile.companySize];
    const inefficiencyFactor = (100 - roundedScore) / 100;
    setRevenueLeak(baseRevenue * (inefficiencyFactor * 0.30));

    setTimeout(() => navigateTo('results'), 500);
  }, [profile.companySize, navigateTo]);

  const handleAnswerSelect = useCallback((score) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    } else {
      calculateResults(newAnswers, questions);
    }
  }, [questions, currentQuestionIndex, answers, calculateResults]);

  const handleOpenCatalog = useCallback(() => navigateTo('catalog'), [navigateTo]);
  const handleBackToResults = useCallback(() => navigateTo('results'), [navigateTo]);

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-blue-200 min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`w-full px-6 py-4 flex justify-between items-center z-50 border-b transition-colors duration-300 ${screen === 'results' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div
          className="flex items-center space-x-2 font-black text-xl cursor-pointer tracking-tight"
          onClick={() => navigateTo('landing')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('landing'); }}
          aria-label="ToasterAI home"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg"><BrainCircuit className="text-white" size={20} /></div>
          <span>ToasterAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 font-semibold text-sm">
          <button
            onClick={() => navigateTo('landing')}
            className={`transition-colors ${screen === 'results' ? 'hover:text-blue-400 text-slate-300' : 'hover:text-blue-600 text-slate-600'}`}
          >
            Diagnostic
          </button>
          <button
            onClick={handleCatalogDirect}
            className={`transition-colors flex items-center ${screen === 'results' ? 'hover:text-blue-400 text-slate-300' : 'hover:text-blue-600 text-slate-600'}`}
          >
            <BookOpen size={16} className="mr-1.5" /> Course Catalog
          </button>
        </div>
      </nav>

      <main ref={mainRef} className="flex-grow flex flex-col relative">
        {screen === 'landing' && <LandingScreen onStart={handleStart} onCatalog={handleCatalogDirect} />}
        {screen === 'segmentation' && <SegmentationScreen profile={profile} setProfile={setProfile} onSubmit={handleProfileSubmit} />}
        {screen === 'assessment' && <AssessmentScreen questions={questions} currentQuestionIndex={currentQuestionIndex} onAnswer={handleAnswerSelect} />}
        {screen === 'results' && (
          <ResultsScreen
            profile={profile}
            finalScore={finalScore}
            classification={classification}
            revenueLeak={revenueLeak}
            categoryScores={categoryScores}
            onOpenCatalog={handleOpenCatalog}
          />
        )}
        {screen === 'catalog' && (
          <CatalogScreen
            profile={profile}
            categoryScores={profile.role ? categoryScores : null}
            onBack={profile.role ? handleBackToResults : null}
          />
        )}
      </main>
    </div>
  );
}
