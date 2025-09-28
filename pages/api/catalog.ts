
import type { NextApiRequest, NextApiResponse } from 'next';
import { readSheet } from '../../lib/google';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const prod = await readSheet('Produits!A:Z');
  const h = prod[0]||[]; const iLib=h.indexOf('Libellé'), iPrix=h.indexOf('PrixBase'), iCat=h.indexOf('Catégorie'), iImg=h.indexOf('Image'), iOld=h.indexOf('PrixAncien');
  const items = prod.slice(1).filter(r=>r[iLib]).map(r=>({
    libelle:r[iLib], categorie:r[iCat]||'Autre', image:r[iImg]||'', ancien:Number(r[iOld]||0)||undefined, prix:Number(r[iPrix]||0)||0
  }));
  const cats = Array.from(new Set(items.map(i=>i.categorie)));
  res.json({ categories:cats, items, currency:'$' });
}
