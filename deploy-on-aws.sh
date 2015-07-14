#!/usr/bin/env bash

cd /home/ec2-user/travelblog
docker-compose -f docker-compose-dev.yml stop

rm -rf /home/ec2-user/travelblog/*

tar xvf /home/ec2-user/deploy-dev.bz2

docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml up -d