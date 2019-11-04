#!/usr/bin/env bash

DIR=$(readlink -e $(dirname $0))
SUDO_CMD=$(test -z $(id -Gn | xargs -n1 | grep '^docker$') && echo sudo)
PROJECT_DIR="/project"
NPM_HOME=${NPM_HOME:-${DIR}/volumes/npm}

node() {
    local base_dir=$(dirname ${DIR})
    local work_dir=$(pwd | sed "s:${base_dir}:${PROJECT_DIR}:")

    if [[ ${work_dir} = $(pwd) ]]; then
        work_dir="${PROJECT_DIR}"
    fi

    if [[ ! -d ${NPM_HOME} ]]; then
        mkdir -p ${NPM_HOME}
    fi

    ${SUDO_CMD} docker run \
        -it \
        --rm \
        -v ${NPM_HOME}:/.npm \
        -v ${NPM_HOME}:/home/node/.npm \
        -v ${HOME}/.ssh:/.ssh \
        -v ${HOME}/.ssh:/home/node/.ssh \
        -v ${DIR}/..:${PROJECT_DIR} \
        -w ${work_dir} \
        -u $(id -u) \
        poll-frontend/node-cli \
        $@
}