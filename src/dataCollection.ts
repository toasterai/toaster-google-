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
    // Send data as URL parameter to avoid CORS/redirect issues with POST body.
    // Apps Script redirects POST→GET (302), which drops the POST body.
    // By encoding data in the URL, it survives the redirect.
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `${GOOGLE_SHEET_WEBHOOK_URL}?data=${encodedData}`;

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    console.log('[Data Collection] Response:', result);
    return result?.status === 'ok';
  } catch (error) {
    console.error('[Data Collection] Failed:', error);
    // Fallback: try with no-cors GET
    try {
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const url = `${GOOGLE_SHEET_WEBHOOK_URL}?data=${encodedData}`;
      await fetch(url, { method: 'GET', mode: 'no-cors' });
      console.log('[Data Collection] Sent via no-cors fallback');
      return true;
    } catch (fallbackError) {
      console.error('[Data Collection] All attempts failed:', fallbackError);
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
