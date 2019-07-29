FROM node:latest as build-stage
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
RUN npm run build


FROM nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY publifactory-nginx-prod.conf /etc/nginx/conf.d/publifactory-nginx-prod.conf
COPY --from=build-stage /src/dist /usr/share/nginx/html
EXPOSE 80 
EXPOSE 443