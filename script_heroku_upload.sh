#!/bin/sh

cd heroku-app
git add .
git commit -m "next"
git push heroku master
