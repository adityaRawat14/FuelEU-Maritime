import express from "express";

import { BankingRepository } from "../../outbound/postgres/BankingRepository";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";
import { ComplianceRepository } from "../../outbound/postgres/ComplianceRepository";
import { PoolingRepository } from "../../outbound/postgres/PoolingRepository";

import { BankingUseCase } from "../../../core/application/BankingUseCase";
import { ComputeCBUseCase } from "../../../core/application/ComputeCBUseCase";
import { SetBaselineUseCase } from "../../../core/application/SetBaselineUseCase";
import { ComputeComparisonUseCase } from "../../../core/application/ComputeComparisonUseCase";

import { TARGET_INTENSITY } from "../../../shared/constants";

const router = express.Router();

const bankingRepo = new BankingRepository();
const routesRepo = new RoutesRepository();
const complianceRepo = new ComplianceRepository();
const poolingRepo = new PoolingRepository();

const bankingUseCase = new BankingUseCase(bankingRepo);
const computeCBUseCase = new ComputeCBUseCase(complianceRepo);
const setBaselineUseCase = new SetBaselineUseCase(routesRepo);

const computeComparisonUseCase = new ComputeComparisonUseCase();


router.get("/", async (req, res) => {
  const rows = await routesRepo.getAllRoutes();
  res.json(rows);
});


// POST /routes/:routeId/baseline
router.post("/:routeId/baseline", async (req, res) => {
  const { routeId } = req.params;
  try {
    await setBaselineUseCase.execute(routeId);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// GET /routes/comparison
router.get("/comparison", async (req, res) => {
  const routes = await routesRepo.getAllRoutes();
  const baseline = routes.find((r) => r.isBaseline);
  if (!baseline) return res.status(400).json({ error: "No baseline set" });

  const others = routes.filter((r) => r.routeId !== baseline.routeId);
  const rows = computeComparisonUseCase.computeComparison(baseline, others, TARGET_INTENSITY);
  res.json({ baseline: baseline.routeId, rows });
});

/**
 * /compliance endpoints
 */
// GET /compliance/cb?shipId=&year=

router.get("/compliance/cb", async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const r = await complianceRepo.getCB(String(shipId), Number(year));
  res.json(r);
});

// POST /compliance/compute?routeId= (compute & store CB for route)
router.post("/compliance/compute", async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ error: "routeId required" });
  const route = await routesRepo.getRouteByRouteId(String(routeId));
  if (!route) return res.status(404).json({ error: "route not found" });
  const rec = await computeCBUseCase.storeCBForRoute(route);
  res.json(rec);
});

/**
 * Banking endpoints
 */
// GET /banking/records?shipId=&year=
router.get("/banking/records", async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
  const amount = await bankingRepo.getBanked(String(shipId), Number(year));
  res.json({ shipId, year: Number(year), banked: amount });
});

// POST /banking/bank => { shipId, year, amount }
router.post("/banking/bank", async (req, res) => {
  const { shipId, year, amount } = req.body;
  try {
    await bankingUseCase.bankSurplus(String(shipId), Number(year), Number(amount));
    res.status(201).json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /banking/apply => { shipId, year, amount }
router.post("/banking/apply", async (req, res) => {
  const { shipId, year, amount } = req.body;
  try {
    await bankingUseCase.applyBanked(String(shipId), Number(year), Number(amount));
    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Pooling - simple greedy allocation handled here for demo:
 * POST /pools { year, members: [{ shipId, cb_before }] }
 */
router.post("/pools", async (req, res) => {
  const { year, members } = req.body;
  if (!year || !Array.isArray(members)) return res.status(400).json({ error: "year and members required" });

  // greedy allocation: sort by cb descending (surplus to deficits)
  const sorted = [...members].sort((a, b) => b.cb_before - a.cb_before);

  // compute sum
  const sum = members.reduce((s: number, m: any) => s + Number(m.cb_before), 0);
  if (sum < 0) return res.status(400).json({ error: "Sum of CB must be >= 0" });

  // naive greedy: distribute surplus to deficits
  const deficits = sorted.filter((m) => m.cb_before < 0).map((m) => ({ ...m }));
  const surplus = sorted.filter((m) => m.cb_before > 0).map((m) => ({ ...m }));

  // convert to mutable
  for (const d of deficits) {
    let needed = -d.cb_before;
    for (const s of surplus) {
      if (needed <= 0) break;
      const take = Math.min(s.cb_before, needed);
      s.cb_before -= take;
      needed -= take;
      d.cb_before += take;
    }
  }

  // Now cb_after is the new cb_before values
  const membersAfter = sorted.map((m) => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: m.cb_before }));

  await poolingRepo.createPool(Number(year), membersAfter);
  res.json({ ok: true, members: membersAfter });
});

export default router;
