
import type { NextApiRequest, NextApiResponse } from 'next';
import { appendRow } from '../../lib/google';
import axios from 'axios';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { payload } = req.body||{}; if(!payload) return res.status(400).json({ ok:false });
  const id = 'C-' + new Date().toISOString().replace(/[-:TZ.]/g,'');
  await appendRow('Commandes!A:I', [
    id, new Date().toISOString(), '', payload.contact||'',
    JSON.stringify(payload.items||[]), payload.subtotal||0, payload.discount||0, payload.total||0, 'Nouvelle'
  ]);
  try{
    const roleId = process.env.DISCORD_ROLE_ID;
    const lines = (payload.items||[]).map((it:any)=>`• ${it.libelle} ×${it.qte} – ${it.montant}`).join('\n');
    if(process.env.DISCORD_WEBHOOK){
      await axios.post(process.env.DISCORD_WEBHOOK, {
        content: roleId ? `<@&${roleId}>` : '',
        username: 'Commandes', avatar_url: 'https://i.goopics.net/vd2259.png',
        embeds: [{ title:`Nouvelle commande ${id}`, color:0xC9A646,
          fields:[ {name:'Total', value:`$${(payload.total||0).toFixed(2)}`, inline:true},
                   {name:'Contact', value:payload.contact||'—', inline:true},
                   {name:'Détails', value: lines||'—', inline:false} ] }]
      });
    }
  }catch(_){}
  res.json({ ok:true, id });
}
