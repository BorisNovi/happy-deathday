# Happy Deathday

A shareable birthday card that counts down to the recipient's estimated death date instead of celebrating another year survived. Built as a dark-humour take on the traditional e-card.

---

## How it works

1. Fill in the recipient's name, date of birth, and preferred language.
2. A personalised card is generated with a live countdown timer — days, hours, minutes, seconds — until the estimated death date.
3. The death date is calculated on the server using WHO life expectancy statistics.
4. Share the card link. Cards automatically expire and are cleaned up after their TTL.

---

## Features

- **Life countdown** — real-time timer ticking down to the estimated death date
- **WHO-based estimation** — death date derived from WHO 2024 life expectancy data
- **Dark / light theme** — persisted in `localStorage`
- **Multilingual** — Russian and English, persisted in `localStorage`
- **SSR** — server-side rendering for fast initial load and proper meta tags
- **Auto-expiry** — a background service deletes expired cards every hour

---

## Tech stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Angular 21 · Taiga UI v5 · ngx-translate v17   |
| Rendering | Angular SSR (server-side rendering)             |
| Backend   | ASP.NET Core · .NET 10 · Entity Framework Core  |
| Database  | PostgreSQL 17                                   |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [.NET SDK](https://dotnet.microsoft.com/) 10
- [Docker](https://www.docker.com/) (for the database)

---

## Getting started

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Run the backend

```bash
cd backend
dotnet ef database update   # apply migrations
dotnet run
```

The API will be available at `http://localhost:5209`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:4200`.

---

## Development

### Frontend

```bash
cd frontend

npm start          # dev server with SSR
npm run build      # production build
npm test           # unit tests
```

Environment config lives in `src/environments/`. The dev environment points the API client at `http://localhost:5209/api`.

### Backend

```bash
cd backend

dotnet run                          # start the API
dotnet ef migrations add <Name>     # create a new migration
dotnet ef database update           # apply pending migrations
```

CORS in development allows `http://localhost:4200`. To change, update `appsettings.Development.json`.

---

## Project structure

```
happy-deathday/
├── frontend/                   # Angular 21 SSR app
│   └── src/app/
│       ├── core/               # singleton services (CardApi, LanguageService, StorageService …)
│       ├── features/           # routed pages (card display, 404)
│       ├── layouts/            # shell layouts + page components (create, preview)
│       └── shared/             # reusable components and interfaces
├── backend/                    # ASP.NET Core Web API
│   ├── Controllers/            # HTTP endpoints
│   ├── Models/                 # EF Core entities
│   ├── Dtos/                   # request / response shapes
│   ├── Services/               # business logic
│   └── Infrastructure/         # background services, exception handling
└── docker-compose.yml          # PostgreSQL for local development
```

---

## API

| Method | Path           | Description                              |
|--------|----------------|------------------------------------------|
| `POST` | `/api/card`    | Create a card, returns the card with ID  |
| `GET`  | `/api/card/:id`| Fetch a card by ID                       |

Cards include an `expiresAt` timestamp. Expired cards are deleted automatically.
