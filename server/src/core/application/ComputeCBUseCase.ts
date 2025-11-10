import type { RouteEntity } from "../domain/Route";
import type { CBRecord } from "../domain/ComplianceBalance";
import type { ComplianceRepositoryPort } from "../ports/ComplianceRepositoryPort";
import { TARGET_INTENSITY } from "../../shared/contstants";

export class ComputeCBUseCase {
  private complianceRepo: ComplianceRepositoryPort;

  constructor(complianceRepo: ComplianceRepositoryPort) {
    this.complianceRepo = complianceRepo;
  }

  // energy = fuelConsumption (t) * 41000 MJ/t
  computeCBForRoute(route: RouteEntity): number {
    const energyMJ = route.fuelConsumption * 41000;
    const cb = (TARGET_INTENSITY - route.ghgIntensity) * energyMJ;
    return cb;
  }

  async storeCBForRoute(route: RouteEntity): Promise<CBRecord> {
    const shipId = route.routeId; // treat routeId as shipId for simplicity
    const cbValue = this.computeCBForRoute(route);
    const rec: CBRecord = { shipId, year: route.year, cb_gco2eq: cbValue };
    await this.complianceRepo.saveCB(rec);
    return rec;
  }
}
