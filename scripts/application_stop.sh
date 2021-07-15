#!/bin/bash
#Stopping existing node servers
echo "Installing package"
npm i pm2 -g
echo "Intalling TS for PM2"
pm2 install typescript
echo "Stopping any existing node servers"
pm2 stop all
