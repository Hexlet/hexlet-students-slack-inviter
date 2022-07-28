setup: install-dependencies run
install-dependencies:
	npm ci

lint:
	npx eslint ./src

run:
	npm run dev

build:
	npm run build

ci-build:
	NODE_ENV=development CI=false make install-dependencies
	NODE_ENV=production CI=true make build

