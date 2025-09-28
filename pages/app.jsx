
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
type Item = { libelle:string, categorie:string, image:string, ancien?:number, prix:number };
export default function AppPage(){
  const [session,setSession]=useState<any>(null);
  const [catalog,setCatalog]=useState<{categories:string[], items:Item[], currency:string}>({categories:[],items:[],currency:'$'});
  const [cat,setCat]=useState('');
  const [cart,setCart]=useState<Record<string, number>>({});
  const [promo,setPromo]=useState<any>(null);
  const [promoCode,setPromoCode]=useState('');
  const [contact,setContact]=useState('');
  useEffect(()=>{
    const s=localStorage.getItem('session'); if(!s){ window.location.href='/'; return; }
    const sess=JSON.parse(s); if(sess.role!=='company'){ window.location.href='/'; return; }
    setSession(sess); axios.get('/api/catalog',{ params:{ token:sess.token } }).then(({data})=>setCatalog(data));
  },[]);
  function add(lib:string, delta:number){
    setCart(prev=>{ const q=Math.max(0,(prev[lib]||0)+delta); const n={...prev}; if(q===0) delete n[lib]; else n[lib]=q; return n; });
  }
  function totals(){
    let sub=0; catalog.items.forEach(it=>{ const q=cart[it.libelle]||0; if(q>0) sub+=q*it.prix; });
    let disc=0; if(promo){ if(promo.type==='pourcentage') disc=sub*(promo.value||0)/100; else disc=promo.value||0; if(disc>sub) disc=sub; }
    const total=Math.round((sub-disc)*100)/100; return { sub:Math.round(sub*100)/100, disc:Math.round(disc*100)/100, total };
  }
  async function applyPromo(){ if(!promoCode){ setPromo(null); return; } const {data}=await axios.post('/api/promo',{ token:session.token, code:promoCode }); setPromo(data.ok?data.promo:null); }
  async function placeOrder(){
    const items=Object.entries(cart).map(([lib,q])=>{ const it=catalog.items.find(i=>i.libelle===lib)!; const m=(q*it.prix); return { libelle:lib, qte:q, prix:it.prix, montant:`$${m.toFixed(2)}` }; });
    const t=totals(); const payload={ items, subtotal:t.sub, discount:t.disc, total:t.total, contact };
    const { data } = await axios.post('/api/order',{ token:session.token, payload });
    alert(data.ok?`Commande envoyée: ${data.id}`:'Erreur'); if(data.ok){ setCart({}); setPromo(null); setPromoCode(''); window.location.href='/track'; }
  }
  function fmt(n:number){ return `$${n.toFixed(2)}`; }
  const who = session?.company ? `Entreprise • ${session.company}` : '';
  return (
    <div className="bg-hero min-h-screen pb-12">
      <Header who={who} role="COMPANY" onLogout={()=>{ localStorage.removeItem('session'); window.location.href='/'; }} />
      <div className="max-w-6xl mx-auto mt-4 grid grid-cols-[240px_1fr_360px] gap-3">
        <div className="card p-3 max-h-[70svh] overflow-auto">
          <div className="text-sm text-gray-400 mb-2">Catégories</div>
          <button onClick={()=>setCat('')} className={`btn-ghost w-full mb-2 ${cat===''?'border-[#3a4352] bg-[#111720]':''}`}>Tous</button>
          {catalog.categories.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`btn-ghost w-full mb-2 ${cat===c?'border-[#3a4352] bg-[#111720]':''}`}>{c}</button>
          ))}
        </div>
        <div className="card p-3 max-h-[70svh] overflow-auto grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {catalog.items.filter(i=>!cat||i.categorie===cat).map(it=>{
            const q=cart[it.libelle]||0;
            return (
              <div key={it.libelle} className="border border-[#2a2f36] rounded-xl overflow-hidden">
                <div className="h-[200px] bg-[#0b0f14]">
                  <img src={it.image || 'https://i.goopics.net/vd2259.png'} className="w-full h-full object-cover"/>
                </div>
                <div className="p-3">
                  <div className="font-semibold">{it.libelle}</div>
                  <div className="text-gold font-bold">{fmt(it.prix)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="btn-ghost" onClick={()=>add(it.libelle,-1)}>-</button>
                    <input className="input" type="number" value={q} onChange={e=>add(it.libelle, Number(e.target.value)-q)} />
                    <button className="btn-ghost" onClick={()=>add(it.libelle,1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card p-3 flex flex-col max-h-[70svh]">
          <label className="text-sm text-gray-400">Contact (téléphone)</label>
          <input className="input mb-2" value={contact} onChange={e=>setContact(e.target.value)} />
          <label className="text-sm text-gray-400">Code promo</label>
          <div className="flex gap-2 mb-1">
            <input className="input" value={promoCode} onChange={e=>setPromoCode(e.target.value)} />
            <button className="btn-ghost" onClick={applyPromo}>Appliquer</button>
          </div>
          <div className="text-sm text-gray-400 mb-2">{promo?'✅ Code appliqué':''}</div>
          <div className="flex-1 overflow-auto">
            {Object.entries(cart).map(([lib,q])=>{
              const it=catalog.items.find(i=>i.libelle===lib)!;
              return <div key={lib} className="flex justify-between py-2 border-b border-dashed border-[#273142]">
                <div>{lib} × {q}</div><div>{fmt(q*it.prix)}</div>
              </div>;
            })}
          </div>
          <div className="border-t border-[#2a2f36] pt-2">
            {(()=>{ const t=totals(); return (<div>
              <div className="text-sm text-gray-400">Sous-total : ${t.sub.toFixed(2)}</div>
              {t.disc>0 && <div className="text-sm text-gray-400">Remise : -${t.disc.toFixed(2)}</div>}
              <div className="font-bold mt-1">Total : ${t.total.toFixed(2)}</div>
              <button className="btn-primary w-full mt-2" onClick={placeOrder}>Valider la commande</button>
            </div>); })()}
          </div>
        </div>
      </div>
    </div>
  );
}
