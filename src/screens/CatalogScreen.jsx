import React, { useState, useMemo } from 'react';
import { Filter, XCircle } from 'lucide-react';
import { ALL_COURSES, ROLES } from '../data/courses';
import CourseCard from '../components/CourseCard';
import SyllabusModal from '../components/SyllabusModal';
import CheckoutModal from '../components/CheckoutModal';

export default function CatalogScreen({ profile, categoryScores, onBack }) {
  const [filterRole, setFilterRole] = useState(profile.role || 'All');
  const [previewCourse, setPreviewCourse] = useState(null);
  const [checkoutCourse, setCheckoutCourse] = useState(null);

  const worstCategory = useMemo(() => {
    if (!categoryScores) return 'core';
    let worst = 'core';
    let lowest = categoryScores.core;
    if (categoryScores.role < lowest) { worst = 'role'; lowest = categoryScores.role; }
    if (categoryScores.industry < lowest) { worst = 'industry'; }
    return worst;
  }, [categoryScores]);

  const filteredCourses = useMemo(() => {
    return ALL_COURSES.filter(c => {
      if (filterRole === 'All') return true;
      if (c.type === 'Core') return true;
      if (c.type === 'Role' && c.target === filterRole) return true;
      if (c.type === 'Industry' && profile.industry && c.target === profile.industry) return true;
      return false;
    });
  }, [filterRole, profile.industry]);

  const isMatch = (course) => {
    if (!profile.role || !categoryScores) return false;
    return (
      (course.type === 'Core' && worstCategory === 'core') ||
      (course.type === 'Role' && course.target === profile.role && worstCategory === 'role') ||
      (course.type === 'Industry' && course.target === profile.industry && worstCategory === 'industry')
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-7xl w-full">
        {profile.role && onBack && (
          <button onClick={onBack} className="text-blue-600 font-semibold flex items-center mb-8 hover:text-blue-800 transition-colors">
            &larr; Back to Results
          </button>
        )}

        <div className="text-center mb-10">
          <h1 tabIndex={-1} className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 outline-none">ToasterAI Course Catalog</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Enroll in our industry-recognized certification programs and actionable role-based masterclasses to scale your revenue.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center text-slate-500 font-semibold mr-2"><Filter size={20} className="mr-2" /> Filter By:</div>
          <label htmlFor="catalog-filter" className="sr-only">Filter courses by role</label>
          <select
            id="catalog-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-3 w-full md:w-auto outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {filterRole !== 'All' && (
            <button onClick={() => setFilterRole('All')} className="text-slate-400 hover:text-slate-600 flex items-center ml-auto text-sm font-semibold">
              <XCircle size={16} className="mr-1" /> Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isMatch={isMatch(course)}
              onPreview={setPreviewCourse}
              onEnroll={setCheckoutCourse}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No courses found for this specific filter combination. Try clearing filters.
          </div>
        )}
      </div>

      {previewCourse && (
        <SyllabusModal
          course={previewCourse}
          onClose={() => setPreviewCourse(null)}
          onEnroll={(course) => setCheckoutCourse(course)}
        />
      )}

      {checkoutCourse && (
        <CheckoutModal
          course={checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
        />
      )}
    </div>
  );
}
