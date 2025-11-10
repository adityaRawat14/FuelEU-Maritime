import express from "express";
import { BankingRepository } from "../../outbound/postgres/BankingRepository";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";
import { TARGET_INTENSITY } from "../../../shared/contstants";

const router = express.Router();
const bankingRepo = new BankingRepository();
const routesRepo = new RoutesRepository();

router.get("/records", async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
  const banked = await bankingRepo.getBanked(String(shipId), Number(year));
  res.json({ shipId: String(shipId), year: Number(year), banked });
});

router.post("/bank", async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount === undefined) return res.status(400).json({ error: "shipId, year, amount required" });

  const yearNum = Number(year);
  const amt = Number(amount);
  if (amt <= 0) return res.status(400).json({ error: "amount must be > 0" });

  const route = await routesRepo.getRouteByRouteId(String(shipId));
  if (!route) return res.status(404).json({ error: "route not found" });
  const cb_before = (route.fuelConsumption * 41000) * ((TARGET_INTENSITY - route.ghgIntensity)); // same formula

  if (amt > cb_before) return res.status(400).json({ error: "amount exceeds available positive CB" });

  await bankingRepo.addBankEntry(String(shipId), yearNum, amt);
  res.status(201).json({ ok: true, cb_before, applied: amt, cb_after: cb_before - amt });
});

router.post("/apply", async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount === undefined) return res.status(400).json({ error: "shipId, year, amount required" });

  const yearNum = Number(year);
  const amt = Number(amount);
  if (amt <= 0) return res.status(400).json({ error: "amount must be > 0" });

  const available = await bankingRepo.getBanked(String(shipId), Number(year));
  if (amt > available) return res.status(400).json({ error: "amount exceeds available banked" });

  // apply: create negative entry
  await bankingRepo.applyBank(String(shipId), yearNum, amt);
  res.json({ ok: true, applied: amt });
});

export default router;
