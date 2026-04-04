import React, { useState } from 'react';
import { X, Lock, Loader2, Check, AlertTriangle } from 'lucide-react';
import { useModal } from '../hooks/useModal';

export default function CheckoutModal({ course, onClose }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const { modalRef, handleBackdropClick } = useModal(true, status === 'idle' ? onClose : () => {});

  if (!course) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('processing');
    // Simulate enrollment (no real payment processing)
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => onClose(), 3500);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      onClick={status === 'idle' ? handleBackdropClick : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-zoom-in">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h3 id="checkout-title" className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Enroll</h3>
            <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
          </div>
          {status === 'idle' && (
            <button onClick={onClose} aria-label="Close checkout" className="text-slate-400 hover:text-slate-700">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6">
          {status === 'idle' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Demo notice - SECURITY: No real card data is collected */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium">
                  This is a demo. No real payment will be processed. Do not enter real card information.
                </p>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <span className="text-slate-600">Total Due Today</span>
                <span className="text-2xl font-black text-slate-900">${course.price} USD</span>
              </div>

              <div>
                <label htmlFor="checkout-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg mt-6 shadow flex justify-center items-center">
                <Lock size={16} className="mr-2" /> Complete Enrollment (Demo)
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                Full payment integration coming soon.
              </p>
            </form>
          )}

          {status === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Enrollment...</h3>
              <p className="text-slate-500">Please do not close this window.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enrollment Confirmed!</h3>
              <p className="text-slate-500 mb-6">Your course access details have been sent to your email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
