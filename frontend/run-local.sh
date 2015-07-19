#!/usr/bin/env bash

export NODE_ENV=localdev

trap killgroup SIGINT

killgroup(){
  echo killing...
  kill 0
}

loop(){
  echo $1
  sleep $1
  loop $1
}


npm run hot-dev-server &
npm run dev &
wait