import express from "express";
import cors from "cors";
import routesController from "./RoutesController";
import prisma from "../../outbound/postgres/PrismaClient";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/routes", routesController);
app.use("/compliance", routesController); 
app.use("/banking", routesController);
app.use("/pools", routesController);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // ensure Prisma connects
  try {
    await prisma.$connect();
    console.log("Prisma connected");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }
});
