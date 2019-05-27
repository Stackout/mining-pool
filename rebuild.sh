#!/bin/bash

docker-compose exec server php artisan database:rebuild
docker-compose exec server php artisan passport:install
