# syntax=docker.io/docker/dockerfile:1@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183

FROM oven/bun:1.4.5-alpine@sha256:da816670775f4c2b4e990b6b1847cf5540dcdc721a42033dd331ce7a88ba6a3b AS base
FROM dhi.io/bun:1.3.13-alpine3.22@sha256:6b9638f4cfc040b36fc74a7297d0830ec0e6ed8fab3f501cb2ba33571a0ce9be AS hardened

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
FROM hardened AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.svelte-kit/ ./.svelte-kit/
COPY --from=builder /app/build/ ./build/
COPY --from=builder /app/static/ ./static/

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "run", "build/"]
