# Playwright MCP E2E Automation Framework

Enterprise-grade end-to-end test automation framework built with Playwright and TypeScript, targeting the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) as a sample application under test.

## Overview

This project demonstrates a scalable, backend-heavy test automation architecture with:

- **Multi-browser coverage** — Chromium, Firefox, WebKit, running in parallel
- **API-first testing strategy** — majority of coverage at the backend/API layer for speed and reliability
- **Page Object Model (POM)** with custom Playwright fixtures
- **Dockerized execution** — both the framework and the application under test run in containers, orchestrated via Docker Compose
- **CI/CD ready** — GitHub Actions workflow included; Jenkins pipeline planned
- **AI/MCP integration** — agentic debugging and automated failure triage (in progress)

## Tech Stack

- TypeScript
- Playwright Test
- Docker / Docker Compose
- GitHub Actions (secondary CI), Jenkins (primary CI/CD, planned)

## Getting Started

### Prerequisites
- Node.js 22.x
- Docker Desktop

### Local setup

```bash
npm install
npx playwright install
```

### Running tests locally

```bash
npx playwright test
```

### Running via Docker Compose (framework + application under test)

```bash
docker compose up
```

## Project Status

This project is under active development. See commit history for progress.

## License

MIT
