
import type { NextApiRequest, NextApiResponse } from 'next';
import { readSheet } from '../../lib/google';
import { randomUUID } from 'crypto';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { username, password } = req.body||{};
  if(!username||!password) return res.json({ ok:false, reason:'Champs requis' });
  // Admins
  const admins = await readSheet('Admins!A:Z');
  const ah = admins[0]||[]; const li=ah.indexOf('Login'), pi=ah.indexOf('Password');
  for(let i=1;i<admins.length;i++){ const r=admins[i]; if((r[li]||'')===username && (r[pi]||'')===password){ return res.json({ ok:true, role:'admin', token:randomUUID() }); } }
  // Entreprises
  const ents = await readSheet('Entreprises!A:Z');
  const eh = ents[0]||[]; const lgi=eh.indexOf('Login'), pwi=eh.indexOf('Password'), ai=eh.indexOf('Actif'), en=eh.indexOf('Entreprise');
  for(let i=1;i<ents.length;i++){ const r=ents[i];
    if((r[lgi]||'')===username && (r[pwi]||'')===password && String(r[ai]||'true').toLowerCase()!=='false'){
      return res.json({ ok:true, role:'company', token:randomUUID(), company:r[en] });
    }
  }
  return res.json({ ok:false, reason:'Identifiants invalides' });
}
