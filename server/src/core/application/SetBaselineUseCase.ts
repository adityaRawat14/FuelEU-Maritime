import type { RoutesRepositoryPort } from "../ports/RoutesRepositoryPort";

export class SetBaselineUseCase {
  private routesRepo: RoutesRepositoryPort;

  constructor(routesRepo: RoutesRepositoryPort) {
    this.routesRepo = routesRepo;
  }

  async execute(routeId: string): Promise<void> {
    await this.routesRepo.setBaseline(routeId);
  }
}
