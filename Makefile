.PHONY: dev build check test deploy help

dev:
	rm -f .hugo_build.lock
	hugo server -D --navigateToChanged --poll 1000ms

build:
	hugo

check:
	npm run validate:i18n
	npm run validate:content
	npm run test:build

test: check
	npm run test:content
	npm run test:e2e

deploy: build
	git add -A && git commit -m "build: site build" && git push

help:
	@echo "Available commands:"
	@echo "  make dev      - Start Hugo dev server with hot reload"
	@echo "  make build    - Build the site"
	@echo "  make check    - Validate i18n, content, and the production build"
	@echo "  make test     - Run all validations, unit tests, and E2E tests"
	@echo "  make deploy   - Build and push to repo"
