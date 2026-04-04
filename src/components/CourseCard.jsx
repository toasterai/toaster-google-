import React from 'react';
import { Target, Check, Eye, ShoppingCart, Lock } from 'lucide-react';

export default function CourseCard({ course, isMatch, onPreview, onEnroll }) {
  return (
    <div className={`bg-white rounded-2xl flex flex-col overflow-hidden shadow-lg border-2 transition-all ${isMatch ? 'border-blue-500 transform lg:-translate-y-2 shadow-blue-500/20 z-10' : course.type === 'Core' ? 'border-indigo-300' : 'border-slate-100 hover:border-slate-300'}`}>
      {isMatch && (
        <div className="bg-blue-600 text-white text-center text-sm font-bold py-2 uppercase tracking-widest flex justify-center items-center">
          <Target size={16} className="mr-2" /> Top Recommendation
        </div>
      )}
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${course.type === 'Core' ? 'bg-indigo-100 text-indigo-700' : course.type === 'Role' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
            {course.type === 'Core' ? 'Certification' : course.target}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-4">{course.title}</h3>
        <p className="text-slate-600 mb-6 flex-grow">{course.desc}</p>

        <div className="text-4xl font-black text-slate-900 mb-6 flex items-end">
          ${course.price} <span className="text-lg text-slate-400 font-normal ml-1">USD</span>
        </div>

        <ul className="space-y-3 mb-8">
          {course.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-700">
              <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-3">
          <button
            onClick={() => onPreview(course)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg transition-all flex justify-center items-center text-sm border border-slate-200"
          >
            <Eye size={16} className="mr-2" /> Preview Syllabus
          </button>

          <button
            onClick={() => onEnroll(course)}
            className={`w-full font-bold py-4 px-6 rounded-lg transition-all flex justify-center items-center ${isMatch || course.type === 'Core' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            <ShoppingCart size={18} className="mr-2" /> Enroll Now
          </button>
        </div>
        <div className="flex items-center justify-center mt-4 text-xs text-slate-400">
          <Lock size={12} className="mr-1" /> Secure Enrollment
        </div>
      </div>
    </div>
  );
}
