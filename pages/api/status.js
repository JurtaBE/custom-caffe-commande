
import type { NextApiRequest, NextApiResponse } from 'next';
import { readSheet, updateCell } from '../../lib/google';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { id, statut } = req.body||{}; if(!id) return res.status(400).json({ ok:false });
  const rows = await readSheet('Commandes!A:I');
  const h = rows[0]||[]; const iID=h.indexOf('ID'); const iSt=h.indexOf('Statut');
  for(let i=1;i<rows.length;i++){
    if(rows[i][iID]===id){
      const rowNumber = i+1; const colLetter = String.fromCharCode('A'.charCodeAt(0)+iSt);
      await updateCell(`Commandes!${colLetter}${rowNumber}`, String(statut||'Nouvelle'));
      return res.json({ ok:true });
    }
  }
  res.json({ ok:false });
}
