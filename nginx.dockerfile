FROM nginx
RUN mkdir -p /etc/ssl/certs/
RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/nginx/snippets/
RUN mkdir -p /etc/ssl/certs
RUN mkdir -p /etc/ssl/private

RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx/publifactory-nginx-prod.conf /etc/nginx/conf.d/publifactory-nginx-prod.conf
COPY ./nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY ./nginx/self-signed.conf /etc/nginx/snippets/self-signed.conf
COPY ./dist /usr/share/nginx/html
COPY ./ssl/web_publifactory.crt /etc/ssl/certs/web_publifactory.crt
COPY ./ssl/web_publifactory.key /etc/ssl/private/web_publifactory.key
COPY ./nginx/dhparam.pem /etc/nginx/
EXPOSE 80
EXPOSE 443
