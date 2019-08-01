FROM node:latest as build-stage
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
RUN npm run build


FROM nginx
# Create container's directory
RUN mkdir -p /etc/ssl/certs/
RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/nginx/snippets/
RUN mkdir -p /etc/ssl/certs
RUN mkdir -p /etc/ssl/private

# Remove old conf.d
RUN rm -rf /etc/nginx/conf.d/*

# Copy all the files necessary to dump nginx server
COPY ./nginx/publifactory-nginx-prod.conf /etc/nginx/conf.d/publifactory-nginx-prod.conf
COPY ./nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY ./nginx/self-signed.conf /etc/nginx/snippets/self-signed.conf
COPY ./dist /usr/share/nginx/html
COPY ./ssl/web_publifactory.crt /etc/ssl/certs/web_publifactory.crt
COPY ./ssl/web_publifactory.key /etc/ssl/private/web_publifactory.key
COPY ./ssl/api_publifactory.crt /etc/ssl/certs/api_publifactory.crt
COPY ./ssl/api_publifactory.key /etc/ssl/private/api_publifactory.key
COPY ./nginx/dhparam.pem /etc/nginx/

# Expose the port 80 for HTTP and port 443 for HTTPS
# The HTTP's port will redirect automatically on HTTPS from NGiNX
EXPOSE 80
EXPOSE 443
