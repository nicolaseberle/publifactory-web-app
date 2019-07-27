FROM nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY publifactory.conf /etc/nginx/conf.d/publifactory.conf
COPY . /usr/share/nginx/html
