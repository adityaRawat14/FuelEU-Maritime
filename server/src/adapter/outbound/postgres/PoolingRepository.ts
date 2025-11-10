import prisma from "./PrismaClient";
import type { PoolingRepositoryPort } from "../../../core/ports/PoolingRepositoryPort";

export class PoolingRepository implements PoolingRepositoryPort {
  async createPool(year: number, members: { shipId: string; cb_before: number; cb_after: number }[]) {
    const pool = await prisma.pool.create({ data: { year } });
    for (const m of members) {
      await prisma.poolMember.create({
        data: {
          poolId: pool.id,
          shipId: m.shipId,
          cb_before: m.cb_before,
          cb_after: m.cb_after,
        },
      });
    }
  }
}
