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
  fetchBanking: () => Promise<any[]>;
  fetchPooling: () => Promise<any[]>;

  fetchComplianceCB: (year: number) => Promise<any[]>;
  fetchAdjustedCB: (year: number) => Promise<any[]>;
  bankSurplus: (shipId: string, year: number, amount: number) => Promise<any>;
  applyBank: (shipId: string, year: number, amount: number) => Promise<any>;
  createPool: (year: number, members: { shipId: string; cb_before: number }[]) => Promise<any>;
};

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const refresh = async () => {
    const r = await api.getRoutes();
    setRoutes(r);
  };

  const fetchBanking = async () => {
    try {
      return await api.getBanking();
    } catch {
      return [];
    }
  };

  const fetchPooling = async () => {
    try {
      return await api.getPooling();
    } catch {
      return [];
    }
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

  const fetchComplianceCB = async (year: number) => {
    try {
      return await api.getComplianceCB(year);
    } catch {
      return [];
    }
  };

  const fetchAdjustedCB = async (year: number) => {
    try {
      return await api.getAdjustedCB(year);
    } catch {
      return [];
    }
  };

  const bankSurplus = async (shipId: string, year: number, amount: number) => {
    return api.bankSurplus(shipId, year, amount);
  };

  const applyBank = async (shipId: string, year: number, amount: number) => {
    return api.applyBank(shipId, year, amount);
  };

  const createPool = async (year: number, members: { shipId: string; cb_before: number }[]) => {
    return api.createPool(year, members);
  };
  // -----------------------------------------------------------------------

  return (
    <RoutesContext.Provider
      value={{
        routes,
        refresh,
        setBaseline,
        fetchComparison,
        fetchBanking,
        fetchPooling,
        fetchComplianceCB,
        fetchAdjustedCB,
        bankSurplus,
        applyBank,
        createPool,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutesContext = () => {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error("useRoutesContext must be used within RoutesProvider");
  return ctx;
};
