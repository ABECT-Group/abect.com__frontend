FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

# --- deps: встановлюємо залежності ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# --- builder: збираємо Next.js ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG PAYLOAD_SECRET
ARG DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI

RUN npm run build

# --- runner: фінальний образ ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Копіюємо лише те, що потрібно для запуску
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=90s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/services?limit=0 || exit 1

CMD ["npm", "run", "start"]