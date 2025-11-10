import type { RoutesRepositoryPort } from "../ports/RoutesRepositoryPort";

export class SetBaselineUseCase {
      private repo: RoutesRepositoryPort;

  constructor(repo: RoutesRepositoryPort) {
    this.repo = repo;
  }

  async execute(routeId: string) {
    await this.repo.setBaseline(routeId);
  }
}
