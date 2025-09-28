
const { google } = require('googleapis');
function getAuth(){
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const pk = (process.env.GOOGLE_PRIVATE_KEY||'').replace(/\n/g,'\n');
  if(!email || !pk) throw new Error('GOOGLE_SERVICE_EMAIL/GOOGLE_PRIVATE_KEY manquants');
  return new google.auth.JWT(email, null, pk, ['https://www.googleapis.com/auth/spreadsheets']);
}
async function sheets(){ return google.sheets({ version:'v4', auth: getAuth() }); }
async function readSheet(range){
  const s = await sheets();
  const r = await s.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range });
  return r.data.values || [];
}
async function appendRow(range, row){
  const s = await sheets();
  await s.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID, range, valueInputOption:'USER_ENTERED',
    requestBody:{ values:[row] }
  });
}
async function updateCell(a1, value){
  const s = await sheets();
  await s.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID, range:a1, valueInputOption:'USER_ENTERED',
    requestBody:{ values:[[value]] }
  });
}
module.exports = { readSheet, appendRow, updateCell };
