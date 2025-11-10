import React, { createContext, useContext, useEffect, useState } from "react";
import type { Route } from "../core/domain/Route";
import { RoutesApiAdapter } from "../adapters/infrastructure/RoutesApiAdapter";
import { SetBaselineUseCase } from "../core/application/SetBaselineUseCase";

const api = new RoutesApiAdapter();
const setBaselineUseCase = new SetBaselineUseCase(api);

type RoutesContextType = {
  routes: Route[];
  refresh: () => Promise<void>;
  setBaseline: (id: string) => Promise<void>;
  fetchComparison: () => Promise<{ baseline: string | null; rows: any[] }>;
};

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const refresh = async () => {
    const r = await api.getRoutes();
    setRoutes(r);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, []);

  const setBaseline = async (id: string) => {
    await setBaselineUseCase.execute(id);
    await refresh();
  };

  const fetchComparison = async () => {
    try {
      const data = await api.getComparison();
      return { baseline: data.baseline ?? null, rows: data.rows ?? [] };
    } catch (err) {
      return { baseline: null, rows: [] };
    }
  };

  return (
    <RoutesContext.Provider value={{ routes, refresh, setBaseline, fetchComparison }}>
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutesContext = () => {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error("useRoutesContext must be used within RoutesProvider");
  return ctx;
};
