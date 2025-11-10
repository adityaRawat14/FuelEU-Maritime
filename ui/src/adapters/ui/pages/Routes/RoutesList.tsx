import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useRoutesContext } from "../../../../context/RoutesContext";

const RoutesList: React.FC = () => {
  const { routes, setBaseline } = useRoutesContext();
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });

  const filtered = useMemo(() => {
    return routes.filter(
      (r) =>
        (!filters.vesselType || r.vesselType === filters.vesselType) &&
        (!filters.fuelType || r.fuelType === filters.fuelType) &&
        (!filters.year || r.year.toString() === filters.year)
    );
  }, [routes, filters]);

  const columns = useMemo<ColumnDef<(typeof routes)[0]>[]>(
    () => [
      { accessorKey: "routeId", header: "Route ID" },
      { accessorKey: "vesselType", header: "Vessel Type" },
      { accessorKey: "fuelType", header: "Fuel Type" },
      { accessorKey: "year", header: "Year" },
      { accessorKey: "ghgIntensity", header: "gCO₂e/MJ" },
      { accessorKey: "fuelConsumption", header: "Fuel (t)" },
      { accessorKey: "distance", header: "Distance (km)" },
      { accessorKey: "totalEmissions", header: "Emissions (t)" },
      {
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() => setBaseline(row.original.routeId)}
            className={`px-3 py-1 rounded text-white ${
              row.original.isBaseline ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {row.original.isBaseline ? "Baseline ✓" : "Set Baseline"}
          </button>
        )
      }
    ],
    [setBaseline]
  );

  const table = useReactTable({ data: filtered, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border rounded p-2" value={filters.vesselType} onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}>
          <option value="">All Vessel Types</option>
          {[...new Set(routes.map((r) => r.vesselType))].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>

        <select className="border rounded p-2" value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}>
          <option value="">All Fuel Types</option>
          {[...new Set(routes.map((r) => r.fuelType))].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>

        <select className="border rounded p-2" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">All Years</option>
          {[...new Set(routes.map((r) => r.year))].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-2 border-b">{flexRender(h.column.columnDef.header, h.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={`hover:bg-gray-50 ${row.original.isBaseline ? "bg-green-50" : ""}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-500 mt-4">No routes found</p>}
      </div>
    </div>
  );
};

export default RoutesList;
