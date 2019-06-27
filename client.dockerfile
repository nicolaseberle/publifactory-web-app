FROM node:latest

COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
EXPOSE 9001

CMD npm run client
