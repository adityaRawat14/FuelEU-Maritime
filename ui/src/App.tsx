import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./adapters/ui/pages/Home";
import RoutesLayout from "./adapters/ui/pages/Routes/RoutesLayout";
import RoutesList from "./adapters/ui/pages/Routes/RoutesList";
import RoutesComparison from "./adapters/ui/pages/Routes/RoutesComparision";
import NavBar from "./components/NavBar";
// TODO: Banking & Pooling pages (skeleton)
const Banking = () => <div className="bg-white p-4 rounded">Banking (TODO)</div>;
const Pooling = () => <div className="bg-white p-4 rounded">Pooling (TODO)</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routes" element={<RoutesLayout />}>
              <Route index element={<RoutesList />} />
              <Route path="comparison" element={<RoutesComparison />} />
            </Route>
            <Route path="/banking" element={<Banking />} />
            <Route path="/pooling" element={<Pooling />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
