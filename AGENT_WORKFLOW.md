# AI Agent Workflow Log

## Agents Used

- **GitHub Copilot** - For inline completions and boilerplate code 
- **Claude Code** - Used for refactoring and fixing complex bugs
- **Claude Web** - Documentation and problem-solving

## Prompts & Outputs

### Example : Creating components

**Prompt to Cursor:**
```
Create a nav bar with tabs like home , Routes , Banking , Pooling in react
```

**Generated code:**
```javascript
<nav className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold text-blue-700">FuelEU Compliance Dashboard</h1>
    <div className="flex gap-6">
      <NavLink to="/" end className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Home</NavLink>
      <NavLink to="/routes" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Routes</NavLink>
      <NavLink to="/banking" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Banking</NavLink>
      <NavLink to="/pooling" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Pooling</NavLink>
    </div>
  </nav>
```
### Example : Database Schema

**Prompt**
```
Give me a boiler plate prisma schema for Routes , ShipCompliance , BankEntry , Pooling 
```
though it gave me some weird schema but from that i got the idea of how it is going to look like 

### Example : Refactoring Callback Hell

**Initial prompt to Claude Code:**
```
Refactor this nested callback code to use async/await
```

The first output had issues with error handling, so I refined it:

**Second prompt:**
```
Add proper try-catch blocks and handle errors for each async operation
```

This gave me cleaner code that properly propagated errors up the chain.

### Example : Quick Component Setup

Just started typing `function Pooling` and Copilot auto-completed a basic React component structure. I kept about 60% of it and modified the props and styling.

## Validation / Corrections

Most of the time I had to verify and fix a few things:

- AI sometimes used outdated packages like table library of js so to use recharts i myself had to interfare
- Generated database queries without proper error handling - added try-catch
- Missed edge cases in validation logic - added manual checks like null checks

I always ran the code, tested it manually, and checked if it fit with the existing codebase before committing.

## Observations

**Where it saved time:**
- Writing repetitive CRUD operations
- Generating test boilerplate (react components with styling)

- Explaining unfamiliar code

**Where it struggled:**
- Understanding our specific business rules
- Keeping context of the whole project structure
- Security-sensitive code needed careful review
- Sometimes suggested non-existent functions

**What worked well:**
- Using Cursor's tasks.md to break down features clearly
- Letting Copilot handle imports and simple functions
- Getting Claude to review and suggest improvements
- Combining tools - one for generation, another for review

## Best Practices Followed

- Always reviewed generated code before accepting
- Used Cursor's tasks.md to give clear requirements
- Let Copilot handle boilerplate while I focused on logic
- Used Claude Code for refactoring existing messy code
- Tested everything manually - AI code isn't bug-free
- Committed code in small chunks to track what was AI-generated
- Asked follow-up questions when output wasn't quite right