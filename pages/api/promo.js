
import type { NextApiRequest, NextApiResponse } from 'next';
import { readSheet } from '../../lib/google';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { code } = req.body||{}; if(!code) return res.json({ ok:false });
  try{
    const rows = await readSheet('CodesPromos!A:Z');
    const h = rows[0]||[]; const c=h.indexOf('CodePromo'), t=h.indexOf('Type'), v=h.indexOf('Valeur'), a=h.indexOf('Actif'), l=h.indexOf('Libellé');
    for(let i=1;i<rows.length;i++){ const r=rows[i]; if(String(r[c]||'').toUpperCase()===String(code).toUpperCase()){
      const active = String(r[a]||'true').toLowerCase(); if(['true','1','oui'].includes(active)){
        return res.json({ ok:true, promo:{ type:String(r[t]||'pourcentage').toLowerCase(), value:Number(r[v]||0)||0, label:r[l]||'' } });
      } } }
  }catch(_){}
  res.json({ ok:false });
}
