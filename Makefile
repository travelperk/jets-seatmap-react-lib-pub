.PHONY: test test-unit test-integration test-coverage test-ci dev build-storybook build-lib prepare

# Run all tests
test:
	jest

# Run unit tests only
test-unit:
	jest --testPathIgnorePatterns='src/.*\.integration\.test\.js$$'

# Run integration tests only
test-integration:
	jest --testPattern='src/.*\.integration\.test\.js$$'

# Run tests with coverage reports
test-coverage:
	jest --coverage --coverageReporters=lcov --coverageReporters=text

# Run tests in CI mode
test-ci:
	jest --ci --coverage --coverageReporters=text --verbose=false

# Start Storybook dev server (port 6006)
dev:
	storybook dev -p 6006

# Build Storybook for production
build-storybook:
	NODE_OPTIONS=--openssl-legacy-provider storybook build

# Build library with Rollup
build-lib:
	pnpm exec rollup -c

# Install Git hooks (husky)
prepare:
	husky
