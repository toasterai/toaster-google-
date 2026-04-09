// ============================================================
// ToasterAI - Google Apps Script
// Handles data collection to Google Sheet + email report sending
//
// HOW TO DEPLOY:
// 1. Open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Replace all code with this file's contents
// 4. Click Deploy > New Deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the URL and update GOOGLE_SHEET_WEBHOOK_URL in dataCollection.ts
// ============================================================

const SHEET_NAME = 'Submissions';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Save to sheet
    saveToSheet(data);

    // Send email report if requested
    if (data.sendEmail && data.email) {
      sendReportEmail(data);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle redirected POST requests (CORS workaround)
  // Also useful for health checks
  if (e && e.parameter && e.parameter.data) {
    try {
      const data = JSON.parse(e.parameter.data);
      saveToSheet(data);
      if (data.sendEmail && data.email) {
        sendReportEmail(data);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'ToasterAI webhook is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Source', 'Email', 'Role', 'Industry',
      'Company Size', 'Score', 'Classification', 'Revenue Leak', 'User ID'
    ]);
  }

  sheet.appendRow([
    new Date().toISOString(),
    data.source || '',
    data.email || '',
    data.role || '',
    data.industry || '',
    data.companySize || '',
    data.score || '',
    data.classification || '',
    data.revenueLeak || '',
    data.userId || ''
  ]);
}

function sendReportEmail(data) {
  const score = data.score || 0;
  const maxScore = 40;
  const percentage = Math.round((score / maxScore) * 100);
  const classification = data.classification || 'Unknown';
  const revenueLeak = data.revenueLeak || 0;
  const role = data.role || 'Professional';
  const industry = data.industry || 'Your Industry';

  const subject = `Your ToasterAI Diagnostic Report — ${classification} (${percentage}%)`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
      <div style="background: white; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0;">

        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; color: #0f172a; margin: 0 0 8px 0;">ToasterAI</h1>
          <p style="color: #64748b; font-size: 14px; margin: 0;">AI Revenue Diagnostic Report</p>
        </div>

        <div style="background: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Your AI Readiness Score</p>
          <p style="font-size: 48px; font-weight: 800; color: #0f172a; margin: 0;">${percentage}%</p>
          <p style="font-size: 18px; font-weight: 600; color: #3b82f6; margin: 8px 0 0 0;">${classification}</p>
        </div>

        <div style="background: #fef2f2; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #991b1b; font-size: 13px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Revenue Leak</p>
          <p style="font-size: 32px; font-weight: 800; color: #dc2626; margin: 0;">$${revenueLeak.toLocaleString()}</p>
          <p style="color: #7f1d1d; font-size: 13px; margin: 8px 0 0 0;">This is the estimated revenue your organization loses annually due to AI efficiency gaps.</p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0;">Diagnostic Profile</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Role</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Industry</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${industry}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Company Size</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${data.companySize || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Raw Score</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${score} / ${maxScore}</td>
            </tr>
          </table>
        </div>

        <div style="background: #eff6ff; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 16px; margin: 0 0 12px 0;">What This Means</h3>
          <p style="color: #1e3a5f; font-size: 14px; line-height: 1.6; margin: 0;">
            ${getRecommendation(percentage, classification)}
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://toaster-google.vercel.app/" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
            View Recommended Courses
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
            This report was generated by ToasterAI's AI Revenue Diagnostic Engine.<br>
            Visit <a href="https://toasterai.org" style="color: #3b82f6;">toasterai.org</a> for more.
          </p>
        </div>

      </div>
    </div>
  `;

  GmailApp.sendEmail(data.email, subject, `Your ToasterAI Score: ${percentage}% (${classification}). Estimated Revenue Leak: $${revenueLeak.toLocaleString()}. View full report at https://toaster-google.vercel.app/`, {
    htmlBody: htmlBody,
    name: 'ToasterAI',
    replyTo: 'support@toasterai.org'
  });
}

function getRecommendation(percentage, classification) {
  if (percentage <= 25) {
    return 'Your organization is in the early stages of AI adoption. There is significant opportunity to reduce manual workloads, eliminate revenue leaks, and gain competitive advantage through AI automation. Our Foundation courses are designed specifically for your stage.';
  } else if (percentage <= 50) {
    return 'You have started your AI journey but major efficiency gaps remain. Key areas like forecasting, personalization, and process automation still rely heavily on manual effort. Our Intermediate courses will help you bridge these gaps systematically.';
  } else if (percentage <= 75) {
    return 'Your organization has meaningful AI integration, but there are still areas where automation could drive significant additional value. Our Advanced courses focus on the high-impact optimizations that separate leaders from followers.';
  } else {
    return 'Your organization is an AI leader with strong integration across operations. Focus on maintaining your edge through cutting-edge agentic AI, autonomous orchestration, and continuous optimization. Our Expert courses keep you ahead of the curve.';
  }
}
