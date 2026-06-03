# Happy Deathday

A shareable birthday card that counts down to the recipient's estimated death date instead of celebrating another year survived. Built as a dark-humour take on the traditional e-card.

**Live:** [happydeathday.app](https://happydeathday.app/)

---

## How it works

1. Enter the recipient's name, date of birth, gender, and country of residence.
2. Pick one of four visual card styles.
3. Preview the card — it shows a live countdown timer (days, hours, minutes, seconds) to the estimated death date.
4. Submit to generate a permanent shareable link. The link is automatically copied to the clipboard.
5. The death date is calculated on the server using WHO life expectancy statistics per country and gender.
6. Cards automatically expire and are cleaned up after their TTL.

---

## Features

- **4-step creation wizard** — intro → form → style → preview, state persisted in URL query params so a page refresh never loses progress
- **4 card styles** — Standard, Official (typewriter + CRT countdown), Vintage (parchment + Playfair italic), Elegant (Arctika Script cursive)
- **Life countdown** — real-time timer ticking down to the estimated death date
- **WHO-based estimation** — life expectancy by country and gender (WHO 2024 data)
- **OG meta tags** — language-aware Open Graph tags for card sharing in messengers and social networks (SSR-rendered)
- **Dark / light theme** — persisted in `localStorage`
- **Multilingual** — Russian and English, persisted in `localStorage`
- **SSR** — card and creation flow pages are server-rendered per request; style and preview pages are client-rendered
- **Mobile-friendly date picker** — native bottom-sheet calendar on mobile devices
- **Auto-expiry** — a background service deletes expired cards every hour

---

## Tech stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | Angular 21 · Taiga UI v5 · ngx-translate v17  |
| Rendering | Angular SSR — Server per request (`/card/:id`, `/public/create/intro`, `/public/create/form`) · Client (`/public/create/style`, `/public/create/card-preview`) |
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
│       ├── core/               # singleton services
│       │   ├── card/           # CardApi, CardStateService
│       │   ├── language/       # LanguageService, TransferState loader
│       │   ├── seo/            # SeoService (meta tags)
│       │   └── storage/        # StorageService, QueryParamsService
│       ├── features/           # routed pages (card display, 404)
│       ├── layouts/
│       │   └── public/
│       │       └── components/
│       │           ├── create-intro/   # step 1 — landing / description
│       │           ├── create-form/    # step 2 — name, birth date, gender, country
│       │           ├── create-style/   # step 3 — style picker
│       │           └── card-preview/   # step 4 — review & submit
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

| Path                           | Component     | Render mode | Description                       |
|--------------------------------|---------------|-------------|-----------------------------------|
| `/public/create/intro`         | CreateIntro   | Server      | Landing page with CTA             |
| `/public/create/form`          | CreateForm    | Server      | Name, birth date, gender, country |
| `/public/create/style`         | CreateStyle   | Client      | Style picker                      |
| `/public/create/card-preview`  | CardPreview   | Client      | Review and submit                 |
| `/card/:id`                    | Card          | Server      | Shareable card with timer         |

---

## API

| Method | Path                | Description                                      |
|--------|---------------------|--------------------------------------------------|
| `POST` | `/api/card/preview` | Calculate estimated death date (no card created) |
| `POST` | `/api/card`         | Create a card, returns the card with ID          |
| `GET`  | `/api/card/:id`     | Fetch a card by ID                               |

Cards include an `expiresAt` timestamp. Expired cards are deleted automatically.

---

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free to use and adapt for non-commercial purposes with attribution. Commercial use is prohibited.
