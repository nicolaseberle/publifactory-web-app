# publifactory-project
This is a MVP implementation of a intuitive editorial workflow.

Join us: contact@publifactory.co

## Before dev
1. Install `mongodb` follow [official manual](https://docs.mongodb.com/manual/installation/). It's recommend to use [MongoChef](3t.io/mongochef/) as the db client.
2. NodeJs installed.

## Dev step
1. Open terminal and run `npm install`, if you don't choose i18n when initialization, you need to run `npm run remove:i18n` here manually
2. Run `npm run server`, this will initial the db and `User` document if not exists
3. Open other terminal and run `npm run client`, you can combine the two command with `npm run dev`
4. Open browser and nav to `localhost:9001` (the default port is 9001, if you change this, change the port)

## License
Under [MIT license](./LICENSE)
