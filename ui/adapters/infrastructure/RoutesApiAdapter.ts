import type { RoutesRepositoryPort } from "../../core/ports/RoutesRepositoryPort";
import type { Route } from "../../core/domain/Route";

export class RoutesApiAdapter implements RoutesRepositoryPort {
  private baseUrl = "http://localhost:4000";

  async getRoutes(): Promise<Route[]> {
    const res = await fetch(`${this.baseUrl}/routes`);
    return res.json();
  }

  async setBaseline(routeId: string): Promise<void> {
    await fetch(`${this.baseUrl}/routes/${routeId}/baseline`, {
      method: "POST",
    });
  }
}
