import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

import { NavLink } from "react-router-dom";
import { useDataproviderContext } from "../../context/DataContext";

const RoutesPage: React.FC = () => {
  const { routes, setBaseline } = useDataproviderContext();
  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });

  const filteredData = useMemo(() => {
    return routes.filter(
      (r) =>
        (filters.vesselType ? r.vesselType === filters.vesselType : true) &&
        (filters.fuelType ? r.fuelType === filters.fuelType : true) &&
        (filters.year ? r.year.toString() === filters.year : true)
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
              row.original.isBaseline
                ? "bg-green-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {row.original.isBaseline ? "Baseline ✓" : "Set Baseline"}
          </button>
        ),
      },
    ],
    [setBaseline]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Routes Overview
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={filters.vesselType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, vesselType: e.target.value }))
          }
        >
          <option value="">All Vessel Types</option>
          {[...new Set(routes.map((d) => d.vesselType))].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={filters.fuelType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fuelType: e.target.value }))
          }
        >
          <option value="">All Fuel Types</option>
          {[...new Set(routes.map((d) => d.fuelType))].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={filters.year}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, year: e.target.value }))
          }
        >
          <option value="">All Years</option>
          {[...new Set(routes.map((d) => d.year))].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
         <NavLink to="/routes/compare" className={({ isActive }) =>
              `hover:text-blue-600  ${isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}`
            }>
              Compare
            </NavLink>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 border-b">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${
                  row.original.isBaseline ? "bg-green-50" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No routes found</p>
        )}
      </div>
    </div>
  );
};

export default RoutesPage;
