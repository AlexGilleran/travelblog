#!/usr/bin/env bash

IP=$(boot2docker ip)
export STATIC_ASSET_BASE=http://$IP/build/webpack/
export AJAX_BASE=http://$IP/api/

cd backend
sbt clean assembly
cd ..

docker-compose -f docker-compose-local.yml build
docker-compose -f docker-compose-local.yml up