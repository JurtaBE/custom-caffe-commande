
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
export default function Admin(){
  const [session,setSession]=useState<any>(null);
  const [rows,setRows]=useState<any[]>([]);
  const statuses=['Nouvelle','Préparation','Prête','Livrée','Annulée'];
  useEffect(()=>{
    const s=localStorage.getItem('session'); if(!s){ window.location.href='/'; return; }
    const sess=JSON.parse(s); if(sess.role!=='admin'){ window.location.href='/'; return; }
    setSession(sess); refresh(sess);
  },[]);
  async function refresh(sess:any){ const {data}=await axios.get('/api/orders',{ params:{ token:sess.token } }); setRows(data); }
  async function update(id:string, statut:string){ await axios.post('/api/status',{ token:session.token, id, statut }); await refresh(session); }
  return (
    <div className="bg-hero min-h-screen pb-12">
      <Header who="Admin" role="ADMIN" onLogout={()=>{ localStorage.removeItem('session'); window.location.href='/'; }} />
      <div className="max-w-6xl mx-auto mt-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Commandes (toutes entreprises)</h3>
          {rows.length===0 ? <div className="text-sm text-gray-400">Aucune commande.</div> :
            rows.map(o=>(
              <div key={o.id} className="border-b border-[#2a2f36] py-3">
                <div className="font-semibold">#{o.id} • {o.entreprise}</div>
                <div className="text-sm text-gray-400">{new Date(o.date).toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <select className="input" defaultValue={o.statut} onChange={e=>update(o.id, e.target.value)}>
                    {statuses.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <div className="ml-auto font-bold">${Number(o.total||0).toFixed(2)}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
