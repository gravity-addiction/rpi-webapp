#!/bin/bash
echo
echo Building API
./node_modules/webpack-cli/bin/cli.js ./src/api/index.ts --output ./dist/api/index.js --config ./api/webpack-api.js --env ./dist/api/.env
echo