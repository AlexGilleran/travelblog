#!/usr/bin/env bash

export IP=$(boot2docker ip)
export STATIC_ASSET_BASE=http://$IP:2992/_assets/
export AJAX_BASE=http://$IP:3000/api/

#docker-compose -f docker-compose-local.yml build
docker-compose -f docker-compose-local.yml up