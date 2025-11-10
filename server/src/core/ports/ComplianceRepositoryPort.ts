import type { CBRecord } from "../domain/ComplianceBalance";

export interface ComplianceRepositoryPort {
  saveCB(record: CBRecord): Promise<void>;
  getCB(shipId: string, year: number): Promise<CBRecord | null>;
}
