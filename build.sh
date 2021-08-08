#!/usr/bin/env bash

./node_modules/.bin/flow-remove-types --pretty index.mjs > build/index.mjs
./node_modules/.bin/flow-remove-types --pretty test.mjs > build/test.mjs
