import type { Route } from "../../core/domain/Route";
import type { RoutesRepositoryPort } from "../../core/ports/RoutesRepositoryPort";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export class RoutesApiAdapter implements RoutesRepositoryPort {
  async getRoutes(): Promise<Route[]> {
    const res = await axios.get<Route[]>(`${BASE}/routes`);
    return res.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await axios.post(`${BASE}/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<{ baseline: string; rows: any[] }> {
    const res = await axios.get(`${BASE}/routes/comparison`);
    return res.data;
  }

  async getBanking(): Promise<any[]> {
    const res = await axios.get(`${BASE}/banking`);
    return res.data;
  }

  async getPooling(): Promise<any[]> {
    const res = await axios.get(`${BASE}/pooling`);
    return res.data;
  }
  
  async getComplianceCB(year: number) {
    const res = await axios.get(`${BASE}/compliance/cb`, { params: { year }});
    return res.data; // array of { shipId, vesselType, year, cb_before }
  }

  async getAdjustedCB(year: number) {
    const res = await axios.get(`${BASE}/compliance/adjusted-cb`, { params: { year }});
    return res.data; // array of { shipId, cb_before, banked, cb_after }
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    const res = await axios.post(`${BASE}/banking/bank`, { shipId, year, amount });
    return res.data;
  }

  async applyBank(shipId: string, year: number, amount: number) {
    const res = await axios.post(`${BASE}/banking/apply`, { shipId, year, amount });
    return res.data;
  }

  async createPool(year: number, members: { shipId: string; cb_before: number }[]) {
    const res = await axios.post(`${BASE}/pools`, { year, members });
    return res.data;
  }
}
