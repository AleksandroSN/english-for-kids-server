#!/bin/bash

#download node and npm
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
# . ~/.nvm/nvm.sh
# nvm install node

# remove work folder
  DIR="/home/ubuntu/EFKServer/english-for-kids-server"
  sudo rm -rf ${DIR}

#create our working directory if it doesnt exist
 DIR="/home/ubuntu/EFKServer/english-for-kids-server"
 if [ -d "$DIR" ]; then
   echo "${DIR} exists"
 else
   echo "Creating ${DIR} directory"
   mkdir ${DIR}
# fi
# if [ -f .env ]; then
#   export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
# fi