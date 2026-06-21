# Sri Raghavendra Engineering Services — Static Website

Static company website built with **Angular 17** and **Tailwind CSS**.

## Company

**Sri Raghavendra Engineering Services** specializes in:

- Erection & commissioning of diesel generator sets
- Repairs & overhauls of diesel generator sets
- Repairs & overhauls of diesel engines
- Repairs & overhauls of alternators

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, services overview, brands |
| Services | `/services` | Detailed service descriptions |
| Contact | `/contact` | Contact info & enquiry form |

## Run Locally

```powershell
cd frontend
npm install
ng serve
```

Open **http://localhost:4200**

## Build for Production

```powershell
cd frontend
ng build
```

Output is in `frontend/dist/frontend/`

## Customize Content

Edit company details and services in:

`frontend/src/app/data/site-data.ts`

Update phone, email, and address there.

## Tech Stack

- Angular 17 (standalone components)
- Tailwind CSS 3
- No backend required — fully static
