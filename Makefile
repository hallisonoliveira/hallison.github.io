.PHONY: dev build deploy help

dev:
	rm -f .hugo_build.lock
	hugo server -D --navigateToChanged --poll 1000ms

build:
	hugo

deploy: build
	git add -A && git commit -m "build: site build" && git push

help:
	@echo "Available commands:"
	@echo "  make dev      - Start Hugo dev server with hot reload"
	@echo "  make build    - Build the site"
	@echo "  make deploy   - Build and push to repo"
