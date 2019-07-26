# publifactory-project
This is a MVP implementation of an open source editorial workflow. This open science project provides :
1. open peer reviewing (anonymous or identified)
2. data visualization (FAIR principles) - shinyR

Based on VueJS / NodeJs / MongoDB / Express

Join us: contact@publifactory.co

## Before dev
1. Install `mongodb` follow [official manual](https://docs.mongodb.com/manual/installation/). It's recommend to use [MongoChef](3t.io/mongochef/) as the db client.
2. NodeJs installed.
3. Launch a container with mongodb `sudo docker run -p 27017:27017 --name afs-mongo -d mongo`
4. Dump the database `sudo cat db.dump | sudo docker exec -i $(sudo docker ps -f name=mongo -q) sh -c 'mongorestore --archive' `


## Dev step
1. Open terminal and run `npm install`, if you don't choose i18n when initialization, you need to run `npm run remove:i18n` here manually
2. Run `npm run server`, this will initial the db and `User` document if not exists
3. Open other terminal and run `npm run client`, you can combine the two command with `npm run server-dev`
4. Open browser and nav to `localhost:9001` (the default port is 9001, if you change this, change the port)

## GCLOUD

1. Log in
`gcloud auth init`

2. Connexion with ssh
`gcloud compute --project "smart-rope-243709" ssh --zone "europe-west3-c" "atome-01"`

3. Launch docker
`gcloud compute --project "smart-rope-243709" ssh --zone "europe-west3-c" "atome-01" --command="more /home/$HOST/install.sh"`


## License
Under [MIT license](./LICENSE)
