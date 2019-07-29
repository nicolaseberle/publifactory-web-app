# Building Client VueJs
FROM node:latest as build-stage
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
