import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Banking from "./adapters/ui/Banking";
import Pooling from "./adapters/ui/Pooling";
import Home from "./adapters/ui/Home";
import RoutesPage from "./adapters/ui/RoutesPage";
import Compare from "./adapters/ui/Compare";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">
            FuelEU Compliance Dashboard
          </h1>
          <div className="flex gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:text-blue-600 ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/routes"
              className={({ isActive }) =>
                `hover:text-blue-600 ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
              }
            >
              Routes
            </NavLink>

            <NavLink
              to="/banking"
              className={({ isActive }) =>
                `hover:text-blue-600 ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
              }
            >
              Banking
            </NavLink>

            <NavLink
              to="/pooling"
              className={({ isActive }) =>
                `hover:text-blue-600 ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
              }
            >
              Pooling
            </NavLink>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <DataProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/banking" element={<Banking />} />
              <Route path="/pooling" element={<Pooling />} />
              <Route path="/routes" element={<RoutesPage />}>
                <Route path="/routes/compare" element={<Compare />} />
              </Route>
            </Routes>
          </DataProvider>
        </main>
      </div>
    </Router>
  );
}

export default App;
