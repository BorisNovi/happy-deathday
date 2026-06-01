FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=build --chown=node /app/dist ./dist

USER node

EXPOSE 4200

CMD ["node", "dist/frontend/server/server.mjs"]
