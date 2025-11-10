
---

## 🧭 `REFLECTION.md`

```markdown
# 🧠 Reflection — Building the FuelEU Maritime Project

This project was a deep dive into combining **architecture, AI-assisted coding**, and real-world compliance logic.  
Working on a system that models **Fuel EU Articles 20–21** taught me not just backend and frontend integration but also **how to communicate with AI tools effectively**.

---

## 💡 What I Learned Using AI Agents

I used a mix of **GitHub Copilot**, **Claude Code**, and **Claude Web** during the development.

- **Copilot** helped with boilerplate — React components, imports, quick function bodies.  
- **Claude Code** handled complex refactoring and debugging, like fixing TypeScript type mismatches and nested async logic.  
- **Claude Web** gave conceptual clarity — particularly around *hexagonal architecture* and database structuring.

I learned that AI works best when I break tasks into small, concrete goals.  
For example, asking “**Write controller for /pools with validation rules**” produced better results than vague prompts.

---

## ⚙️ Efficiency Gains vs Manual Coding

AI accelerated my workflow in several ways:
- Reduced boilerplate setup time (routing, context providers, Prisma models)
- Helped me debug Prisma migration issues faster than searching manually
- Suggested architecture patterns that scaled well between client and server

However, I still manually validated every output:
- Some Prisma schemas needed restructuring  
- Certain React hooks were context-mismatched  
- Business rules (like CB constraints) had to be double-checked

Overall, I estimate that AI **saved me 50–60%** of development time but still required careful human supervision.

---

## 🔍 Improvements for Next Time

If I redo this project, I’d:
1. Set up **automated tests** early on instead of manual verification.  
2. Use **one AI agent per layer** — e.g., Copilot for React, Claude for backend, GPT for architecture.  
3. Add **continuous integration** with pre-commit checks and schema linting.  
4. Document each AI-assisted task as part of my workflow from the start.  

---

## ✨ Final Thoughts

AI didn’t replace my development process — it **augmented** it.  
The collaboration felt like pair-programming with multiple experts: one good at writing code, another at refactoring, another at explaining design choices.  

This project reinforced that:
> 💬 “AI can accelerate progress, but the developer’s understanding still drives the architecture.”

---

_Aditya Rawat_  
NIT Allahabad 
