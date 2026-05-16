# Happy Deathday

A shareable birthday card that counts down to the recipient's estimated death date instead of celebrating another year survived. Built as a dark-humour take on the traditional e-card.

---

## How it works

1. Enter the recipient's name, date of birth, and gender.
2. Pick one of four visual card styles.
3. Preview the card — it shows a live countdown timer (days, hours, minutes, seconds) to the estimated death date.
4. Submit to generate a permanent shareable link.
5. The death date is calculated on the server using WHO life expectancy statistics.
6. Cards automatically expire and are cleaned up after their TTL.

---

## Features

- **3-step creation wizard** — intro → form → style, state persisted in URL query params so a page refresh never loses progress
- **4 card styles** — Standard, Official, Vintage, Elegant
- **Life countdown** — real-time timer ticking down to the estimated death date
- **WHO-based estimation** — life expectancy differs by gender (71 years male / 76 years female, WHO 2024)
- **Dark / light theme** — persisted in `localStorage`
- **Multilingual** — Russian and English, persisted in `localStorage`
- **SSR** — server-side rendering for fast initial load and proper meta tags
- **Auto-expiry** — a background service deletes expired cards every hour

---

## Tech stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | Angular 21 · Taiga UI v5 · ngx-translate v17  |
| Rendering | Angular SSR (server-side rendering)            |
| Backend   | ASP.NET Core · .NET 10 · Entity Framework Core |
| Database  | PostgreSQL 17                                  |

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
│       ├── core/               # singleton services (CardApi, CardStateService, LanguageService …)
│       ├── features/           # routed pages (card display, 404)
│       ├── layouts/
│       │   └── public/
│       │       └── components/
│       │           ├── create-intro/   # step 1 — landing / description
│       │           ├── create-form/    # step 2 — name, birth date, gender
│       │           ├── create-style/   # step 3 — style picker
│       │           └── card-preview/   # review & submit
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

## Routing

| Path                    | Component     | Description               |
|-------------------------|---------------|---------------------------|
| `/public/create/intro`  | CreateIntro   | Landing page with CTA     |
| `/public/create/form`   | CreateForm    | Name, birth date, gender  |
| `/public/create/style`  | CreateStyle   | Style picker              |
| `/public/card-preview`  | CardPreview   | Review and submit         |
| `/card/:id`             | Card          | Shareable card with timer |

---

## API

| Method | Path            | Description                             |
|--------|-----------------|-----------------------------------------|
| `POST` | `/api/card`     | Create a card, returns the card with ID |
| `GET`  | `/api/card/:id` | Fetch a card by ID                      |

Cards include an `expiresAt` timestamp. Expired cards are deleted automatically.
