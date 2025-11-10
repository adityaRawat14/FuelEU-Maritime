import type { RouteEntity } from "../domain/Route";

export type ComparisonRow = {
  routeId: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export class ComputeComparisonUseCase {
  computeComparison(baseline: RouteEntity, others: RouteEntity[], target?: number): ComparisonRow[] {
    const rows = others.map((r) => {
      const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = typeof target === "number" ? r.ghgIntensity <= target : false;
      return {
        routeId: r.routeId,
        baselineIntensity: baseline.ghgIntensity,
        comparisonIntensity: r.ghgIntensity,
        percentDiff,
        compliant,
      };
    });
    return rows;
  }
}
