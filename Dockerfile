FROM node:12.3.0
ADD . /app
WORKDIR /app
COPY package.json /app
RUN npm install
EXPOSE 4000
EXPOSE 9001
CMD ["sh", "-c", "npm run server & npm run client"]
