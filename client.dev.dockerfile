FROM node:latest

# Download packages for hot reload
RUN apt update
RUN apt install -y inotify-tools

# Building Client VueJs
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
EXPOSE 9001

CMD npm run client-prod