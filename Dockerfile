FROM nginx
COPY web.nginx /etc/nginx/sites-enabled/default
COPY . /usr/share/nginx/html
