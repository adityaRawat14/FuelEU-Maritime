import React from "react";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = () => (
  <nav className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold text-blue-700">FuelEU Compliance Dashboard</h1>
    <div className="flex gap-6">
      <NavLink to="/" end className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Home</NavLink>
      <NavLink to="/routes" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Routes</NavLink>
      <NavLink to="/banking" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Banking</NavLink>
      <NavLink to="/pooling" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Pooling</NavLink>
    </div>
  </nav>
);

export default NavBar;
