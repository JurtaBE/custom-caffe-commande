
import Link from 'next/link';
export default function Header({ who, role, onLogout }:{ who?:string, role?:string, onLogout?:()=>void}){
  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://i.goopics.net/vd2259.png" className="w-8 h-8 rounded-lg" />
          <div className="font-bold tracking-wide">CUSTOM CAFFE</div>
          {who && <span className="ml-2 text-xs bg-[#232a35] border border-[#2a2f36] rounded-full px-2 py-1">{who}</span>}
          {role && <span className="text-xs bg-[#232a35] border border-[#2a2f36] rounded-full px-2 py-1">{role}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Link className="btn-ghost text-sm" href="/app">Commander</Link>
          <Link className="btn-ghost text-sm" href="/track">Suivi</Link>
          <Link className="btn-ghost text-sm" href="/admin">Admin</Link>
          <button className="btn-ghost text-sm" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
}
