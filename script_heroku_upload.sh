#!/bin/sh

cd heroku_app
git add .
git commit -m "next"
git push heroku master
