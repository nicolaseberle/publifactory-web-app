FROM nginx
RUN rm -rf /etc/nginx/sites-enabled/*
RUN mkdir -p /etc/nginx/sites-enabled
COPY proxy_params /etc/nginx/proxy_params
COPY publifactory.conf /etc/nginx/sites-enabled/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html
