
import type { NextApiRequest, NextApiResponse } from 'next';
import { readSheet } from '../../lib/google';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const rows = await readSheet('Commandes!A:I');
  if(!rows || rows.length<2) return res.json([]);
  const h = rows[0]; const iID=h.indexOf('ID'), iTs=h.indexOf('Horodatage'), iEnt=h.indexOf('Entreprise'), iCt=h.indexOf('Contact'), iJson=h.indexOf('Articles(JSON)'), iTot=h.indexOf('Total'), iSt=h.indexOf('Statut');
  const out = rows.slice(1).map(r=>({
    id:r[iID], date:r[iTs], entreprise:r[iEnt]||'', contact:r[iCt]||'',
    items:(()=>{ try{return JSON.parse(r[iJson]||'[]');}catch(_){return []} })(),
    total:Number(r[iTot]||0), statut:r[iSt]||'Nouvelle'
  }));
  res.json(out);
}
