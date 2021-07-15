#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
npm i pm2
pm2 install typescript
pm2 stop all
