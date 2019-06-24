FROM node:latest

# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
EXPOSE 9001

CMD npm run client
