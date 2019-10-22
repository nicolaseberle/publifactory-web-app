FROM node:latest as build-front-stage
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
RUN npm run build

FROM nginx:1.17.2-alpine
# Create container's directory
RUN mkdir -p /etc/ssl/certs/
RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/nginx/snippets/

# Remove old conf.d
RUN rm -rf /etc/nginx/conf.d/*

# Copy all the files necessary to dump nginx server
COPY ./nginx/publifactory-nginx-dev.conf /etc/nginx/conf.d/publifactory-nginx-frontend-dev.conf
COPY --from=build-front-stage /src/dist /usr/share/nginx/html

# Expose the port 80 for HTTP and port 443 for HTTPS
# The HTTP's port will redirect automatically on HTTPS from NGiNX
EXPOSE 80
EXPOSE 443