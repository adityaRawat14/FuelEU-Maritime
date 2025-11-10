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
}
