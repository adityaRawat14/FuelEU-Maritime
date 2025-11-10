import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRoutesContext } from "../../../../context/RoutesContext";

const TARGET = 89.3368;

const RoutesComparison: React.FC = () => {
  const { fetchComparison } = useRoutesContext();
  const [data, setData] = useState<{ baseline: string | null; rows: any[] }>({ baseline: null, rows: [] });

  useEffect(() => {
    fetchComparison().then((d) => setData(d));
  }, [fetchComparison]);

  const chartData = useMemo(() => data.rows.map((r: any) => ({ routeId: r.routeId, baseline: r.baselineIntensity, comparison: r.comparisonIntensity })), [data]);

  if (!data.baseline) {
    return <p className="text-gray-600">Please set a baseline on the Routes list first.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Baseline: {data.baseline}</h3>

      <table className="min-w-full text-left border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Route</th>
            <th className="px-4 py-2 border-b">Baseline (gCO₂e/MJ)</th>
            <th className="px-4 py-2 border-b">Comparison (gCO₂e/MJ)</th>
            <th className="px-4 py-2 border-b">% Diff</th>
            <th className="px-4 py-2 border-b">Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r: any) => (
            <tr key={r.routeId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{r.routeId}</td>
              <td className="px-4 py-2 border-b">{r.baselineIntensity}</td>
              <td className="px-4 py-2 border-b">{r.comparisonIntensity}</td>
              <td className={`px-4 py-2 border-b ${r.percentDiff < 0 ? "text-green-600" : "text-red-500"}`}>{r.percentDiff.toFixed ? r.percentDiff.toFixed(2) : r.percentDiff}%</td>
              <td className="px-4 py-2 border-b">{r.compliant ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mb-2 font-semibold">GHG Intensity chart</h4>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="routeId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" name="Baseline" />
            <Bar dataKey="comparison" name="Comparison" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoutesComparison;
