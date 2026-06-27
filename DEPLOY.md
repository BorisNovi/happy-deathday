# Deploy Guide

## Prerequisites

- VPS with Ubuntu 24.04+ (recommended: 2 CPU, 2 GB RAM, 20+ GB disk)
- Domain (e.g. from Porkbun or Namecheap)
- GitHub repository with Actions enabled

---

## 1. DNS Setup

In your domain registrar's DNS settings, add two A records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | VPS IP address | 300 |
| A | `www` | VPS IP address | 300 |

`@` points `happydeathday.app` to the server.
`www` points `www.happydeathday.app` to the same server.

Verify propagation (usually 5–15 minutes):

```bash
dig happydeathday.app +short
# Should return your VPS IP
```

---

## 2. Server Setup

```bash
# Connect to server
ssh root@<VPS_IP>

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Verify
docker --version
docker compose version

# Create project directory
mkdir -p /opt/happy-deathday

# Create the ACME webroot (used for certificate renewal, see step 3)
mkdir -p /var/www/certbot
```

---

## 3. SSL Certificate

DNS must be propagated before this step.

### Initial issuance (`--standalone`)

At this point nginx is not running yet, so port 80 is free and we can use the
standalone authenticator:

```bash
apt install certbot -y

certbot certonly --standalone -d happydeathday.app -d www.happydeathday.app
```

Certificates are saved to `/etc/letsencrypt/live/happydeathday.app/`.

### Switch renewal to `webroot`

> ⚠️ Do **not** leave the cert on `standalone`. Once the stack is deployed,
> nginx (in Docker) holds port 80, so a `standalone` renewal would fail to bind
> `:80` (the first issuance works, but `certbot renew` would break in ~60 days).
> `webroot` renews with no downtime and never touches the port.

Run this **after the first deploy** (step 7), when nginx is up and serving
`/.well-known/acme-challenge/` from `/var/www/certbot`. It re-runs issuance over
webroot, which rewrites the cert's renewal config to use the webroot
authenticator from now on:

```bash
certbot certonly --webroot -w /var/www/certbot \
  -d happydeathday.app -d www.happydeathday.app
```

Then add a deploy hook so nginx picks up the renewed cert automatically:

```bash
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/sh
docker exec happy-deathday-nginx-1 nginx -s reload
EOF
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Certbot's systemd timer now renews automatically — no further manual action.
Verify the renewal is configured correctly (no real renewal happens):

```bash
certbot renew --dry-run
```

---

## 4. Environment Variables

```bash
nano /opt/happy-deathday/.env
```

Fill in based on `.env.example`:

```
POSTGRES_DB=happy_deathday
POSTGRES_USER=<your_db_user>
POSTGRES_PASSWORD=<generate with: openssl rand -hex 32>

APP_URL=https://happydeathday.app
```

---

## 5. SSH Key for GitHub Actions

On your local machine, add the public key to the server:

```bash
ssh-copy-id -i ~/.ssh/<your_key>.pub root@<VPS_IP>
```

---

## 6. GitHub Secrets

In the repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `HD_VPS_HOST` | VPS IP address |
| `HD_VPS_USER` | SSH user (e.g. `root`) |
| `HD_VPS_SSH_KEY` | Contents of private key (`cat ~/.ssh/<your_key>`) |

---

## 7. First Deploy

```bash
git tag v1.0.0
git push --tags
```

GitHub Actions will:
1. Build backend and frontend Docker images in parallel
2. Push images to GitHub Container Registry (GHCR)
3. Copy `docker-compose.prod.yml` and `nginx/` to the server
4. Pull new images and restart containers

---

## 8. Verify

```bash
ssh root@<VPS_IP>
cd /opt/happy-deathday
docker compose -f docker-compose.prod.yml ps
```

All four containers should be `Up`: `postgres`, `backend`, `frontend`, `nginx`.

Open `https://happydeathday.app` in the browser.

> 🔁 Now that nginx is running, go back to **step 3 → "Switch renewal to
> `webroot`"** and run it once. Skipping this leaves the cert on `standalone`,
> which will fail to renew in ~60 days.

---

## Subsequent Deploys

```bash
git tag v1.x.x
git push --tags
```

### Rollback

In GitHub: **Actions → Deploy → Run workflow** → enter the tag to roll back to (e.g. `v1.0.0`).

---

## Useful Commands on Server

```bash
# View logs
docker logs happy-deathday-backend-1 --tail 50 -f
docker logs happy-deathday-frontend-1 --tail 50 -f
docker logs happy-deathday-nginx-1 --tail 50 -f

# Restart a service
docker compose -f /opt/happy-deathday/docker-compose.prod.yml restart backend

# Check certificate expiry
certbot certificates
```
