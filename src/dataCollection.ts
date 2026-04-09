// ============================================================
// Google Apps Script handles BOTH data collection AND email sending.
//
// Update your Apps Script (Extensions > Apps Script) with the
// code shown in APPS_SCRIPT_CODE.js, then redeploy.
// ============================================================
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxbNxWEj_JXG6jyeN69mO2_hv-VM_bQSOK0gSxfosObHRy0uwY4vnedsI3Lko8-3rZi/exec';

interface CollectionData {
  email?: string;
  role?: string;
  industry?: string;
  companySize?: string;
  score?: number;
  classification?: string;
  revenueLeak?: number;
  source: string;
  userId?: string;
  sendEmail?: boolean;
}

export async function collectData(data: CollectionData): Promise<boolean> {
  if (GOOGLE_SHEET_WEBHOOK_URL === 'REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL') {
    console.log('[Data Collection] Not configured. Would have sent:', data);
    return true;
  }

  try {
    // Try standard fetch first — if Apps Script returns proper CORS headers, we can read the response
    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
      redirect: 'follow',
    });
    const result = await response.json();
    console.log('[Data Collection] Response:', result);
    return result?.status === 'ok';
  } catch {
    // Apps Script redirects POST → GET which causes CORS issues.
    // Fallback: use no-cors mode. The request still reaches the server
    // but we get an opaque response (can't read it). Assume success.
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      console.log('[Data Collection] Sent via no-cors fallback');
      return true;
    } catch (error) {
      console.error('[Data Collection] All attempts failed:', error);
      return false;
    }
  }
}

// Send report via Apps Script (collects data + sends email)
export async function sendReportViaAppsScript(data: {
  email: string;
  score: number;
  classification: string;
  revenueLeak: number;
  role: string;
  industry: string;
  companySize: string;
  userId?: string;
}): Promise<boolean> {
  return collectData({
    ...data,
    source: 'report_request',
    sendEmail: true,
  });
}
