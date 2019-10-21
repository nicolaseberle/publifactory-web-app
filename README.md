# __publifactory-project__
This is a MVP implementation of an open source editorial workflow. This open science project provides :
1. open peer reviewing (anonymous or identified)
2. data visualization (FAIR principles) - With PlotlyJs
3. data creation from Python and R Scripts

Based on VueJS / NodeJs / MongoDB / ExpressJs

Join us: contact@publifactory.co

## Documentation

A Postman's documentation is available [here](https://documenter.getpostman.com/view/7420423/SVfUrmLb?version=latest) ;
this one will allow you to copy the Postman environment to test every routes of the API.

A Swagger's documentation will be available soon.

*INFORMATION*: You can run `npm test` to see every routes and returns from the API.

## Steps before development
1. Install [docker](https://www.docker.com/), which will make you able to use docker-compose and launch the database.
2. Install `nodeJs` and `npm`. **WARNING**: your nodeJs version must be higher than v11.x.x .
3. Build every images to run every component : `sudo docker-compose build`. It mays take an hour at the first time.

## Dev step
At this point, you have two choices:
 - Run the application with `npm`, which is more easier and will allowed you to see the modification from the code ;
 - Run the application with `docker`, which is used to be a production replicas ;
 
### Run the application with npm
1. After build the docker's image, up the database: `sudo docker-compose up -d mongo`
2. Dump the database: `sudo cat db.dump | sudo docker exec -i $(sudo docker ps -f name=mongo -q) sh -c 'mongorestore --archive' `
3. Install every dependencies: `npm install`
4. Run the API: `npm run server-dev`
5. Run the VueJs app: `npm run client`

### Run the application with docker
After build the docker's image, run the following commands: 
```bash
sudo docker-compose up -d mongo
sudo cat db.dump | sudo docker exec -i $(sudo docker ps -f name=mongo -q) sh -c 'mongorestore --archive'
sudo docker-compose up api client_dev whale 
```

**WARNING**: With docker's procedure, you won't be able to reload the application with hot-reload options.
Keep in mind that docker is used to reproduce the production environment.

## GCLOUD

1. Log in
`gcloud auth init`

2. Connexion with ssh
`gcloud compute --project "smart-rope-243709" ssh --zone "europe-west3-c" "atome-01"`

3. Launch docker
`gcloud compute --project "smart-rope-243709" ssh --zone "europe-west3-c" "atome-01" --command="sudo /home/leo_riberonpiatyszek/script_docker.sh start prod"`


## License
Under [MIT license](./LICENSE)
