.PHONY: start-api stop-api test-all test-api test-e2e

# Start the API (Docker containers)
start-api:
	cd api && docker compose up --wait

# Stop the API
stop-api:
	cd api && docker compose down

# Run all the tests
test-all: test-api test-e2e

# API tests (PHPUnit), creating the test database if needed
test-api: start-api
	cd api && docker compose exec -T php bin/console doctrine:database:create --env=test --if-not-exists
	cd api && docker compose exec -T php bin/phpunit

# End-to-end tests (Playwright)
test-e2e: start-api
	cd e2e && npm test
