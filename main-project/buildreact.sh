#!/bin/sh
cd app/client/

# TODO: Check to see that npm is installed
npm install
npm update
npm audit fix
npm run build
cd ../..
