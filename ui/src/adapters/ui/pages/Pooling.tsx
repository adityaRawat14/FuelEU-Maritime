import React, { useEffect, useState } from "react";
import { useRoutesContext } from "../../../context/RoutesContext";

type AdjustedRow = { shipId: string; vesselType?: string; cb_before: number; banked?: number; cb_after?: number; selected?: boolean; };

const PoolingPage: React.FC = () => {
  const { fetchAdjustedCB, createPool } = useRoutesContext();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [rows, setRows] = useState<AdjustedRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(()=>{ load(); }, [year]);

  const load = async () => {
    const data = await fetchAdjustedCB(year);
    // data: { shipId, vesselType, cb_before, banked, cb_after }
    setRows(data.map((d:any) => ({ shipId: d.shipId, vesselType: d.vesselType, cb_before: Number(d.cb_before), banked: Number(d.banked || 0), cb_after: Number(d.cb_after || d.cb_before), selected: false })));
  };

  const toggle = (shipId: string) => {
    setRows(rs => rs.map(r => r.shipId===shipId ? {...r, selected: !r.selected} : r));
  };

  const selectedMembers = () => rows.filter(r=>r.selected).map(r=>({ shipId: r.shipId, cb_before: r.cb_before }));

  const poolSum = () => selectedMembers().reduce((s,m)=>s + m.cb_before, 0);

  const validatePool = () => {
    const members = selectedMembers();
    if (members.length === 0) return { ok:false, msg: "No members selected" };
    if (members.reduce((s,m)=>s+m.cb_before,0) < 0) return { ok:false, msg: "Sum(adjustedCB) must be >= 0" };
    return { ok:true };
  };

  const handleCreatePool = async () => {
    setMessage(null);
    const v = validatePool();
    if (!v.ok && v.msg) return setMessage(v.msg);
    try {
      const res = await createPool(year, selectedMembers());
      setMessage("Pool created");
      await load();
    } catch (err:any) {
      setMessage(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">Pooling (Article 21)</h2>

      <div className="flex gap-3 items-center mb-4">
        <label>Year:</label>
        <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="border p-2 rounded">
          {[2023,2024,2025].map(y=> <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <table className="min-w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Route</th>
            <th className="px-4 py-2">Vessel</th>
            <th className="px-4 py-2">CB Before</th>
            <th className="px-4 py-2">Banked</th>
            <th className="px-4 py-2">CB After (adj)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.shipId} className="hover:bg-gray-50">
              <td className="px-4 py-2"><input type="checkbox" checked={!!r.selected} onChange={()=>toggle(r.shipId)} /></td>
              <td className="px-4 py-2">{r.shipId}</td>
              <td className="px-4 py-2">{r.vesselType || '-'}</td>
              <td className="px-4 py-2">{Number(r.cb_before).toFixed(2)}</td>
              <td className="px-4 py-2">{Number(r.banked).toFixed(2)}</td>
              <td className="px-4 py-2">{Number(r.cb_after).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-4 mb-3">
        <div>Pool Sum: <span className={poolSum() >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{poolSum().toFixed(2)}</span></div>
        <button onClick={handleCreatePool} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={poolSum() < 0}>Create Pool</button>
      </div>

      {message && <div className="text-sm text-red-600">{message}</div>}
    </div>
  );
};

export default PoolingPage;
