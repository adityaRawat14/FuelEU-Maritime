import type { BankingRepositoryPort } from "../ports/BankingRepositoryPort";

export class BankingUseCase {
  private bankingRepo: BankingRepositoryPort;

  constructor(bankingRepo: BankingRepositoryPort) {
    this.bankingRepo = bankingRepo;
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    // amount must be positive
    if (amount <= 0) throw new Error("Amount must be positive");
    await this.bankingRepo.addBankEntry(shipId, year, amount);
  }

  async applyBanked(shipId: string, year: number, amount: number) {
    const available = await this.bankingRepo.getBanked(shipId, year);
    if (amount > available) throw new Error("Amount exceeds available banked");
    await this.bankingRepo.applyBank(shipId, year, amount);
  }
}
