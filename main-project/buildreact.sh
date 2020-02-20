#!/bin/sh
cd app/client/

# TODO: Check to see that npm is installed
npm install
npm build react
cd ../..
