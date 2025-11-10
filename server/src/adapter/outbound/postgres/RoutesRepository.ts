import prisma from "./PrismaClient";
import type { RoutesRepositoryPort } from "../../../core/ports/RoutesRepositoryPort";
import type { RouteEntity } from "../../../core/domain/Route";

export class RoutesRepository implements RoutesRepositoryPort {
  async getAllRoutes(): Promise<RouteEntity[]> {
    const rows = await prisma.route.findMany();
    return rows.map((r:RouteEntity) => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline,
    }));
  }

  async setBaseline(routeId: string): Promise<void> {
    // unset old baseline
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });
    // set new baseline
    await prisma.route.updateMany({
      where: { routeId },
      data: { isBaseline: true },
    });
  }

  async getRouteByRouteId(routeId: string) {
    const r = await prisma.route.findUnique({ where: { routeId } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline,
    };
  }
}
