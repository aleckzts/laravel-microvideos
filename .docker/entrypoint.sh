#!/bin/bash

chown -R www-data.www-data /var/www/storage

cp .env.example .env
cp .env.testing.example .env.testing

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh
composer install
php artisan key:generate
php artisan migrate

php-fpm
