import React, { createContext, useContext, useState } from "react";
import axios from "axios";

export type RouteData = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

const initialRoutes: RouteData[] = [
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 1200,
    totalEmissions: 600,
  },
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 1400,
    totalEmissions: 550,
  },
  {
    routeId: "R003",
    vesselType: "Tanker",
    fuelType: "MGO",
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 1500,
    totalEmissions: 630,
  },
  {
    routeId: "R004",
    vesselType: "RoRo",
    fuelType: "HFO",
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 1250,
    totalEmissions: 580,
  },
  {
    routeId: "R005",
    vesselType: "Container",
    fuelType: "LNG",
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 1300,
    totalEmissions: 590,
  },
];

type DataproviderContextType = {
  routes: RouteData[];
  setBaseline: (routeId: string) => Promise<void>;
  updateRoutes: React.Dispatch<React.SetStateAction<RouteData[]>>;
};

const DataproviderContext = createContext<DataproviderContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteData[]>(initialRoutes);

  const setBaseline = async (routeId: string) => {
    try {
      // mock backend call
      await axios.post(`/routes/${routeId}/baseline`);
      setRoutes((prev) =>
        prev.map((r) => ({
          ...r,
          isBaseline: r.routeId === routeId,
        }))
      );
    } catch (err) {
      console.error("Failed to set baseline", err);
    }
  };

  return (
    <DataproviderContext.Provider value={{ routes, setBaseline, updateRoutes: setRoutes }}>
      {children}
    </DataproviderContext.Provider>
  );
};

export const useDataproviderContext = () => {
  const ctx = useContext(DataproviderContext);
  if (!ctx) throw new Error("useDataproviderContext must be used within a DataProvider");
  return ctx;
};
