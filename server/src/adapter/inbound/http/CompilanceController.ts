import express from "express";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";
import { ComplianceRepository } from "../../outbound/postgres/ComplianceRepository";
import { BankingRepository } from "../../outbound/postgres/BankingRepository";
import { PoolingRepository } from "../../outbound/postgres/PoolingRepository";
import { ComputeCBUseCase } from "../../../core/application/ComputeCBUseCase";

const router = express.Router();

const routesRepo = new RoutesRepository();
const complianceRepo = new ComplianceRepository();
const bankingRepo = new BankingRepository();
const poolingRepo = new PoolingRepository();

const computeCBUseCase = new ComputeCBUseCase(complianceRepo);

/**
 * GET /compliance/cb?year=YYYY
 * Return CB snapshot per ship for the year (compute on the fly if not present)
 */
router.get("/cb", async (req, res) => {
  const year = Number(req.query.year);
  if (!year) return res.status(400).json({ error: "year query required" });

  // Get routes for that year
  const routes = (await routesRepo.getAllRoutes()).filter((r) => r.year === year);
  // For each route compute CB (or read stored CB if present)
  const result = [];
  for (const r of routes) {
    // attempt to get stored CB
    const stored = await complianceRepo.getCB(r.routeId, year);
    let cbValue = stored?.cb_gco2eq;
    if (cbValue === null || cbValue === undefined) {
      cbValue = computeCBUseCase.computeCBForRoute(r);
      // optionally store snapshot but keep safe: don't double store
      await complianceRepo.saveCB({ shipId: r.routeId, year, cb_gco2eq: cbValue });
    }
    result.push({
      shipId: r.routeId,
      vesselType: r.vesselType,
      year,
      cb_before: cbValue,
    });
  }

  res.json(result);
});

/**
 * GET /compliance/adjusted-cb?year=YYYY
 * Returns cb_before, banked_available, cb_after (initially cb_before)
 */
router.get("/adjusted-cb", async (req, res) => {
  const year = Number(req.query.year);
  if (!year) return res.status(400).json({ error: "year query required" });

  const routes = (await routesRepo.getAllRoutes()).filter((r) => r.year === year);
  const out = [];
  for (const r of routes) {
    const cb_before = computeCBUseCase.computeCBForRoute(r);
    const banked = await bankingRepo.getBanked(r.routeId, year); 
    const cb_after = cb_before + (banked ?? 0);
    out.push({
      shipId: r.routeId,
      vesselType: r.vesselType,
      cb_before,
      banked,
      cb_after,
    });
  }

  res.json(out);
});

export default router;
