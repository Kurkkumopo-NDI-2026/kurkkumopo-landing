# Kurkkumopo Landing

[![CI](https://github.com/Kurkkumopo-NDI-2026/kurkkumopo-landing/actions/workflows/ci.yml/badge.svg)](https://github.com/Kurkkumopo-NDI-2026/kurkkumopo-landing/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Team Kurkkumopo's Nuit de l'Info 2026 hub: every project built during the night, in one place.

**Live:** [kurkkumopo.info](https://kurkkumopo.info)

## Development

```bash
npm install
npm run dev           # http://localhost:5173
npm run build         # type check + production build
npm run lint          # ESLint
npm run format:check  # Prettier
```

Requires Node.js 22.12+.

## Adding a project

Add an entry to `ALL_PROJECTS` in [`src/data.ts`](src/data.ts):

```ts
import banner from './assets/my-project.png'

export const ALL_PROJECTS: ProjectInput[] = [{ title: 'My project', desc: 'What it does.', stack: 'React · Go', url: 'https://…', banner }]
```

Project count, stats and cards update automatically.

## Deployment

Every push to `main` runs the CI (format, lint, build) and publishes the image to `ghcr.io/kurkkumopo-ndi-2026/kurkkumopo-landing` (`latest` and `sha-<short>`). Flux image automation then rolls it out to the homelab Kubernetes cluster, behind Cloudflare Tunnel.

```bash
docker build -t kurkkumopo-landing .
docker run -p 8080:8080 kurkkumopo-landing  # http://localhost:8080
```
