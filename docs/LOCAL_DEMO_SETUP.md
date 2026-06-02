# Local Demo Setup

This project now uses a simple full-stack structure:

- Frontend: Next.js on port `3000`
- Backend: Node.js/Express on port `5000`
- Demo storage: in-memory seed data
- Future storage: MySQL-ready structure can be added later

## 1. Clean install

If you previously installed packages while Tailwind was broken, clean your local install first.

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### macOS/Linux/Git Bash

```bash
rm -rf node_modules package-lock.json
npm install
```

## 2. Create environment file

Copy `.env.example` to `.env.local`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

### macOS/Linux/Git Bash

```bash
cp .env.example .env.local
```

## 3. Run backend API

Open one terminal:

```bash
npm run dev:api
```

Backend should run at:

```text
http://localhost:5000
```

Test these URLs:

```text
http://localhost:5000/health
http://localhost:5000/api
http://localhost:5000/api/menu
http://localhost:5000/api/dashboard
```

## 4. Run frontend

Open another terminal:

```bash
npm run dev:frontend
```

Frontend should run at:

```text
http://localhost:3000
```

## 5. Demo routes

Customer pages:

```text
/
/menu
/order
/track
/reservations
/deals
/delivery
/gallery
```

Operations pages:

```text
/admin
/kitchen
```

## Current backend behavior

The backend stores orders and reservations in memory. This is good for demos because it runs without MySQL setup.

When the server restarts, demo orders and reservations reset.

## Next production step

Add MySQL tables and connect routes to a real database after the client approves the demo direction.
