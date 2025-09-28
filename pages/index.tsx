
import { useState } from 'react';
import axios from 'axios';
export default function Login(){
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [m,setM]=useState('');
  async function submit(){
    setM('Connexion...');
    try{
      const { data } = await axios.post('/api/login', { username:u, password:p });
      if(!data.ok){ setM('❌ '+(data.reason||'Échec')); return; }
      localStorage.setItem('session', JSON.stringify(data));
      window.location.href = data.role==='admin' ? '/admin' : '/app';
    }catch(e:any){ setM('❌ '+(e?.message||'Erreur')); }
  }
  return (
    <div className="bg-hero min-h-screen flex items-center">
      <div className="max-w-lg mx-auto w-full card p-6">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        <label className="text-sm text-gray-400">Identifiant</label>
        <input className="input mb-3" value={u} onChange={e=>setU(e.target.value)} />
        <label className="text-sm text-gray-400">Mot de passe</label>
        <input className="input mb-4" type="password" value={p} onChange={e=>setP(e.target.value)} />
        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={submit}>Se connecter</button>
          <div className="text-sm text-gray-400">{m}</div>
        </div>
      </div>
    </div>
  );
}
