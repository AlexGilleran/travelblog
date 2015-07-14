#!/usr/bin/env bash

# TODO: Turn this into gradle it's already awful and it's barely even started

rm -rf build
mkdir build

rm -rf dist
mkdir dist

#backend
cd backend
sbt clean assembly
cd ..

mkdir -p build/backend/target/scala-2.11
cp backend/target/scala-2.11/backend-assembly-*.jar build/backend/target/scala-2.11/
cp backend/Dockerfile build/backend/

#frontend
cp -R frontend build/

#db
mkdir build/db
cp db/* build/db

#docker
cp docker-compose*.yml build/

#bz2 it up
cd build
tar cvzf ../dist/deploy-dev.bz2 .
cd ..

#put it on the server
scp -i ~/.ssh/travelblog-aws.pem dist/deploy-dev.bz2 ec2-user@travelblog-dev.alexgilleran.com:/home/ec2-user

# start 'er up
ssh -i ~/.ssh/travelblog-aws.pem ec2-user@travelblog-dev.alexgilleran.com "bash -s" < deploy-on-aws.sh