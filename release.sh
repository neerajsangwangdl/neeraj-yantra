#!/bin/bash

# Script to tag a release on git based on previous tags

# Initialising color coding and default service
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

git fetch --all
printf "$YELLOW Checking out and updating master"
git checkout main
git reset --hard origin/main
rm -rf /var/www/
mkdir /var/www/
ls -l /var/www/ | egrep -c '^-'
cp -r dist/. /var/www/.
ls -l /var/www/ | egrep -c '^-'
service nginx reload
