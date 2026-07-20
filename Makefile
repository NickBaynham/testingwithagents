# testingwithagents.com
#
# Canonical workflow:
#   make install    install Node dependencies and Playwright browsers
#   make config     validate local environment and required config
#   make build      production build
#   make test       unit + e2e + a11y suites
#   make deploy     trigger an AWS Amplify release of the current branch
#   make run-docker bring up local Docker services
#
# See plan/plan.md for phase-by-phase work. Targets that require Phase 0
# scaffolding (package.json, next.config, docker compose file) will fail with
# a clear message until that work lands.

SHELL := /bin/bash
.DEFAULT_GOAL := help

COMPOSE_FILE := docker/docker-compose.yml
BRANCH := $(shell git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)

.PHONY: help install setup config build test unit e2e a11y deploy \
        run-docker compose-up compose-down dev start lint typecheck \
        linkcheck ci \
        _require-node _require-pkg _require-compose _require-aws

help:
	@echo "Canonical targets:"
	@echo "  install     Install Node dependencies and Playwright browsers"
	@echo "  config      Validate local environment and required config"
	@echo "  build       Production build (next build)"
	@echo "  test        Unit + e2e + a11y test suites"
	@echo "  deploy      Trigger AWS Amplify release of the current branch"
	@echo "  run-docker  Bring up local Docker services (analytics, lychee)"
	@echo ""
	@echo "Supporting:"
	@echo "  dev         Run Next.js dev server"
	@echo "  lint        eslint + prettier --check + markdownlint"
	@echo "  typecheck   tsc --noEmit"
	@echo "  unit e2e a11y   Individual test suites"
	@echo "  start       Serve production build"
	@echo "  compose-up  Alias for run-docker"
	@echo "  compose-down  Stop local Docker services"
	@echo "  linkcheck   lychee broken-link scan against built site"
	@echo "  ci          Full local CI: lint, typecheck, test, build, linkcheck"

_require-node:
	@command -v node >/dev/null || { echo "ERROR: Node.js is not installed. Install Node 20+ first."; exit 1; }
	@command -v npm  >/dev/null || { echo "ERROR: npm is not installed."; exit 1; }

_require-pkg: _require-node
	@test -f package.json || { \
	  echo "ERROR: package.json not found."; \
	  echo "       Phase 0 of plan/plan.md scaffolds Next.js 15 + TypeScript + Tailwind v4."; \
	  echo "       Run that step before invoking build/test targets."; \
	  exit 1; \
	}

_require-compose:
	@command -v docker >/dev/null || { echo "ERROR: docker is not installed."; exit 1; }
	@test -f $(COMPOSE_FILE) || { \
	  echo "ERROR: $(COMPOSE_FILE) not found."; \
	  echo "       Phase 0 of plan/plan.md adds the local Docker services."; \
	  exit 1; \
	}

_require-aws:
	@command -v aws >/dev/null || { echo "ERROR: aws CLI is not installed."; exit 1; }
	@test -n "$$AMPLIFY_APP_ID" || { \
	  echo "ERROR: AMPLIFY_APP_ID is not set."; \
	  echo "       Export it from your shell or .env.local before deploying."; \
	  exit 1; \
	}

install setup: _require-pkg
	npm ci
	npx playwright install --with-deps

config: _require-pkg
	@echo "Checking local config..."
	@test -f next.config.ts || test -f next.config.js || { \
	  echo "ERROR: next.config.ts/.js not found."; exit 1; \
	}
	@test -f .env.local || echo "NOTE: .env.local missing (ok for dev, required for deploy)"
	@node --version
	@npm --version
	@echo "Config OK."

build: _require-pkg
	npm run build

dev: _require-pkg
	npm run dev

start: _require-pkg
	npm run start

lint: _require-pkg
	npm run lint
	npm run format:check
	npm run lint:md

typecheck: _require-pkg
	npx tsc --noEmit

unit: _require-pkg
	npm run test:unit

e2e: _require-pkg
	CI=true npx playwright test --grep-invert @a11y

a11y: _require-pkg
	CI=true npx playwright test --grep @a11y

test: unit e2e a11y

run-docker compose-up: _require-compose
	docker compose -f $(COMPOSE_FILE) up -d

compose-down: _require-compose
	docker compose -f $(COMPOSE_FILE) down

linkcheck: _require-compose
	docker compose -f $(COMPOSE_FILE) run --rm lychee

deploy: _require-pkg _require-aws
	@echo "Triggering Amplify release for branch '$(BRANCH)' on app $$AMPLIFY_APP_ID..."
	aws amplify start-job \
	  --app-id "$$AMPLIFY_APP_ID" \
	  --branch-name "$(BRANCH)" \
	  --job-type RELEASE

ci: lint typecheck unit build e2e a11y linkcheck
	@echo "Local CI complete."
