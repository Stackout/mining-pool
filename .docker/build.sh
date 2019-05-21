#!/bin/bash

set -e
set -o pipefail

docker build -f .docker/php/Dockerfile \
  -t helixalpha/php:7.3.3 \
  .docker/php

docker build -f stratum/Dockerfile \
  -t helixalpha/stratum \
  stratum

docker build -f server/Dockerfile \
  -t helixalpha/server \
  server

docker build . -f .docker/app/Dockerfile \
  -t helixalpha/app