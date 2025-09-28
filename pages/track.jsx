
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
export default function Track(){
  const [session,setSession]=useState<any>(null);
  const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{
    const s=localStorage.getItem('session'); if(!s){ window.location.href='/'; return; }
    const sess=JSON.parse(s); setSession(sess);
    axios.get('/api/orders',{ params:{ token:sess.token } }).then(({data})=>setRows(data));
  },[]);
  const who = session?.company ? `Entreprise • ${session.company}` : 'Admin';
  return (
    <div className="bg-hero min-h-screen pb-12">
      <Header who={who} role={(session?.role||'').toUpperCase()} onLogout={()=>{ localStorage.removeItem('session'); window.location.href='/'; }} />
      <div className="max-w-6xl mx-auto mt-4">
        {rows.length===0 ? <div className="card p-4">Aucune commande.</div> :
          rows.map(o=>(
            <div key={o.id} className="card p-4 mb-3">
              <div className="font-semibold">#{o.id} • {o.entreprise}</div>
              <div className="text-sm text-gray-400">{new Date(o.date).toLocaleString()}</div>
              <div className="mt-1">Statut : <b>{o.statut}</b></div>
              <div>Total : <b>${Number(o.total||0).toFixed(2)}</b></div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
