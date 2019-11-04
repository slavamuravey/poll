#!/usr/bin/env bash

. $(dirname $0)/functions.sh

set -e

if [[ ! -f "${DIR}/../docker-compose.yml" ]]; then
    cp "${DIR}/../docker-compose.yml.dist" "${DIR}/../docker-compose.yml"
fi

${SUDO_CMD} docker build -t poll-backend/node-cli "${DIR}/../build/node-cli/"
