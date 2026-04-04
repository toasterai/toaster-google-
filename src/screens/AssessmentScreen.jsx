import React from 'react';

export default function AssessmentScreen({ questions, currentQuestionIndex, onAnswer }) {
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 items-center">
      <div className="w-full max-w-2xl mt-10">
        <div className="flex justify-between text-sm font-semibold text-slate-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="uppercase text-blue-600 tracking-wider text-xs bg-blue-100 px-2 py-1 rounded">
            {question.category} Analysis
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-fade-in-up">
          <h2 tabIndex={-1} className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-relaxed outline-none">
            {question.text}
          </h2>
          <fieldset>
            <legend className="sr-only">Choose an answer</legend>
            <div className="space-y-4">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onAnswer(opt.score)}
                  className="w-full text-left p-5 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-4 group-hover:border-blue-500 flex items-center justify-center" aria-hidden="true">
                    <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  {opt.text}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
