import { useEffect, useRef } from 'react';

// Paddle price IDs mapped to course IDs.
// Replace these with your real Paddle price IDs after creating products in the Paddle dashboard.
// Format: course_id -> Paddle price ID (e.g., "pri_01abc123...")
const COURSE_PRICE_MAP = {
  // Core
  core_1: 'REPLACE_WITH_PADDLE_PRICE_ID',
  // Roles
  role_ceo: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_sales: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_ops: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_marketing: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_hr: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_finance: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_eng: 'REPLACE_WITH_PADDLE_PRICE_ID',
  role_cs: 'REPLACE_WITH_PADDLE_PRICE_ID',
  // Industries
  ind_telecom: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_saas: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_ecom: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_services: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_health: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_fintech: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_mfg: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_re: 'REPLACE_WITH_PADDLE_PRICE_ID',
  ind_edtech: 'REPLACE_WITH_PADDLE_PRICE_ID',
};

// Set this to your Paddle client-side token from the Paddle dashboard.
// Sandbox token for testing, live token for production.
const PADDLE_CLIENT_TOKEN = 'REPLACE_WITH_PADDLE_CLIENT_TOKEN';

// Set to true while testing with Paddle Sandbox, false for production.
const USE_SANDBOX = true;

export function usePaddle() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (typeof window.Paddle === 'undefined') return;

    try {
      if (USE_SANDBOX) {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
      });
      initializedRef.current = true;
    } catch (err) {
      console.error('Paddle initialization failed:', err);
    }
  }, []);

  const openCheckout = (courseId, { onSuccess, onClose } = {}) => {
    const priceId = COURSE_PRICE_MAP[courseId];
    if (!priceId || priceId === 'REPLACE_WITH_PADDLE_PRICE_ID') {
      console.warn(`No Paddle price ID configured for course: ${courseId}. Opening demo mode.`);
      // Fallback: if no price IDs configured yet, trigger onSuccess for demo
      if (onSuccess) {
        setTimeout(() => onSuccess({ demo: true }), 1500);
      }
      return;
    }

    if (typeof window.Paddle === 'undefined') {
      console.error('Paddle.js not loaded');
      return;
    }

    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: window.location.origin + '?enrolled=' + courseId,
      },
      customData: { courseId },
    });
  };

  return { openCheckout };
}

export { COURSE_PRICE_MAP };
