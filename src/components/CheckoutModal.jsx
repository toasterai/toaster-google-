import React, { useState } from 'react';
import { X, Lock, Loader2, Check, ShoppingCart } from 'lucide-react';
import { useModal } from '../hooks/useModal';
import { usePaddle } from '../hooks/usePaddle';

export default function CheckoutModal({ course, onClose }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const { modalRef, handleBackdropClick } = useModal(true, status === 'idle' ? onClose : () => {});
  const { openCheckout } = usePaddle();

  if (!course) return null;

  const handleEnroll = () => {
    setStatus('processing');
    openCheckout(course.id, {
      onSuccess: () => {
        setStatus('success');
        setTimeout(() => onClose(), 3500);
      },
      onClose: () => {
        setStatus('idle');
      },
    });
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
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <span className="text-slate-600">Total Due Today</span>
                <span className="text-2xl font-black text-slate-900">${course.price} USD</span>
              </div>

              <ul className="space-y-3">
                {course.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleEnroll}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg flex justify-center items-center transition-colors"
              >
                <ShoppingCart size={18} className="mr-2" /> Proceed to Checkout
              </button>

              <p className="text-center text-xs text-slate-400 flex items-center justify-center">
                <Lock size={12} className="mr-1" /> Secure payment powered by Paddle
              </p>
            </div>
          )}

          {status === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Opening Secure Checkout...</h3>
              <p className="text-slate-500">You will be redirected to Paddle to complete payment.</p>
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
