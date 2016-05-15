#!/usr/bin/env bash

export STATIC_ASSET_BASE=http://localhost:2992/_assets/
export AJAX_BASE=http://localhost:3000/api/

#docker-compose -f docker-compose-local.yml build
docker-compose -f docker-compose-local.yml up