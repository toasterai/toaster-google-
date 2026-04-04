import React from 'react';
import { X, BookOpen, GraduationCap, CheckCircle2, Award, ShoppingCart } from 'lucide-react';
import { useModal } from '../hooks/useModal';

export default function SyllabusModal({ course, onClose, onEnroll }) {
  const { modalRef, handleBackdropClick } = useModal(true, onClose);

  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-title"
    >
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-zoom-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded w-fit mb-2 ${course.type === 'Core' ? 'bg-indigo-100 text-indigo-700' : course.type === 'Role' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
              {course.type === 'Core' ? 'Certification' : course.target}
            </div>
            <h2 id="syllabus-title" className="text-2xl font-bold text-slate-900">{course.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close syllabus preview" className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white rounded-full shadow-sm border border-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-grow">
          <p className="text-slate-600 text-lg leading-relaxed mb-8">{course.desc}</p>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-200 pb-3">
            <BookOpen size={20} className="mr-2 text-blue-600" /> Course Curriculum
          </h3>

          <div className="space-y-4 mb-10">
            {course.modules.map((mod, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors">
                <div className="font-bold text-slate-800 text-lg mb-1">Module {i + 1}: {mod.title}</div>
                <p className="text-sm text-slate-600 mb-4">{mod.desc}</p>
                <div className="flex items-center space-x-6">
                  <span className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                    <GraduationCap size={16} className="mr-2 text-slate-400" /> {mod.lessons} Lessons
                  </span>
                  <span className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                    <CheckCircle2 size={16} className="mr-2 text-slate-400" /> {mod.quizzes} Quiz Questions
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 text-lg mb-3 flex items-center">
              <Award size={20} className="mr-2 text-indigo-600" /> Final Assessment
            </h4>
            <p className="text-indigo-800 leading-relaxed font-medium">{course.finalAssessment}</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-2xl">
          <div className="text-3xl font-black text-slate-900">
            ${course.price} <span className="text-sm font-normal text-slate-500">USD</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center shadow-lg"
          >
            <ShoppingCart size={18} className="mr-2" /> Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
