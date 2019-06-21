FROM node:latest

COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent

CMD npm run client
