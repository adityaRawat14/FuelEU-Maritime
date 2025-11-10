import type { RouteEntity } from "../domain/Route";

export interface RoutesRepositoryPort {
  getAllRoutes(): Promise<RouteEntity[]>;
  setBaseline(routeId: string): Promise<void>;
  getRouteByRouteId(routeId: string): Promise<RouteEntity | null>;
}
