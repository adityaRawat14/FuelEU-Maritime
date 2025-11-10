# ⚙️ FuelEU Maritime — Server

This is the backend service for **FuelEU Maritime**, implementing GHG emissions, banking, and pooling logic based on Fuel EU Articles 20–21.

It follows a **Hexagonal (Ports & Adapters)** architecture for clean separation of core logic, domain, and infrastructure.

---

## 🏗️ Folder Structure

server/
├── prisma/ # Prisma migrations & schema
├── src/
│ ├── adapter/
│ │ ├── inbound/http/ # Express controllers
│ │ └── outbound/postgres/ # Repository implementations using Prisma
│ ├── core/
│ │ ├── domain/ # Domain entities (Route, Pool, CB, etc.)
│ │ ├── application/ # Use cases (SetBaseline, ComputeCB, etc.)
│ │ └── ports/ # Interfaces for repositories
│ ├── shared/ # Shared constants and utilities
│ └── infrastructure/
│ └── db/ # Database layer & Prisma client
├── package.json
├── tsconfig.json
├── .env
└── README.md

yaml
Copy code

---

## ⚡ Prerequisites

- Node.js **>= 18**
- PostgreSQL **>= 14**
- npm or yarn

---

## 🧩 Environment Variables

Create a `.env` file in the `server` root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fueleu"
PORT=4000
Example for local dev:

ini
Copy code
DATABASE_URL="postgresql://postgres:1234@localhost:5432/fueleu"
🗄️ Database Setup (Prisma)
1️⃣ Initialize Prisma

bash
Copy code
npx prisma init --schema=src/infrastructure/db/schema.prisma
2️⃣ Define your schema

Example:

prisma
Copy code
// src/infrastructure/db/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Route {
  id              Int      @id @default(autoincrement())
  routeId         String   @unique
  vesselType      String
  fuelType        String
  year            Int
  ghgIntensity    Float
  fuelConsumption Float
  distance        Float
  totalEmissions  Float
}

model BankEntry {
  id           Int     @id @default(autoincrement())
  shipId       String
  year         Int
  amount_gco2eq Float
}

model Pool {
  id    Int    @id @default(autoincrement())
  year  Int
  members PoolMember[]
}

model PoolMember {
  id        Int     @id @default(autoincrement())
  poolId    Int
  shipId    String
  cb_before Float
  cb_after  Float
  Pool      Pool    @relation(fields: [poolId], references: [id])
}
3️⃣ Run migrations

bash
Copy code
npx prisma migrate dev --name init
4️⃣ Generate Prisma Client

bash
Copy code
npx prisma generate
5️⃣ (Optional) Seed data
Create a script at prisma/seed.ts:

ts
Copy code
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.route.createMany({
    data: [
      { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 1200, totalEmissions: 600 },
      { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 1400, totalEmissions: 550 },
    ],
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
Then run:

bash
Copy code
npx ts-node prisma/seed.ts
⚙️ TypeScript Configuration
tsconfig.json:

json
Copy code
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": false
  },
  "include": ["src"]
}
If you use verbatimModuleSyntax: true or "moduleResolution": "Bundler",
ensure all imports use import type for TS-only types.

🚀 Running the Server
1️⃣ Install dependencies
bash
Copy code
npm install
2️⃣ Compile TypeScript
bash
Copy code
npx tsc
3️⃣ Start in development (with live reload)
bash
Copy code
npx ts-node-dev src/adapter/inbound/http/server.ts
or if you have a script:

bash
Copy code
npm run dev
4️⃣ Build & run production
bash
Copy code
npm run build
node dist/adapter/inbound/http/server.js
🌍 Available API Routes
Endpoint	Method	Description
/routes	GET	List all routes
/routes/:id/baseline	POST	Set baseline route
/compliance/cb?year=YYYY	GET	Compute compliance balance per route
/compliance/adjusted-cb?year=YYYY	GET	Get adjusted CB after banking
/banking/bank	POST	Bank positive CB
/banking/apply	POST	Apply banked surplus
/pools	POST	Create a pool (Article 21)

🧠 Architecture Summary
Core
Holds domain logic & pure use-cases (business rules).

Never depends on frameworks.

Adapter
Inbound: Express controllers → calls use-cases.

Outbound: Repositories → connect to DB (Prisma).

Shared
Constants, config, helper utilities (e.g. TARGET_INTENSITY).

Infrastructure
Database schema, Prisma client, connections.

✅ Quick Dev Checklist
 PostgreSQL is running

 .env contains correct DATABASE_URL

 npx prisma generate succeeded

 npx prisma migrate dev ran

 npm run dev starts server successfully

 Hitting http://localhost:4000/routes returns routes