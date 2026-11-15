#!/usr/bin/env bash
# Runs once, when the dev container is created
set -euo pipefail

# JavaScript dependencies of the interface and the end-to-end tests
npm ci --prefix web
npm ci --prefix e2e

# Browsers used by Playwright (Chromium, and WebKit for Safari and iPhone)
cd e2e
npx playwright install --with-deps chromium webkit
