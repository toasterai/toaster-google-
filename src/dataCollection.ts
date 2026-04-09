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
    // Google Apps Script redirects POST to GET (302), which causes CORS issues
    // in browsers. Using no-cors mode ensures the POST reaches the server.
    // We can't read the response (opaque), but the data is processed server-side.
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });
    console.log('[Data Collection] Request sent successfully');
    return true;
  } catch (error) {
    console.error('[Data Collection] Failed:', error);
    return false;
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
