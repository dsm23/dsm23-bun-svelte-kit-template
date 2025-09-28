# syntax=docker.io/docker/dockerfile:1@sha256:dabfc0969b935b2080555ace70ee69a5261af8a8f1b4df97b9e7fbcf6722eddf

FROM oven/bun:1.2.23-alpine@sha256:0841c588f6304300baf1d395ae339ce09a6e18c4b6a7cdd4fddcbdb87a2f096a AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

ENV LEFTHOOK=0

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 bunjs \
  && adduser --system --uid 1001 sveltekit

COPY --from=builder /app/static ./static

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=sveltekit:bunjs /app/.svelte-kit ./.svelte-kit
COPY --from=builder --chown=sveltekit:bunjs /app/build ./build

USER sveltekit

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "run", "build/"]
