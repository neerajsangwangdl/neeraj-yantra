#!/bin/bash

# Script to tag a release on git based on previous tags

# Initialising color coding and default service
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

git fetch --all
printf "$YELLOW Checking out and updating master"
git checkout newprojectfor14v
git reset --hard origin/newprojectfor14v
sudo rm -rf /var/www/
sudo mkdir /var/www/
sudo ls -l /var/www/ | egrep -c '^-'
sudo cp -r dist/. /var/www/.
sudo ls -l /var/www/ | egrep -c '^-'
sudo service nginx reload
