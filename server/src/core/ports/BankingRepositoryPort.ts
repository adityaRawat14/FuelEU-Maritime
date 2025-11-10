export interface BankingRepositoryPort {
  getBanked(shipId: string, year: number): Promise<number>;
  addBankEntry(shipId: string, year: number, amount: number): Promise<void>;
  applyBank(shipId: string, year: number, amount: number): Promise<void>;
}
