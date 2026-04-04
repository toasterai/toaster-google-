// ============================================================
// Google Apps Script handles BOTH data collection AND email sending.
//
// Update your Apps Script (Extensions > Apps Script) with the
// code shown in APPS_SCRIPT_CODE.md, then redeploy.
// ============================================================
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw76grMFbJv4x-86rmuDxRLsxVUmnWMh1m5r9FP4uOgvBmFGPp4_XG0lfdTtydc7RiAGw/exec';

interface CollectionData {
  email?: string;
  role?: string;
  industry?: string;
  companySize?: string;
  score?: number;
  classification?: string;
  revenueLeak?: number;
  source: string; // e.g., 'diagnostic_complete', 'report_request', 'enrollment'
  userId?: string;
  sendEmail?: boolean; // If true, Apps Script will also send a report email
}

export async function collectData(data: CollectionData): Promise<boolean> {
  if (GOOGLE_SHEET_WEBHOOK_URL === 'REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL') {
    console.log('[Data Collection] Not configured. Would have sent:', data);
    return true;
  }

  try {
    // Use no-cors as fallback — Apps Script redirects POST to GET,
    // which can break response parsing. The request still goes through.
    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    try {
      const result = await response.json();
      console.log('[Data Collection] Response:', result);
      return result?.status === 'ok';
    } catch {
      // If we can't parse JSON (e.g. CORS redirect), assume success
      // if the request didn't throw
      console.log('[Data Collection] Request sent (no parseable response)');
      return true;
    }
  } catch (error) {
    console.error('Data collection failed:', error);
    // Try again with no-cors mode as last resort
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
      });
      console.log('[Data Collection] Sent via no-cors fallback');
      return true;
    } catch (fallbackError) {
      console.error('Data collection fallback also failed:', fallbackError);
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
