import type { Route } from "../domain/Route";

export interface RoutesRepositoryPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<{ baseline: string; rows: any[] }>;
}
