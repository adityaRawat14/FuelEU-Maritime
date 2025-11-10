import React, { useEffect, useState } from "react";
import { useRoutesContext } from "../../../context/RoutesContext";

type CBRow = { shipId: string; vesselType?: string; year: number; cb_before: number };

const BankingPage: React.FC = () => {
  const { fetchComplianceCB, fetchAdjustedCB, bankSurplus, applyBank } = useRoutesContext();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [cbRows, setCbRows] = useState<CBRow[]>([]);
  const [selected, setSelected] = useState<CBRow | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [year]);

  const load = async () => {
    const data = await fetchComplianceCB(year);
    setCbRows(data);
  };

  const handleBank = async () => {
    if (!selected) return;
    if (amount <= 0) return setMessage("Amount must be > 0");
    if (amount > selected.cb_before) return setMessage("Cannot bank more than cb_before");
    try {
      await bankSurplus(selected.shipId, selected.year, amount);
      setMessage("Banked successfully");
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.error || err.message);
    }
  };

  const handleApply = async () => {
    if (!selected) return;
    if (amount <= 0) return setMessage("Amount must be > 0");
    try {
      await applyBank(selected.shipId, selected.year, amount);
      setMessage("Applied bank successfully");
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Banking (Article 20)</h2>

      <div className="flex gap-3 items-center mb-4">
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border p-2 rounded">
          {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <table className="min-w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Route</th>
            <th className="px-4 py-2">Vessel</th>
            <th className="px-4 py-2">CB Before</th>
            <th className="px-4 py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {cbRows.map(r => (
            <tr key={r.shipId} className="hover:bg-gray-50">
              <td className="px-4 py-2">{r.shipId}</td>
              <td className="px-4 py-2">{r.vesselType || '-'}</td>
              <td className="px-4 py-2">{Number(r.cb_before).toFixed(2)}</td>
              <td className="px-4 py-2">
                <input type="radio" name="selected" checked={selected?.shipId===r.shipId} onChange={() => setSelected(r)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 items-center mb-3">
        <input type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="border p-2 rounded" placeholder="amount" />
        <button onClick={handleBank} className="px-3 py-1 bg-blue-600 text-white rounded">Bank</button>
        <button onClick={handleApply} className="px-3 py-1 bg-green-600 text-white rounded">Apply</button>
      </div>

      {message && <div className="text-sm text-red-600">{message}</div>}
    </div>
  );
};

export default BankingPage;
