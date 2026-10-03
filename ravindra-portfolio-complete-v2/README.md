# Ravindra Portfolio — Lovable UI + Spring Boot/MySQL

This version uses the uploaded Lovable source as the frontend UI and preserves the existing Spring Boot + MySQL backend.

## Run with Docker

From this folder:

```powershell
docker compose down -v
docker compose up -d --build
docker compose ps
```

Open:

- Public/admin app: http://localhost:5173
- Backend: http://localhost:8081

The `-v` on the first run is intentional: it recreates the MySQL volume so the Lovable-matching seed data (19 skills, 6 certifications, 1 achievement, 2 projects) is loaded.

## Admin login

Email:
`admin@ravindrachimkar.dev`

Password:
`ChangeMe123!`

Change this development password before production use.

## What changed

- Replaced the previous monolithic React frontend with the actual uploaded Lovable frontend source.
- Preserved Spring Boot + JWT + MySQL.
- Connected Lovable UI/API abstractions to the existing database.
- Added grouped skill-category CRUD at `/api/admin/skills`.
- Added dashboard activity data and login activity logging.
- Added frontend adapters for the existing snake_case database schema.
- Docker now runs the TanStack Start application instead of serving the old static Vite build.
- Lovable's exact CSS design tokens, typography, icons, hover states and component structure are retained.

## Important

The Lovable visual implementation is the source of truth for the frontend. The Spring Boot API remains the source of truth for portfolio content and authentication.
