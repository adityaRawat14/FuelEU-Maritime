import express from "express";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";
import { BankingRepository } from "../../outbound/postgres/BankingRepository";
import { PoolingRepository } from "../../outbound/postgres/PoolingRepository";
import { ComputeCBUseCase } from "../../../core/application/ComputeCBUseCase";
import { ComplianceRepository } from "../../outbound/postgres/ComplianceRepository";

const router = express.Router();
const routesRepo = new RoutesRepository();
const bankingRepo = new BankingRepository();
const poolingRepo = new PoolingRepository();
const complianceRepo = new ComplianceRepository();
const computeCB = new ComputeCBUseCase(complianceRepo);


router.post("/", async (req, res) => {
  const { year, members } = req.body;
  if (!year || !Array.isArray(members)) return res.status(400).json({ error: "year and members required" });

  // enrich members with cb_before if needed
  const enriched = [];
  for (const m of members) {
    const shipId = String(m.shipId);
    let cb_before = typeof m.cb_before === "number" ? m.cb_before : null;
    if (cb_before === null) {
      // find route
      const route = await routesRepo.getRouteByRouteId(shipId);
      if (!route) return res.status(404).json({ error: `route ${shipId} not found` });
      cb_before = computeCB.computeCBForRoute(route);
    }
    enriched.push({ shipId, cb_before: Number(cb_before) });
  }

  const sum = enriched.reduce((s, x) => s + x.cb_before, 0);
  if (sum < 0) return res.status(400).json({ error: "Sum(adjustedCB) must be >= 0" });

  const surpluses = enriched.filter((m: any) => m.cb_before > 0).map((m) => ({ ...m }));
  const deficits = enriched.filter((m: any) => m.cb_before < 0).map((m) => ({ ...m }));

  surpluses.sort((a, b) => b.cb_before - a.cb_before);
  deficits.sort((a, b) => a.cb_before - b.cb_before); // more negative first

  // allocate
  for (const d of deficits) {
    let needed = -d.cb_before;
    for (const s of surpluses) {
      if (needed <= 0) break;
      if (s.cb_before <= 0) continue;
      const take = Math.min(s.cb_before, needed);
      s.cb_before -= take;
      d.cb_before += take; 
      needed -= take;
    }
    
  }
  const membersAfter = [...surpluses, ...deficits, ...enriched.filter(m => m.cb_before === 0)]
    .map((m) => ({ shipId: m.shipId, cb_before: m.cb_before /* original pre-allocation is lost, so compute original? */ }));

  const result = enriched.map((orig) => {
    const after = (() => {
      const foundSur = surpluses.find((s) => s.shipId === orig.shipId);
      const foundDef = deficits.find((d) => d.shipId === orig.shipId);
      if (foundSur) return foundSur.cb_before;
      if (foundDef) return foundDef.cb_before;
      // if unchanged
      return orig.cb_before;
    })();
    return { shipId: orig.shipId, cb_before: orig.cb_before, cb_after: Number(after) };
  });


  // persist pool
  await poolingRepo.createPool(Number(year), result.map(r => ({ shipId: r.shipId, cb_before: r.cb_before, cb_after: r.cb_after })));

  res.json({ ok: true, members: result, sum: result.reduce((s, m) => s + m.cb_after, 0) });
});

export default router;
