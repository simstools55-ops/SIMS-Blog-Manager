/**
 * SIMS-Core Production Baseline v1.1
 * 99_Utils.gs
 *
 * Shared utility functions. Keep dependency-free and reusable.
 */
function simsSs_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function simsUi_() {
  return SpreadsheetApp.getUi();
}

function simsTz_() {
  return Session.getScriptTimeZone() || SIMS_DEFAULTS.TIMEZONE;
}

function simsNowDate_() {
  return new Date();
}

function simsNowText_() {
  return Utilities.formatDate(new Date(), simsTz_(), 'yyyy-MM-dd HH:mm:ss');
}

function simsDateText_(date) {
  return Utilities.formatDate(date, simsTz_(), 'yyyy-MM-dd');
}

function simsId_(prefix) {
  return prefix + '-' + Utilities.formatDate(new Date(), simsTz_(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000);
}

function simsSafeText_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function simsNumber_(value) {
  if (typeof value === 'number') return value;
  const n = Number(String(value || '').replace('%', '').replace(/,/g, '').trim());
  return isNaN(n) ? 0 : n;
}

function simsFormatPercent_(value) {
  const n = simsNumber_(value);
  if (n > 0 && n < 1) return (n * 100).toFixed(2) + '%';
  return n.toFixed(2) + '%';
}

function simsGetOrCreateSheet_(sheetName) {
  const ss = simsSs_();
  return ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
}

function simsOpenSheet_(sheetName) {
  const sheet = simsGetOrCreateSheet_(sheetName);
  simsSs_().setActiveSheet(sheet);
  return sheet;
}

function simsEnsureHeaders_(sheet, headers) {
  const currentLastCol = sheet.getLastColumn();
  const current = currentLastCol ? sheet.getRange(1, 1, 1, currentLastCol).getValues()[0].map(String) : [];
  const hasAnyHeader = current.some(Boolean);
  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const missing = headers.filter(h => current.indexOf(h) === -1);
    if (missing.length) {
      sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
    }
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).setFontWeight('bold').setBackground('#e8f0fe');
}

function simsHeaderMap_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headers.forEach((h, i) => {
    const key = simsSafeText_(h);
    if (key) map[key] = i + 1;
  });
  return map;
}

function simsRowsAsObjects_(sheetName) {
  const sheet = simsSs_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.map((row, idx) => {
    const obj = { _rowNumber: idx + 2 };
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function simsAppendObject_(sheetName, headers, obj) {
  const sheet = simsGetOrCreateSheet_(sheetName);
  simsEnsureHeaders_(sheet, headers);
  const map = simsHeaderMap_(sheet);
  const row = new Array(sheet.getLastColumn()).fill('');
  headers.forEach(h => {
    const col = map[h];
    if (col) row[col - 1] = obj[h] !== undefined ? obj[h] : '';
  });
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function simsSetObjectValues_(sheet, rowNumber, updates) {
  const map = simsHeaderMap_(sheet);
  Object.keys(updates).forEach(key => {
    if (map[key]) sheet.getRange(rowNumber, map[key]).setValue(updates[key]);
  });
}

function simsFindRowByValue_(sheetName, headerName, value) {
  const sheet = simsSs_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const map = simsHeaderMap_(sheet);
  const col = map[headerName];
  if (!col) return null;
  const values = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(value)) return i + 2;
  }
  return null;
}

function simsGetSetting_(key, defaultValue) {
  const rows = simsRowsAsObjects_(SIMS_SHEETS.SETTINGS);
  const row = rows.find(r => String(r.Key) === String(key));
  return row ? row.Value : defaultValue;
}

function simsSetSetting_(key, value, description) {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.SETTINGS);
  simsEnsureHeaders_(sheet, SIMS_HEADERS.SETTINGS);
  const rowNumber = simsFindRowByValue_(SIMS_SHEETS.SETTINGS, 'Key', key);
  if (rowNumber) {
    simsSetObjectValues_(sheet, rowNumber, { Value: value, Description: description || '', UpdatedAt: simsNowText_() });
  } else {
    simsAppendObject_(SIMS_SHEETS.SETTINGS, SIMS_HEADERS.SETTINGS, { Key: key, Value: value, Description: description || '', UpdatedAt: simsNowText_() });
  }
}

function simsGetBlogProfile_(key, defaultValue) {
  const rows = simsRowsAsObjects_(SIMS_SHEETS.BLOG_PROFILE);
  const row = rows.find(r => String(r.Key) === String(key));
  return row ? row.Value : defaultValue;
}

function simsSetBlogProfile_(key, value, description) {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.BLOG_PROFILE);
  simsEnsureHeaders_(sheet, SIMS_HEADERS.BLOG_PROFILE);
  const rowNumber = simsFindRowByValue_(SIMS_SHEETS.BLOG_PROFILE, 'Key', key);
  if (rowNumber) {
    simsSetObjectValues_(sheet, rowNumber, { Value: value, Description: description || '', UpdatedAt: simsNowText_() });
  } else {
    simsAppendObject_(SIMS_SHEETS.BLOG_PROFILE, SIMS_HEADERS.BLOG_PROFILE, { Key: key, Value: value, Description: description || '', UpdatedAt: simsNowText_() });
  }
}

function simsLog_(action, status, detail) {
  simsAppendObject_(SIMS_SHEETS.SYSTEM_LOG, SIMS_HEADERS.SYSTEM_LOG, {
    CreatedAt: simsNowText_(),
    Action: action,
    Status: status,
    Detail: detail || '',
    User: Session.getActiveUser().getEmail() || ''
  });
}

function simsAlert_(title, message) {
  simsUi_().alert(title, message, simsUi_().ButtonSet.OK);
}

function simsToast_(message, title, seconds) {
  simsSs_().toast(message, title || 'SIMS', seconds || 4);
}

function simsStyleDataSheet_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, lastCol).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true);
  sheet.getRange(1, 1, lastRow, lastCol).setVerticalAlignment('top').setWrap(true);
  sheet.autoResizeColumns(1, Math.min(lastCol, 12));
}
