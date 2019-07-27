FROM nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY publifactory-nginx-prod.conf /etc/nginx/conf.d/publifactory-nginx-prod.conf
COPY ./dist /usr/share/nginx/html
