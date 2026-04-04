// ============================================================
// SETUP: Google Sheets data collection via Google Apps Script
//
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this code in the script editor:
//
//    function doPost(e) {
//      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//      var data = JSON.parse(e.postData.contents);
//      sheet.appendRow([
//        new Date(),
//        data.email || '',
//        data.role || '',
//        data.industry || '',
//        data.companySize || '',
//        data.score || '',
//        data.classification || '',
//        data.revenueLeak || '',
//        data.source || '',
//        data.userId || ''
//      ]);
//      return ContentService
//        .createTextOutput(JSON.stringify({ status: 'ok' }))
//        .setMimeType(ContentService.MimeType.JSON);
//    }
//
// 4. Click Deploy > New Deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the Web App URL and paste below
// ============================================================
const GOOGLE_SHEET_WEBHOOK_URL = 'REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL';

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
}

export async function collectData(data: CollectionData): Promise<boolean> {
  // If webhook URL isn't configured yet, just log
  if (GOOGLE_SHEET_WEBHOOK_URL === 'REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL') {
    console.log('[Data Collection] Not configured. Would have sent:', data);
    return true;
  }

  try {
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error('Data collection failed:', error);
    return false;
  }
}
