import prisma from "./PrismaClient";
import type { BankingRepositoryPort } from "../../../core/ports/BankingRepositoryPort";

export class BankingRepository implements BankingRepositoryPort {
  async getBanked(shipId: string, year: number): Promise<number> {
    const rows = await prisma.bankEntry.findMany({ where: { shipId, year } });
    //@ts-ignore
    const sum = rows.reduce((s, r) => s + r.amount_gco2eq, 0);
    return sum;
  }

  async addBankEntry(shipId: string, year: number, amount: number): Promise<void> {
    await prisma.bankEntry.create({
      data: { shipId, year, amount_gco2eq: amount },
    });
  }

  async applyBank(shipId: string, year: number, amount: number): Promise<void> {
    await prisma.bankEntry.create({
      data: { shipId, year, amount_gco2eq: -Math.abs(amount) },
    });
  }
}
