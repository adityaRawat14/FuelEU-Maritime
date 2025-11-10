import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const RoutesLayout: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Routes</h2>
        <div className="flex gap-2">
          <NavLink to="/routes" end className={({ isActive }) => isActive ? "px-3 py-1 bg-blue-600 text-white rounded" : "px-3 py-1 bg-gray-200 rounded"}>
            List
          </NavLink>
          <NavLink to="comparison" className={({ isActive }) => isActive ? "px-3 py-1 bg-blue-600 text-white rounded" : "px-3 py-1 bg-gray-200 rounded"}>
            Comparison
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default RoutesLayout;
