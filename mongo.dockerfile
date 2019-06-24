FROM mongo:latest

RUN mkdir -p /data/dump
COPY ./database /data/dump
WORKDIR /data
EXPOSE 27017

# Dump the database
CMD mongorestore
