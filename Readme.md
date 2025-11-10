# ⚙️ FuelEU Maritime — Full-Stack Application

A web-based platform built to analyze **fuel emissions and compliance** with the **Fuel EU Maritime Regulation**, implementing core features like **Routes**, **Baseline Management**, **Banking**, and **Pooling**.

This project was designed using the **Hexagonal Architecture** approach, ensuring modular, maintainable, and testable code on both frontend and backend.

---

## 🧩 Overview

**FuelEU Maritime** simulates the emission-tracking system for ships, focusing on energy efficiency, emission intensity, and compliance with Articles **20 (Banking)** and **21 (Pooling)** of the FuelEU directive.

The system allows users to:
- View routes and set emission baselines  
- Calculate and bank surplus compliance balances (CBs)  
- Apply or pool CBs between ships  
- Visualize metrics and validate compliance rules  

---

## 🏗️ Architecture Summary

### 🔸 Hexagonal Structure (Ports & Adapters)
The project follows the **Hexagonal (Clean) Architecture** for both backend and frontend.

core/
├── domain/ # Entities and models (Route, Pool, BankEntry)
├── application/ # Use cases and business logic
└── ports/ # Interfaces for external adapters

adapters/
├── inbound/http/ # Express controllers and routes
└── outbound/db/ # Prisma/Postgres repositories

infrastructure/
└── db/ # Prisma schema and client setup

shared/
└── constants.ts # Global constants (e.g., TARGET_INTENSITY)

Frontend mirrors this structure:
This structure ensures:
- Core logic stays independent of frameworks.
- Easy swapping of UI/DB without touching business logic.

---

## ⚙️ Setup & Run Instructions

### 🧱 Prerequisites
- **Node.js** ≥ 18  
- **PostgreSQL** ≥ 14  
- **npm** or **yarn**

### 🗂️ 1. Clone Repository
```bash
git clone https://github.com/yourusername/fueleu-maritime.git
cd fueleu-maritime
⚙️ 2. Backend Setup
bash
Copy code
cd server
npm install
Create a .env file:

ini
Copy code
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fueleu"
PORT=4000
Run Prisma:

bash
Copy code
npx prisma migrate dev --name init
npx prisma generate
Start backend:

bash
Copy code
npm run dev
💻 3. Frontend Setup
bash
Copy code
cd ../frontend
npm install
Add .env:

ini
Copy code
VITE_API_BASE=http://localhost:4000
Run the app:

bash
Copy code
npm run dev 


```
![image alt](https://github.com/adityaRawat14/FuelEU-Maritime/blob/master/Screenshot%202025-11-11%20014435.png)
![image alt](https://github.com/adityaRawat14/FuelEU-Maritime/blob/master/Screenshot%202025-11-11%20014442.png)
![image alt](https://github.com/adityaRawat14/FuelEU-Maritime/blob/master/Screenshot%202025-11-11%20014504.png)
![image alt](https://github.com/adityaRawat14/FuelEU-Maritime/blob/master/Screenshot%202025-11-11%20020307.png)
![image alt](https://github.com/adityaRawat14/FuelEU-Maritime/blob/master/Screenshot%202025-11-11%20020338.png)

## 📦 Tech Stack
Layer	Technology
Frontend	React + TypeScript + Tailwind CSS
Backend	Express + TypeScript + Prisma ORM
Database	PostgreSQL
Architecture	Hexagonal / Ports & Adapters
Testing	Jest (server) + Vitest (client)
