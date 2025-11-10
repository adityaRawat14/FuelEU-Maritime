import type { PoolingRepositoryPort } from "../ports/PoolingRepositoryPort";

export class PoolingUseCase {
  private poolingRepo: PoolingRepositoryPort;

  constructor(poolingRepo: PoolingRepositoryPort) {
    this.poolingRepo = poolingRepo;
  }

  async createPool(year: number, members: { shipId: string; cb_before: number }[]) {
    const membersAfter = members.map((m) => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: m.cb_before }));
    await this.poolingRepo.createPool(year, membersAfter);
  }
}
