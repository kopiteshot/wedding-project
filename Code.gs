// Google Apps Script — Wedding RSVP → Google Sheets
// Spreadsheet: https://docs.google.com/spreadsheets/d/1mLCKAzXkZofvDCgz-C4_gPL5gGF8AF4QJfF89lVufms

const SPREADSHEET_ID = '1mLCKAzXkZofvDCgz-C4_gPL5gGF8AF4QJfF89lVufms';
const SHEET_NAME     = 'RSVP';   // tên trang tính — đổi nếu cần

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      e.parameter.timestamp  || new Date().toLocaleString('vi-VN'),
      e.parameter.name       || '',
      e.parameter.phone      || '',
      e.parameter.attendance || '',
      e.parameter.guests     || '',
      e.parameter.message    || ''
    ]);
    return ok();
  } catch (err) {
    return ok(); // vẫn trả 200 để tránh retry từ browser
  }
}

// GET dùng để kiểm tra endpoint còn sống không
function doGet() {
  return ContentService
    .createTextOutput('Wedding RSVP endpoint is running ♡')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Helpers ──────────────────────────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian', 'Họ và Tên', 'Số Điện Thoại',
      'Tham Dự', 'Số Khách', 'Lời Chúc'
    ]);
    sheet.getRange(1, 1, 1, 6)
      .setFontWeight('bold')
      .setBackground('#f5ede8');
  }
  return sheet;
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
