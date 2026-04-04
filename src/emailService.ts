import emailjs from '@emailjs/browser';

// ============================================================
// SETUP: Replace these with your EmailJS credentials.
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (e.g., Gmail) under "Email Services"
// 3. Create an Email Template under "Email Templates" with these variables:
//    - {{to_email}} - recipient email
//    - {{to_name}} - recipient name (optional)
//    - {{score}} - AI readiness score
//    - {{classification}} - score classification
//    - {{revenue_leak}} - estimated revenue leak
//    - {{role}} - user's role
//    - {{industry}} - user's industry
//    - {{company_size}} - company size
// 4. Copy your Service ID, Template ID, and Public Key below
// ============================================================
const EMAILJS_SERVICE_ID = 'service_0stp0ej';
const EMAILJS_TEMPLATE_ID = 'template_i52dzee';
const EMAILJS_PUBLIC_KEY = 'oFpTa2Xusw6yTcQyB';

// Initialize EmailJS with public key
emailjs.init(EMAILJS_PUBLIC_KEY);

interface ReportData {
  email: string;
  score: number;
  classification: string;
  revenueLeak: number;
  role: string;
  industry: string;
  companySize: string;
}

export async function sendReport(data: ReportData): Promise<boolean> {
  // If credentials aren't configured yet, simulate success
  if (EMAILJS_SERVICE_ID === 'REPLACE_WITH_SERVICE_ID') {
    console.warn('EmailJS not configured. Simulating email send.');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: data.email,
        score: data.score.toString(),
        classification: data.classification,
        revenue_leak: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(data.revenueLeak),
        role: data.role,
        industry: data.industry,
        company_size: data.companySize,
      },
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error: any) {
    console.error('Failed to send report email:', error);
    console.error('EmailJS error details:', error?.text || error?.message || JSON.stringify(error));
    return false;
  }
}
