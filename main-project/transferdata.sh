#!/bin/sh

# THIS FILE TRANSFERS DATA FROM DEV DATABASE TO DELIVERABLE 2 DB
# IT SHOULD NOT BE SHOWN AS IT HAS PASSWORDS IN PLAINTEXT
mongodump -h ds117535.mlab.com:17535 -d heroku_9tn7s7md -u mccgamma -p alfdasdf83423j4lsdf8 -o mongostuff

mongorestore -h ds249035.mlab.com:49035 -d heroku_nf9l49n7 -u mccgamma -p alfdasdf83423j4lsdf8 mongostuff/heroku_9tn7s7md/

rm -rf mongostuff
