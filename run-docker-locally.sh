#!/usr/bin/env bash

IP=$(boot2docker ip)
export STATIC_ASSET_BASE=http://$IP:2992/assets/
export AJAX_BASE=http://$IP/api/

#docker-compose -f docker-compose-local.yml build
docker-compose -f docker-compose-local.yml up