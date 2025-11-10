import prisma from "./PrismaClient";
import type { ComplianceRepositoryPort } from "../../../core/ports/ComplianceRepositoryPort";
import type { CBRecord } from "../../../core/domain/ComplianceBalance";

export class ComplianceRepository implements ComplianceRepositoryPort {
  async saveCB(record: CBRecord): Promise<void> {
    await prisma.shipCompliance.create({
      data: {
        shipId: record.shipId,
        year: record.year,
        cb_gco2eq: record.cb_gco2eq,
      },
    });
  }

  async getCB(shipId: string, year: number) {
    const r = await prisma.shipCompliance.findFirst({
      where: { shipId, year },
      orderBy: { createdAt: "desc" },
    });
    if (!r) return null;
    return { shipId: r.shipId, year: r.year, cb_gco2eq: r.cb_gco2eq };
  }
}
