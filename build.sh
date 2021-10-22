#!/usr/bin/env bash

files=(
    'actions.mjs'
    'balance.mjs'
    'find.mjs'
    'findNext.mjs'
    'findPrev.mjs'
    'index.mjs'
    'insert.mjs'
    'iterate.mjs'
    'maxNode.mjs'
    'minNode.mjs'
    'maxValue.mjs'
    'minValue.mjs'
    'remove.mjs'
    'test.mjs'
    'types.mjs'
)

for f in ${files[@]}; do
  ./node_modules/.bin/flow-remove-types --pretty "$f" > build/"$f"
done
